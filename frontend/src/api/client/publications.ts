import type { PublicationResponse } from '@/api/generated/schemas';

export type Publication = Omit<PublicationResponse, 'doi' | 'authors' | 'title' | 'magazine' | 'year'> & {
  doi: string;
  authors: string;
  title: string;
  magazine: string;
  year: string;
};

export function mapPublication(publication: PublicationResponse): Publication {
  return {
    ...publication,
    doi: publication.doi ?? '',
    authors: publication.authors ?? '',
    title: publication.title ?? '',
    magazine: publication.magazine ?? '',
    year: publication.year ?? '',
  };
}
