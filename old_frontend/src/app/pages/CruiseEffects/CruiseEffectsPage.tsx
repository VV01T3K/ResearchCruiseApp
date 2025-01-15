import React, { createContext, useContext, useEffect, useState } from "react"

import { FieldTableWrapper } from "../FormPage/Wrappers/FieldTableWrapper"
import { OrdinalNumber } from "../FormPage/Inputs/TableParts"
import { CellContext } from "@contexts/CellContext"
import ReadOnlyTextInput from "../../../ToBeMoved/CommonComponents/ReadOnlyTextInput"
import Api from "@api/Api"
import Page from "../../../ToBeMoved/Pages/Page"
import PageTitle from "../../../components/Page/PageTitle"
import { CruiseEffectData, taskTypes } from "CruiseEffectData"
import LinkWithState from "@components/Navigation/LinkWithState"
import { Path } from "../../../ToBeMoved/Tools/Path"
import { ListModeContext } from "@contexts/ListModeContext"

export const CruiseEffectContext = createContext<CruiseEffectData | null>(null)
export const CruiseEffectsContext = createContext<null | CruiseEffectData[]>(null)
export const SetCruiseEffectListContext = createContext<React.Dispatch<
  React.SetStateAction<CruiseEffectData[]>
> | null>(null)

export const CruiseEffectsTools = () => {
  const cellContext = useContext(CellContext)
  const cruiseEffectsContext = useContext(CruiseEffectsContext)

  const setCruiseEffectListContext = useContext(SetCruiseEffectListContext)
  const cruiseEffect: CruiseEffectData = cruiseEffectsContext![cellContext?.rowIndex!]
  const updateCruiseEffect = (fieldKey: keyof CruiseEffectData, value: CruiseEffectData) => {
    // @ts-ignore
    cruiseEffect[fieldKey] = value
    const newCruiseEffectList = [...cruiseEffectsContext!]
    const publicationIndex = newCruiseEffectList.findIndex(
      (_cruiseEffect) => _cruiseEffect.userId === cruiseEffect.userId
    )
    newCruiseEffectList[publicationIndex] = cruiseEffect
    setCruiseEffectListContext!(newCruiseEffectList)
  }
  return { cruiseEffect, updateCruiseEffect }
}

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

const TableReadOnlyField = (props: {
  fieldLabel: string
  fieldKey: NestedKeyOf<CruiseEffectData>
}) => {
  const { cruiseEffect } = CruiseEffectsTools()

  const getValue = (key: string, obj: any): any => key.split(".").reduce((o, i) => o?.[i], obj)
  return (
    <div className={"task-field-input col-md-6"}>
      <label>{props.fieldLabel}</label>
      <ReadOnlyTextInput value={getValue(props.fieldKey, cruiseEffect) as string} />
    </div>
  )
}

export const Type = () => {
  const { cruiseEffect } = CruiseEffectsTools()
  return (
    <div className={"task-field-input"}>
      <i>{taskTypes[Number(cruiseEffect.effect.type)]}</i>
    </div>
  )
}

export const Points = () => {
  const { cruiseEffect } = CruiseEffectsTools()
  return (
    <div className={"task-field-input"}>
      <i>{cruiseEffect.points}</i>
    </div>
  )
}

export const Publication = () => (
  <div className={"w-100 d-flex flex-row flex-wrap"}>
    <TableReadOnlyField fieldLabel={"Autor:"} fieldKey={"effect.author"} />
    <TableReadOnlyField fieldLabel={"Tytuł: "} fieldKey={"effect.title"} />
  </div>
)

export const ScienceProject = () => {
  const { cruiseEffect } = CruiseEffectsTools()

  return (
    <div className={"w-100 d-flex flex-row flex-wrap"}>
      <TableReadOnlyField fieldLabel={"Roboczy tytuł projektu: "} fieldKey={"effect.title"} />
      <TableReadOnlyField fieldLabel={"Przewidywany termin złożenia:"} fieldKey={"effect.date"} />
      <div className={"task-field-input col-md-6"}>
        <label>Otrzymano finansowanie:</label>
        <ReadOnlyTextInput value={cruiseEffect.effect.financingApproved ? "tak" : "nie"} />
      </div>
    </div>
  )
}

export const ProjectRealization = () => {
  const { cruiseEffect } = CruiseEffectsTools()

  return (
    <div className={"w-100 d-flex flex-row flex-wrap"}>
      <TableReadOnlyField fieldLabel={"Tytuł: "} fieldKey={"effect.title"} />
      <TableReadOnlyField fieldLabel={"Kwota finansowania:"} fieldKey={"effect.financingAmount"} />
      <div className={"task-field-input col-md-6"}>
        <label>Ramy czasowe:</label>
        <div>
          <div>
            <label>{"Od: "}</label>
            <ReadOnlyTextInput value={cruiseEffect.effect.startDate} />
          </div>
          <div>
            <label>{"Do: "}</label>
            <ReadOnlyTextInput value={cruiseEffect.effect.endDate} />
          </div>
        </div>
      </div>
      <TableReadOnlyField
        fieldLabel={"Środki zabezpieczone na realizację rejsu:"}
        fieldKey={"effect.securedAmount"}
      />
    </div>
  )
}

export const Education = () => {
  const { cruiseEffect } = CruiseEffectsTools()
  return (
    <div className={"task-field-input"}>
      <label>Opis zajęcia dydaktycznego:</label>
      <ReadOnlyTextInput value={cruiseEffect.effect.description} />
    </div>
  )
}

export const OwnResearchTask = () => (
  <div className={"w-100 d-flex flex-row flex-wrap"}>
    <TableReadOnlyField fieldLabel={"Roboczy tytuł publikacji: "} fieldKey={"effect.title"} />
    <TableReadOnlyField fieldLabel={"Przewidywany termin składania: "} fieldKey={"effect.date"} />
    <TableReadOnlyField fieldLabel={"Magazyn: "} fieldKey={"effect.magazine"} />
    <TableReadOnlyField
      fieldLabel={"Punkty ministerialne: "}
      fieldKey={"effect.ministerialPoints"}
    />
  </div>
)

export const OtherTask = () => {
  const { cruiseEffect } = CruiseEffectsTools()
  return (
    <div className={"task-field-input"}>
      <label>Opis zadania:</label>
      <ReadOnlyTextInput value={cruiseEffect.effect.description} />
    </div>
  )
}

export const Informations = () => {
  const { cruiseEffect } = CruiseEffectsTools()
  switch (taskTypes[Number(cruiseEffect.effect.type)]) {
    case "Praca licencjacka":
      return <Publication />
    case "Praca magisterska":
      return <Publication />
    case "Praca doktorska":
      return <Publication />
    case "Przygotowanie projektu naukowego":
      return <ScienceProject />
    case "Realizacja projektu krajowego (NCN, NCBiR, itp.)":
      return <ProjectRealization />
    case "Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)":
      return <ProjectRealization />
    case "Realizacja projektu wewnętrznego UG":
      return <ProjectRealization />
    case "Realizacja innego projektu naukowego":
      return <ProjectRealization />
    case "Realizacja projektu komercyjnego":
      return <ProjectRealization />
    case "Dydaktyka":
      return <Education />
    case "Realizacja własnego zadania badawczego":
      return <OwnResearchTask />
    case "Inne zadanie":
      return <OtherTask />
  }
}

export const FormLinks = () => {
  const { cruiseEffect } = CruiseEffectsTools()
  return (
    <CruiseEffectContext.Provider value={cruiseEffect}>
      <div className={"task-field-input"}>
        <FormLink formType={"C"} />
      </div>
    </CruiseEffectContext.Provider>
  )
}

const FormLink = (props: { formType: string }) => {
  const cruiseEffectContext = useContext(CruiseEffectContext)
  const listModeContext = useContext(ListModeContext)
  return (
    <LinkWithState
      to={Path.Form}
      useWindow={listModeContext?.mode != undefined}
      state={{
        formType: props.formType,
        cruiseApplicationId: cruiseEffectContext!.cruiseApplicationId,
        cruiseApplication: cruiseEffectContext,
        readOnly: true,
      }}
      label={"Formularz " + props.formType}
    />
  )
}

const manageCruiseEffectsPageTableContent = () => [
  () => <OrdinalNumber label={"Efekt rejsu"} />,
  Type,
  Informations,
  Points,
  FormLinks,
]

const getCruiseEffect = () =>
  Api.get("/api/CruiseApplications/effectsEvaluations").then((response) => {
    return response?.data
  })

function CruiseEffectsPage() {
  const [cruiseEffectList, setCruiseEffectList] = useState<CruiseEffectData[]>([])
  const fetchData = async () => {
    return getCruiseEffect().then((response) => setCruiseEffectList(response))
  }
  useEffect(() => {
    fetchData()
  }, [])

  const mdColWidths = [5, 20, 55, 10, 10]
  const mdColTitles = ["Lp.", "Zadanie", "Szczegóły", "Punkty", "Formularz"]
  const colTitle = "Efekty rejsu"

  const emptyText = "Nie ma żadnego efektu rejsu"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    manageCruiseEffectsPageTableContent,
    null,
    emptyText,
    cruiseEffectList,
    true
  )

  return (
    <Page className={"form-page"}>
      <PageTitle title={"Efekty rejsów"} />
      <SetCruiseEffectListContext.Provider value={setCruiseEffectList}>
        <CruiseEffectsContext.Provider value={cruiseEffectList}>
          <div className="form-page-content d-flex flex-column align-items-center w-100 pt-4">
            <Render className={" w-100"} />
          </div>
        </CruiseEffectsContext.Provider>
      </SetCruiseEffectListContext.Provider>
    </Page>
  )
}

export default CruiseEffectsPage
