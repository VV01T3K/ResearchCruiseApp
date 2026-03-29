import BackgroundImageUrl from '@/assets/background.jpg';
import { AppLoader } from '@/components/layout/AppLoader';

export function RouterBootFallback() {
  return (
    <>
      <div
        className="fixed -z-50 h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${BackgroundImageUrl}')` }}
      />
      <div className="fixed -z-50 h-screen w-full" style={{ backdropFilter: 'blur(12px)' }} />
      <AppLoader />
    </>
  );
}
