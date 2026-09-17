import ArrowRepeatIcon from 'bootstrap-icons/icons/arrow-repeat.svg?react';
import React from 'react';

export type InfiniteScrollProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetching: boolean;
  pageCount: number;
  fetchNextPage: () => void;
};

export function AppTableInfiniteScrollTrigger({
  hasNextPage,
  isFetchingNextPage,
  isFetching,
  pageCount,
  fetchNextPage,
}: InfiniteScrollProps) {
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetching) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, pageCount, fetchNextPage]);

  if (!hasNextPage && !isFetchingNextPage) {
    return null;
  }

  return (
    <div ref={sentinelRef} className="flex w-full items-center justify-center py-4">
      {isFetchingNextPage && (
        <ArrowRepeatIcon className="h-6 w-6 animate-spin text-primary" role="status" aria-label="Wczytywanie…" />
      )}
    </div>
  );
}
