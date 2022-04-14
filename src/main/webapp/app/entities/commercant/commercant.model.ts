import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ICommande } from 'app/entities/commande/commande.model';
import { IPaiement } from 'app/entities/paiement/paiement.model';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';

export interface ICommercant {
  id?: number;
  shopRating?: string | null;
  isOpen?: boolean | null;
  averageDeliveryTime?: number | null;
  openingTime?: dayjs.Dayjs | null;
  closingTime?: dayjs.Dayjs | null;
  tags?: string | null;
  user?: IUser | null;
  commandes?: ICommande[] | null;
  paiements?: IPaiement[] | null;
  cooperative?: ICooperative | null;
}

export class Commercant implements ICommercant {
  constructor(
    public id?: number,
    public shopRating?: string | null,
    public isOpen?: boolean | null,
    public averageDeliveryTime?: number | null,
    public openingTime?: dayjs.Dayjs | null,
    public closingTime?: dayjs.Dayjs | null,
    public tags?: string | null,
    public user?: IUser | null,
    public commandes?: ICommande[] | null,
    public paiements?: IPaiement[] | null,
    public cooperative?: ICooperative | null
  ) {
    this.isOpen = this.isOpen ?? false;
  }
}

export function getCommercantIdentifier(commercant: ICommercant): number | undefined {
  return commercant.id;
}
