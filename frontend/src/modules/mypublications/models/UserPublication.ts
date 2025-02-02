import { Publication } from '@/mypublications/models/Publication';

export type UserPublication = {
  id: string;
  userId: string;
  publication: Publication;
};
