import { Publication } from '@/api/dto/publications/Publication';

export type UserPublication = {
  id: string;
  userId: string;
  publication: Publication;
};
