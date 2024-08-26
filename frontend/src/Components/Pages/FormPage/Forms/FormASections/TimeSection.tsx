import MonthSlider from "../../Inputs/MonthSlider";
import NumberInput from "../../Inputs/NumberInput";
import TextArea from "../../Inputs/TextArea";
import FormRadio from "../../Inputs/FormRadio";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React, {useContext, useEffect, useState} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../Wrappers/FormASections";
import {FormContext} from "../../Wrappers/FormTemplate";

const timeSectionFieldNames = {
    acceptablePeriod:"acceptablePeriod",
    optimalPeriod:"optimalPeriod",
    cruiseHours:"cruiseHours",
    periodNotes:"periodNotes",
    shipUsage:"shipUsage",
    differentUsage:"differentUsage"

}

const AcceptablePeriodField = () => {
    return(
        <MonthSlider className="two-fields-beside-md"  // p-4 pb-0 pt-2"
                     fieldName={timeSectionFieldNames.acceptablePeriod}
                     fieldNameToAlsoSet="optimalPeriod"
                     fieldLabel="Rok rejsu"
        />
    )
}

const OptimalPeriodField = () => {
    const formContext = useContext(FormContext)
    return(
        <MonthSlider className="two-fields-beside-md"
                     fieldName={timeSectionFieldNames.optimalPeriod}
                     range={formContext!.getValues(timeSectionFieldNames.acceptablePeriod)}
                     fieldLabel="Optymalny okres, w którym miałby się odbywać rejs"
        />
    )
}

const CruiseDaysField = () => {
    return (<NumberInput className="two-fields-beside-md"
                 fieldName={timeSectionFieldNames.cruiseHours}
                 fieldLabel="Liczba planowanych dób rejsowych"
                 notZero
                 maxVal={24}/>)
}

const CruiseHoursField = () => {
    return(<NumberInput className="two-fields-beside-md"
                 notZero
                 fieldName={timeSectionFieldNames.cruiseHours}
                 fieldLabel="Liczba planowanych godzin rejsowych"
                 setterFunction={(e) => e*24}
                 onChange={(e)=>e/24}
                 maxVal={99}
    />
)
}

const PeriodNotesField = () => (
    <TextArea className="single-field"
              fieldLabel="Uwagi dotyczące teminu"
              fieldName={timeSectionFieldNames.periodNotes}
              maxLength={200}
    />
)

const ShipUsageField = () => {
    const formContext = useContext(FormContext)
    return (
        <FormRadio className="two-fields-beside-md"
                   fieldLabel="Statek na potrzeby badań będzie wykorzystywany:"
                   fieldName={timeSectionFieldNames.shipUsage}
                   initValues={formContext!.initValues?.shipUsages}
        />
    )
}

const DifferentShipUsageField = () => {
    const formContext = useContext(FormContext)

    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        const lastFieldInShipUsageSelected = formContext!.initValues && formContext!.initValues?.shipUsages.length > 0 &&
            formContext!.getValues("shipUsage") == formContext!.initValues?.shipUsages?.length - 1
        if(!disabled && !lastFieldInShipUsageSelected) {
            setDisabled(true)
            if(formContext?.getValues(timeSectionFieldNames.differentUsage))formContext?.resetField(timeSectionFieldNames.differentUsage)
            if(formContext?.formState?.errors[timeSectionFieldNames.differentUsage])formContext!.clearErrors(timeSectionFieldNames.differentUsage)
        }
        else if(disabled && lastFieldInShipUsageSelected)
            setDisabled(false)
    }, []);

    return(
            <TextArea className="two-fields-beside-md"
                      fieldLabel="Inny sposób użycia"
                      fieldName={timeSectionFieldNames.differentUsage}
                      disabled = {disabled}
                      required={!disabled && "Podaj sposób użycia"}
            />
    )
}


export const TimeSection = ():FormSectionType => {
    const shortTitle = "Czas"
    const longTitle = "Czas trwania zgłaszanego rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <AcceptablePeriodField/>
            <OptimalPeriodField/>
            <CruiseDaysField/>
            <CruiseHoursField/>
            <PeriodNotesField/>
            <ShipUsageField/>
            <DifferentShipUsageField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:timeSectionFieldNames}
}