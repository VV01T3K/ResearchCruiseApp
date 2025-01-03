import { FieldValues } from "react-hook-form"
import { useContext } from "react"
import { FormContext } from "@contexts/FormContext"
import { putFormA, putFormB } from "@api/requests/Put"
import { useNavigate } from "react-router-dom"
import { Path } from "./Path"
import cruiseApplicationFromLocation from "@hooks/cruiseApplicationFromLocation"
import { addCruiseApplication } from "@api/requests"
import { AxiosResponse } from "axios"
import { FormType } from "../Pages/CommonComponents/FormTitleWithNavigation"
import { formAToSend } from "./FormsTransform"

export const handleSave = () => {
  const navigate = useNavigate()
  const formContext = useContext(FormContext)
  const app = cruiseApplicationFromLocation()

  return () => {
    let response: Promise<AxiosResponse<any, any>>

    if (formContext?.type === FormType.A) {
      const dataToSend = formAToSend(formContext.getValues())

      response =
        app?.id && !formContext.isCopied
          ? putFormA(dataToSend, app.id, true)
          : addCruiseApplication(dataToSend, true)
    } else if (formContext?.type === FormType.B) {
      response = putFormB(app?.id, formContext!.getValues(), true)
    } else {
      return
    }

    response.then(() => {
      navigate(Path.CruiseApplications)
    })
  }
}

export const handleSubmit = () => {
  const navigate = useNavigate()
  const formContext = useContext(FormContext)
  const app = cruiseApplicationFromLocation()

  return () => {
    let response: Promise<AxiosResponse<any, any>>

    if (formContext?.type === FormType.A) {
      const dataToSend = formAToSend(formContext.getValues())

      response =
        app?.id && !formContext?.isCopied
          ? putFormA(dataToSend, app.id, false)
          : addCruiseApplication(dataToSend, false)
    } else if (formContext?.type === FormType.B) {
      response = putFormB(app.id, formContext?.getValues(), false)
    } else {
      return
    }

    response.then(() => navigate(Path.CruiseApplications))
  }
}

export const handleDownload = (data: FieldValues) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })
  return URL.createObjectURL(blob)
}
export const fileName = (formType: string) => {
  const currentDate = new Date()
  const day = currentDate.getDate()
  const month = currentDate.getMonth() + 1 // Adding 1 because months are zero-indexed
  const year = currentDate.getFullYear()
  return `Formularz_${formType}_${day}.${month}.${year}`
}

export const handlePrint = () => {
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((style) => style.outerHTML)
    .join("")

  const header_str = `
    <html>
      <head>
        <title>${document.title}</title>
        ${styles} <!-- Skopiowane style -->
      </head>
      <body>
  `
  const footer_str = "</body></html>"
  const new_str = document.getElementById("form")?.innerHTML

  if (new_str) {
    const printIframe = document.createElement("iframe")
    printIframe.style.width = "100%"
    printIframe.style.height = "100vh"
    printIframe.style.border = "none"
    printIframe.style.position = "absolute"

    document.body.appendChild(printIframe)

    const iframeDoc = printIframe.contentWindow?.document
    iframeDoc?.open()
    iframeDoc?.write(header_str + new_str + footer_str)
    iframeDoc?.close()

    printIframe.contentWindow?.focus()
    printIframe.contentWindow?.print()

    document.body.removeChild(printIframe)
  }
}
