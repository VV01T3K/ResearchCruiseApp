import { useQueryClient } from '@tanstack/react-query';

import { Publication } from '@/api/publications/dto/Publication';
import { UserEffectDto } from '@/api/applications/dto/UserEffectDto';
import {
  getGetCurrentUserPublicationsV2QueryKey,
  importCurrentUserPublicationsV2,
  useDeleteAllCurrentUserPublicationsV2,
  useDeleteCurrentUserPublicationV2,
  useGetCurrentUserPublicationsV2Suspense,
  useGetCurrentUserCruiseEffectsV2Suspense,
  useImportCurrentUserPublicationsV2,
} from '@/api/generated/endpoints';
import { ImportPublicationRequest } from '@/api/generated/model';
import { validateRequest } from '@/api/validateRequest';

export function useCurrentPublicationsQuery() {
  return useGetCurrentUserPublicationsV2Suspense({
    query: {
      select: (publications) =>
        publications.map(
          (publication): Publication => ({
            ...publication,
            doi: publication.doi ?? '',
            authors: publication.authors ?? '',
            title: publication.title ?? '',
            magazine: publication.magazine ?? '',
            year: publication.year ?? '',
          })
        ),
    },
  });
}

export function useDeleteCurrentPublicationMutation() {
  const queryClient = useQueryClient();

  return useDeleteCurrentUserPublicationV2({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCurrentUserPublicationsV2QueryKey() }),
    },
  });
}

export function useDeleteAllCurrentPublicationsMutation() {
  const queryClient = useQueryClient();

  return useDeleteAllCurrentUserPublicationsV2({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCurrentUserPublicationsV2QueryKey() }),
    },
  });
}

export function useImportCurrentPublicationsMutation() {
  const queryClient = useQueryClient();

  return useImportCurrentUserPublicationsV2({
    mutation: {
      mutationFn: ({ data }) =>
        importCurrentUserPublicationsV2(validateRequest('import-publications', ImportPublicationRequest.array(), data)),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCurrentUserPublicationsV2QueryKey() }),
    },
  });
}

export function useCurrentCruiseEffectsQuery() {
  return useGetCurrentUserCruiseEffectsV2Suspense<UserEffectDto[]>({
    query: { select: (effects) => effects as UserEffectDto[] },
  });
}
