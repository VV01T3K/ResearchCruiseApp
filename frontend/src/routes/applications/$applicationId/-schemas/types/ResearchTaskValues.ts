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

export const ThesisResearchTaskInputSchema = z.object({
  type: z.enum([ResearchTaskType.BachelorThesis, ResearchTaskType.MasterThesis, ResearchTaskType.DoctoralThesis]),
  author: z.string(),
  title: z.string(),
});
export const ThesisResearchTaskValuesSchema = ThesisResearchTaskInputSchema.extend({
  author: z.string().nonempty('Autor nie może być pusty'),
  title: z.string().nonempty('Tytuł nie może być pusty'),
});
export type ThesisResearchTaskValues = z.input<typeof ThesisResearchTaskInputSchema>;

export const ProjectPreparationResearchTaskInputSchema = z.object({
  type: z.enum([ResearchTaskType.ProjectPreparation]),
  title: z.string(),
  date: z.string(),
  financingApproved: z.boolean(),
});
export const ProjectPreparationResearchTaskValuesSchema = ProjectPreparationResearchTaskInputSchema.extend({
  title: z.string().nonempty('Tytuł nie może być pusty'),
  date: z.string().nonempty('Data nie może być pusta'),
  financingApproved: z.boolean(),
});
export type ProjectPreparationResearchTaskValues = z.input<typeof ProjectPreparationResearchTaskInputSchema>;

export const ProjectResearchTaskInputSchema = z.object({
  type: z.enum([
    ResearchTaskType.DomesticProject,
    ResearchTaskType.ForeignProject,
    ResearchTaskType.InternalUgProject,
    ResearchTaskType.OtherProject,
    ResearchTaskType.CommercialProject,
  ]),
  title: z.string(),
  financingAmount: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  securedAmount: z.number(),
});
export const ProjectResearchTaskValuesSchema = ProjectResearchTaskInputSchema.extend({
  title: z.string().nonempty('Tytuł nie może być pusty'),
  financingAmount: z.number().nonnegative('Kwota finansowania musi być poprawną kwotą większą lub równą 0.00'),
  startDate: z.string().nonempty('Data rozpoczęcia nie może być pusta'),
  endDate: z.string().nonempty('Data zakończenia nie może być pusta'),
  securedAmount: z.number().nonnegative('Kwota zabezpieczona musi być poprawną kwotą większą lub równą 0.00'),
});
export type ProjectResearchTaskValues = z.input<typeof ProjectResearchTaskInputSchema>;

export const DidacticsResearchTaskInputSchema = z.object({
  type: z.enum([ResearchTaskType.Didactics]),
  description: z.string(),
});
export const DidacticsResearchTaskValuesSchema = DidacticsResearchTaskInputSchema.extend({
  description: z.string().nonempty('Opis nie może być pusty').max(10240, 'Opis nie może być dłuższy niż 10240 znaków'),
});
export type DidacticsResearchTaskValues = z.input<typeof DidacticsResearchTaskInputSchema>;

export const OwnResearchTaskInputSchema = z.object({
  type: z.enum([ResearchTaskType.OwnResearchTask]),
  title: z.string(),
  date: z.string(),
  magazine: z.string(),
  ministerialPoints: z.number(),
});
export const OwnResearchTaskValuesSchema = OwnResearchTaskInputSchema.extend({
  title: z.string().nonempty('Tytuł nie może być pusty'),
  date: z.string().nonempty('Data nie może być pusta'),
  magazine: z.string().nonempty('Czasopismo nie może być puste'),
  ministerialPoints: z
    .number()
    .int('Punkty ministerialne muszą być liczbą całkowitą większą lub równą 0')
    .nonnegative('Punkty ministerialne muszą być liczbą całkowitą większą lub równą 0'),
});
export type OwnResearchTaskValues = z.input<typeof OwnResearchTaskInputSchema>;

export const OtherResearchTaskInputSchema = z.object({
  type: z.enum([ResearchTaskType.OtherResearchTask]),
  description: z.string(),
});
export const OtherResearchTaskValuesSchema = OtherResearchTaskInputSchema.extend({
  description: z.string().nonempty('Opis nie może być pusty').max(10240, 'Opis nie może być dłuższy niż 10240 znaków'),
});
export type OtherResearchTaskValues = z.input<typeof OtherResearchTaskInputSchema>;

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

export const ResearchTaskValuesDraftValidationSchema = z.object({
  type: z.enum([taskTypes[0], ...taskTypes.slice(1)]),
});

export const ResearchTaskValuesSchema = z.union([
  ThesisResearchTaskValuesSchema,
  ProjectPreparationResearchTaskValuesSchema,
  ProjectResearchTaskValuesSchema,
  DidacticsResearchTaskValuesSchema,
  OwnResearchTaskValuesSchema,
  OtherResearchTaskValuesSchema,
]);
export const ResearchTaskValuesInputSchema = z.union([
  ThesisResearchTaskInputSchema,
  ProjectPreparationResearchTaskInputSchema,
  ProjectResearchTaskInputSchema,
  DidacticsResearchTaskInputSchema,
  OwnResearchTaskInputSchema,
  OtherResearchTaskInputSchema,
]);
export type ResearchTaskValues = z.input<typeof ResearchTaskValuesInputSchema>;

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

export function getEmptyTask(taskType: ResearchTaskType): ResearchTaskValues {
  switch (taskType) {
    case ResearchTaskType.BachelorThesis:
      return {
        type: ResearchTaskType.BachelorThesis,
        author: '',
        title: '',
      };
    case ResearchTaskType.MasterThesis:
      return {
        type: ResearchTaskType.MasterThesis,
        author: '',
        title: '',
      };
    case ResearchTaskType.DoctoralThesis:
      return {
        type: ResearchTaskType.DoctoralThesis,
        author: '',
        title: '',
      };
    case ResearchTaskType.ProjectPreparation:
      return {
        type: ResearchTaskType.ProjectPreparation,
        title: '',
        date: '',
        financingApproved: false,
      };
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return {
        type: taskType,
        title: '',
        financingAmount: 0,
        startDate: '',
        endDate: '',
        securedAmount: 0,
      };
    case ResearchTaskType.Didactics:
      return { type: ResearchTaskType.Didactics, description: '' };
    case ResearchTaskType.OwnResearchTask:
      return {
        type: ResearchTaskType.OwnResearchTask,
        title: '',
        date: '',
        magazine: '',
        ministerialPoints: 0,
      };
    case ResearchTaskType.OtherResearchTask:
      return { type: ResearchTaskType.OtherResearchTask, description: '' };
    default:
      throw new Error(`Unknown task type: ${taskType}`);
  }
}
