import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { CurrentPublicationImportRequest, CurrentPublicationResponse } from '@/api/account/contracts';
import { UserEffectDto } from '@/api/applications/dto/UserEffectDto';
import { Publication } from '@/api/publications/dto/Publication';
import { client } from '@/lib/api';

export function useCurrentPublicationsQuery() {
  return useSuspenseQuery({
    queryKey: ['currentPublications'],
    queryFn: async () => client.get<CurrentPublicationResponse[]>('/v2/account/me/publications'),
    select: (response) =>
      response.data.map(
        (publication): Publication => ({
          ...publication,
          doi: publication.doi ?? '',
          authors: publication.authors ?? '',
          title: publication.title ?? '',
          magazine: publication.magazine ?? '',
          year: publication.year ?? '',
        })
      ),
  });
}

export function useDeleteCurrentPublicationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => client.delete(`/v2/account/me/publications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPublications'] });
    },
  });
}

export function useDeleteAllCurrentPublicationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => client.delete('/v2/account/me/publications'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPublications'] });
    },
  });
}

export function useImportCurrentPublicationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (publications: CurrentPublicationImportRequest[]) =>
      client.post('/v2/account/me/publications/import', publications),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPublications'] });
    },
  });
}

export function useCurrentCruiseEffectsQuery() {
  return useSuspenseQuery({
    queryKey: ['currentCruiseEffects'],
    queryFn: async () => client.get<UserEffectDto[]>('/v2/account/me/cruise-effects'),
    select: (response) => response.data,
  });
}
