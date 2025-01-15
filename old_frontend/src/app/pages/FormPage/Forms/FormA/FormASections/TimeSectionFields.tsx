import MonthSlider from "../../../Inputs/MonthSlider"
import { useContext, useEffect, useState } from "react"
import NumberInput from "../../../Inputs/NumberInput"
import TextArea from "../../../Inputs/TextArea"
import FormRadio from "../../../Inputs/FormRadio"
import { timeSectionFieldNames } from "./TimeSection"
import { FormContext } from "@contexts/FormContext"
import { FormAInitValues } from "FormAInitValues"
import { maxCruiseDays } from "@consts/maxCruiseDays"
import { ReadOnlyContext } from "@contexts/ReadOnlyContext"

export const AcceptablePeriodField = () => (
  <MonthSlider
    className="two-fields-beside-md"
    fieldName={timeSectionFieldNames.acceptablePeriod}
    fieldNameToAlsoSet="optimalPeriod"
    fieldLabel="Dopuszczalny okres, w którym miałby się odbywać rejs"
  />
)

export const OptimalPeriodField = () => {
  const formContext = useContext(FormContext)
  return (
    <MonthSlider
      className="two-fields-beside-md"
      fieldName={timeSectionFieldNames.optimalPeriod}
      range={formContext!.getValues(timeSectionFieldNames.acceptablePeriod)}
      fieldLabel="Optymalny okres, w którym miałby się odbywać rejs"
    />
  )
}

export const CruiseDaysField = () => (
  <NumberInput
    className="two-fields-beside-md"
    fieldName={timeSectionFieldNames.cruiseHours}
    fieldLabel="Liczba planowanych dób rejsowych"
    setterFunction={(e) => e / 24}
    onChange={(e) => e * 24}
    notZero
    maxVal={maxCruiseDays}
  />
)

export const CruiseHoursField = () => (
  <NumberInput
    className="two-fields-beside-md"
    notZero
    fieldName={timeSectionFieldNames.cruiseHours}
    fieldLabel="Liczba planowanych godzin rejsowych"
    maxVal={maxCruiseDays * 24}
  />
)

export const PeriodNotesField = () => (
  <TextArea
    className="single-field"
    fieldLabel="Uwagi dotyczące teminu"
    placeholder={"Dodaj uwagi"}
    fieldName={timeSectionFieldNames.periodNotes}
    maxLength={200}
  />
)

export const ShipUsageField = () => {
  const formContext = useContext(FormContext)
  return (
    <FormRadio
      className="two-fields-beside-md"
      isVertical={true}
      fieldLabel="Statek na potrzeby badań będzie wykorzystywany:"
      fieldName={timeSectionFieldNames.shipUsage}
      initValues={(formContext!.initValues as FormAInitValues)?.shipUsages}
    />
  )
}

export const DifferentShipUsageField = () => {
  const formContext = useContext(FormContext)
  const readOnly = useContext(ReadOnlyContext)
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    const lastFieldInShipUsageSelected =
      formContext!.initValues &&
      (formContext!.initValues as FormAInitValues)?.shipUsages?.length > 0 &&
      formContext!.getValues("shipUsage") ==
        (formContext!.initValues as FormAInitValues)?.shipUsages?.length - 1
    if (
      !disabled &&
      (formContext!.initValues as FormAInitValues)?.shipUsages &&
      !lastFieldInShipUsageSelected
    ) {
      setDisabled(true)
      if (formContext?.getValues(timeSectionFieldNames.differentUsage)) {
        formContext?.setValue(timeSectionFieldNames.differentUsage, "")
      }
      if (formContext?.formState?.errors[timeSectionFieldNames.differentUsage]) {
        formContext!.clearErrors(timeSectionFieldNames.differentUsage)
      }
    } else if (disabled && lastFieldInShipUsageSelected) {
      setDisabled(false)
    }
  }, [formContext])

  return (
    <TextArea
      className="two-fields-beside-md"
      placeholder={!disabled ? "Podaj sposób" : "Aby podać inny sposób, zaznacz „w inny sposób”"}
      fieldLabel="Inny sposób użycia"
      fieldName={timeSectionFieldNames.differentUsage}
      disabled={readOnly ?? disabled}
      required={!disabled && "Podaj sposób użycia"}
    />
  )
}
