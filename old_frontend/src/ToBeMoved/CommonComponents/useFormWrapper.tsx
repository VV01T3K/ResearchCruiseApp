import { FieldValues, RegisterOptions, useForm } from "react-hook-form"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Path as Path } from "../Tools/Path"
import { ErrorMessageIfPresentNoContext } from "@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext"
import { emailPattern } from "@consts/emailPatterns"

export default function useFormWrapper() {
  const form = useForm({ mode: "onBlur", reValidateMode: "onBlur" })
  const [disabled, setDisabled] = useState(false)

  const ErrorMessageIfPresent = (props: { fieldName: string }) => {
    const errors = form.formState.errors
    return (
      <>
        {errors[props.fieldName] && (
          <ErrorMessageIfPresentNoContext message={errors[props.fieldName]!.message as string} />
        )}
      </>
    )
  }

  const ClearField = (name: string) => {
    form.setValue(name, "")
  }

  const CommonInput = (props: {
    label: string
    name: string
    type: string
    registerOptions: RegisterOptions
  }) => {
    return (
      <>
        <div className="login-common-text-field">
          <label>{props.label}</label>
          <input
            type={props.type}
            disabled={disabled}
            {...form.register(props.name, props.registerOptions)}
          />
        </div>
        <ErrorMessageIfPresent fieldName={props.name} />
      </>
    )
  }

  const EmailTextInput = () => {
    return (
      <CommonInput
        label={"E-mail"}
        name={"email"}
        type={"text"}
        registerOptions={{
          required: "Pole wymagane",
          maxLength: 200,
          pattern: {
            value: emailPattern,
            message: "Adres email jest niepoprawny",
          },
        }}
      />
    )
  }

  const passwordPattern = {
    value: /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
    message: "Co najmniej 8 znaków w tym przynajmniej jedna duża litera, mała litera oraz cyfra",
  }

  const passwordOptions = {
    required: "Pole wymagane",
    maxLength: 200,
  }

  const PasswordTextInput = () => {
    return (
      <CommonInput
        label={"Hasło"}
        name={"password"}
        type={"password"}
        registerOptions={{
          ...passwordOptions,
          pattern: passwordPattern,
        }}
      />
    )
  }

  const NewPasswordTextInput = () => {
    return (
      <CommonInput
        label={"Nowe hasło"}
        name={"newPassword"}
        type={"password"}
        registerOptions={{
          ...passwordOptions,
          pattern: passwordPattern,
        }}
      />
    )
  }

  const ComparePasswordWith = (field: string) => {
    return (value: FieldValues) => value === form.getValues(field) || "Hasła nie pasują do siebie"
  }

  const ConfirmNewPasswordTextInput = () => {
    return (
      <CommonInput
        label={"Potwierdź nowe hasło"}
        name={"newPasswordConfirm"}
        type={"password"}
        registerOptions={{
          ...passwordOptions,
          validate: ComparePasswordWith("newPassword"),
        }}
      />
    )
  }

  const ConfirmPasswordTextInput = () => {
    return (
      <CommonInput
        label={"Potwierdź hasło"}
        name={"passwordConfirm"}
        type={"password"}
        registerOptions={{
          ...passwordOptions,
          validate: ComparePasswordWith("password"),
        }}
      />
    )
  }

  const LastNameTextInput = () => {
    return (
      <CommonInput
        label={"Nazwisko"}
        name={"lastName"}
        type={"text"}
        registerOptions={{ required: "Pole wymagane", maxLength: 100 }}
      />
    )
  }
  const FirstNameTextInput = () => {
    return (
      <CommonInput
        label={"Imię"}
        name={"firstName"}
        type={"text"}
        registerOptions={{ required: "Pole wymagane", maxLength: 100 }}
      />
    )
  }

  const CommonSubmitButton = (props: { label: string }) => {
    return (
      <input
        className={disabled ? "login-common-submit-loading" : "login-common-submit"}
        type="submit"
        disabled={disabled}
        value={props.label}
      />
    )
  }

  const RegisterLink = () => {
    return (
      <div className="signup-link">
        Brak konta? <span /> <Link to={Path.Register}> Zarejestruj się </Link>
      </div>
    )
  }

  const ConfirmButton = () => {
    return <CommonSubmitButton label={"Potwierdź"} />
  }

  const ReturnToLoginLink = () => {
    return <input type={"submit"} className="login-common-submit" value={"Powrót do logowania"} />
  }

  return {
    ...form,
    ErrorMessageIfPresent,
    ClearField,
    disabled,
    setDisabled,
    CommonInput,
    CommonSubmitButton,
    EmailTextInput,
    PasswordTextInput,
    LastNameTextInput,
    FirstNameTextInput,
    ConfirmPasswordTextInput,
    RegisterLink,
    ConfirmButton,
    ReturnToLoginLink,
    NewPasswordTextInput,
    ConfirmNewPasswordTextInput,
  }
}
