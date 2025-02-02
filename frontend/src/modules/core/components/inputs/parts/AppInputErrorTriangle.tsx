import ExclamationTraingleIcon from 'bootstrap-icons/icons/exclamation-triangle.svg?react';

type Props = {
  errors: string[] | undefined;
};
export function AppInputErrorTriangle({ errors }: Props) {
  if (!errors) {
    return null;
  }

  return <ExclamationTraingleIcon className="w-5 h-5 text-danger absolute right-5 top-2.5" />;
}
