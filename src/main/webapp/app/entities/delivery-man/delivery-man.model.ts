import { IUser } from 'app/entities/user/user.model';
import { IOrder } from 'app/entities/order/order.model';

export interface IDeliveryMan {
  id?: number;
  vehicle?: string | null;
  numberOfEarnings?: number | null;
  numberOfRides?: number | null;
  rating?: string | null;
  user?: IUser | null;
  orders?: IOrder[] | null;
}

export class DeliveryMan implements IDeliveryMan {
  constructor(
    public id?: number,
    public vehicle?: string | null,
    public numberOfEarnings?: number | null,
    public numberOfRides?: number | null,
    public rating?: string | null,
    public user?: IUser | null,
    public orders?: IOrder[] | null
  ) {}
}

export function getDeliveryManIdentifier(deliveryMan: IDeliveryMan): number | undefined {
  return deliveryMan.id;
}
