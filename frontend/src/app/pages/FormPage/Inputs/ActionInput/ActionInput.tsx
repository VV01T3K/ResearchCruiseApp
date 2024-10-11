import { UseFormReturn } from 'react-hook-form';

export type Action = {
    startDate?: string,
    endDate?: string,
    name: string,
    time?: string,
    category?: string
}

type Props = {
    className: string,
    name: string,
    form?: UseFormReturn,
    history?: Action[],
    required?: boolean,
    readonly?: boolean,
    actionName: string
}