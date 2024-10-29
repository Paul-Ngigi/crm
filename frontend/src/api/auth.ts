/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { IUser } from "interfaces/user.interface";
import apiClient from "./index";

export interface UserData {
  email: string;
  authToken: string;
}

// Login user function
export const loginUser = (data: UserData): Promise<any> => {
  return apiClient.post(`/auth/login`, data);
};

// Register user function
export const registerUser = (data: any): Promise<any> => {
  return apiClient.post(`/auth/register`, data);
};

export const uploadAttachment = async (data: FormData): Promise<any> => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  return axios.post(`${baseURL}/upload/upload-attachment`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAuthUser = (): IUser => {
  const authUser: any = sessionStorage.getItem("user");
  const user: IUser = JSON.parse(authUser);
  return user;
};
