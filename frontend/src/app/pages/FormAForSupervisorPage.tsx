import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FormType } from "../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation"
import { Path } from "../../ToBeMoved/Tools/Path"

export default function FormAForSupervisorPage() {
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(window.location.search)
  const applicationId = queryParams.get("cruiseApplicationId")
  const supervisorCode = queryParams.get("supervisorCode")

  useEffect(() => {
    if (applicationId && supervisorCode) {
      navigate(Path.Form, {
        state: {
          formType: FormType.AForSupervisor,
          cruiseApplicationId: applicationId,
          supervisorCode: supervisorCode,
          readOnly: true,
        },
      })
    } else {
      navigate(Path.Default)
    }
  }, [])
  return <></>
}
