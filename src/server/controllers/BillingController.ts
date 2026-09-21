import { Request, Response } from 'express';
import { computeEnterpriseTaxA } from '../services/TaxCalculationServiceA';
import { computeEnterpriseTaxB } from '../services/TaxCalculationServiceB';
import { DocumentRepository } from '../repositories/DocumentRepository';

const docRepo = new DocumentRepository();

export class BillingController {
  public calculateTaxRegionA(req: Request, res: Response): void {
    const { items, rate, cert } = req.body;
    const result = computeEnterpriseTaxA(items || [], rate || 0.08, cert || null);
    res.json(result);
  }

  public calculateTaxRegionB(req: Request, res: Response): void {
    const { items, rate, cert } = req.body;
    const result = computeEnterpriseTaxB(items || [], rate || 0.08, cert || null);
    res.json(result);
  }

  public downloadInvoice(req: Request, res: Response): void {
    const filename = req.query.file as string;
    const content = docRepo.getInvoiceDocument(filename);
    res.send(content);
  }
}
