import DownloadIcon from 'bootstrap-icons/icons/download.svg?react';
import XIcon from 'bootstrap-icons/icons/x.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppModal } from '@/components/shared/AppModal';
import type { FileContent } from '@/api/generated/schemas';
import { cn, createModalPortal } from '@/lib/utils';

type FileListProps<File extends FileContent> = {
  files: File[];

  onRemove?: (file: File) => void;
  disabled?: boolean;
  className?: string;
};

export function AppFileList<File extends FileContent>({ files, onRemove, disabled, className }: FileListProps<File>) {
  const [fileInPreview, setFileInPreview] = React.useState<File | undefined>(undefined);

  return (
    <>
      <ul className={cn('w-full', className)} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence>
          {files.map((file, i) => (
            <motion.li
              // oxlint-disable-next-line @eslint-react/no-array-index-key
              key={(file.name ?? '') + i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AppFileListElement
                file={file}
                setFileInPreview={setFileInPreview}
                onRemove={onRemove}
                disabled={disabled}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {createModalPortal(
        <AppModal
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
        </AppModal>
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

function AppFileListElement<File extends FileContent>({
  file,
  setFileInPreview,
  onRemove,
  disabled,
}: FileListElementProps<File>) {
  return (
    <div
      className={cn(
        'mx-4 my-2 flex flex-row items-center justify-between rounded-lg border border-gray-200 p-2',
        disabled ? 'bg-gray-100' : 'bg-white'
      )}
    >
      <button
        type="button"
        className="truncate text-left duration-300 ease-in-out hover:text-primary"
        onClick={() => setFileInPreview(file)}
      >
        {file.name}
      </button>

      <div className="mr-2 flex flex-row items-center gap-2">
        {onRemove && !disabled && (
          <button type="button" aria-label={`Usuń plik ${file.name ?? ''}`} onClick={() => onRemove(file)}>
            <XIcon className="h-8 w-8" />
          </button>
        )}
        <a download={file.name} href={file.content} aria-label={`Pobierz plik ${file.name ?? ''}`}>
          <DownloadIcon className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
}
