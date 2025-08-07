import React, { useState, useEffect, useCallback } from "react";
import { GetItemDto } from "@/clients/items/get-items-dto";
import { GetDepartmentDto } from "@/clients/departments/get-department-dto";
import EditDepartment from "@/components/edit-department";
import DeleteDepartment from "@/components/delete-department";
import AddItem from "@/components/add-item";
import DeleteItem from "@/components/delete-item";
import EditItem from "@/components/edit-item";
import { ReactPagination } from "@/components/ui/react-pagination";
import { useAppContext } from "@/contexts/AppContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ItemsListProps {
  items: GetItemDto[];      
  selectedDepartment: GetDepartmentDto | null;
  isLoading?: boolean;
}

function ItemsList({ items, selectedDepartment, isLoading = false }: ItemsListProps) {
  const {
    paginatedItems, 
    currentPage, 
    pageSize, 
    searchQuery, 
    setCurrentPage, 
    setPageSize, 
    setSearchQuery 
  } = useAppContext();
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  const debounceSearch = useCallback((query: string) => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(query);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [setSearchQuery]);
  
  useEffect(() => {
    return debounceSearch(localSearchQuery);
  }, [localSearchQuery, debounceSearch]);
  
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };
  return (
    <section className="m-4 w-full">
        <div className="mb-5 flex justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-[20px] h-[20px] absolute top-[6px] left-[5px] text-gray-400" />
              <Input 
                className="pl-[35px]" 
                placeholder="Search for an item..." 
                type="text" 
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
              {localSearchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-6 w-6 p-0"
                  onClick={() => setLocalSearchQuery('')}
                >
                  ✕
                </Button>
              )}
          </div>
          <div className="flex gap-3">
            {selectedDepartment && (
              <>
                <AddItem departmentId={selectedDepartment.id} departmentName={selectedDepartment.name} />
                <EditDepartment id={selectedDepartment.id} name={selectedDepartment.name} />
                <DeleteDepartment id={selectedDepartment.id} />
              </>
            )}
          </div>
        </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-[#777d7d]">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-[#777d7d]">
            {searchQuery ? `No items found matching "${searchQuery}"` : 'No items found for this department.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-2 right-2 flex gap-1">
                  <EditItem item={item} />
                  <DeleteItem itemId={item.id} itemName={item.name} />
                </div>
                <img 
                  src={item.imageUrl || "https://placehold.co/300x200"} 
                  alt={item.name}
                  className="w-full h-48 object-cover rounded mb-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/300x200";
                  }}
                />
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-green-600 font-bold text-xl">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          {paginatedItems && paginatedItems.totalCount > 0 && (
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, paginatedItems.totalCount)} of {paginatedItems.totalCount} items
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Items per page:</label>
                    <select 
                      value={pageSize} 
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
                <ReactPagination
                  currentPage={currentPage}
                  totalPages={paginatedItems.totalPages}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ItemsList;