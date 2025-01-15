import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Path } from "./Path"
import userBasedAccess from "../../route/UserBasedAccess"
import { FormContext } from "@contexts/FormContext"
import { CruiseApplicationContext } from "@contexts/CruiseApplicationContext"
import { CruiseApplicationStatus } from "CruiseApplicationStatus"

import { extendedUseLocation } from "@hooks/extendedUseLocation"
import cruiseApplicationFromLocation from "@hooks/cruiseApplicationFromLocation"
import { acceptApplication, editEvaluation, getCruiseApplication } from "@api/requests"

export const RefreshApplicationDetailsPage = () => {
  const location = extendedUseLocation()
  const navigate = useNavigate()

  return () =>
    getCruiseApplication(location?.state.cruiseApplication.id).then((response) =>
      navigate(Path.CruiseApplicationDetails, {
        state: {
          cruiseApplication: response?.data,
          readOnly: true,
        },
        replace: true,
      })
    )
}
const SendButton = () => {
  const formContext = useContext(FormContext)
  const cruiseApplication = cruiseApplicationFromLocation()
  const refreshApplicationDetailsPage = RefreshApplicationDetailsPage()

  const handleSubmit = () =>
    editEvaluation(cruiseApplication.id, formContext?.getValues())
      .then(refreshApplicationDetailsPage)
      .finally(() => formContext!.setReadOnly(true))
  const onClickAction = formContext!.handleSubmit(handleSubmit)

  return (
    <button onClick={onClickAction} className="form-page-option-button-default">
      {" "}
      Zapisz punkty{" "}
    </button>
  )
}

const CancelButton = () => {
  const formContext = useContext(FormContext)
  const cancel = () => {
    formContext?.reset()
    formContext!.setReadOnly(true)
  }
  return (
    <button onClick={cancel} className="form-page-option-button-default">
      {" "}
      Anuluj{" "}
    </button>
  )
}

const EditButton = () => {
  const formContext = useContext(FormContext)
  const editPoints = () => formContext!.setReadOnly(false)

  return (
    <button onClick={editPoints} className="form-page-option-button-default">
      {" "}
      Edytuj punkty{" "}
    </button>
  )
}

const AcceptApplication = (accept: string) => {
  const refreshApplicationDetailsPage = RefreshApplicationDetailsPage()
  const cruiseApplication = cruiseApplicationFromLocation()
  return () => acceptApplication(cruiseApplication.id, accept).then(refreshApplicationDetailsPage)
}

export const ConfirmApplicationButton = () => {
  const acceptApplication = AcceptApplication("true")
  return (
    <div onClick={acceptApplication} className="form-page-option-button w-100">
      {" "}
      Akceptuj zgłoszenie{" "}
    </div>
  )
}

export const MenuWarning = (props: { message: string }) => (
  <div className={"w-100 text-danger text-center mt-1"}>{props.message}</div>
)

export const MenuWithWarning = (props: { children: React.ReactNode; message: string }) => (
  <div className={"d-flex flex-column w-100"}>
    <MenuWarning message={"Po odrzuceniu wymagane będzie ponowne złożenie wniosku"} />
    <div className={"d-flex flex-row w-100"}>{props.children}</div>
  </div>
)

const ToggleButton = () => {
  const [toggle, setToggle] = useState(false)
  const DisabledRender = () => (
    <div onClick={() => setToggle(true)} className="form-page-option-button bg-danger w-100">
      Odrzuć zgłoszenie
    </div>
  )
  const EnabledRender = () => (
    <div onClick={() => setToggle(false)} className="form-page-option-button w-50">
      Anuluj
    </div>
  )
  return { toggle, DisabledRender, EnabledRender }
}

export const CancelApplicationButton = () => {
  const [errorMessage, setError] = useState<string | null>(null)
  const acceptApplication = AcceptApplication("false")
  const { toggle, DisabledRender, EnabledRender } = ToggleButton()
  const ConfirmMenu = () => (
    <MenuWithWarning message={"Po odrzuceniu wymagane będzie ponowne złożenie wniosku"}>
      <EnabledRender />
      <div
        onClick={() => acceptApplication().catch((err) => setError(err.request.response))}
        className="form-page-option-button w-50 bg-danger"
      >
        {!errorMessage && "Potwierdź odrzucenie"}
        {errorMessage}
      </div>
    </MenuWithWarning>
  )
  return {
    confirm: toggle,
    Button: DisabledRender,
    ConfirmMenu: ConfirmMenu,
  }
}

const AcceptedBySupervisorMenu = () => {
  const CancelApplication = CancelApplicationButton()
  return (
    <>
      {!CancelApplication.confirm && <ConfirmApplicationButton />}
      {!CancelApplication.confirm && <CancelApplication.Button />}
      {CancelApplication.confirm && <CancelApplication.ConfirmMenu />}
    </>
  )
}

export const BottomOptionBar = () => {
  const formContext = useContext(FormContext)
  const { UserHasShipownerAccess, UserHasAdminAccess } = userBasedAccess()
  const EditableFormButtons = () => (
    <>
      <CancelButton />
      <SendButton />
    </>
  )

  const ReadonlyFormButtons = () => {
    const CancelApplication = CancelApplicationButton()
    return (
      <>
        {!CancelApplication.confirm && <EditButton />}
        {!CancelApplication.confirm && <CancelApplication.Button />}
        {CancelApplication.confirm && <CancelApplication.ConfirmMenu />}
      </>
    )
  }

  const DefaultMenu = () => (
    <>
      {!formContext!.readOnly && <EditableFormButtons />}
      {formContext!.readOnly && <ReadonlyFormButtons />}
    </>
  )

  const applicationContext = useContext(CruiseApplicationContext)
  const WaitingForSupervisorMenu = () => {
    const CancelApplication = CancelApplicationButton()

    return (
      <>
        {!CancelApplication.confirm && <CancelApplication.Button />}
        {CancelApplication.confirm && <CancelApplication.ConfirmMenu />}
      </>
    )
  }

  const EditPointsMenu = () => (
    <>
      <DefaultMenu />
    </>
  )

  const FormBRequired = () => (
    <div className="form-page-option-element w-100">{CruiseApplicationStatus.FormBRequired}</div>
  )

  const FormBFilled = () => (
    <div className="form-page-option-element w-100">{CruiseApplicationStatus.FormBFilled}</div>
  )

  const UnderTaken = () => (
    <div className="form-page-option-element w-100">{CruiseApplicationStatus.Undertaken}</div>
  )

  const Reported = () => (
    <div className="form-page-option-element w-100">{CruiseApplicationStatus.Reported}</div>
  )

  return (
    <>
      {(UserHasShipownerAccess() || UserHasAdminAccess()) && (
        <div className="form-page-option-bar">
          {applicationContext!.status === CruiseApplicationStatus.WaitingForSupervisor && (
            <WaitingForSupervisorMenu />
          )}
          {applicationContext!.status === CruiseApplicationStatus.AcceptedBySupervisor && (
            <AcceptedBySupervisorMenu />
          )}
          {applicationContext!.status === CruiseApplicationStatus.Accepted && <EditPointsMenu />}
          {applicationContext!.status === CruiseApplicationStatus.FormBRequired && (
            <FormBRequired />
          )}
          {applicationContext!.status === CruiseApplicationStatus.FormBFilled && <FormBFilled />}
          {applicationContext!.status === CruiseApplicationStatus.Undertaken && <UnderTaken />}
          {applicationContext!.status === CruiseApplicationStatus.Reported && <Reported />}
        </div>
      )}
    </>
  )
}
