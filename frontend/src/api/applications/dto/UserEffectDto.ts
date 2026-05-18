import { ResearchTaskEffectDto } from '@/api/applications/dto/ResearchTaskEffectDto';

export type UserEffectDto = {
  id: string;
  userId: string;
  effect: ResearchTaskEffectDto;
  points: string;
  cruiseApplicationId: string;
};
