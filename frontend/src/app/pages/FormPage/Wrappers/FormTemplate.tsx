import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
    FormType, FormTypeKeys,
    FormTypeValues,
} from '../../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';
import Api from '@api/Api';
import { useOnBlurForm } from '@hooks/useOnBlurForm';
import { FormTemplateProps } from 'Form/FormTemplateProps';
import Page from '../../../../ToBeMoved/Pages/Page';
import FormTitleWithNavigation from '../../../../components/Form/FormTitleWithNavigation';

import { FormContent } from '@components/Form/FormContent';
import { BottomOptionBar } from '../../../../ToBeMoved/Tools/FormBottomOptionBar';
import { FormContext } from '@contexts/FormContext';
import { ReadOnlyContext } from '@contexts/ReadOnlyContext';
import { getFormA, getFormForSupervisor } from '@api/requests';
import { FormAInitValues } from 'FormAInitValues';

import { extendedUseLocation } from '@hooks/extendedUseLocation';
import { Guid } from 'Guid';
import { CruiseApplication } from 'CruiseApplication';
import {
    Control, DefaultValues,
    FormState,
    UseFormClearErrors,
    UseFormGetValues,
    UseFormHandleSubmit, UseFormReset,
    UseFormResetField, UseFormSetError, UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form';
import { FormSectionType } from 'Form/Section/FormSectionType';
import { FormInitValues } from 'FormInitValues';

export type FormContextFields = {
    resetField: UseFormResetField<any>,
    clearErrors: UseFormClearErrors<any>,
    trigger: UseFormTrigger<any>,
    formState: FormState<any>,
    handleSubmit: UseFormHandleSubmit<any>,
    getValues: UseFormGetValues<any>,
    reset: UseFormReset<any>,
    control: Control,
    setValue: UseFormSetValue<any>,
    setError: UseFormSetError<any>,
    defaultValues: DefaultValues<any>,
    setReadOnly: Dispatch<SetStateAction<boolean>>,
    type: FormTypeKeys,
    readOnly: boolean,
    sections: FormSectionType[],
    initValues: FormInitValues | undefined,
};
const locationToDataMapper = () => {
    const location = extendedUseLocation();
    return {
        supervisorCode: location?.state.supervisorCode as Guid,
        cruiseApplicationId: location?.state.cruiseApplicationId as Guid,
        cruiseApplication: location?.state.cruiseApplication as CruiseApplication,
        typeOfForm: location?.state.formType as FormTypeValues,
        readOnly: location?.state.readOnly as boolean,
    };
};

function FormTemplate(props: FormTemplateProps) {
    const {
        supervisorCode,
        cruiseApplicationId,
        typeOfForm,
        readOnly: _readOnly,
        cruiseApplication,
    } = locationToDataMapper();

    const _getFormA = () => getFormA(cruiseApplication?.id ?? cruiseApplicationId);

    const _getFormForSupervisor = () =>
        getFormForSupervisor(cruiseApplicationId, supervisorCode);

    const getForm = supervisorCode ? _getFormForSupervisor : _getFormA;

    const [defaultValues, setDefaultValues] = useState(
        props.defaultValues ?? undefined,
    );

    useEffect(() => {
        if ((cruiseApplication?.id || cruiseApplicationId) && typeOfForm && !defaultValues) {
            getForm().then((response) => {
                setDefaultValues(response?.data);
                form.reset(response?.data);
            });
        }
    }, []);

    const initEndpoint = (_formType: FormTypeValues) => {
        switch (_formType) {
            case FormType.A:
            case FormType.B:
                return '/Forms/InitValues/A';
            case FormType.ApplicationDetails:
                return `/api/CruiseApplications/${cruiseApplication.id}/evaluation`;
            case FormType.AForSupervisor:
                return `/Forms/InitValuesForSupervisor/A?cruiseApplicationId=${cruiseApplicationId}&supervisorCode=${supervisorCode}`
        }
    };

    const [formInitValues, setFormInitValues] = useState<
        FormAInitValues | undefined
    >(undefined);
    useEffect(() => {
        const _formType = supervisorCode ? FormType.AForSupervisor : props.type;
        const initValuesPath = initEndpoint(_formType);

        if (!initValuesPath) {
            return;
        }

        Api
            .get(initValuesPath)
            .then((response) => {
                setFormInitValues(response?.data);
                form.reset();
            });
    }, []);

    const form = useOnBlurForm(defaultValues);

    const [readOnly, setReadOnly] = useState(_readOnly);
    console.log(form.getValues());
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
    };

    return (
        <Page className="form-page">
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
