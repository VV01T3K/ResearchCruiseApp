import { createContext, useContext, useState } from "react"
import { CruiseStateContext } from "./CruisesPage"
import { SelectWrapper } from "../FormPage/Wrappers/ReactSelectWrapper"
import { FieldTableWrapper } from "../FormPage/Wrappers/FieldTableWrapper"
import {
  Actions,
  Cruises,
  MainCruiseManagerId,
  Number,
  StartAndEndDate,
  Status,
} from "./CruiseListFields"
import { CruisesListFilterAndSort, FilterMapper } from "./CruiseListFilterAndSort"
import { Cruise } from "Cruise"
import { CellContext } from "@contexts/CellContext"
import { SelectStringFilterOption } from "../../../ToBeMoved/Pages/CommonComponents/ListFilterMenu"
import { CruiseStatus } from "@enums/CruiseStatus"
import { selectStringFilterDefaultOption } from "@app/pages/CruiseApplicationsPage/CruiseApplicationsList/CruiseApplicationsList"

export const CruisesTools = () => {
  const cellContext = useContext(CellContext)
  const cruisesContext = useContext(CruisesContext)

  const cruise: Cruise = cruisesContext![cellContext?.rowIndex!]
  return { cruise }
}

export const CruisesContext = createContext<undefined | Cruise[]>(undefined)

const CruisesListTableContent = () => [
  Number,
  StartAndEndDate,
  Status,
  MainCruiseManagerId,
  Cruises,
  Actions,
]

export default function CruisesList() {
  const cruiseStateContext = useContext(CruiseStateContext)
  const { cruisesToDisplay, sortOptions, anyStringFilterOptions } = CruisesListFilterAndSort()

  const [statusFilter, setStatusFilter] = useState("")

  const selectStringFilterOptions: SelectStringFilterOption[] = [
    {
      label: "Status",
      selectValues: Object.values(CruiseStatus),
      setFilter: setStatusFilter,
    },
  ]

  // const _UpperMenu = UpperMenu()
  const mdColWidths = [12, 16, 16, 23, 17, 16]
  const mdColTitles = ["Numer", "Czas trwania", "Status", "Kierownik główny", "Zgłoszenia", "Akcje"]

  const _cruisesToDisplay = cruisesToDisplay.filter(
    (row) => statusFilter == "" || row.status.toString() == statusFilter
  )
  const colTitle = "Rejsy"
  const emptyText = "Brak rejsów"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    CruisesListTableContent,
    null,
    emptyText,
    _cruisesToDisplay,
    true
  )

  return (
    <div className={"table-with-filters w-100"}>
      <div className={"d-flex flex-row flex-wrap w-100"}>
        <SelectWrapper
          className="d-flex col-6 col-md-3 p-1"
          options={sortOptions}
          placeHolder={"Sortuj"}
          onChange={(selectedOption) =>
            cruiseStateContext!.setCruises((selectedOption!.value as () => Cruise[])())
          }
        />
        <FilterMapper
          filterOptions={anyStringFilterOptions}
          optionClassName="d-none d-md-flex col-12 col-md-3 p-1"
        />
        <div></div>
        <div className={"col-md-6 col-6"}>
          {selectStringFilterOptions.map((selectStringFilter, index) => (
            <SelectWrapper
              key={index}
              className={"col-md-6 col-12 me-0 ms-auto  justify d-flex p-1"}
              placeHolder={"Sortuj"}
              options={[selectStringFilterDefaultOption].concat(
                selectStringFilter.selectValues.map((selectValue) => ({
                  label: selectValue,
                  value: selectValue,
                }))
              )}
              defaultValue={selectStringFilterDefaultOption}
              onChange={(selectedOption) => selectStringFilter.setFilter(selectedOption?.value)}
            />
          ))}
        </div>
      </div>
      <CruisesContext.Provider value={_cruisesToDisplay}>
        <Render />
      </CruisesContext.Provider>
    </div>
  )
}
