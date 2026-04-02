import CloudUploadIcon from 'bootstrap-icons/icons/cloud-upload.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppFileList } from '@/components/shared/inputs/parts/AppFileList';
import type { FileDto } from '@/lib/types';
import { cn } from '@/lib/utils';

import { FieldErrorsBlock, FieldLabel, useNormalizedFieldErrors } from './shared';

type FileFieldProps =
  | {
      label?: React.ReactNode;
      allowMultiple: true;
      uploadMessage?: string;
      emptyMessage?: string;
      maxSizeInMb?: number;
      acceptedMimeTypes?: string[];
    }
  | {
      label?: React.ReactNode;
      allowMultiple?: false;
      uploadMessage?: string;
      emptyMessage?: string;
      maxSizeInMb?: number;
      acceptedMimeTypes?: string[];
    };

export function FileField({
  label,
  allowMultiple,
  uploadMessage = 'Kliknij lub przeciągnij plik',
  emptyMessage = 'Brak plików',
  maxSizeInMb = 2,
  acceptedMimeTypes,
}: FileFieldProps) {
  const { field, hasError, normalizedErrors } = useNormalizedFieldErrors<FileDto[] | FileDto | null | undefined>();
  const initialFiles = React.useMemo(
    () =>
      allowMultiple
        ? Array.isArray(field.state.value)
          ? field.state.value
          : []
        : field.state.value
          ? [field.state.value as FileDto]
          : [],
    [allowMultiple, field.state.value]
  );
  const [files, setFiles] = React.useState<FileDto[]>(initialFiles);
  const [notifications, setNotifications] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  function updateFiles(nextFiles: FileDto[]) {
    setFiles(nextFiles);
    if (allowMultiple) field.handleChange(nextFiles as never);
    else field.handleChange((nextFiles[0] ?? null) as never);
    field.handleBlur();
  }

  async function loadFile(file: globalThis.File): Promise<FileDto> {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ name: file.name, content: reader.result?.toString() ?? '' });
      };
      reader.readAsDataURL(file);
    });
  }

  async function loadFileList(fileList: FileList): Promise<FileDto[]> {
    const nextNotifications: string[] = [];
    const loadedFiles = await Promise.all(
      Array.from(fileList)
        .filter((file) => {
          if (maxSizeInMb && file.size > maxSizeInMb * 1024 * 1024) {
            nextNotifications.push(`Plik ${file.name} jest zbyt duży (max. ${maxSizeInMb} MB)`);
            return false;
          }
          if (acceptedMimeTypes && !acceptedMimeTypes.includes(file.type)) {
            nextNotifications.push(
              `Plik ${file.name} ma nieprawidłowy format. Dozwolone są pliki typu: ${acceptedMimeTypes.join(', ')}`
            );
            return false;
          }
          return true;
        })
        .map((file) => loadFile(file))
    );
    setNotifications(nextNotifications);
    return loadedFiles;
  }

  return (
    <div data-invalid={hasError || undefined}>
      <FieldLabel htmlFor={field.name} label={label} />
      <div
        className="flex w-full items-center justify-center"
        onClick={() => inputRef.current?.click()}
        onDrop={async (event) => {
          event.preventDefault();
          event.stopPropagation();
          const droppedFiles = event.dataTransfer.files;
          if (!droppedFiles) return;
          const nextFiles = await loadFileList(droppedFiles);
          updateFiles(allowMultiple ? [...files, ...nextFiles] : nextFiles);
        }}
        onDragOver={(event) => event.preventDefault()}
      >
        <label
          className={cn(
            'flex w-full flex-col items-center justify-center border-2 border-gray-300 text-gray-500',
            'cursor-pointer overflow-x-auto rounded-lg border-dashed bg-gray-50 hover:bg-gray-100',
            'min-h-10 transition-all duration-200 ease-in-out',
            hasError ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
          )}
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-4 text-sm">
                <CloudUploadIcon className="mb-4 h-8 w-8" />
                {uploadMessage}
                {notifications.length > 0 && (
                  <div className="mx-2 mt-1 rounded bg-danger-100 p-1 text-danger-900">
                    <ul className="list-inside list-disc">
                      {notifications.map((notification) => (
                        <li key={notification}>{notification}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          <AppFileList
            files={files}
            onRemove={(file) => updateFiles(files.filter((currentFile) => currentFile !== file))}
            className="my-1"
          />
          {files.length === 0 && <div>{emptyMessage}</div>}
        </label>
      </div>
      <input
        ref={inputRef}
        type="file"
        name={field.name}
        multiple={allowMultiple}
        className="hidden"
        accept={acceptedMimeTypes?.join(',')}
        onChange={async (event) => {
          const selectedFiles = event.target.files;
          if (!selectedFiles) return;
          const nextFiles = await loadFileList(selectedFiles);
          updateFiles(allowMultiple ? [...files, ...nextFiles] : nextFiles);
          event.target.value = '';
        }}
      />
      <FieldErrorsBlock errors={normalizedErrors} />
    </div>
  );
}
