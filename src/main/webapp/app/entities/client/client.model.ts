import { IUser } from 'app/entities/user/user.model';
import { ICommande } from 'app/entities/commande/commande.model';
import { IPaiement } from 'app/entities/paiement/paiement.model';

export interface IClient {
  id?: number;
  walletBalance?: number | null;
  orderCount?: number | null;
  user?: IUser | null;
  commandes?: ICommande[] | null;
  paiements?: IPaiement[] | null;
}

export class Client implements IClient {
  constructor(
    public id?: number,
    public walletBalance?: number | null,
    public orderCount?: number | null,
    public user?: IUser | null,
    public commandes?: ICommande[] | null,
    public paiements?: IPaiement[] | null
  ) {}
}

export function getClientIdentifier(client: IClient): number | undefined {
  return client.id;
}
