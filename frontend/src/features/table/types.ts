import { Header } from '@tanstack/react-table';

export type AppTableHeaderDropdownStatus = 'open' | 'closed';
export type AppTableHeaderProps<TData, TValue> = {
  header: Header<TData, TValue>;
  children: React.ReactNode;
};
export type DropdownMenuProps<TData, TValue> = {
  header: Header<TData, TValue>;
  supportsDropdown: boolean;
  supportsFilter: boolean;
  supportsSort: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  headerRef: React.RefObject<HTMLDivElement | null>;
  status: AppTableHeaderDropdownStatus;
};
