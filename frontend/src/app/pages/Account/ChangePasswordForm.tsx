import axios from "axios"
import { FieldValues, SubmitHandler } from "react-hook-form"
import useFormWrapper from "../../../ToBeMoved/CommonComponents/useFormWrapper"
import { useState } from "react"
import userDataManager from "../../../ToBeMoved/CommonComponents/UserDataManager"

import { ErrorMessageIfPresentNoContext } from "@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext"

import { ChangePasswordData } from "ChangePasswordData"

// TODO : Move to different place
export default function ChangePasswordForm() {
  const { ChangePassword } = userDataManager()
  const HandleError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status == 400) {
      setChangePasswordError("Podano błędne hasło")
    } else {
      setChangePasswordError("Nieznany błąd")
    }
    setChangePasswordSuccess(false)
  }

  const AfterSubmitSuccess = () => {
    setChangePasswordError(null)
    setChangePasswordSuccess(true)
    reset()
  }

  const onPasswordChangeSubmit = async (data: ChangePasswordData) => {
    setDisabled(true)
    try {
      await ChangePassword(data)
      AfterSubmitSuccess()
    } catch (error) {
      HandleError(error)
    }
    setDisabled(false)
  }

  const {
    PasswordTextInput,
    NewPasswordTextInput,
    ConfirmNewPasswordTextInput,
    ConfirmButton,
    setDisabled,
    handleSubmit,
    reset,
  } = useFormWrapper()

  const [changePasswordError, setChangePasswordError] = useState<null | string>(null)
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false)

  const FormFields = () => (
    <>
      <PasswordTextInput />
      <NewPasswordTextInput />
      <ConfirmNewPasswordTextInput />
      <ConfirmButton />
    </>
  )

  return (
    <>
      <form
        className="h6"
        onSubmit={handleSubmit(onPasswordChangeSubmit as SubmitHandler<FieldValues>)}
      >
        <FormFields />
        {changePasswordError && <ErrorMessageIfPresentNoContext message={changePasswordError} />}
      </form>
      {changePasswordSuccess && <div className="h6 text-center">Pomyślnie zmieniono hasło</div>}
    </>
  )
}
