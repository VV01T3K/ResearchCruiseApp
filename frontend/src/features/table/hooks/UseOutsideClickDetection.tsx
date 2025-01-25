import React from 'react';

type Props = {
  refs: React.RefObject<HTMLDivElement | null>[];
  ignoreClickWhen?: (event: MouseEvent) => boolean;
  onOutsideClick: () => void;
};

export function useOutsideClickDetection({ refs, ignoreClickWhen, onOutsideClick }: Props) {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ignoreClickWhen && ignoreClickWhen(event)) {
        return;
      }

      if (refs.some((ref) => ref.current && ref.current.contains(event.target as Node))) {
        return;
      }

      if (refs.every((ref) => !ref.current)) {
        return;
      }

      onOutsideClick();
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOutsideClick, ignoreClickWhen, refs]);
}
