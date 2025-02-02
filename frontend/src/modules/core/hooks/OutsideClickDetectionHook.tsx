import React from 'react';

type Props = {
  refs: React.RefObject<HTMLElement | null>[];
  ignoreWhen?: (event: MouseEvent) => boolean;
  onOutsideClick: () => void;
};

export function useOutsideClickDetection({ refs, ignoreWhen, onOutsideClick }: Props) {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ignoreWhen && ignoreWhen(event)) {
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
  }, [onOutsideClick, ignoreWhen, refs]);
}
