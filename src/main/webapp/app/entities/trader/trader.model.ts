import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IOrder } from 'app/entities/order/order.model';
import { IPayment } from 'app/entities/payment/payment.model';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';

export interface ITrader {
  id?: number;
  shopRating?: string | null;
  isOpen?: boolean | null;
  averageDeliveryTime?: number | null;
  openingTime?: dayjs.Dayjs | null;
  closingTime?: dayjs.Dayjs | null;
  tags?: string | null;
  user?: IUser | null;
  orders?: IOrder[] | null;
  payments?: IPayment[] | null;
  cooperative?: ICooperative | null;
}

export class Trader implements ITrader {
  constructor(
    public id?: number,
    public shopRating?: string | null,
    public isOpen?: boolean | null,
    public averageDeliveryTime?: number | null,
    public openingTime?: dayjs.Dayjs | null,
    public closingTime?: dayjs.Dayjs | null,
    public tags?: string | null,
    public user?: IUser | null,
    public orders?: IOrder[] | null,
    public payments?: IPayment[] | null,
    public cooperative?: ICooperative | null
  ) {
    this.isOpen = this.isOpen ?? false;
  }
}

export function getTraderIdentifier(trader: ITrader): number | undefined {
  return trader.id;
}
