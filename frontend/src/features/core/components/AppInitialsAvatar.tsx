import { UserContext } from '@core/contexts/UserContext';
import { useContext, useMemo } from 'react';

function getByteLength(string: string) {
  return new TextEncoder().encode(string[0])[0];
}

function map(value: number, start1: number, stop1: number, start2: number, stop2: number) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

const minCharByteValue: number = getByteLength('a');
const maxCharByteValue: number = getByteLength('z');

const minRange: number = minCharByteValue / maxCharByteValue;
const maxRange: number = 1;

export function AppInitialsAvatar() {
  const userContext = useContext(UserContext)!;
  const color = useMemo(() => {
    if (!userContext.currentUser) {
      return undefined;
    }

    const userValue =
      getByteLength(userContext.currentUser.firstName.charAt(0).toLowerCase()) /
      getByteLength(userContext.currentUser.lastName.charAt(0).toLowerCase());

    return `hsl(${map(userValue, minRange, maxRange, 0, 360)},50%,50%)`;
  }, [userContext.currentUser]);

  if (!userContext.currentUser) {
    return null;
  }

  return (
    <div
      className="relative inline-flex items-center justify-center w-16 h-16 overflow-hidden bg-[var(--color)] rounded-full"
      style={{ '--color': color } as React.CSSProperties}
    >
      <span className="text-gray-50 font-bold text-2xl">
        {userContext.currentUser.firstName.charAt(0)}
        {userContext.currentUser.lastName.charAt(0)}
      </span>
    </div>
  );
}
