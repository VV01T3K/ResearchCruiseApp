import { Publication } from '@/features/my-publications/models/Publication';

export type UserPublication = {
  id: string;
  userId: string;
  publication: Publication;
};
