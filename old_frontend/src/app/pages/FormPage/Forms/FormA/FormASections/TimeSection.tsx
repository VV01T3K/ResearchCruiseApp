import {
  AcceptablePeriodField,
  CruiseDaysField,
  CruiseHoursField,
  DifferentShipUsageField,
  OptimalPeriodField,
  PeriodNotesField,
  ShipUsageField,
} from "./TimeSectionFields"
import { SectionWrapper } from "@components/Form/Section/SectionWrapper"

export const timeSectionFieldNames = {
  acceptablePeriod: "acceptablePeriod",
  optimalPeriod: "optimalPeriod",
  cruiseHours: "cruiseHours",
  periodNotes: "periodNotes",
  shipUsage: "shipUsage",
  differentUsage: "differentUsage",
}

const TimeSectionFields = () => (
  <>
    <AcceptablePeriodField />
    <OptimalPeriodField />
    <CruiseDaysField />
    <CruiseHoursField />
    <PeriodNotesField />
    <ShipUsageField />
    <DifferentShipUsageField />
  </>
)

export const TimeSection = () =>
  SectionWrapper({
    shortTitle: "Czas",
    longTitle: "Czas trwania zgłaszanego rejsu",
    sectionFieldNames: timeSectionFieldNames,
    children: <TimeSectionFields />,
  })
