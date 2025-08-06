import React from "react";
import { GetItemDto } from "@/clients/items/get-items-dto";
import { GetDepartmentDto } from "@/clients/departments/get-department-dto";
import EditDepartment from "@/components/edit-department";
import DeleteDepartment from "@/components/delete-department";
import AddItem from "@/components/add-item";

interface ItemsListProps {
  items: GetItemDto[];      
  selectedDepartment: GetDepartmentDto | null;
  isLoading?: boolean;
}

function ItemsList({ items, selectedDepartment, isLoading = false }: ItemsListProps) {
  return (
    <section className="m-4 w-full">
        <div className="mb-5 flex justify-between">
            <div className="relative">
              <img src="src/assets/img.svg" className="w-[20px] h-[20px] absolute top-[6px] left-[5px]" alt="" />
              
              <input className="pl-[30px] py-1 border" placeholder="search for an item ..." type="text" />
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
          <p className="text-[#777d7d]">No items found for this department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="https://placehold.co/300x200" 
                alt={item.name}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-green-600 font-bold text-xl">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ItemsList;