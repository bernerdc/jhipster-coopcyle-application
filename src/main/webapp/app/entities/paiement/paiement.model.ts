import { IClient } from 'app/entities/client/client.model';
import { ICommercant } from 'app/entities/commercant/commercant.model';

export interface IPaiement {
  id?: number;
  amount?: number;
  paiementType?: string;
  client?: IClient | null;
  commercant?: ICommercant | null;
}

export class Paiement implements IPaiement {
  constructor(
    public id?: number,
    public amount?: number,
    public paiementType?: string,
    public client?: IClient | null,
    public commercant?: ICommercant | null
  ) {}
}

export function getPaiementIdentifier(paiement: IPaiement): number | undefined {
  return paiement.id;
}
