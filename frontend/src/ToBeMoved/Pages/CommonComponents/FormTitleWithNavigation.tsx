export const FormType = {
  A: "A",
  AForSupervisor: "AForSupervisor",
  B: "B",
  C: "C",
  ApplicationDetails: "0",
  CruiseDetails: "1",
}

export type FormTypeKeys = keyof typeof FormType
export type FormTypeValues = (typeof FormType)[FormTypeKeys]
