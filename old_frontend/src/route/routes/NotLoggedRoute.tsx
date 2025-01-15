import { Route } from "react-router-dom"
import { Path } from "../../ToBeMoved/Tools/Path"
import LoginPage from "@app/pages/NotLoggedInPage/LoginPage/LoginPage"
import FormAForSupervisorPage from "@app/pages/FormAForSupervisorPage"
import FormPage from "@app/pages/FormPage/FormPage"
import RegisterPage from "@app/pages/NotLoggedInPage/RegisterPage/RegisterPage"
import ForgotPasswordPage from "@app/pages/NotLoggedInPage/ForgotPasswordPage/ForgotPasswordPage"
import ResetPasswordPage from "@app/pages/NotLoggedInPage/ResetPasswordPage/ResetPasswordPage"

export const NotLoggedRoute = () => {
  return (
    <>
      <Route path={Path.Any} element={<LoginPage />} />
      <Route path={Path.FormAForSupervisor} element={<FormAForSupervisorPage />} />
      <Route path={Path.Form} element={<FormPage />} />
      <Route path={Path.Register} element={<RegisterPage />} />
      <Route path={Path.ForgotPassword} element={<ForgotPasswordPage />} />
      <Route path={Path.ResetPassword} element={<ResetPasswordPage />} />
      {/*<Route path={Path.ForcedLogout} element={<LogoutPage />} />*/}
    </>
  )
}
