import React from 'react';
import ItemsList from './items-list';
import { useAppContext } from '@/contexts/AppContext';

function LeftSection() {
  const {
    departments,
    selectedDepartment,
    activeDepId,
    items,
    isLoadingItems,
    isDepartmentsLoading,
    departmentsError,
    itemsError,
    setActiveDepId,
  } = useAppContext();

  if (departmentsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">Error loading departments</p>
          <p className="text-sm text-gray-600">{departmentsError.message}</p>
        </div>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">Error loading items</p>
          <p className="text-sm text-gray-600">{itemsError.message}</p>
        </div>
      </div>
    );
  }

  if (isDepartmentsLoading) {
    return (
      <section className="flex">
        <div className="border-r-[2px] h-screen w-[200px] flex items-center justify-center">
          <p className="text-[#777d7d]">Loading departments...</p>
        </div>
        <div className="m-4 w-full flex items-center justify-center">
          <p className="text-[#777d7d]">Loading...</p>
        </div>
      </section>
    );
  }

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
        {departments.map((dept) => (
          <li
            onClick={() => setActiveDepId(dept.id)}
            key={dept.id}
            className={`${
              activeDepId === dept.id
                ? 'bg-[#e2f0ed] text-[#216037]'
                : 'text-[#777d7d]'
            } cursor-pointer py-2 font-[600] hover:bg-gray-100 transition-colors`}
          >
            {dept.name}
          </li>
        ))}
      </ul>
      <ItemsList items={items} selectedDepartment={selectedDepartment} isLoading={isLoadingItems} />
    </section>
  );
}

export default LeftSection;
