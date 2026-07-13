import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { UserEffectDto } from '@/api/applications/dto/UserEffectDto';
import { Publication } from '@/api/publications/dto/Publication';
import { client } from '@/lib/api';
import { Result } from '@/models/user/Results';
import { getStoredAuthDetails } from '@/providers/StoredAuthDetails';

import {
  ChangePasswordRequest,
  CurrentPublicationImportRequest,
  CurrentPublicationResponse,
  CurrentUserResponse,
} from './contracts';

type ResultProps = {
  setResult: (result: Result) => void;
};

/* Returns NULL when no access token has been set or the session is unauthorized. */
export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const accessToken = getStoredAuthDetails()?.accessToken;
      if (!accessToken) {
        return null;
      }

      try {
        const response = await client.get<CurrentUserResponse>('/v2/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });
}

export function useChangePasswordMutation({ setResult }: ResultProps) {
  return useMutation({
    mutationFn: async (request: ChangePasswordRequest) => {
      return await client.patch('/v2/users/me/password', request);
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });
}

export function useCurrentPublicationsQuery() {
  return useSuspenseQuery({
    queryKey: ['currentPublications'],
    queryFn: async () => client.get<CurrentPublicationResponse[]>('/v2/users/me/publications'),
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
    mutationFn: async (id: string) => client.delete(`/v2/users/me/publications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPublications'] });
    },
  });
}

export function useDeleteAllCurrentPublicationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => client.delete('/v2/users/me/publications'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPublications'] });
    },
  });
}

export function useImportCurrentPublicationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (publications: CurrentPublicationImportRequest[]) =>
      client.post('/v2/users/me/publications/import', publications),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPublications'] });
    },
  });
}

export function useCurrentCruiseEffectsQuery() {
  return useSuspenseQuery({
    queryKey: ['currentCruiseEffects'],
    queryFn: async () => client.get<UserEffectDto[]>('/v2/users/me/cruise-effects'),
    select: (response) => response.data,
  });
}
