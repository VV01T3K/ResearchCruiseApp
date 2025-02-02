import React from 'react';

type Props = {
  openingItemRef: React.RefObject<HTMLElement | null>;
  dropdownRef: React.RefObject<HTMLElement | null>;
};

export function useDropdownPosition({ openingItemRef, dropdownRef }: Props) {
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });

  const updateDropdownPosition = React.useCallback(() => {
    console.log(openingItemRef.current, dropdownRef.current);
    if (!openingItemRef.current || !dropdownRef.current) {
      return;
    }

    const headerRect = openingItemRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setDropdownPosition({
      top: headerRect.top - headerRect.height / 2 + window.scrollY,
      left: headerRect.left + headerRect.width / 2 - dropdownRect.width / 2 + window.scrollX,
    });
  }, [openingItemRef, dropdownRef]);

  React.useEffect(() => {
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [updateDropdownPosition]);

  return dropdownPosition;
}
