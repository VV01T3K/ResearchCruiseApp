import type { ResearchAreaOption } from '@/api/generated/schemas';
export type { ResearchAreaOption } from '@/api/generated/schemas';

export function getResearchAreaName(initialAreas: ResearchAreaOption[], id: string) {
  for (const area of initialAreas) {
    if (area.id == id) return area.name;
  }
  return null;
}
