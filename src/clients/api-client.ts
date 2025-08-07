import axios, { AxiosResponse } from 'axios';
import { GetItemDto, PaginatedItemsResponse } from './items/get-items-dto';
import { GetDepartmentDto } from './departments/get-department-dto';

export const BASE_URL = 'http://localhost:5099';

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
  const response = await getItemsByDepIdPaginated(depId, 1, 50);
  return response.items;
}

async function getItemsByDepIdPaginated(
  depId: number, 
  page: number = 1, 
  pageSize: number = 10, 
  search?: string
): Promise<PaginatedItemsResponse> {
  const params = new URLSearchParams({
    pageNumber: page.toString(),
    pageSize: pageSize.toString(),
  });
  
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  console.log(params.toString())
  const response: AxiosResponse<PaginatedItemsResponse> = await api.get(
    `/api/Department/${depId}/items?${params.toString()}`
  );
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

async function addItem(departmentId: number, Name: string, Price: number, imageFile?: File) {
      // console.log("m")
        const formData = new FormData();
        formData.append('Name', Name);
        formData.append('Price', Price.toString());
        if (imageFile) {
        formData.append('ImageFile', imageFile);
        }
        const response: AxiosResponse = await api.post(
            `/api/Department/${departmentId}/items`, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
}

async function deleteItem(itemId: number) {
    const response: AxiosResponse = await api.delete(`/api/Item/${itemId}`);
    return response.data;
}

async function editItem(itemId: number, name: string, price: number, imageFile?: File) {
    if (imageFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price.toString());
        formData.append('ImageFile', imageFile);
        
        const response: AxiosResponse = await api.put(
            `/api/Item/${itemId}`, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } else {
        // Use JSON for text-only data
        const response: AxiosResponse = await api.put(`/api/Item/${itemId}`, {
            name,
            price
        });
        return response.data;
    }
}

export {
  getAllDepartments,
  getItemsByDepId,
  getItemsByDepIdPaginated,
  addDepartments,
  updateDepartment,
  deleteDepartment,
  addItem,
  deleteItem,
  editItem
};
