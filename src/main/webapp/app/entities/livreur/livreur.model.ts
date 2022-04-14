import { IUser } from 'app/entities/user/user.model';
import { ICommande } from 'app/entities/commande/commande.model';

export interface ILivreur {
  id?: number;
  vehicleType?: string | null;
  totalEarnings?: number | null;
  totalRides?: number | null;
  transporterRating?: string | null;
  user?: IUser | null;
  commandes?: ICommande[] | null;
}

export class Livreur implements ILivreur {
  constructor(
    public id?: number,
    public vehicleType?: string | null,
    public totalEarnings?: number | null,
    public totalRides?: number | null,
    public transporterRating?: string | null,
    public user?: IUser | null,
    public commandes?: ICommande[] | null
  ) {}
}

export function getLivreurIdentifier(livreur: ILivreur): number | undefined {
  return livreur.id;
}
