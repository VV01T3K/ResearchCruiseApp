import { FileImageIcon, FilePdfIcon, PaperclipIcon, XIcon } from '@phosphor-icons/react';
import { useCallback, useId, useRef, useState } from 'react';

import {
  ACCEPTED_ATTACHMENTS,
  type FeedbackAttachment,
  isImageAttachment,
  MAX_ATTACHMENTS,
} from '@/integrations/sentry/attachments';

type Props = {
  attachments: FeedbackAttachment[];
  errors: string[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
};
export function FeedbackAttachments({ attachments, errors, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const helperId = useId();

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">Załączniki</span>
        <button
          type="button"
          aria-describedby={helperId}
          disabled={attachments.length >= MAX_ATTACHMENTS}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-primary hover:cursor-pointer hover:bg-primary/5 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          <PaperclipIcon className="h-4 w-4" aria-hidden />
          Dołącz plik
        </button>
      </div>
      <p id={helperId} className="text-xs text-gray-500">
        Do {MAX_ATTACHMENTS} plików PNG, JPEG, WebP lub PDF, każdy do 5 MB. Zrzut ekranu można też wkleić (Ctrl+V).
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={ACCEPTED_ATTACHMENTS}
        onChange={(e) => {
          onAdd(Array.from(e.target.files ?? []));
          e.target.value = '';
        }}
      />
      {attachments.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {attachments.map((attachment) => (
            <li key={attachment.id} className="flex items-center gap-2 rounded-md border border-gray-200 p-1.5 text-sm">
              <AttachmentThumbnail attachment={attachment} />
              <span className="min-w-0 flex-1 truncate" title={attachment.filename}>
                {attachment.filename}
              </span>
              <span className="shrink-0 text-xs text-gray-500">{formatSize(attachment.data.byteLength)}</span>
              <button
                type="button"
                aria-label={`Usuń załącznik ${attachment.filename}`}
                onClick={() => onRemove(attachment.id)}
                className="shrink-0 rounded-md p-1 text-gray-500 hover:cursor-pointer hover:bg-black/5 hover:text-gray-700"
              >
                <XIcon className="h-4 w-4 scale-55" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors.length > 0 && (
        <ul role="alert" className="mt-2 space-y-0.5 text-xs text-red-600">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AttachmentThumbnail({ attachment }: { attachment: FeedbackAttachment }) {
  const [broken, setBroken] = useState(false);
  const showPreview = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img) return;
      const url = URL.createObjectURL(new Blob([attachment.data], { type: attachment.contentType }));
      img.src = url;
      return () => URL.revokeObjectURL(url);
    },
    [attachment]
  );

  if (broken) return <FileImageIcon className="h-8 w-8 shrink-0 p-1 text-gray-500" aria-hidden />;
  if (!isImageAttachment(attachment)) {
    return <FilePdfIcon className="h-8 w-8 shrink-0 p-1 text-red-600" aria-hidden />;
  }
  return (
    <img
      ref={showPreview}
      alt=""
      onError={() => setBroken(true)}
      className="h-8 w-8 shrink-0 rounded-sm bg-gray-100 object-cover"
    />
  );
}

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
