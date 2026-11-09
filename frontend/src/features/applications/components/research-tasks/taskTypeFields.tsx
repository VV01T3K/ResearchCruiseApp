import type { ReactNode } from 'react';

import { formatDate } from '@/lib/dateUtils';

import type { ResearchTaskFields } from '@/api/generated/schemas';
import { ResearchTaskType } from '@/features/applications/schemas/types/ResearchTaskValues';

export type TaskField = {
  name:
    | 'author'
    | 'title'
    | 'description'
    | 'date'
    | 'magazine'
    | 'ministerialPoints'
    | 'financingApproved'
    | 'startDate'
    | 'endDate'
    | 'financingAmount'
    | 'securedAmount';
  label: string;
  kind: 'text' | 'date' | 'month' | 'points' | 'amount' | 'yesNo';
  placeholder?: string;
  wide?: boolean;
};

type TaskTypeFields = {
  fields: TaskField[];
  summary: (task: ResearchTaskFields) => ReactNode[];
};

const thesis: TaskTypeFields = {
  fields: [
    { name: 'author', label: 'Autor', kind: 'text', placeholder: 'Wprowadź autora' },
    { name: 'title', label: 'Tytuł', kind: 'text', placeholder: 'Wprowadź tytuł' },
  ],
  summary: (task) => [<>Tytuł: {task.title}</>, <>Autor: {task.author}</>],
};

const projectPreparation: TaskTypeFields = {
  fields: [
    { name: 'title', label: 'Roboczy tytuł projektu', kind: 'text', placeholder: 'Wprowadź tytuł', wide: true },
    { name: 'date', label: 'Przewidywany termin składania', kind: 'date' },
    { name: 'financingApproved', label: 'Otrzymano decyzję o finansowaniu?', kind: 'yesNo' },
  ],
  summary: (task) => [<>Tytuł: {task.title}</>, <>Data: {formatDate(task.date ?? '', 'date')}</>],
};

const project: TaskTypeFields = {
  fields: [
    { name: 'title', label: 'Tytuł', kind: 'text', placeholder: 'Wprowadź tytuł', wide: true },
    { name: 'startDate', label: 'Data rozpoczęcia', kind: 'month' },
    { name: 'endDate', label: 'Data zakończenia', kind: 'month' },
    { name: 'financingAmount', label: 'Kwota finansowania', kind: 'amount' },
    { name: 'securedAmount', label: 'Środki zabezpieczone na realizację rejsu', kind: 'amount' },
  ],
  summary: (task) => [
    <>Tytuł: {task.title}</>,
    <>
      {formatDate(task.startDate ?? '', 'monthYear')} - {formatDate(task.endDate ?? '', 'monthYear')}
    </>,
    <>Kwota: {task.financingAmount} zł</>,
  ],
};

const didactics: TaskTypeFields = {
  fields: [
    {
      name: 'description',
      label: 'Opis zajęcia dydaktycznego',
      kind: 'text',
      placeholder: 'Wprowadź opis zajęcia dydaktycznego',
    },
  ],
  summary: (task) => [<>Opis: {task.description}</>],
};

const own: TaskTypeFields = {
  fields: [
    { name: 'title', label: 'Roboczy tytuł projektu', kind: 'text', placeholder: 'Wprowadź tytuł' },
    { name: 'date', label: 'Przewidywany termin składania', kind: 'date' },
    { name: 'magazine', label: 'Czasopismo', kind: 'text', placeholder: 'Wprowadź czasopismo' },
    { name: 'ministerialPoints', label: 'Przewidywane punkty ministerialne', kind: 'points' },
  ],
  summary: (task) => [<>Tytuł: {task.title}</>, <>Data: {formatDate(task.date ?? '', 'date')}</>],
};

const other: TaskTypeFields = {
  fields: [{ name: 'description', label: 'Opis zadania', kind: 'text', placeholder: 'Wprowadź opis zadania' }],
  summary: (task) => [<>Opis: {task.description}</>],
};

export function getTaskTypeFields(type: string | undefined): TaskTypeFields {
  switch (type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return thesis;
    case ResearchTaskType.ProjectPreparation:
      return projectPreparation;
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return project;
    case ResearchTaskType.Didactics:
      return didactics;
    case ResearchTaskType.OwnResearchTask:
      return own;
    default:
      return other;
  }
}
