/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./index";

export const createProject = (body: any): Promise<any> => {
  return apiClient.post(`/projects`, body);
};

export const getProjects = (params: any): Promise<any> => {
  return apiClient.get(`/projects`, params);
};

export const getProjectById = (id: number): Promise<any> => {
  return apiClient.get(`/projects/${id}`);
};

export const updateProject = (id: number, data: any): Promise<any> => {
  return apiClient.put(`/projects/${id}`, data);
};

export const deleteProject = (id: number): Promise<any> => {
  return apiClient.delete(`/projects/${id}`);
};
