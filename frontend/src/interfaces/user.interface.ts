export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  kraPin: string;
  attachment: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
}
