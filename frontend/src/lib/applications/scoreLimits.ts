// Mirrors backend EvaluationConstants: scores are stored as int.
export const MAX_MINISTERIAL_POINTS = 2_147_483_647;

export const MINISTERIAL_POINTS_MESSAGE = `Punkty ministerialne muszą być liczbą całkowitą od 0 do ${MAX_MINISTERIAL_POINTS}`;

export function isMinisterialPoints(value: string) {
  return /^\d+$/.test(value) && Number(value) <= MAX_MINISTERIAL_POINTS;
}
