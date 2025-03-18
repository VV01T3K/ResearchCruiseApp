import CloudUploadIcon from 'bootstrap-icons/icons/cloud-upload.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppFileList } from '@/core/components/inputs/parts/AppFileList';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { FileDto } from '@/core/lib/types';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;

  onBlur?: () => void;
  errors?: string[];
  label?: React.ReactNode;
  required?: boolean;
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
      value: FileDto[];

      onChange?: (value: FileDto[]) => void;
    }
  | {
      allowMultiple?: false;
      value?: FileDto;
      onChange?: (value: FileDto) => void;
    }
);

export function AppFileInput({
  name,
  value,
  onBlur,
  onChange,
  errors,
  label,
  required,
  allowMultiple,
  className,
  disabled,
  helper,
  uploadMessage = 'Kliknij lub przeciągnij plik',
  emptyMessage = 'Brak plików',
  maxSizeInMb = 2,
  acceptedMimeTypes,
}: Props) {
  const [files, setFiles] = React.useState<FileDto[]>(allowMultiple ? value : value ? [value] : []);
  const [notifications, setNotifications] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (allowMultiple) {
      onChange?.(files);
    } else {
      onChange?.(files[0]);
    }
    onBlur?.();
  }, [allowMultiple, files, onBlur, onChange]);

  async function handleDrop(evt: React.DragEvent<HTMLDivElement>) {
    evt.preventDefault();
    evt.stopPropagation();

    const filesList = evt.dataTransfer.files;
    if (!disabled && filesList) {
      setFiles(await loadFileList(filesList));
    }
  }

  async function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const filesList = evt.target.files;
    if (filesList) {
      setFiles(await loadFileList(filesList));
    }
  }

  async function loadFileList(files: FileList): Promise<FileDto[]> {
    const newNotifications: string[] = [];
    const promises = Array.from(files)
      .filter((file) => {
        if (maxSizeInMb && file.size > maxSizeInMb * 1024 * 1024) {
          newNotifications.push(`Plik ${file.name} jest zbyt duży (max. ${maxSizeInMb} MB)`);
          return false;
        }

        if (acceptedMimeTypes && !acceptedMimeTypes.includes(file.type)) {
          newNotifications.push(
            `Plik ${file.name} ma nieprawidłowy format. Dozwolone są pliki typu: ${acceptedMimeTypes.join(', ')}`
          );
          return false;
        }

        return true;
      })
      .map((file) => loadFile(file));

    setNotifications(newNotifications);
    return await Promise.all(promises);
  }

  function removeFile(file: FileDto) {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  }

  return (
    <div>
      <AppInputLabel name={name} label={label} />

      <div
        className="flex items-center justify-center w-full"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <label
          className={cn(
            'flex flex-col items-center justify-center w-full border-2 border-gray-300 text-gray-500',
            'border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-x-auto',
            'duration-200 ease-in-out transition-all min-h-10',
            disabled ? 'bg-gray-200 hover:bg-gray-200 cursor-pointer' : '',
            errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : '',
            className
          )}
        >
          <AnimatePresence>
            {!disabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-4 text-sm">
                  <CloudUploadIcon className="w-8 h-8 mb-4" />
                  {uploadMessage}
                  {notifications && notifications.length > 0 && (
                    <div className="bg-danger-100 text-danger-900 rounded mx-2 p-1 mt-1">
                      <ul className="list-disc list-inside">
                        {notifications.map((notification) => (
                          <li key={notification}>{notification}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {<AppFileList files={files} onRemove={removeFile} disabled={disabled} className="my-1" />}
          {files.length === 0 && disabled && <div>{emptyMessage}</div>}
        </label>
      </div>

      <input
        type="file"
        name={name}
        ref={inputRef}
        multiple={allowMultiple}
        required={required}
        disabled={disabled}
        className="hidden"
        onChange={handleChange}
        accept={acceptedMimeTypes?.join(',')}
      />
      <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2' : '')}>
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
  );
}

async function loadFile(file: File): Promise<FileDto> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result?.toString();
      if (!content) {
        throw new Error(`Failed to read the ${file.name} file content`);
      }
      resolve({ name: file.name, content });
    };
    reader.readAsDataURL(file);
  });
}
