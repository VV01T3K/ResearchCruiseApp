import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    FormType,
    FormTypeKeys,
    FormTypeValues,
} from '../../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';
import {useOnBlurForm} from '@hooks/useOnBlurForm';
import {FormTemplateProps} from 'Form/FormTemplateProps';
import Page from '../../../../ToBeMoved/Pages/Page';
import FormTitleWithNavigation from '../../../../components/Form/FormTitleWithNavigation';

import {FormContent} from '@components/Form/FormContent';
import {BottomOptionBar} from '../../../../ToBeMoved/Tools/FormBottomOptionBar';
import {FormContext} from '@contexts/FormContext';
import {ReadOnlyContext} from '@contexts/ReadOnlyContext';
import {
    getApplicationDetails,
    getFormA,
    getFormAInitValues,
    getFormAInitValuesForSupervisor,
    getFormB,
    getFormBInitValues,
    getFormC,
    getFormCInitValues,
    getFormForSupervisor,
} from '@api/requests';
import {FormAInitValues} from 'FormAInitValues';

import {extendedUseLocation} from '@hooks/extendedUseLocation';
import {Guid} from 'Guid';
import {CruiseApplication} from 'CruiseApplication';
import {
    Control,
    DefaultValues,
    FormState,
    UseFormClearErrors,
    UseFormGetValues,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
    UseFormResetField,
    UseFormSetError,
    UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form';
import {FormSectionType} from 'Form/Section/FormSectionType';
import {FormInitValues} from 'FormInitValues';

export type FormContextFields = {
  resetField: UseFormResetField<any>;
  clearErrors: UseFormClearErrors<any>;
  trigger: UseFormTrigger<any>;
  formState: FormState<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  getValues: UseFormGetValues<any>;
  reset: UseFormReset<any>;
  control: Control;
  setValue: UseFormSetValue<any>;
  setError: UseFormSetError<any>;
  defaultValues: DefaultValues<any>;
  setReadOnly: Dispatch<SetStateAction<boolean>>;
  type: FormTypeKeys;
  readOnly: boolean;
  sections: FormSectionType[];
  initValues: FormInitValues | undefined;
  register: UseFormRegister<any>;
  isCopied: boolean;
};
const locationToDataMapper = () => {
  const location = extendedUseLocation();
  return {
    supervisorCode: location?.state.supervisorCode as Guid,
    cruiseApplicationId: location?.state.cruiseApplicationId as Guid,
    cruiseApplication: location?.state.cruiseApplication as CruiseApplication,
    typeOfForm: location?.state.formType as FormTypeValues,
    readOnly: location?.state.readOnly as boolean,
    newOnCopy: location?.state.newOnCopy as boolean,
  };
};

function FormTemplate(props: FormTemplateProps) {
  const {
    supervisorCode,
    cruiseApplicationId,
    typeOfForm,
    readOnly: _readOnly,
    cruiseApplication,
    newOnCopy,
  } = locationToDataMapper();

  const _getFormA = () =>
    getFormA(cruiseApplication?.id ?? cruiseApplicationId).then(
      (response) => response?.data
    );
  const _getFormB = () =>
    getFormB(cruiseApplication?.id ?? cruiseApplicationId).then(
      (response) => response?.data
    );
  const _getFormC = () =>
    getFormC(cruiseApplication?.id ?? cruiseApplicationId).then(
      (response) => response?.data
    );

  const _getFormForSupervisor = () =>
    getFormForSupervisor(cruiseApplicationId, supervisorCode).then(
      (response) => response?.data
    );

  const _getFormAInitValues = () =>
    getFormAInitValues().then((response) => response?.data);

  const _getFormBInitValues = () =>
    getFormBInitValues().then((response) => response?.data);

  const _getFormCInitValues = () =>
    getFormCInitValues().then((response) => response?.data);

  const _getApplicationDetailsInitValues = () =>
    getApplicationDetails(cruiseApplication.id).then(
      (response) => response?.data
    );

  const _getFormAInitValuesForSupervisor = () =>
    getFormAInitValuesForSupervisor(cruiseApplicationId, supervisorCode).then(
      (response) => response?.data
    );

  const GetFormData = async (formType: FormTypeValues) => {
    switch (formType) {
      case 'A':
        return await _getFormA();
      case 'AForSupervisor':
        return await _getFormForSupervisor();
      case 'ApplicationDetails':
        return null;
      case 'B':
        const formB = await _getFormB();
        const formA = await _getFormA();
        return { ...formA, ...formB };
      case 'C':
        const formC = await _getFormC();
        return { ...formC };
      case 'CruiseDetails':
        return null;
      default:
        return null;
    }
  };

  const [defaultValues, setDefaultValues] = useState(
    props.defaultValues ?? undefined
  );

  const SetFormDefaultValues = async () => {
    const formData = await GetFormData(typeOfForm);
    if (formData) {
      setDefaultValues(formData);
      form.reset(formData);
    }
  };

  useEffect(() => {
    if (
      (cruiseApplication?.id || cruiseApplicationId) &&
      typeOfForm &&
      !defaultValues
    ) {
      SetFormDefaultValues();
    }
  }, []);

  const GetFormInitValues = async (formType: FormTypeValues) => {
    switch (formType) {
      case FormType.A:
        return await _getFormAInitValues();
      case FormType.B:
        const formAInitValues = await _getFormAInitValues();
        const formBInitValues = await _getFormBInitValues();
        return { ...formAInitValues, ...formBInitValues };
      case FormType.C:
        const formCInitValues = await _getFormCInitValues();
        return { ...formCInitValues };
      case FormType.ApplicationDetails:
        return await _getApplicationDetailsInitValues();
      case FormType.AForSupervisor:
        return await _getFormAInitValuesForSupervisor();
      default:
        return null;
    }
  };

  const [formInitValues, setFormInitValues] = useState<
    FormAInitValues | undefined
  >(undefined);

  const LoadInitValues = async () => {
    const initValues = await GetFormInitValues(typeOfForm ?? props.type);
    if (initValues) {
      setFormInitValues(initValues);
      form.reset();
    }
  };
  useEffect(() => {
    LoadInitValues();
  }, []);

  const form = useOnBlurForm(defaultValues);

  const [readOnly, setReadOnly] = useState(_readOnly);
  const formContext: FormContextFields = {
    resetField: form.resetField,
    clearErrors: form.clearErrors,
    trigger: form.trigger,
    formState: form.formState,
    handleSubmit: form.handleSubmit,
    getValues: form.getValues,
    reset: form.reset,
    control: form.control,
    setValue: form.setValue,
    setError: form.setError,
    defaultValues: defaultValues,
    setReadOnly: setReadOnly,
    type: props.type,
    readOnly: readOnly,
    sections: props.sections,
    initValues: formInitValues,
    register: form.register,
    isCopied: newOnCopy,
  };

  return (
    <Page className='form-page'>
      <FormContext.Provider value={formContext as FormContextFields}>
        <ReadOnlyContext.Provider value={formContext.readOnly}>
          <FormTitleWithNavigation />
          <FormContent sections={props.sections} />
          {props.BottomOptionBar ? (
            <props.BottomOptionBar />
          ) : (
            <BottomOptionBar />
          )}
        </ReadOnlyContext.Provider>
      </FormContext.Provider>
    </Page>
  );
}

export default FormTemplate;
