/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./index";

export const createLead = (body: any): Promise<any> => {
  return apiClient.post(`/leads`, body);
};

export const getLeads = (params: any): Promise<any> => {
  return apiClient.get(`/leads`, params);
};

export const getLeadById = (id: number): Promise<any> => {
  return apiClient.get(`/leads/${id}`);
};

export const updateLead = (id: number, data: any): Promise<any> => {
  return apiClient.put(`/leads/${id}`, data);
};

export const deleteLead = (id: number): Promise<any> => {
  return apiClient.delete(`/leads/${id}`);
};
