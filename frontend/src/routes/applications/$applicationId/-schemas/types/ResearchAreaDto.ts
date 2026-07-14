import type { ResearchAreaDto } from '@/api/gen/model';
export type { ResearchAreaDto } from '@/api/gen/model';

export function getResearchAreaName(initialAreas: ResearchAreaDto[], id: string) {
  for (const area of initialAreas) {
    if (area.id == id) return area.name;
  }
  return null;
}
