/**
 * Display a loading spinner in the center of the screen.
 */
export function AppLoader() {
  return (
    <div className="absolute top-0 h-full w-full flex items-center justify-center backdrop-blur-sm">
      <div className="absolute h-full w-full bg-white/50 -z-10" />
      <div className="flex flex-col gap-8">
        <div
          className="inline-block h-32 w-32 animate-spin rounded-full border-8 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-blue-500"
          role="status"
        ></div>
      </div>
    </div>
  );
}
