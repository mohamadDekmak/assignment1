export interface GetItemDto
{
  id: number;
  name: string;
  price: number;
  departmentId: number;
  imageUrl?: string;
}

export interface PaginatedItemsResponse {
  items: GetItemDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
