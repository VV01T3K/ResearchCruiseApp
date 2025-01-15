import { ErrorMessageIfPresentNoContext } from "@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext"
import userDataManager from "../../../ToBeMoved/CommonComponents/UserDataManager"
import { useEffect, useState } from "react"
import useFormWrapper from "../../../ToBeMoved/CommonComponents/useFormWrapper"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import WaitingPage from "../WaitingPage"
import Page from "../../../ToBeMoved/Pages/Page"
import { Path } from "../../../ToBeMoved/Tools/Path"

// TODO: [Not important] Switch to useContext(FormContext)
function EmailConfirmPage() {
  const { ConfirmEmail } = userDataManager()
  const [confirmed, setConfirmed] = useState(false)
  const [errorMsg, setErrorMsg] = useState<null | string>(null)
  const { ReturnToLoginLink } = useFormWrapper()

  const handleConfirmError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response?.status === 403) {
        setErrorMsg("email został już potwierdzony")
      } else {
        if (error.response && error.response?.status === 401) {
          setErrorMsg("link jest uszkodzony ")
        } else {
          setErrorMsg("Nieznany problem")
        }
      }
    }
  }

  const onLaunch = async () => {
    try {
      await ConfirmEmail()
      setConfirmed(true)
    } catch (error) {
      handleConfirmError(error)
    }
  }

  useEffect(() => {
    onLaunch()
  }, ["load"])

  const EmailConfirmedText = () => {
    return (
      <div className={"text-submit"}>
        Email został potwierdzony
        <div style={{ fontSize: 17 }}>
          {" "}
          Aby umożliwić Ci zalogowanie się, Biuro Armatora musi jeszcze zaakceptować Twoje konto
        </div>
      </div>
    )
  }

  const EmailConfirmFailedText = () => {
    return (
      <>
        <div className={"text-submit"}>Nie udało się potwiedzić adresu email</div>
        {errorMsg && <ErrorMessageIfPresentNoContext message={errorMsg!} />}
      </>
    )
  }

  const navigate = useNavigate()

  const ConfirmForm = () => {
    return (
      <form onSubmit={() => navigate(Path.Default)}>
        {confirmed && <EmailConfirmedText />}
        {!confirmed && errorMsg && <EmailConfirmFailedText />}
        <ReturnToLoginLink />
      </form>
    )
  }

  return (
    <>
      {!confirmed && !errorMsg && <WaitingPage label={"Trwa potwierdzanie adresu email"} />}
      <Page className={"login-common"}>
        <ConfirmForm />
      </Page>
    </>
  )
}

export default EmailConfirmPage
