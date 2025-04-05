import { ResearchTaskEffectDto } from '@/cruise-applications/models/ResearchTaskEffectDto';

export type UserEffectDto = {
  id: string;
  userId: string;
  effect: ResearchTaskEffectDto;
  points: string;
  cruiseApplicationId: string;
};
