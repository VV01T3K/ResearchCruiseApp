import MonthSlider from '../../../Inputs/MonthSlider';
import React, { useContext, useEffect, useState } from 'react';
import NumberInput from '../../../Inputs/NumberInput';
import TextArea from '../../../Inputs/TextArea';
import FormRadio from '../../../Inputs/FormRadio';
import { timeSectionFieldNames } from './TimeSection';
import { FormContext } from '@contexts/FormContext';
import { FormAInitValues } from 'FormAInitValues';

export const AcceptablePeriodField = () => (
    <MonthSlider className="two-fields-beside-md"
                 fieldName={timeSectionFieldNames.acceptablePeriod}
                 fieldNameToAlsoSet="optimalPeriod"
                 fieldLabel="Rok rejsu"
    />
);

export const OptimalPeriodField = () => {
    const formContext = useContext(FormContext);
    return (
        <MonthSlider className="two-fields-beside-md"
                     fieldName={timeSectionFieldNames.optimalPeriod}
                     range={formContext!.getValues(timeSectionFieldNames.acceptablePeriod)}
                     fieldLabel="Optymalny okres, w którym miałby się odbywać rejs"
        />
    );
};

export const CruiseDaysField = () => (
    <NumberInput className="two-fields-beside-md"
                 fieldName={timeSectionFieldNames.cruiseHours}
                 fieldLabel="Liczba planowanych dób rejsowych"
                 setterFunction={(e) => e / 24}
                 onChange={(e) => e * 24}
                 notZero
                 maxVal={24} />
);

export const CruiseHoursField = () => (
    <NumberInput className="two-fields-beside-md"
                 notZero
                 fieldName={timeSectionFieldNames.cruiseHours}
                 fieldLabel="Liczba planowanych godzin rejsowych"
                 maxVal={99}
    />
);

export const PeriodNotesField = () => (
    <TextArea className="single-field"
              fieldLabel="Uwagi dotyczące teminu"
              placeholder={'Dodaj uwagi'}
              fieldName={timeSectionFieldNames.periodNotes}
              maxLength={200}
    />
);

export const ShipUsageField = () => {
    const formContext = useContext(FormContext);
    return (
        <FormRadio className="two-fields-beside-md"
                   isVertical={true}
                   fieldLabel="Statek na potrzeby badań będzie wykorzystywany:"
                   fieldName={timeSectionFieldNames.shipUsage}
                   initValues={(formContext!.initValues as FormAInitValues)?.shipUsages}
        />
    );
};

export const DifferentShipUsageField = () => {
    const formContext = useContext(FormContext);

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const lastFieldInShipUsageSelected = formContext!.initValues && (formContext!.initValues as FormAInitValues)?.shipUsages.length > 0 &&
            formContext!.getValues('shipUsage') === (formContext!.initValues as FormAInitValues)?.shipUsages?.length - 1;
        if (!disabled && (formContext!.initValues as FormAInitValues)?.shipUsages && !lastFieldInShipUsageSelected) {
            setDisabled(true);
            if (formContext?.getValues(timeSectionFieldNames.differentUsage)) {
                formContext?.resetField(timeSectionFieldNames.differentUsage);
            }
            if (formContext?.formState?.errors[timeSectionFieldNames.differentUsage]) {
                formContext!.clearErrors(timeSectionFieldNames.differentUsage);
            }
        } else if (disabled && lastFieldInShipUsageSelected) {
            setDisabled(false);
        }
    }, []);

    return (
        <TextArea className="two-fields-beside-md"
                  placeholder={'Podaj sposób'}
                  fieldLabel="Inny sposób użycia"
                  fieldName={timeSectionFieldNames.differentUsage}
                  disabled={disabled}
                  required={!disabled && 'Podaj sposób użycia'}
        />
    );
};
