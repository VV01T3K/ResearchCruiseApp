import { fileName, handleDownload, handlePrint, handleSave } from "./FormButtonsHandlers"
import { useContext, useEffect, useState } from "react"
import CancelIcon from "bootstrap-icons/icons/x-lg.svg?react"
import { FormContext } from "@contexts/FormContext"
import { FormContextFields } from "@app/pages/FormPage/Wrappers/FormTemplate"
import { refillFormB, refillFormC } from "@api/requests/Put"
import { useNavigate } from "react-router-dom"
import { extendedUseLocation } from "@hooks/extendedUseLocation"
import { CruiseApplicationStatus } from "CruiseApplicationStatus"
import { Path } from "./Path"
import { FormType } from "../Pages/CommonComponents/FormTitleWithNavigation"
import { cruiseManagerNorDeputyIsCurrentUserErrName } from "@app/pages/FormPage/Forms/FormA/FormASections/CruiseManagerSectionFields"

const formDownloadProps = (formContext: FormContextFields) => {
  return {
    download: fileName(formContext?.type!),
    href: handleDownload(formContext?.getValues()!),
  }
}

export const DownloadButtonDefault = () => {
  const formContext = useContext(FormContext)
  return (
    <a {...formDownloadProps(formContext!)} className="form-page-option-button-default">
      {" "}
      Pobierz{" "}
    </a>
  )
}

export const ResendButton = () => {
  const formContext = useContext(FormContext)
  return (
    <div
      onClick={() => formContext!.setReadOnly(false)}
      className="form-page-option-button-default"
    >
      {" "}
      Kopiuj
    </div>
  )
}

export const RefillBButton = () => {
  const location = extendedUseLocation()
  const navigate = useNavigate()
  return (
    <div
      onClick={() =>
        refillFormB(location?.state.cruiseApplication?.id).then((_) => {
          location!.state.cruiseApplication.status = CruiseApplicationStatus.FormBRequired
          navigate(Path.Form, {
            state: location!.state,
            replace: true,
          })
        })
      }
      className="form-page-option-button-default"
    >
      Cofnij do edycji
    </div>
  )
}

export const RefillCButton = () => {
  const location = extendedUseLocation()
  const navigate = useNavigate()
  return (
    <div
      onClick={() =>
        refillFormC(location?.state.cruiseApplication?.id).then((_) => {
          location!.state.cruiseApplication.status = CruiseApplicationStatus.Undertaken
          navigate(Path.Form, {
            state: location!.state,
            replace: true,
          })
        })
      }
      className="form-page-option-button-default"
    >
      Cofnij do edycji
    </div>
  )
}

const ConfirmSaveButton = () => {
  const formContext = useContext(FormContext)
  const _handleSave = handleSave()
  const cruiseManagerNorDeputyIsCurrentUserErr =
    formContext?.formState.errors[cruiseManagerNorDeputyIsCurrentUserErrName]
  const disabled =
    cruiseManagerNorDeputyIsCurrentUserErr != undefined ||
    (formContext?.type == FormType.B && !formContext.formState.isValid)
  useEffect(() => {}, [formContext])
  return (
    <button
      disabled={disabled}
      onClick={_handleSave}
      className={
        formContext?.type == FormType.A
          ? "form-page-option-button w-100"
          : "form-page-option-button w-100"
      }
    >
      Potwierdź
    </button>
  )
}

const PrintButton = () => (
  <button onClick={handlePrint} className="form-page-option-note-button-large d-none d-md-flex">
    Drukuj
  </button>
)

export function SaveMenu() {
  const [savingStated, setSavingStarted] = useState(false)
  const formContext = useContext(FormContext)
  const cruiseManagerNorDeputyIsCurrentUserErr =
    formContext?.formState.errors[cruiseManagerNorDeputyIsCurrentUserErrName]
  const [errorText, setErrorText] = useState("")

  useEffect(() => {
    if (!cruiseManagerNorDeputyIsCurrentUserErr && errorText != "") setErrorText("")
    else if (cruiseManagerNorDeputyIsCurrentUserErr && errorText == "")
      setErrorText("Aby zapisać zgłoszenie musisz być jego kierownikiem lub zastępcą")
  }, [formContext])

  const CancelButton = () => (
    <div className={"form-page-option-note-button-small"} onClick={() => setSavingStarted(false)}>
      <CancelIcon />
    </div>
  )

  const SaveButton = () => {
    const formContext = useContext(FormContext)
    const onClickAction = () => {
      if (formContext?.type == FormType.B) formContext?.trigger().then(() => setSavingStarted(true))
      else setSavingStarted(true)
    }
    return (
      <button onClick={onClickAction} className="form-page-option-button-default">
        Zapisz
      </button>
    )
  }

  const NoteInput = () => {
    const formContext = useContext(FormContext)
    return (
      <input
        maxLength={100}
        {...formContext!.register("note")}
        placeholder={"Notatka"}
        className={"form-page-option-note-input d-none d-md-flex"}
        type={"text"}
      />
    )
  }

  return {
    menu: () => (
      <div className={"d-flex flex-column w-100"}>
        {errorText && <div className={"w-100 text-danger text-center p-2"}>{errorText}</div>}
        <div className={"w-100 d-flex flex-row"}>
          {formContext!.type === FormType.A && <NoteInput />}
          <ConfirmSaveButton />
          <PrintButton />
          <CancelButton />
        </div>
      </div>
    ),
    saveButton: SaveButton,
    enabled: savingStated,
  }
}
