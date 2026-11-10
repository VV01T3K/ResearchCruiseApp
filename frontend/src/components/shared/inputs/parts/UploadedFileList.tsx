import { DownloadSimpleIcon, XIcon } from '@phosphor-icons/react';
import React from 'react';

import { Modal } from '@/components/shared/Modal';
import type { FileContent } from '@/api/generated/schemas';
import { cn, createModalPortal } from '@/lib/utils';

const fileKeys = new WeakMap<FileContent, number>();
let nextFileKey = 0;

function getFileKey(file: FileContent) {
  let key = fileKeys.get(file);
  if (key === undefined) {
    key = nextFileKey++;
    fileKeys.set(file, key);
  }
  return key;
}

type FileListProps<File extends FileContent> = {
  files: File[];

  onRemove?: (file: File) => void;
  disabled?: boolean;
  className?: string;
};

export function UploadedFileList<File extends FileContent>({
  files,
  onRemove,
  disabled,
  className,
}: FileListProps<File>) {
  const [fileInPreview, setFileInPreview] = React.useState<File | undefined>(undefined);

  return (
    <>
      <ul className={cn('w-full', className)} onClick={(e) => e.stopPropagation()}>
        {files.map((file) => (
          <li key={getFileKey(file)} className="transition-opacity duration-200 ease-out starting:opacity-0">
            <UploadedFileListElement
              file={file}
              setFileInPreview={setFileInPreview}
              onRemove={onRemove}
              disabled={disabled}
            />
          </li>
        ))}
      </ul>
      {createModalPortal(
        <Modal
          isOpen={fileInPreview !== undefined}
          onClose={() => setFileInPreview(undefined)}
          title={fileInPreview?.name || ''}
        >
          <div
            className={cn(
              'relative flex flex-col items-center justify-center p-4',
              fileInPreview?.content?.startsWith('data:application/pdf') ? 'h-220' : ''
            )}
          >
            <object data={fileInPreview?.content} className="flex h-full w-full items-center justify-center">
              Nie można wyświetlić podglądu pliku
            </object>
          </div>
        </Modal>
      )}
    </>
  );
}

type FileListElementProps<File extends FileContent> = {
  file: File;
  setFileInPreview: (file: File) => void;

  onRemove?: (file: File) => void;
  disabled?: boolean;
};

function UploadedFileListElement<File extends FileContent>({
  file,
  setFileInPreview,
  onRemove,
  disabled,
}: FileListElementProps<File>) {
  return (
    <div
      className={cn(
        'mx-4 my-2 flex flex-row items-center justify-between rounded-lg border border-border-muted p-2',
        disabled ? 'bg-surface-subtle' : 'bg-surface'
      )}
    >
      <button
        type="button"
        className="truncate rounded-sm text-left duration-300 ease-in-out hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
        onClick={() => setFileInPreview(file)}
      >
        {file.name}
      </button>

      <div className="mr-2 flex flex-row items-center gap-2">
        {onRemove && !disabled && (
          <button type="button" aria-label={`Usuń plik ${file.name ?? ''}`} onClick={() => onRemove(file)}>
            <XIcon className="h-8 w-8 scale-55" />
          </button>
        )}
        <a
          download={file.name}
          href={file.content}
          aria-label={`Pobierz plik ${file.name ?? ''}`}
          className="rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
        >
          <DownloadSimpleIcon className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
}
