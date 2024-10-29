export interface ILead {
  id: number;
  email: string;
  name: string;
  companyName?: string;
  phoneNumber: string;
  status: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
