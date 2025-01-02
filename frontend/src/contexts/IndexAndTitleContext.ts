import {createContext} from 'react';

export const IndexAndTitleContext = createContext<{ index?: number, title?: string } | null>(null);