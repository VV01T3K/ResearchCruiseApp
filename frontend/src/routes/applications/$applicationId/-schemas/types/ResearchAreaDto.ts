import type { ResearchAreaDto } from '@/api/generated/schemas';
export type { ResearchAreaDto } from '@/api/generated/schemas';

export function getResearchAreaName(initialAreas: ResearchAreaDto[], id: string) {
  for (const area of initialAreas) {
    if (area.id == id) return area.name;
  }
  return null;
}
