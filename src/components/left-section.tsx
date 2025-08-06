import React, { useEffect, useState } from 'react';
import { getAllDepartments, getItemsByDepId } from '@/clients/api-client';
import ItemsList from './items-list';
import { GetDepartmentDto } from "@/clients/departments/get-department-dto";
import { GetItemDto } from '@/clients/items/get-items-dto';
import { useQuery } from '@tanstack/react-query';

function LeftSection() {
  const [activeDepId, setActiveDepId] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<GetDepartmentDto | null>(null);

const {
  data: departments,
  error: departmentsError,
} = useQuery<GetDepartmentDto[], Error>({
  queryKey: ['departments'],
  queryFn: getAllDepartments,
});

// Use React Query for items fetching too
const {
  data: items = [],
  error: itemsError,
  isLoading: itemsLoading,
} = useQuery<GetItemDto[], Error>({
  queryKey: ['items', activeDepId],
  queryFn: () => getItemsByDepId(activeDepId!),
  enabled: activeDepId !== null,
});

// Update selected department when activeDepId or departments change
useEffect(() => {
  if (activeDepId !== null && departments) {
    const department = departments.find(dept => dept.id === activeDepId);
    setSelectedDepartment(department || null);
  } else {
    setSelectedDepartment(null);
  }
}, [activeDepId, departments]);

useEffect(() => {
  if (departments && departments.length > 0) {
    if (activeDepId === null) {
      setActiveDepId(departments[0].id);
    } else {
      const currentDepartmentExists = departments.some(dept => dept.id === activeDepId);
      if (!currentDepartmentExists) {
        setActiveDepId(departments[0].id);
      }
    }
  } else {
    setActiveDepId(null);
    setSelectedDepartment(null);
  }
}, [departments, activeDepId]);

  if (departmentsError) return <div>Error loading departments: {departmentsError.message}</div>;
  if (itemsError) return <div>Error loading items: {itemsError.message}</div>;
  if (!departments || departments.length === 0) {
    return (
      <section className="flex">
        <div className="border-r-[2px] h-screen w-[200px] flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-[#777d7d] mb-2">No departments yet</p>
            <p className="text-sm text-[#999]">Click "Add Department" above to create your first department</p>
          </div>
        </div>
        <div className="m-4 w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#777d7d] text-lg mb-2">Welcome to your store!</p>
            <p className="text-[#999]">Start by adding your first department to organize your items</p>
          </div>
        </div>
      </section>
    );
  }

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
      <ItemsList items={items} selectedDepartment={selectedDepartment} isLoading={itemsLoading} />
    </section>
  );
}

export default LeftSection;
