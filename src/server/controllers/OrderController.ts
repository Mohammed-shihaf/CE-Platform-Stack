import { Request, Response } from 'express';
import { OrderRepository } from '../repositories/OrderRepository';
import { calculateTieredDiscount } from '../services/PricingEngine';

const orderRepo = new OrderRepository();

export class OrderController {
  public searchOrders(req: Request, res: Response): void {
    const customer = (req.query.customer as string) || '';
    const query = orderRepo.buildCustomerOrderQuery(customer);
    const records = orderRepo.getMockOrders(customer);
    res.json({ query, records });
  }

  public evaluateDiscount(req: Request, res: Response): void {
    const { spend, tier, contract, isNonProfit, promo } = req.body;
    const discount = calculateTieredDiscount(
      spend || 0,
      tier || 'COMMERCIAL',
      contract || 'MONTHLY',
      isNonProfit || false,
      promo || 'NONE'
    );
    res.json({ spend, discount, net: (spend || 0) - discount });
  }
}
