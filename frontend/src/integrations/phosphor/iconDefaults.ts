import type { IconProps } from '@phosphor-icons/react';

// Phosphor glyphs fill about 81% of their box and Bootstrap's the whole box; the cropped viewBox keeps the old sizes.
export const iconDefaults: IconProps = { size: '100%', viewBox: '21 21 214 214', overflow: 'visible' };
