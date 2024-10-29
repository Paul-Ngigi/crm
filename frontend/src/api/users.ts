/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./index";

export const getUsers = (params: any): Promise<any> => {
  return apiClient.get(`/users`, params);
};

export const getUserById = (id: number): Promise<any> => {
  return apiClient.get(`/users/${id}`);
};

export const updateUser = (id: number, data: any): Promise<any> => {
  return apiClient.put(`/users/${id}`, data);
};

export const deleteUser = (id: number): Promise<any> => {
  return apiClient.delete(`/users/${id}`);
};
