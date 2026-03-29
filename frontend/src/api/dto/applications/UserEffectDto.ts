import { ResearchTaskEffectDto } from '@/api/dto/applications/ResearchTaskEffectDto';

export type UserEffectDto = {
  id: string;
  userId: string;
  effect: ResearchTaskEffectDto;
  points: string;
  cruiseApplicationId: string;
};
