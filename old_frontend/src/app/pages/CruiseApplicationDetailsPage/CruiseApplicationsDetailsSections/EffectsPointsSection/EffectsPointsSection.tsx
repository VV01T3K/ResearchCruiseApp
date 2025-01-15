import { SectionWrapper } from "@components/Form/Section/SectionWrapper"
import { EffectsPointsField } from "@app/pages/CruiseApplicationDetailsPage/CruiseApplicationsDetailsSections/EffectsPointsSection/EffectsPointsField"

export const EffectsPointsSection = () =>
  SectionWrapper({
    shortTitle: "Efekty",
    longTitle: "Efekty osiągnięte po poprzednich rejsach",
    children: <EffectsPointsField />,
  })
