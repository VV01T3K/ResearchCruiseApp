// Mirrors backend EvaluationConstants: scores are stored and summed as int.
export const MAX_MINISTERIAL_POINTS = 2_147_483_647;
export const MAX_FINANCING_AMOUNT = 2_684_354_500_000;

export const MINISTERIAL_POINTS_MESSAGE = `Punkty ministerialne muszą być liczbą całkowitą od 0 do ${MAX_MINISTERIAL_POINTS}`;

export function isMinisterialPoints(value: string) {
  return /^\d+$/.test(value) && Number(value) <= MAX_MINISTERIAL_POINTS;
}
