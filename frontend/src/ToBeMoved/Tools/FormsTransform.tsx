import {FormAFields} from "FormAFields";


export const formAToSend = (formValues: FormAFields): FormAFields => {
  if (formValues.cruiseManagerId === "") {
    formValues.cruiseManagerId = undefined;
  }
  if (formValues.deputyManagerId === "") {
    formValues.deputyManagerId = undefined;
  }

  return formValues;
};