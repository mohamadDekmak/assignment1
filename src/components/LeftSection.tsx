import React, { useEffect, useState } from 'react';
import { getAllDepartments, getItemsByDepId } from '@/clients/apiClient';
import ItemsList from './ItemsList';
import { GetDepartmentDto } from "@/clients/Departments/getDepartmentDto";
import { GetItemDto } from '@/clients/Items/GetItemsDto';
import { useQuery } from '@tanstack/react-query';

function LeftSection() {
  const [items, setItems] = useState<GetItemDto[]>([]);
  const [activeDepId, setActiveDepId] = useState<number | null>(null);
const {
  data: departments,
  error,
  isLoading,
} = useQuery<GetDepartmentDto[], Error>({
  queryKey: ['departments'],
  queryFn: getAllDepartments,
});

useEffect(() => {
  if (activeDepId !== null) {
    getItemsByDepId(activeDepId)
      .then((data) => setItems(data.items))
      .catch((err) => {
        console.error('Error fetching items:', err);
      });
  }
}, [activeDepId]);

useEffect(() => {
  if (departments && departments.length > 0 && activeDepId === null) {
    setActiveDepId(departments[0].id);
  }
}, [departments]);

  if (isLoading) return <div>Loading departments...</div>;
  if (error) return <div>Error loading departments: {error.message}</div>;

  return (
    <section className="flex">
      <ul className="text-center border-r-[2px] h-screen w-[200px]">
        {departments?.map((dept) => (
          <li
            onClick={() => setActiveDepId(dept.id)}
            key={dept.id}
            className={`${
              activeDepId === dept.id
                ? 'bg-[#e2f0ed] text-[#216037]'
                : 'text-[#777d7d]'
            } cursor-pointer py-2 font-[600]`}
          >
            {dept.name}
          </li>
        ))}
      </ul>
      <ItemsList items={items} />
    </section>
  );
}

export default LeftSection;
