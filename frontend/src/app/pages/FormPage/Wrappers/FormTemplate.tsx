import { useEffect, useState } from 'react';
import {
    formType,
    FormTypeValues,
} from '../../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';
import Api from '@api/Api';
import { useOnBlurForm } from '@hooks/useOnBlurForm';
import { FormTemplateProps } from '@types/Form/FormTemplateProps';
import Page from '../../../../ToBeMoved/Pages/Page';
import FormTitleWithNavigation from '../../../../components/Form/FormTitleWithNavigation';

import { FormContent } from '@components/Form/FormContent';
import { BottomOptionBar } from '../../../../ToBeMoved/Tools/FormBottomOptionBar';
import { FormContext } from '@contexts/FormContext';
import { ReadOnlyContext } from '@contexts/ReadOnlyContext';
import { getFormA, getFormForSupervisor } from '@api/requests';
import { FormAInitValues } from '@types/FormAInitValues';

import { extendedUseLocation } from '@hooks/extendedUseLocation';
import { Guid } from '@types/Guid';
import { CruiseApplication } from '@types/CruiseApplication';

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

    console.log(cruiseApplication);
    const _getFormA = () => getFormA(cruiseApplication.id);

    const _getFormForSupervisor = () =>
        getFormForSupervisor(cruiseApplicationId, supervisorCode);

    const getForm = supervisorCode ? _getFormForSupervisor : _getFormA;

    const [defaultValues, setDefaultValues] = useState(
        props.defaultValues ?? undefined,
    );

    useEffect(() => {
        if (cruiseApplication.id && typeOfForm && !defaultValues) {
            getForm().then((response) => {
                setDefaultValues(response?.data);
                form.reset(response?.data);
            });
        }
    }, []);

    const initEndpoint = (_formType: FormTypeValues) => {
        switch (_formType) {
            case formType.A:
            case formType.B:
                return '/Forms/InitValues/A';
            case formType.ApplicationDetails:
                return `/api/CruiseApplications/${cruiseApplication.id}/evaluation`;
        }
    };

    const [formInitValues, setFormInitValues] = useState<
        FormAInitValues | undefined
    >(undefined);
    useEffect(() => {
        const initValuesPath = initEndpoint(props.type);
        if (!initValuesPath) {
            return;
        }

        Api.get(initValuesPath).then((response) => {
            setFormInitValues(response?.data);
            form.reset();
        });
    }, []);

    const form = useOnBlurForm(defaultValues);

    const [readOnly, setReadOnly] = useState(_readOnly);

    const formContext = {
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
            <FormContext.Provider value={formContext}>
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
