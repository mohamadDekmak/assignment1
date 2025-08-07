import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetDepartmentDto } from '@/clients/departments/get-department-dto';
import { GetItemDto, PaginatedItemsResponse } from '@/clients/items/get-items-dto';
import { getAllDepartments, getItemsByDepIdPaginated } from '@/clients/api-client';

interface AppContextType {
  departments: GetDepartmentDto[] | undefined;
  selectedDepartment: GetDepartmentDto | null;
  activeDepId: number | null;
  items: GetItemDto[];
  paginatedItems: PaginatedItemsResponse | undefined;
  isLoadingItems: boolean;
  isDepartmentsLoading: boolean;
  departmentsError: Error | null;
  itemsError: Error | null;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  setActiveDepId: (id: number | null) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchQuery: (query: string) => void;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  
  const prevActiveDepId = useRef(activeDepId);
  const prevSearchQuery = useRef(searchQuery);

  const {
    data: departments,
    error: departmentsError,
    isLoading: isDepartmentsLoading,
  } = useQuery<GetDepartmentDto[], Error>({
    queryKey: ['departments'],
    queryFn: getAllDepartments,
  });

  const {
    data: paginatedItems,
    error: itemsError,
    isLoading: isLoadingItems,
  } = useQuery<PaginatedItemsResponse, Error>({
    queryKey: ['items', activeDepId, currentPage, pageSize, searchQuery],
    queryFn: async () => {
      if (!activeDepId) return { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 };
      return await getItemsByDepIdPaginated(activeDepId, currentPage, pageSize, searchQuery);
    },
    enabled: !!activeDepId,
  });


  const items = paginatedItems?.items || [];

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

  useEffect(() => {
    if (prevActiveDepId.current !== null && prevActiveDepId.current !== activeDepId) {
      setCurrentPage(1);
    }
    prevActiveDepId.current = activeDepId;
  }, [activeDepId]);
  
  useEffect(() => {
    if (prevSearchQuery.current !== searchQuery) {
      setCurrentPage(1);
    }
    prevSearchQuery.current = searchQuery;
  }, [searchQuery]);
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
    paginatedItems,
    isLoadingItems,
    isDepartmentsLoading,
    departmentsError,
    itemsError,
    currentPage,
    pageSize,
    searchQuery,
    setActiveDepId,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
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
