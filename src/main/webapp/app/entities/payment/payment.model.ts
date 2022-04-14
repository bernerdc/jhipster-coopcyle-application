import { IClient } from 'app/entities/client/client.model';
import { ITrader } from 'app/entities/trader/trader.model';

export interface IPayment {
  id?: number;
  amount?: number;
  paiementType?: string;
  client?: IClient | null;
  trader?: ITrader | null;
}

export class Payment implements IPayment {
  constructor(
    public id?: number,
    public amount?: number,
    public paiementType?: string,
    public client?: IClient | null,
    public trader?: ITrader | null
  ) {}
}

export function getPaymentIdentifier(payment: IPayment): number | undefined {
  return payment.id;
}
