import { ICommercant } from 'app/entities/commercant/commercant.model';

export interface ICooperative {
  id?: number;
  city?: string;
  shopCount?: number | null;
  commercants?: ICommercant[] | null;
}

export class Cooperative implements ICooperative {
  constructor(public id?: number, public city?: string, public shopCount?: number | null, public commercants?: ICommercant[] | null) {}
}

export function getCooperativeIdentifier(cooperative: ICooperative): number | undefined {
  return cooperative.id;
}
