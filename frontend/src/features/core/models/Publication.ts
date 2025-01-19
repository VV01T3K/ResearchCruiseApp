export type Publication = {
  id: string;
  category: string;
  doi: string;
  authors: string;
  title: string;
  magazine: string;
  year: string;
  ministerialPoints: string;
};

export type UserPublication = {
  id: string;
  userId: string;
  publication: Publication;
};
