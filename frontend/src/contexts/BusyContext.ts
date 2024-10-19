import { createContext } from 'react';
import { ContextUseStateType } from 'ContextUseStateType';
import { UseStateContext } from '@contexts/UseStateContext';

export const BusyContext = UseStateContext<string | null>();