import { Toast } from '@base-ui/react/toast';
import CheckCircleIcon from 'bootstrap-icons/icons/check-circle-fill.svg?react';
import ExclamationCircleIcon from 'bootstrap-icons/icons/exclamation-circle-fill.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';

import { toastManager } from './toast';

function ToastIcon({ type }: { type?: string }) {
  if (type === 'success') {
    return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
  }
  if (type === 'error') {
    return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
  }
  if (type === 'loading') {
    return <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />;
  }
  return null;
}

// CSS-based progress bar that uses animation-play-state to pause
// This syncs with Base UI's internal timer since both use the [data-expanded] attribute
function ToastProgress({ type }: { type?: string }) {
  // Don't show progress for loading toasts
  if (type === 'loading') return null;

  const progressColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-gray-400';

  return (
    <div className="absolute right-0 bottom-0 left-0 h-1 overflow-hidden rounded-b-lg bg-gray-100">
      <div className={`toast-progress-bar h-full w-full ${progressColor}`} />
    </div>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((t) => (
    <Toast.Root
      key={t.id}
      toast={t}
      swipeDirection={[]}
      className="absolute top-0 right-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 h-[var(--height)] w-[350px] origin-top [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))] rounded-lg border border-gray-200 bg-white p-4 shadow-lg [--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)+(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s] after:absolute after:bottom-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-[ending-style]:opacity-0 data-[expanded]:h-[var(--toast-height)] data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-[limited]:opacity-0 data-[starting-style]:[transform:translateY(-150%)] [&[data-ending-style]:not([data-limited])]:[transform:translateY(-150%)]"
    >
      <Toast.Content className="overflow-hidden transition-opacity [transition-duration:250ms] data-[behind]:pointer-events-none data-[behind]:opacity-0 data-[expanded]:pointer-events-auto data-[expanded]:opacity-100">
        <div className="flex items-center gap-4" data-testid={`toast-${t.type}`}>
          <ToastIcon type={t.type} />
          <Toast.Description className="flex-1 text-sm" />
          {t.type !== 'loading' && (
            <Toast.Close
              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:cursor-pointer hover:bg-black/5 hover:text-gray-700"
              aria-label="Close"
            >
              <XLgIcon className="h-4 w-4" />
            </Toast.Close>
          )}
        </div>
      </Toast.Content>
      <ToastProgress type={t.type} />
    </Toast.Root>
  ));
}

export function AppToaster() {
  return (
    <Toast.Provider toastManager={toastManager} limit={5}>
      <Toast.Portal>
        <Toast.Viewport
          data-testid="toast-container"
          className="fixed top-4 right-4 z-[1000] flex w-[350px] flex-col items-end"
        >
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
