import React from "react";
import { Item } from "@/clients/apiClient";
import EditDepartment from "@/components/EditDepartment";

interface ItemsListProps {
    items: Item[];
}

function ItemsList({ items }: ItemsListProps , department_name : string) {
  return (
    <section className="m-4">
        <div className="mb-5">
            <div className="relative">
              <img src="src/assets/img.svg" className="w-[20px] h-[20px] absolute top-[6px] left-[5px]" alt="" />
              <input className="pl-[30px] py-1 border" placeholder="search for an item ..." type="text" /> 
          </div>
          <div>
            <EditDepartment name="test"/>
          </div>
        </div>
      {items.length === 0 ? (
        <p>No items found for this department.</p>
      ) : (
        <ul>
              {items.map((item) => (
            <li className="grid grid-cols-3" key={item.id}>
                <div>
                    <img src="https://placehold.co/600x400" alt="" />
                    <p>{item.name}</p>
                    <p>{item.price}</p>
                </div>
                </li>
          ))}
        </ul>
      )}    
    </section>
  );
}

export default ItemsList;