import axios, { AxiosResponse } from 'axios';
import {GetDepartmentDto} from "@/clients/Departments/getDepartmentDto"
import { GetItemDto } from './Items/GetItemsDto';

export const BASE_URL = 'https://localhost:7078';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function getAllDepartments(): Promise<GetDepartmentDto[]> {
    const response: AxiosResponse<GetDepartmentDto[]> = await api.get('/api/Department');
    return response.data;
}

 async function getItemsByDepId(depId: number): Promise<GetItemDto[]> {
  const response : AxiosResponse<GetItemDto[]> = await api.get(`/api/Department/${depId}/items`);
  return response.data;
}

async function addDepartments(name: string) {
    const response: AxiosResponse = await api.post('/api/Department', {name});
    return response.data;
}

export {
  getAllDepartments,
  getItemsByDepId,
  addDepartments
};