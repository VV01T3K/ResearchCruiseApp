import CheckCircleFillIcon from 'bootstrap-icons/icons/check-circle-fill.svg?react';
import ExclamationTriangleFillIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?react';

import { AppModal } from '@/core/components/AppModal';
import { useAppContext } from '@/core/hooks/AppContextHook';

export function AppAlertDisplayer() {
  const { alert, hideAlert } = useAppContext();

  return (
    <AppModal title={alert?.title ?? ''} isOpen={!!alert} onClose={() => alert && hideAlert(alert!.id)}>
      <div className="flex items-center gap-8">
        {alert?.variant === 'danger' && <ExclamationTriangleFillIcon className="h-12 w-12 text-red-500" />}
        {alert?.variant === 'success' && <CheckCircleFillIcon className="h-12 w-12 text-green-500" />}
        {alert?.message ?? ''}
      </div>
    </AppModal>
  );
}
