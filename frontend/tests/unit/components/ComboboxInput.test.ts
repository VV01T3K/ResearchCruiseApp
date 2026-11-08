import { describe, expect, it } from 'vite-plus/test';

import { matchesWordStart } from '@/components/inputs/ComboboxInput';

describe('matchesWordStart', () => {
  const label = 'Ewa Jankowska (e.jankowska@ug.edu.pl)';

  it('matches the start of a name or email word', () => {
    expect(matchesWordStart('Kamil Kowalczyk (k.kowalczyk@ug.edu.pl)', 'kow')).toBe(true);
    expect(matchesWordStart(label, 'jank')).toBe(true);
    expect(matchesWordStart(label, 'ewa jan')).toBe(true);
    expect(matchesWordStart(label, 'e.jankowska@ug.edu.pl')).toBe(true);
  });

  it('skips matches inside a word', () => {
    expect(matchesWordStart(label, 'kow')).toBe(false);
  });

  it('ignores case and Polish diacritics', () => {
    expect(matchesWordStart('Łukasz Żółw', 'zol')).toBe(true);
  });
});
