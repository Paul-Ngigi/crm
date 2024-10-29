/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./index";

export const getCustomers = (params: any): Promise<any> => {
  return apiClient.get(`/customers`, params);
};

export const getCustomerById = (id: number): Promise<any> => {
  return apiClient.get(`/customers/${id}`);
};

export const updateCustomer = (id: number, data: any): Promise<any> => {
  return apiClient.put(`/customers/${id}`, data);
};

export const deleteCustomer = (id: number): Promise<any> => {
  return apiClient.delete(`/customers/${id}`);
};
