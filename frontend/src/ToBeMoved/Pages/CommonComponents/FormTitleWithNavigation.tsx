export const formType = {
  A: 'A',
  B: 'B',
  C: 'C',
  ApplicationDetails: '0',
  CruiseDetails: '1',
};

export type FormTypeKeys = keyof typeof formType;
export type FormTypeValues = (typeof formType)[FormTypeKeys];
