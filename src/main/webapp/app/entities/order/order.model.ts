import { IClient } from 'app/entities/client/client.model';
import { IDeliveryMan } from 'app/entities/delivery-man/delivery-man.model';
import { ITrader } from 'app/entities/trader/trader.model';

export interface IOrder {
  id?: number;
  pickupAddr?: string | null;
  deliveryAddr?: string | null;
  client?: IClient | null;
  deliveryMan?: IDeliveryMan | null;
  trader?: ITrader | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public pickupAddr?: string | null,
    public deliveryAddr?: string | null,
    public client?: IClient | null,
    public deliveryMan?: IDeliveryMan | null,
    public trader?: ITrader | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
