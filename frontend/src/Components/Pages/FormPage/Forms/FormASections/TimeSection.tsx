import MonthSlider from "../../Inputs/MonthSlider";
import NumberInput from "../../Inputs/NumberInput";
import TextArea from "../../Inputs/TextArea";
import FormRadio from "../../Inputs/FormRadio";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React, {useContext} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../Wrappers/FormASections";
import {FormContext} from "../../Wrappers/FormTemplate";
import {useFormContext} from "react-hook-form";

const AcceptablePeriodField = () => {
    return(
        <MonthSlider className="two-fields-beside-md"  // p-4 pb-0 pt-2"
                     fieldName="acceptablePeriod"
                     fieldNameToAlsoSet="optimalPeriod"
                     fieldLabel="Rok rejsu"
        />
    )
}

const OptimalPeriodField = () => {
    const formContext = useContext(FormContext)
    return(
        <MonthSlider className="two-fields-beside-md"
                     fieldName="optimalPeriod"
                     range={formContext!.getValues("acceptablePeriod")}
                     fieldLabel="Optymalny okres, w którym miałby się odbywać rejs"
        />
    )
}

const CruiseDaysField = () => (
    <NumberInput className="two-fields-beside-md"
                 fieldName="cruiseDays"
                 fieldLabel="Liczba planowanych dób rejsowych"
                 fieldNameToAlsoSet="cruiseHours"
                 notZero
                 setterFunction={(e) => 24 * e}
                 maxVal={24}/>
)

const CruiseHoursField = () => (
    <NumberInput className="two-fields-beside-md"
                 notZero
                 fieldName="cruiseHours"
                 fieldLabel="Liczba planowanych godzin rejsowych"
                 fieldNameToAlsoSet="cruiseDays"
                 setterFunction={(e) => Number((e/24).toFixed(2))}
                 maxVal={99}
    />
)

const PeriodNotesField = () => (
    <TextArea className="single-field"
              fieldLabel="Uwagi dotyczące teminu"
              fieldName="periodNotes"
              maxLength={200}
    />
)

const ShipUsageField = () => {
    const formContext = useContext(FormContext)
    return (
        <FormRadio className="two-fields-beside-md"
                   fieldLabel="Statek na potrzeby badań będzie wykorzystywany:"
                   fieldName="shipUsage"
                   // initValues={formContext!.initValues?.shipUsages}
        />
    )
}

const DifferentShipUsageField = () => {
    const formContext = useContext(FormContext)
    const lastFieldInShipUsageSelected = true
        // formContext!.initValues && formContext!.initValues?.shipUsages.length > 0 &&
        //formContext!.getValues("shipUsage") == formContext!.initValues?.shipUsages?.length - 1
    return(
        <>
            {lastFieldInShipUsageSelected &&
                <TextArea className="two-fields-beside-md"
                          fieldLabel="Inny sposób użycia"
                          fieldName="differentUsage"
                          required="Podaj sposób użycia"
                />
            }
        </>
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
    return {Content, id, shortTitle, longTitle}
}