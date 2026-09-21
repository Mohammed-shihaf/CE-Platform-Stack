import path from 'path';
import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, '../../../proto/payment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const paymentProto: any = grpc.loadPackageDefinition(packageDefinition).payment;
const grpcHost = process.env.PAYMENT_SERVICE_GRPC_HOST || 'localhost:50051';

export class PaymentServiceClient {
  private client: any;

  constructor() {
    this.client = new paymentProto.PaymentService(
      grpcHost,
      grpc.credentials.createInsecure()
    );
  }

  public processPayment(payload: {
    order_id: string;
    amount: number;
    currency: string;
    payment_method: string;
  }): Promise<{ transaction_id: string; status: string; authorization_code: string }> {
    return new Promise((resolve, reject) => {
      this.client.ProcessPayment(payload, (err: any, response: any) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  public queryTransaction(transactionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.QueryTransaction({ transaction_id: transactionId }, (err: any, response: any) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }
}
