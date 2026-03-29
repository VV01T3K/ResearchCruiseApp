import { ResearchTaskEffectDto } from '@/features/cruise-applications/models/ResearchTaskEffectDto';

export type UserEffectDto = {
  id: string;
  userId: string;
  effect: ResearchTaskEffectDto;
  points: string;
  cruiseApplicationId: string;
};
