import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetDepartmentDto } from '@/clients/departments/get-department-dto';
import { GetItemDto } from '@/clients/items/get-items-dto';
import { getAllDepartments, getItemsByDepId } from '@/clients/api-client';

interface AppContextType {
  departments: GetDepartmentDto[] | undefined;
  selectedDepartment: GetDepartmentDto | null;
  activeDepId: number | null;
  items: GetItemDto[];
  isLoadingItems: boolean;
  isDepartmentsLoading: boolean;
  departmentsError: Error | null;
  itemsError: Error | null;
  setActiveDepId: (id: number | null) => void;
  invalidateDepartments: () => void;
  invalidateItems: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [activeDepId, setActiveDepId] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<GetDepartmentDto | null>(null);
  const queryClient = useQueryClient();
  const {
    data: departments,
    error: departmentsError,
    isLoading: isDepartmentsLoading,
  } = useQuery<GetDepartmentDto[], Error>({
    queryKey: ['departments'],
    queryFn: getAllDepartments,
  });
  const {
    data: items = [],
    error: itemsError,
    isLoading: isLoadingItems,
  } = useQuery<GetItemDto[], Error>({
    queryKey: ['items', activeDepId],
    queryFn: async () => {
      if (!activeDepId) return [];
      const response = await getItemsByDepId(activeDepId);
      return Array.isArray(response) ? response : response.items || [];
    },
    enabled: !!activeDepId,
  });

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
  const invalidateDepartments = () => {
    queryClient.invalidateQueries({ queryKey: ['departments'] });
  };

  const invalidateItems = () => {
    if (activeDepId) {
      queryClient.invalidateQueries({ queryKey: ['items', activeDepId] });
    }
  };

  const contextValue: AppContextType = {
    departments,
    selectedDepartment,
    activeDepId,
    items,
    isLoadingItems,
    isDepartmentsLoading,
    departmentsError,
    itemsError,
    setActiveDepId,
    invalidateDepartments,
    invalidateItems,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
