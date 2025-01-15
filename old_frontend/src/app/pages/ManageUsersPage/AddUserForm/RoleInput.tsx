import { UseFormReturn } from "react-hook-form"
import { SelectWrapper } from "../../FormPage/Wrappers/ReactSelectWrapper"
import { ErrorMessageIfPresentNoContext } from "@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext"
import UserBasedAccess from "../../../../route/UserBasedAccess"
import { Role } from "Role"
import { NewUserFormValues } from "NewUserFormValues"

type RoleOption = {
  label: string
  value: Role
}

type Props = {
  form: UseFormReturn<NewUserFormValues>
  label: string
  name: keyof NewUserFormValues
  disabled: boolean
}

export default function RoleInput(props: Props) {
  const fieldOptions = {
    required: "Pole wymagane",
  }

  const getRoleOptions = (): RoleOption[] => {
    const { UserHasAdminAccess, UserHasShipownerAccess } = UserBasedAccess()
    const roleOptions: RoleOption[] = []

    if (UserHasAdminAccess() || UserHasShipownerAccess()) {
      roleOptions.push(
        {
          label: "Kierownik",
          value: Role.CruiseManager,
        },
        {
          label: "Gość",
          value: Role.Guest,
        }
      )
    }
    if (UserHasAdminAccess()) {
      roleOptions.push(
        {
          label: "Administrator",
          value: Role.Administrator,
        },
        {
          label: "Armator",
          value: Role.Shipowner,
        }
      )
    }

    return roleOptions
  }

  return (
    <>
      <div className="d-flex flex-wrap col-md-3 col-12 mb-1">
        <label className="d-flex pb-1" style={{ fontSize: "inherit" }}>
          {props.label}:
        </label>
        <SelectWrapper
          {...props.form.register(props.name, fieldOptions)}
          ref={null}
          className="d-flex w-100"
          options={getRoleOptions()}
          placeHolder={"Wybierz wartość"}
          disabled={props.disabled}
          onChange={(selectedValue) => {
            if (selectedValue) {
              props.form.setValue(props.name, selectedValue.value as string, {
                shouldTouch: true,
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          }}
        />
        {props.form.formState.errors[props.name] && (
          <div className="d-flex col-12 justify-content-center">
            <ErrorMessageIfPresentNoContext
              message={props.form.formState.errors[props.name]?.message}
            />
          </div>
        )}
      </div>
    </>
  )
}
