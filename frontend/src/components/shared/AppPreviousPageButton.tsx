import { useRouter } from '@tanstack/react-router';
import { ArrowLeftCircle } from 'lucide-react';

export function AppPreviousPageButton() {
  const router = useRouter();

  return (
    <div className="w-8">
      <a className="hover:cursor-pointer" title="Cofnij się" onClick={() => router.history.back()}>
        <ArrowLeftCircle className="rounded-full text-[#0041d2] transition-colors hover:bg-[#0041d2] hover:text-white" />
      </a>
    </div>
  );
}
