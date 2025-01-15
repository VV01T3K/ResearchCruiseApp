import { KeyContext } from "@contexts/KeyContext"
import { FBoolField } from "@app/pages/FormPage/Inputs/CellFormFields"

const TechnicalElementsWrapper = (props: { keySelector: string; label: string }) => {
  return (
    <KeyContext.Provider value={props.keySelector}>
      <div className={"w-50 p-2"}>
        <label>{props.label}</label>
        <FBoolField />
      </div>
    </KeyContext.Provider>
  )
}

export const BowStarboardField = () => (
  <TechnicalElementsWrapper label={"Żurawik dziobowy prawa burta"} keySelector={"bowStarboard"} />
)

export const AftStarboardField = () => (
  <TechnicalElementsWrapper label={"Żurawik rufowy prawa burta"} keySelector={"aftStarboard"} />
)

export const AftPortSideField = () => (
  <TechnicalElementsWrapper label={"Żurawik rufowy lewa burta"} keySelector={"aftPortSide"} />
)

export const MainCraneField = () => (
  <TechnicalElementsWrapper label={"Dźwig główny"} keySelector={"mainCrane"} />
)

export const BomSTBSField = () => (
  <TechnicalElementsWrapper label={"Bom STBS (prawa burta)"} keySelector={"bomSTBS"} />
)

export const BomPSField = () => (
  <TechnicalElementsWrapper label={"Bom PS (lewa burta)"} keySelector={"bomPS"} />
)

export const CableRope35kNField = () => (
  <TechnicalElementsWrapper label={"Kablolina 35 kN"} keySelector={"cableRope35kN"} />
)

export const CableRope5kNField = () => (
  <TechnicalElementsWrapper label={"Kablolina 5 kN"} keySelector={"cableRope5kN"} />
)

export const MainGantryField = () => (
  <TechnicalElementsWrapper label={"Bramownica główna (rufowa)"} keySelector={"mainGantry"} />
)

export const STBSAuxiliaryGateField = () => (
  <TechnicalElementsWrapper
    label={"Bramownica pomocnicza STBS (prawa burta)"}
    keySelector={"STBSAuxiliaryGate"}
  />
)

export const STBSTrawlElevatorField = () => (
  <TechnicalElementsWrapper
    label={"Winda trałowa STBS (prawa burta)"}
    keySelector={"STBSTrawlElevator"}
  />
)

export const PSTrawlElevatorField = () => (
  <TechnicalElementsWrapper
    label={"Winda trałowa PS (lewa burta)"}
    keySelector={"PSTrawlElevator"}
  />
)

export const WorkboatField = () => (
  <TechnicalElementsWrapper label={"Łódź robocza"} keySelector={"workboat"} />
)

export const ObservatoryField = () => (
  <TechnicalElementsWrapper
    label={"Obserwatorium (bocianie gniazdo)"}
    keySelector={"observatory"}
  />
)

export const ElementsColumn = () => (
  <div className={"w-100 d-flex flex-row flex-wrap"}>
    <BowStarboardField />
    <AftStarboardField />
    <AftPortSideField />
    <MainCraneField />
    <BomSTBSField />
    <BomPSField />
    <CableRope35kNField />
    <CableRope5kNField />
    <MainGantryField />
    <STBSAuxiliaryGateField />
    <STBSTrawlElevatorField />
    <PSTrawlElevatorField />
    <WorkboatField />
    <ObservatoryField />
  </div>
)
