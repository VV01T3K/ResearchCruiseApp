import { useMutation } from '@tanstack/react-query';

import config from '@/config';

type Props = {
  setNetworkConnectionStatus: (status: boolean) => void;
};

export function useNetworkStatusMutation({ setNetworkConnectionStatus }: Props) {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${config.apiUrl}/health`);
      if (!response.ok) throw new Error(`Network status request failed with status ${response.status}`);
    },
    onSuccess: () => {
      setNetworkConnectionStatus(true);
    },
    onError: () => {
      setNetworkConnectionStatus(false);
    },
    retry: false,
  });
}
