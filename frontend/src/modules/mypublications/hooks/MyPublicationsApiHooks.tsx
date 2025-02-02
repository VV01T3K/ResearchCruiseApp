import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/core/lib/api';
import { Publication } from '@/mypublications/models/Publication';
import { UserPublication } from '@/mypublications/models/UserPublication';

export function useOwnPublicationQuery() {
  return useSuspenseQuery({
    queryKey: ['ownPublications'],
    queryFn: () => {
      return client.get('api/cruiseApplications/ownPublications');
    },
    select: (data) => data.data.map((userPublication: UserPublication) => userPublication.publication) as Publication[],
  });
}

export function useDeleteOwnPublicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return client.delete(`api/cruiseApplications/ownPublications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownPublications'] });
    },
  });
}

export function useDeleteAllOwnPublicationsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return client.delete('api/cruiseApplications/ownPublications');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownPublications'] });
    },
  });
}

export function useUploadPublicationsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (publications: Publication[]) => {
      return client.post('api/cruiseApplications/ownPublications', publications);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownPublications'] });
    },
  });
}
