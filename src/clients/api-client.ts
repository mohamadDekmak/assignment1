import axios, { AxiosResponse } from 'axios';
import { GetItemDto } from './items/get-items-dto';
import { GetDepartmentDto } from './departments/get-department-dto';

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

async function updateDepartment(id : number, name: string) {
    const response: AxiosResponse = await api.put(`/api/Department/${id}`, {name});
    return response.data;
}

async function deleteDepartment(id : number) {
    const response: AxiosResponse = await api.delete(`/api/Department/${id}`);
    return response.data;
}

async function addItem(departmentId: number, name: string, price: number) {
    const response: AxiosResponse = await api.post(`/api/Department/${departmentId}/items`, {
        name,
        price
    });
    return response.data;
}

export {
  getAllDepartments,
  getItemsByDepId,
  addDepartments,
  updateDepartment,
  deleteDepartment,
  addItem
};
