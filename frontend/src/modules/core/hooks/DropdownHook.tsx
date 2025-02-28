import React from 'react';

type Props = {
  openingItemRef: React.RefObject<HTMLElement | null>;
  dropdownRef: React.RefObject<HTMLElement | null>;
  dropdownPosition?: 'left' | 'center' | 'right';
  dropdownWidthMultiplier?: number;
};

type DropdownProperties = {
  top: number;
  left: number;
  width: number;
  direction: 'up' | 'down';
};

const positionModifier: Record<Exclude<Props['dropdownPosition'], undefined>, number> = {
  left: 0,
  center: 0.5,
  right: 1,
};

function isOverflowingDownwards(headerRect: DOMRect, dropdownRect: DOMRect) {
  return headerRect.top - headerRect.height / 2 + window.scrollY + dropdownRect.height < document.body.scrollHeight;
}

export function useDropdown({
  openingItemRef,
  dropdownRef,
  dropdownPosition = 'center',
  dropdownWidthMultiplier = 1,
}: Props) {
  const [dropdownProperties, setDropdownProperties] = React.useState<DropdownProperties>({
    top: 0,
    left: 0,
    width: 0,
    direction: 'down',
  });

  const updateDropdownPosition = React.useCallback(() => {
    if (!openingItemRef.current || !dropdownRef.current) {
      return;
    }

    const headerRect = openingItemRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    const direction = isOverflowingDownwards(headerRect, dropdownRect) ? 'down' : 'up';

    let width = headerRect.width * dropdownWidthMultiplier;
    if (headerRect.left + width > window.innerWidth) {
      width -= headerRect.left + width - window.innerWidth;
    }
    if (headerRect.right - width < 0) {
      width -= headerRect.right - width;
    }

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setDropdownProperties({
      top:
        direction === 'down'
          ? headerRect.top - headerRect.height / 2 + window.scrollY
          : headerRect.top - headerRect.height * 1.75 - dropdownRect.height + window.scrollY,
      left:
        headerRect.left +
        headerRect.width * positionModifier[dropdownPosition] -
        dropdownRect.width * positionModifier[dropdownPosition] +
        window.scrollX,
      width,
      direction,
    });
  }, [openingItemRef, dropdownRef, dropdownWidthMultiplier, dropdownPosition]);

  React.useEffect(() => {
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDropdownPosition, dropdownRef.current]);

  return dropdownProperties;
}
