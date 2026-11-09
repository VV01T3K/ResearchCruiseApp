import { ArrowCircleLeftIcon } from '@phosphor-icons/react';
import { useRouter } from '@tanstack/react-router';

export function PreviousPageButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="group block w-8 rounded-full bg-surface text-primary hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-hidden"
      aria-label="Wróć do poprzedniej strony"
      title="Wróć do poprzedniej strony"
      onClick={() => router.history.back()}
    >
      <ArrowCircleLeftIcon className="block group-hover:hidden" />
      <ArrowCircleLeftIcon weight="fill" className="hidden group-hover:block" />
    </button>
  );
}
