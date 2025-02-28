import React from 'react';

type Props = {
  inputRef: React.RefObject<HTMLInputElement | null>;

  defaultPosition?: number;
};

export function useInputCursorPosition({ inputRef, defaultPosition = 0 }: Props) {
  const [cursorPosition, setCursorPosition] = React.useState(defaultPosition);

  React.useEffect(() => {
    inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
  });

  return setCursorPosition;
}
