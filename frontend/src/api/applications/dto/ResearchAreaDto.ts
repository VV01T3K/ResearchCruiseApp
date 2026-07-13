export type ResearchAreaDto = {
  id: string;
  name: string;
};

export function getResearchAreaName(initialAreas: ResearchAreaDto[], id: string) {
  for (const area of initialAreas) {
    if (area.id == id) return area.name;
  }
  return null;
}
