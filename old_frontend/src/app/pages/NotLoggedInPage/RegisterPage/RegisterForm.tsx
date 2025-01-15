import { useState } from "react"
import { FieldValues } from "react-hook-form"

import { ErrorMessageIfPresentNoContext } from "@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext"
import userDataManager from "../../../../ToBeMoved/CommonComponents/UserDataManager"
import useFormWrapper from "../../../../ToBeMoved/CommonComponents/useFormWrapper"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { Path } from "../../../../ToBeMoved/Tools/Path"

// TODO: [Not important] Switch to useContext(FormContext)
function RegisterForm() {
  const { Register } = userDataManager()
  const {
    reset,
    handleSubmit,
    EmailTextInput,
    LastNameTextInput,
    FirstNameTextInput,
    ConfirmPasswordTextInput,
    PasswordTextInput,
    ConfirmButton,
    setDisabled,
    ReturnToLoginLink,
  } = useFormWrapper()
  const [registerError, setRegisterError] = useState<null | string>(null)
  const [registerSuccessful, setRegisterSuccessful] = useState(false)

  const BeforeSubmit = () => {
    setDisabled(true)
    setRegisterError(null)
  }

  const AfterError = () => {
    setDisabled(false)
  }

  const AfterRegisterSuccess = () => {
    setRegisterError(null)
    setRegisterSuccessful(true)
    reset()
  }

  const HandleRegisterError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        setRegisterError("Dane są niepoprawne lub użytkownik istnieje")
      } else {
        setRegisterError("Wystąpił problem z rejestracją spróbuj ponownie później")
      }
    }
    AfterError()
  }
  const onSubmit = async (data: FieldValues) => {
    BeforeSubmit()
    try {
      await Register(data)
      AfterRegisterSuccess()
    } catch (error) {
      HandleRegisterError(error)
    }
  }

  const LoginLink = () => {
    return (
      <div className="signup-link">
        Posiadasz konto? <Link to="/">Logowanie</Link>
      </div>
    )
  }

  const navigate = useNavigate()

  const onSubmitWhenSuccess = () => {
    navigate(Path.Default)
  }

  const RegisterSuccessful = () => {
    return (
      <form onSubmit={handleSubmit(onSubmitWhenSuccess)}>
        <div className="signup-link">
          Rejestracja przebiegła pomyślnie, potwierdź rejestrację poprzez link wysłany na adres
          e-mail i oczekuj zatwierdzenia konta przez Biuro Armatora
        </div>
        <ReturnToLoginLink />
      </form>
    )
  }

  const DefaultForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {!registerSuccessful && (
          <>
            <EmailTextInput />
            <FirstNameTextInput />
            <LastNameTextInput />
            <PasswordTextInput />
            <ConfirmPasswordTextInput />
            <ConfirmButton />
            {registerError && <ErrorMessageIfPresentNoContext message={registerError} />}
            <LoginLink />
          </>
        )}
      </form>
    )
  }

  return (
    <>
      <h1 className={"login-common-header"}>Rejestracja</h1>
      {!registerSuccessful && <DefaultForm />}
      {registerSuccessful && <RegisterSuccessful />}
    </>
  )
}

export default RegisterForm
