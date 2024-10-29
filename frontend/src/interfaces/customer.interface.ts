export interface ICustomer {
  id: number;
  email: string;
  name: string;
  companyName?: string;
  phoneNumber: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
