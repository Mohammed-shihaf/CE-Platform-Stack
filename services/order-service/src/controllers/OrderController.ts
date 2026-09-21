import { Router, Request, Response } from 'express';
import { validateOrderPayload, OrderPayload } from '../domain/orders/OrderValidator';
import { OrderTaxCalculationService } from '../domain/orders/OrderTaxCalculationService';
import { OrderWorkflowEngine } from '../domain/orders/OrderWorkflowEngine';
import { OrderRepository } from '../domain/orders/OrderRepository';
import { PaymentServiceClient } from '../clients/PaymentServiceClient';

const router = Router();
const orderRepo = new OrderRepository();
const taxService = new OrderTaxCalculationService();
const workflowEngine = new OrderWorkflowEngine();
const paymentClient = new PaymentServiceClient();

// POST /api/v1/orders/create
router.post('/create', async (req: Request, res: Response) => {
  const payload: OrderPayload = req.body;
  const validation = validateOrderPayload(payload);

  if (!validation.valid) {
    return res.status(400).json({ status: 'VALIDATION_ERROR', errors: validation.reasons });
  }

  // 1. Calculate Tax
  const taxResult = taxService.calculateSettlementTax({
    baseAmount: payload.amount,
    countryCode: payload.countryCode || 'US',
    isTaxExempt: false,
    category: 'STANDARD'
  });

  // 2. Determine workflow routing
  const route = workflowEngine.executeOrderWorkflow(
    payload.tier || 'STANDARD',
    taxResult.totalGrossAmount,
    false,
    'NONE'
  );

  // 3. Initiate payment via gRPC to PaymentService
  let paymentStatus = 'PENDING';
  let paymentTxnId = '';

  try {
    const paymentResponse = await paymentClient.processPayment({
      order_id: payload.orderId,
      amount: taxResult.totalGrossAmount,
      currency: payload.currency,
      payment_method: 'CREDIT_CARD'
    });
    paymentStatus = paymentResponse.status;
    paymentTxnId = paymentResponse.transaction_id;
  } catch (err: any) {
    paymentStatus = 'OFFLINE_QUEUED';
  }

  // 4. Persist in repository
  orderRepo.save({
    orderId: payload.orderId,
    customerId: payload.customerId || 'ANONYMOUS',
    amount: taxResult.totalGrossAmount,
    currency: payload.currency,
    status: paymentStatus,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({
    status: 'CREATED',
    orderId: payload.orderId,
    workflowRoute: route,
    taxDetails: taxResult,
    paymentStatus,
    paymentTxnId
  });
});

// GET /api/v1/orders/search
router.get('/search', (req: Request, res: Response) => {
  const customer = req.query.customer as string || '';
  const query = orderRepo.findOrdersByCustomerRaw(customer);
  res.json({
    status: 'QUERY_EXECUTED',
    executedQuery: query,
    results: []
  });
});

// GET /api/v1/orders/receipt
router.get('/receipt', (req: Request, res: Response) => {
  const filename = req.query.file as string || '';
  const content = orderRepo.exportOrderReceipt(filename);
  res.json({
    status: 'RECEIPT_PROCESSED',
    content
  });
});

export { router as orderRouter };
