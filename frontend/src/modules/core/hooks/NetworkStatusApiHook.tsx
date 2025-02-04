import { useMutation } from '@tanstack/react-query';

import { client } from '@/core/lib/api';

type Props = {
  setNetworkConnectionStatus: (status: boolean) => void;
};

export function useNetworkStatusMutation({ setNetworkConnectionStatus }: Props) {
  return useMutation({
    mutationFn: async () => client.get('/health', { headers: { Authorization: '' } }),
    onSuccess: () => {
      setNetworkConnectionStatus(true);
    },
    onError: () => {
      setNetworkConnectionStatus(false);
    },
    retry: false,
  });
}
