import React from 'react';

type Props = {
  refs: React.RefObject<HTMLElement | null>[];
  ignoreWhen?: (evt: MouseEvent) => boolean;
  onOutsideClick: () => void;
};

export function useOutsideClickDetection({ refs, ignoreWhen, onOutsideClick }: Props) {
  React.useEffect(() => {
    function handleClickOutside(evt: MouseEvent) {
      if (ignoreWhen && ignoreWhen(evt)) {
        return;
      }

      if (refs.some((ref) => ref.current && ref.current.contains(evt.target as Node))) {
        return;
      }

      if (refs.every((ref) => !ref.current)) {
        return;
      }

      onOutsideClick();
    }

    function handleKeyDown(evt: KeyboardEvent) {
      if (evt.key === 'Escape') {
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOutsideClick, ignoreWhen, refs]);
}
