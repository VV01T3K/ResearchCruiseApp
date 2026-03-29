import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { useStore } from '@tanstack/react-form';
import ExclamationTriangleIcon from 'bootstrap-icons/icons/exclamation-triangle.svg?react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { motion } from 'motion/react';
import React from 'react';

import { cn } from '@/lib/utils';

import { useFieldContext } from '../context';

dayjs.extend(utc);

export type NormalizedError = {
  message: string;
};

export function normalizeErrors(errors: unknown[]): NormalizedError[] {
  return errors
    .map((error) => {
      if (typeof error === 'string') {
        return { message: error };
      }

      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        return { message: (error as { message: string }).message };
      }

      return { message: String(error) };
    })
    .filter((error) => error.message.length > 0);
}

export function useNormalizedFieldErrors<TValue>() {
  const field = useFieldContext<TValue>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const hasError = field.state.meta.isTouched && errors.length > 0;

  return {
    field,
    hasError,
    normalizedErrors: hasError ? normalizeErrors(errors) : undefined,
  };
}

export function FieldLabel({
  htmlFor,
  label,
  className,
}: {
  htmlFor?: string;
  label?: React.ReactNode;
  className?: string;
}) {
  if (!label) {
    return null;
  }

  return (
    <label htmlFor={htmlFor} className={cn('mb-2 block text-sm font-medium text-gray-900', className)}>
      {label}
    </label>
  );
}

export function FieldErrorTriangle({
  hasError,
  mode = 'inline',
}: {
  hasError: boolean;
  mode?: 'absolute' | 'inline';
}) {
  if (!hasError) {
    return null;
  }

  return (
    <ExclamationTriangleIcon
      className={cn('text-danger h-5 w-5', mode === 'absolute' ? 'absolute top-2.5 right-5' : '')}
    />
  );
}

export function FieldError({ errors }: { errors?: NormalizedError[] }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  if (errors.length === 1) {
    return (
      <p className="text-danger" data-error="true">
        {errors[0]?.message}
      </p>
    );
  }

  return (
    <ul className="list-disc ps-4 text-danger">
      {errors.map((error) => (
        <li key={error.message} data-error="true">
          {error.message}
        </li>
      ))}
    </ul>
  );
}

export function FieldErrorsBlock({ errors }: { errors?: NormalizedError[] }) {
  return (
    <div className={cn('flex flex-col justify-between text-sm', errors ? 'mt-2' : '')}>
      <FieldError errors={errors} />
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <ButtonPrimitive
      {...props}
      className={cn(
        'rounded-lg bg-primary px-5 py-2.5 text-md text-white outline-none hover:cursor-pointer hover:bg-primary-900 active:bg-primary disabled:cursor-default disabled:bg-primary-500',
        'flex items-center justify-around',
        className
      )}
    >
      {children}
    </ButtonPrimitive>
  );
}

export function PlainButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <ButtonPrimitive
      {...props}
      className={cn('text-default outline-none hover:cursor-pointer disabled:cursor-default', className)}
    >
      {children}
    </ButtonPrimitive>
  );
}

export function getDateFromValue(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.endsWith('Z') ? value : `${value}Z`;
  return dayjs.utc(normalized).toDate();
}

export function getValueFromDate(date: Date | undefined): string | undefined {
  return date ? date.toISOString() : undefined;
}

export function getLooseDateFromValue(value: string | undefined): Date | undefined {
  return value ? new globalThis.Date(value) : undefined;
}

export function getLooseValueFromDate(date: Date | undefined): string | undefined {
  return date ? date.toISOString() : undefined;
}

export function DropdownModal({
  dropdownRef,
  inputRef,
  children,
  top,
  left,
  direction,
}: {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  top: number;
  left: number;
  direction: 'up' | 'down';
}) {
  void inputRef;

  return (
    <motion.div
      style={{ top, left }}
      className="fixed z-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden"
      initial={{ opacity: 0, translateY: '-10%' }}
      animate={{ opacity: 1, translateY: '0' }}
      exit={{ opacity: 0, translateY: direction === 'up' ? '10%' : '-10%' }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      ref={dropdownRef}
    >
      {children}
    </motion.div>
  );
}
