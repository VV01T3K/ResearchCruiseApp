import { z } from 'zod';

export enum ResearchTaskType {
  BachelorThesis = '0',
  MasterThesis = '1',
  DoctoralThesis = '2',
  ProjectPreparation = '3',
  DomesticProject = '4',
  ForeignProject = '5',
  InternalUgProject = '6',
  OtherProject = '7',
  CommercialProject = '8',
  Didactics = '9',
  OwnResearchTask = '10',
  OtherResearchTask = '11',
}

export type ThesisResearchTaskDto = {
  type: ResearchTaskType.BachelorThesis | ResearchTaskType.MasterThesis | ResearchTaskType.DoctoralThesis;
  author: string;
  title: string;
};

export const ThesisResearchTaskDtoValidationSchema = z.object({
  type: z.enum([ResearchTaskType.BachelorThesis, ResearchTaskType.MasterThesis, ResearchTaskType.DoctoralThesis]),
  author: z.string().nonempty('Autor nie może być pusty'),
  title: z.string().nonempty('Tytuł nie może być pusty'),
});

export type ProjectPreparationResearchTaskDto = {
  type: ResearchTaskType.ProjectPreparation;
  title: string;
  date: string;
  financingApproved: 'true' | 'false';
};

export const ProjectPreparationResearchTaskDtoValidationSchema = z.object({
  type: z.enum([ResearchTaskType.ProjectPreparation]),
  title: z.string().nonempty('Tytuł nie może być pusty'),
  date: z.string().nonempty('Data nie może być pusta'),
  financingApproved: z.enum(['true', 'false'], {
    message: 'Wymagane jest wskazanie czy finansowanie zostało zatwierdzone',
  }),
});

export type ProjectResearchTaskDto = {
  type:
    | ResearchTaskType.DomesticProject
    | ResearchTaskType.ForeignProject
    | ResearchTaskType.InternalUgProject
    | ResearchTaskType.OtherProject
    | ResearchTaskType.CommercialProject;
  title: string;
  financingAmount: string;
  startDate: string;
  endDate: string;
  securedAmount: string;
};

export const ProjectResearchTaskDtoValidationSchema = z.object({
  type: z.enum([
    ResearchTaskType.DomesticProject,
    ResearchTaskType.ForeignProject,
    ResearchTaskType.InternalUgProject,
    ResearchTaskType.OtherProject,
    ResearchTaskType.CommercialProject,
  ]),
  title: z.string().nonempty('Tytuł nie może być pusty'),
  financingAmount: z.string().refine((val) => {
    const parsed = parseFloat(val);
    return !isNaN(parsed) && parsed >= 0;
  }, 'Kwota finansowania musi być poprawną kwotą większą lub równą 0.00'),
  startDate: z.string().nonempty('Data rozpoczęcia nie może być pusta'),
  endDate: z.string().nonempty('Data zakończenia nie może być pusta'),
  securedAmount: z.string().refine((val) => {
    const parsed = parseFloat(val);
    return !isNaN(parsed) && parsed >= 0;
  }, 'Kwota zabezpieczona musi być poprawną kwotą większą lub równą 0.00'),
});

export type DidacticsResearchTaskDto = {
  type: ResearchTaskType.Didactics;
  description: string;
};

export const DidacticsResearchTaskDtoValidationSchema = z.object({
  type: z.enum([ResearchTaskType.Didactics]),
  description: z.string().nonempty('Opis nie może być pusty').max(10240, 'Opis nie może być dłuższy niż 10240 znaków'),
});

export type OwnResearchTaskDto = {
  type: ResearchTaskType.OwnResearchTask;
  title: string;
  date: string;
  magazine: string;
  ministerialPoints: string;
};

export const OwnResearchTaskDtoValidationSchema = z.object({
  type: z.enum([ResearchTaskType.OwnResearchTask]),
  title: z.string().nonempty('Tytuł nie może być pusty'),
  date: z.string().nonempty('Data nie może być pusta'),
  magazine: z.string().nonempty('Czasopismo nie może być puste'),
  ministerialPoints: z.string().refine(
    (val) => {
      const parsed = parseInt(val, 10);
      return !isNaN(parsed) && parsed >= 0;
    },
    {
      message: 'Punkty ministerialne muszą być liczbą całkowitą większą lub równą 0',
    }
  ),
});

export type OtherResearchTaskDto = {
  type: ResearchTaskType.OtherResearchTask;
  description: string;
};

export const OtherResearchTaskDtoValidationSchema = z.object({
  type: z.enum([ResearchTaskType.OtherResearchTask]),
  description: z.string().nonempty('Opis nie może być pusty').max(10240, 'Opis nie może być dłuższy niż 10240 znaków'),
});

export type ResearchTaskDto =
  | ThesisResearchTaskDto
  | ProjectPreparationResearchTaskDto
  | ProjectResearchTaskDto
  | DidacticsResearchTaskDto
  | OwnResearchTaskDto
  | OtherResearchTaskDto;

export const taskTypes = [
  ResearchTaskType.BachelorThesis,
  ResearchTaskType.MasterThesis,
  ResearchTaskType.DoctoralThesis,
  ResearchTaskType.ProjectPreparation,
  ResearchTaskType.DomesticProject,
  ResearchTaskType.ForeignProject,
  ResearchTaskType.InternalUgProject,
  ResearchTaskType.OtherProject,
  ResearchTaskType.CommercialProject,
  ResearchTaskType.Didactics,
  ResearchTaskType.OwnResearchTask,
  ResearchTaskType.OtherResearchTask,
];

export const ResearchTaskDtoDraftValidationSchema = z.object({
  type: z.enum([taskTypes[0], ...taskTypes.slice(1)]),
});

export const ResearchTaskDtoValidationSchema = z.union([
  ThesisResearchTaskDtoValidationSchema,
  ProjectPreparationResearchTaskDtoValidationSchema,
  ProjectResearchTaskDtoValidationSchema,
  DidacticsResearchTaskDtoValidationSchema,
  OwnResearchTaskDtoValidationSchema,
  OtherResearchTaskDtoValidationSchema,
]);

export function getTaskName(taskType: ResearchTaskType): string {
  switch (taskType) {
    case ResearchTaskType.BachelorThesis:
      return 'Praca licencjacka';
    case ResearchTaskType.MasterThesis:
      return 'Praca magisterska';
    case ResearchTaskType.DoctoralThesis:
      return 'Praca doktorska';
    case ResearchTaskType.ProjectPreparation:
      return 'Przygotowanie projektu naukowego';
    case ResearchTaskType.DomesticProject:
      return 'Realizacja projektu krajowego (NCN, NCBiR, itp.)';
    case ResearchTaskType.ForeignProject:
      return 'Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)';
    case ResearchTaskType.InternalUgProject:
      return 'Realizacja projektu wewnętrznego UG';
    case ResearchTaskType.OtherProject:
      return 'Realizacja innego projektu naukowego';
    case ResearchTaskType.CommercialProject:
      return 'Realizacja projektu komercyjnego';
    case ResearchTaskType.Didactics:
      return 'Dydaktyka';
    case ResearchTaskType.OwnResearchTask:
      return 'Realizacja własnego zadania badawczego';
    case ResearchTaskType.OtherResearchTask:
      return 'Inne zadanie';
  }
}

export function getEmptyTask(taskType: ResearchTaskType) {
  switch (taskType) {
    case ResearchTaskType.BachelorThesis:
      return { type: ResearchTaskType.BachelorThesis, author: '', title: '' } as ThesisResearchTaskDto;
    case ResearchTaskType.MasterThesis:
      return { type: ResearchTaskType.MasterThesis, author: '', title: '' } as ThesisResearchTaskDto;
    case ResearchTaskType.DoctoralThesis:
      return { type: ResearchTaskType.DoctoralThesis, author: '', title: '' } as ThesisResearchTaskDto;
    case ResearchTaskType.ProjectPreparation:
      return {
        type: ResearchTaskType.ProjectPreparation,
        title: '',
        date: '',
        financingApproved: 'false',
      } as ProjectPreparationResearchTaskDto;
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return {
        type: taskType,
        title: '',
        financingAmount: '0.00',
        startDate: '',
        endDate: '',
        securedAmount: '0.00',
      } as ProjectResearchTaskDto;
    case ResearchTaskType.Didactics:
      return { type: ResearchTaskType.Didactics, description: '' } as DidacticsResearchTaskDto;
    case ResearchTaskType.OwnResearchTask:
      return {
        type: ResearchTaskType.OwnResearchTask,
        title: '',
        date: '',
        magazine: '',
        ministerialPoints: '0',
      } as OwnResearchTaskDto;
    case ResearchTaskType.OtherResearchTask:
      return { type: ResearchTaskType.OtherResearchTask, description: '' } as OtherResearchTaskDto;
    default:
      throw new Error(`Unknown task type: ${taskType}`);
  }
}
