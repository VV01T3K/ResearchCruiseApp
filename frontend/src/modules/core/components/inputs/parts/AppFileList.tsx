import DownloadIcon from 'bootstrap-icons/icons/download.svg?react';
import XIcon from 'bootstrap-icons/icons/x.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppModal } from '@/core/components/AppModal';
import { FileDto } from '@/core/lib/types';
import { cn, createModalPortal } from '@/core/lib/utils';

type FileListProps = {
  files: FileDto[];

  onRemove?: (file: FileDto) => void;
  disabled?: boolean;
  className?: string;
};

export function AppFileList({ files, onRemove, disabled, className }: FileListProps) {
  const [fileInPreview, setFileInPreview] = React.useState<FileDto | undefined>(undefined);

  return (
    <>
      <ul className={cn('w-full', className)} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence>
          {files.map((file, i) => (
            <motion.li
              // eslint-disable-next-line @eslint-react/no-array-index-key
              key={file.name + i}
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
              fileInPreview?.content.startsWith('data:application/pdf') ? 'h-220' : ''
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

type FileListElementProps = {
  file: FileDto;
  setFileInPreview: (file: FileDto) => void;

  onRemove?: (file: FileDto) => void;
  disabled?: boolean;
};

function AppFileListElement({ file, setFileInPreview, onRemove, disabled }: FileListElementProps) {
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  return (
    <div
      className={cn(
        'mx-4 my-2 flex flex-row items-center justify-between rounded-lg border border-gray-200 p-2',
        disabled ? 'bg-gray-100' : 'bg-white'
      )}
    >
      <div className="hover:text-primary truncate duration-300 ease-in-out" onClick={() => setFileInPreview(file)}>
        {file.name}
      </div>

      <div className="mr-2 flex flex-row items-center gap-2">
        {onRemove && !disabled && <XIcon className="h-8 w-8" onClick={() => onRemove!(file)} />}
        <DownloadIcon className="h-6 w-6" onClick={() => linkRef.current?.click()} />
      </div>

      <a ref={linkRef} download={file.name} href={file.content} className="hidden" />
    </div>
  );
}
