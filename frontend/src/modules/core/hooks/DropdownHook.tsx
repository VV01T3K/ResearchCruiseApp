import React from 'react';

type Props = {
  openingItemRef: React.RefObject<HTMLElement | null>;
  dropdownRef: React.RefObject<HTMLElement | null>;
  dropdownPosition?: 'left' | 'center' | 'right';
};

const positionModifier: Record<Exclude<Props['dropdownPosition'], undefined>, number> = {
  left: 0,
  center: 0.5,
  right: 1,
};

export function useDropdown({ openingItemRef, dropdownRef, dropdownPosition = 'center' }: Props) {
  const [dropdownProperties, setDropdownProperties] = React.useState({ top: 0, left: 0, width: 0 });

  const updateDropdownPosition = React.useCallback(() => {
    if (!openingItemRef.current || !dropdownRef.current) {
      return;
    }

    const headerRect = openingItemRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setDropdownProperties({
      top: headerRect.top - headerRect.height / 2 + window.scrollY,
      left:
        headerRect.left +
        headerRect.width * positionModifier[dropdownPosition] -
        dropdownRect.width * positionModifier[dropdownPosition] +
        window.scrollX,
      width: headerRect.width,
    });
  }, [openingItemRef, dropdownRef, dropdownPosition]);

  React.useEffect(() => {
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [updateDropdownPosition]);

  return dropdownProperties;
}
