import { useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/core/lib/api';
import { FormAInitialState } from '@/formA/lib/types';

export function useFormAInitialStateQuery() {
  return useSuspenseQuery({
    queryKey: ['formAInitialState'],
    queryFn: async () => {
      return client.get('/forms/InitValues/A');
    },
    select: (res) => res.data as FormAInitialState,
  });
}
