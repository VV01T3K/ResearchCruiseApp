import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { CloudArrowUpIcon } from '@phosphor-icons/react';
import React from 'react';

import { UploadedFileList } from '@/components/shared/inputs/parts/UploadedFileList';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';
import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';
import { cn } from '@/lib/utils';

export type FileValue = {
  name: string;
  content: string;
};

type Props = {
  name: string;

  onBlur?: () => void;
  errors?: string[];
  label?: React.ReactNode;
  showRequiredAsterisk?: boolean;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
  uploadMessage?: string;
  emptyMessage?: string;
  maxSizeInMb?: number;
  acceptedMimeTypes?: string[];
  allowMultiple?: boolean;
} & (
  | {
      allowMultiple: true;
      value: FileValue[];

      onChange?: (value: FileValue[]) => void;
    }
  | {
      allowMultiple?: false;
      value?: FileValue;
      onChange?: (value: FileValue | undefined) => void;
    }
);

export function FileInput({
  name,
  value,
  onBlur,
  onChange,
  errors,
  label,
  showRequiredAsterisk,
  allowMultiple,
  className,
  disabled,
  helper,
  uploadMessage = 'Kliknij lub przeciągnij plik',
  emptyMessage = 'Brak plików',
  maxSizeInMb = 2,
  acceptedMimeTypes,
}: Props) {
  const aria = useInputAria(errors, helper);
  const files = allowMultiple ? value : value ? [value] : [];
  const [notifications, setNotifications] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function updateFiles(newFiles: FileValue[]) {
    if (allowMultiple) {
      onChange?.(newFiles);
    } else {
      onChange?.(newFiles[0]);
    }
    // Drops and removals can change the files without the upload control losing focus.
    onBlur?.();
  }

  async function handleDrop(evt: React.DragEvent<HTMLDivElement>) {
    evt.preventDefault();
    evt.stopPropagation();

    const filesList = evt.dataTransfer.files;
    if (!disabled && filesList) {
      if (allowMultiple) {
        const newFiles = await loadFileList(filesList);
        updateFiles([...files, ...newFiles]);
      } else {
        updateFiles(await loadFileList(filesList));
      }
    }
  }

  async function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const filesList = evt.target.files;
    if (filesList) {
      if (allowMultiple) {
        const newFiles = await loadFileList(filesList);
        updateFiles([...files, ...newFiles]);
      } else {
        updateFiles(await loadFileList(filesList));
      }
      evt.target.value = '';
    }
  }

  async function loadFileList(files: FileList): Promise<FileValue[]> {
    const newNotifications: string[] = [];
    const promises = Array.from(files)
      .filter((file) => {
        if (maxSizeInMb && file.size > maxSizeInMb * 1024 * 1024) {
          newNotifications.push(`Plik ${file.name} jest zbyt duży (max. ${maxSizeInMb} MB)`);
          return false;
        }

        if (acceptedMimeTypes && !acceptedMimeTypes.includes(file.type)) {
          newNotifications.push(
            `Plik ${file.name} ma nieprawidłowy format. Dozwolone są pliki typu: ${acceptedMimeTypes.map((type) => type.split('/')[1].toUpperCase()).join(', ')}`
          );
          return false;
        }

        return true;
      })
      .map((file) => loadFile(file));

    setNotifications(newNotifications);
    return await Promise.all(promises);
  }

  function removeFile(file: FileValue) {
    updateFiles(files.filter((f) => f !== file));
  }

  return (
    <div>
      <InputLabel name={aria.id} value={label} showRequiredAsterisk={showRequiredAsterisk} />
      <div
        className="flex w-full items-center justify-center"
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onDrop={(evt) => void handleDrop(evt)}
        onDragOver={(e) => e.preventDefault()}
      >
        <div
          className={cn(
            'relative flex w-full flex-col items-center justify-center border-2 border-border text-muted-foreground',
            'cursor-pointer overflow-x-auto rounded-lg border-dashed bg-surface-muted hover:bg-surface-subtle',
            'min-h-10 transition-colors duration-150 ease-out',
            disabled
              ? 'cursor-pointer bg-neutral-200 hover:bg-neutral-200'
              : 'hover:border-neutral-400 active:bg-neutral-200',
            hasErrors(errors) && 'border-danger text-danger',
            className
          )}
        >
          {/* The file list has its own buttons, so it stays outside this button. */}
          <div
            {...aria.inputProps}
            role="button"
            aria-label={typeof label === 'string' ? label : uploadMessage}
            aria-disabled={disabled}
            onBlur={onBlur}
            onKeyDown={(event) => {
              if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              'w-full rounded-lg',
              hasErrors(errors)
                ? 'focus:ring-danger focus:ring-2 focus:outline-hidden focus:ring-inset'
                : 'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-hidden focus-visible:ring-inset'
            )}
          >
            {!disabled && (
              <div className="transition-opacity duration-200 ease-out starting:opacity-0">
                <div className="flex flex-col items-center justify-center pt-5 pb-4 text-sm">
                  <CloudArrowUpIcon className="mb-4 h-8 w-8" />
                  {uploadMessage}
                  {notifications && notifications.length > 0 && (
                    <div className="mx-2 mt-1 rounded-sm bg-danger-100 p-1 text-danger-900">
                      <ul className="list-inside list-disc">
                        {notifications.map((notification) => (
                          <li key={notification}>{notification}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            {files.length === 0 && disabled && <div className="text-center">{emptyMessage}</div>}
          </div>
          <UploadedFileList files={files} onRemove={removeFile} disabled={disabled} className="my-1" />
          <InputErrorTriangle errors={errors} mode="absolute" />
        </div>
      </div>

      <input
        type="file"
        name={name}
        ref={inputRef}
        multiple={allowMultiple}
        disabled={disabled}
        className="hidden"
        onChange={(evt) => void handleChange(evt)}
        accept={acceptedMimeTypes?.join(',')}
      />
      <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
        <InputHelper id={aria.helperId} helper={helper} />
        <InputErrorsList id={aria.errorId} errors={errors} />
      </div>
    </div>
  );
}

async function loadFile(file: File): Promise<FileValue> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : undefined;
      if (!content) {
        throw new Error(`Failed to read the ${file.name} file content`);
      }
      resolve({ name: file.name, content });
    };
    reader.readAsDataURL(file);
  });
}
