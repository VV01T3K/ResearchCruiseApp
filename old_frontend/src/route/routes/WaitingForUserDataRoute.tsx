import { Route } from "react-router-dom"
import { Path } from "../../ToBeMoved/Tools/Path"
import WaitingPage from "@app/pages/WaitingPage"

export const WaitingForUserDataRoute = () => {
  return (
    <>
      <Route path={Path.Any} element={<WaitingPage label={"Wczytywanie danych"} />} />
    </>
  )
}
