import { useMutation } from '@tanstack/react-query';

import { apiFetch } from '@/api/fetch';

type Props = {
  setNetworkConnectionStatus: (status: boolean) => void;
};

export function useNetworkStatusMutation({ setNetworkConnectionStatus }: Props) {
  return useMutation({
    mutationFn: async () => apiFetch('/health', { headers: { Authorization: '' } }),
    onSuccess: () => {
      setNetworkConnectionStatus(true);
    },
    onError: () => {
      setNetworkConnectionStatus(false);
    },
    retry: false,
  });
}
