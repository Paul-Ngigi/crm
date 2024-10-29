import { ICustomer } from "./customer.interface";
import { ILead } from "./lead.interface";

export interface ILeadsInteraction {
  id: number;
  type: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  lead: ILead | null;
  customer: ICustomer | null;
}
