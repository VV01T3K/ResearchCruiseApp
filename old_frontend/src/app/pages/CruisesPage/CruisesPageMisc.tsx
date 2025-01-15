import { useContext, useState } from "react"
import ButtonWithState from "../../../components/Navigation/ButtonWithState"
import { CruiseStateContext } from "./CruisesPage"
import CruisesList from "./CruisesList"
import ReactSwitch from "react-switch"
import CruisesCalendar from "./CruisesCalendar"
import UserBasedAccess from "../../../route/UserBasedAccess"
import { Path } from "../../../ToBeMoved/Tools/Path"
import { fetchCruises } from "@api/requests"
import { autoAddCruises } from "@api/requests/Put"
import { deleteCruise } from "@api/requests/Delete"
import { sortCruiseListByNumber } from "@app/pages/CruisesPage/CruiseListFilterAndSort"
import { ExportCruisesForm } from "@app/pages/CruisesPage/ExportCruisesForm/ExportCruisesForm"

export const ModeSwitch = () => {
  const [listView, setListView] = useState(true)
  return {
    CalendarListSwitch: () => (
      <div className="d-flex align-items-center px-2 py-1 w-25">
        <div className="pe-2">Kalendarz</div>
        <ReactSwitch
          className={"custom-switch"}
          checked={listView}
          checkedIcon={false}
          uncheckedIcon={false}
          onChange={() => {
            setListView(!listView)
          }}
        />
        <div className="ps-2">Lista</div>
      </div>
    ),
    listView: listView,
  }
}

export const LoadCruises = () => {
  const cruiseStateContext = useContext(CruiseStateContext)
  return () =>
    fetchCruises().then((response) =>
      cruiseStateContext!.setCruises(
        response ? sortCruiseListByNumber(response?.data).reverse() : []
      )
    )
}

export const CruiseMenuButtons = () => {
  const loadCruises = LoadCruises()
  const [showExport, setShowExport] = useState(false)

  return (
    <>
      <div className="d-flex flex-row flex-wrap justify-content-end align-items-center w-75">
        <button
          className="cruises-button"
          onClick={() => autoAddCruises().then(() => loadCruises())}
        >
          Dodaj rejsy automatycznie
        </button>
        <ButtonWithState className="cruises-button" to={Path.CruiseForm} label="Nowy rejs" />
        <button
          className="cruises-button"
          style={{ fontSize: "inherit" }}
          onClick={() => setShowExport(!showExport)}
        >
          Eksport {showExport ? " ▲" : " ▼"}
        </button>
      </div>
      {showExport && <ExportCruisesForm />}
    </>
  )
}

export const CruisePageContent = () => {
  const { CalendarListSwitch, listView } = ModeSwitch()
  const { UserHasShipownerAccess, UserHasAdminAccess } = UserBasedAccess()
  const OptionBar = () => (
    <div className={"d-none d-md-flex flex-wrap flex-row w-100"}>
      <CalendarListSwitch />
      {(UserHasAdminAccess() || UserHasShipownerAccess()) && <CruiseMenuButtons />}
    </div>
  )

  return (
    <>
      <OptionBar />
      {!listView && <CruisesCalendar />}
      {listView && <CruisesList />}
    </>
  )
}

export const HandleDeleteCruises = () => {
  const cruiseStateContext = useContext(CruiseStateContext)
  return (id: string) =>
    deleteCruise(id).then((_) => {
      const newCruises = cruiseStateContext!.cruises.filter((cruise) => cruise.id !== id)
      cruiseStateContext!.setCruises!(newCruises)
    })
}
