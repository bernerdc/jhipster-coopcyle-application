import { IClient } from 'app/entities/client/client.model';
import { ILivreur } from 'app/entities/livreur/livreur.model';
import { ICommercant } from 'app/entities/commercant/commercant.model';

export interface ICommande {
  id?: number;
  pickupAddress?: string | null;
  deliveryAddress?: string | null;
  client?: IClient | null;
  livreur?: ILivreur | null;
  commercant?: ICommercant | null;
}

export class Commande implements ICommande {
  constructor(
    public id?: number,
    public pickupAddress?: string | null,
    public deliveryAddress?: string | null,
    public client?: IClient | null,
    public livreur?: ILivreur | null,
    public commercant?: ICommercant | null
  ) {}
}

export function getCommandeIdentifier(commande: ICommande): number | undefined {
  return commande.id;
}
