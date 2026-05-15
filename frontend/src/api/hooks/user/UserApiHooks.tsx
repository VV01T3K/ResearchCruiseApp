import { useMutation } from '@tanstack/react-query';
import { client } from '@/lib/api';
import { Result } from '@/models/user/Results';

type Props = {
  setResult: (result: Result) => void;
};

export function useConfirmEmailMutation({ setResult }: Props) {
  return useMutation({
    mutationFn: async ({ userId, code }: { userId: string; code: string }) => {
      return await client.get('/account/emailConfirmation', {
        params: {
          userId,
          code,
        },
      });
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}
