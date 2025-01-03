import { UserData } from "User/UserData"
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { AnyStringFilterOption } from "../../../ToBeMoved/Pages/CommonComponents/ListFilterMenu"
import { FieldTableWrapper } from "../FormPage/Wrappers/FieldTableWrapper"
import ReadOnlyTextInput from "../../../ToBeMoved/CommonComponents/ReadOnlyTextInput"
import PageTitle from "../../../components/Page/PageTitle"
import Page from "../../../ToBeMoved/Pages/Page"
import AddUserForm from "./AddUserForm/AddUserForm"
import { CellContext } from "@contexts/CellContext"
import { UserRole } from "@enums/UserRole"
import UserDataManager from "../../../ToBeMoved/CommonComponents/UserDataManager"
import { activateUser, deactivateUser, getUsers, requestEmail } from "@api/requests"

export const FilteredUsersContext = createContext<null | UserData[]>(null)
export const UsersContext = createContext<null | UserData[]>(null)

export const UsersTools = () => {
  const cellContext = useContext(CellContext)
  const filteredUsersContext = useContext(FilteredUsersContext)
  const usersContext = useContext(UsersContext)

  const setUserListContext = useContext(SetUserListContext)
  const user: UserData = filteredUsersContext![cellContext?.rowIndex!]
  const updateUser = (fieldKey: keyof UserData, value: UserData[keyof UserData]) => {
    // @ts-ignore
    user[fieldKey] = value
    const newUserList = [...usersContext!]
    const userIndex = newUserList.findIndex((_user) => _user.id == user.id)
    newUserList![userIndex] = user
    setUserListContext!(newUserList)
  }
  return { user, updateUser }
}

export const TableReadOnlyField = (props: { fieldLabel: string; fieldKey: keyof UserData }) => {
  const { user } = UsersTools()
  return (
    <div className={"task-field-input"}>
      <label className={"table-field-input-label"}>{props.fieldLabel}</label>
      <ReadOnlyTextInput value={user![props.fieldKey] as string} />
    </div>
  )
}
export const UserName = () => (
  <TableReadOnlyField fieldLabel={"Nazwa użytkownika:"} fieldKey={"email"} />
)
export const FirstAndLastName = () => (
  <div className={"d-flex flex-column w-100"}>
    <TableReadOnlyField fieldLabel={"Imię:"} fieldKey={"firstName"} />
    <TableReadOnlyField fieldLabel={"Nazwisko:"} fieldKey={"lastName"} />
  </div>
)
export const Accepted = () => {
  const { user } = UsersTools()
  return (
    <div className={"task-field-input"}>
      <label className={"table-field-input-label"}>Zaakceptowany:</label>
      <ReadOnlyTextInput
        className={!user.accepted ? "bg-danger" : "bg-success"}
        value={user.accepted ? "tak" : "nie"}
      />
    </div>
  )
}
export const EmailConfirmed = () => {
  const { user } = UsersTools()
  return (
    <div className={"task-field-input"}>
      <label className={"table-field-input-label"}>Email potwierdzony:</label>
      <ReadOnlyTextInput
        className={!user.emailConfirmed ? "bg-danger" : "bg-success"}
        value={user.emailConfirmed ? "tak" : "nie"}
      />
    </div>
  )
}
export const Roles = () => {
  const { user } = UsersTools()
  return (
    <div className={"task-field-input"}>
      <label className={"table-field-input-label"}>Role:</label>
      <ReadOnlyTextInput
        value={user.roles.map((role) => UserRole[role as keyof typeof UserRole]).join(", ")}
      />
    </div>
  )
}

export const Actions = () => {
  const { user, updateUser } = UsersTools()
  const { userData } = UserDataManager()
  const [emailText] = useState("Wyślij email")
  const emailSent = "Wysłano email"
  return (
    <div className="btn-group-vertical align-items-center">
      {!user.accepted && (
        <div
          className={"user-action-link"}
          onClick={() => activateUser(user).then(() => updateUser("accepted", true))}
        >
          Aktywuj konto
        </div>
      )}
      {user.accepted && user.id !== userData?.id && (
        <div
          className={"user-action-link"}
          onClick={() => deactivateUser(user).then(() => updateUser("accepted", false))}
        >
          Dezaktywuj
        </div>
      )}
      {!user.emailSent && !user.emailConfirmed && (
        <div
          className={!(emailText == emailSent) ? "user-action-link" : ""}
          onClick={
            emailSent
              ? () => requestEmail(user).then(() => updateUser("emailSent", true))
              : () => {}
          }
        >
          Wyślij potwierdzenie email
        </div>
      )}
      {user.emailSent && <div>Wysłano</div>}
    </div>
  )
}
const manageUsersPageTableContent = () => [
  UserName,
  FirstAndLastName,
  Accepted,
  EmailConfirmed,
  Roles,
  Actions,
]

const getUsersData = () =>
  getUsers().then((response) => {
    return response?.data
  })

export const SetUserListContext = createContext<Dispatch<SetStateAction<UserData[]>> | null>(null)

function ManageUsersPage() {
  const [userList, setUserList] = useState<UserData[]>([])
  const fetchData = async () => {
    return getUsersData().then((response) => setUserList(response ?? []))
  }
  useEffect(() => {
    fetchData()
  }, [])

  const [filterText, setFilterText] = useState("")

  const anyStringFilterOptions: AnyStringFilterOption[] = [
    {
      label: "Imię/nazwisko",
      filter: setFilterText,
    },
  ]

  const [notAcceptedToggle, setNotAcceptedToggle] = useState(false)
  const [withoutConfirmedMailToggle, setWithoutConfirmedMailToggle] = useState(false)

  const applyFilters = (row: UserData): boolean =>
    !(notAcceptedToggle && row.accepted) &&
    !(withoutConfirmedMailToggle && row.emailConfirmed) &&
    (row.firstName?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.lastName?.toLowerCase().includes(filterText.toLowerCase()))

  const mdColWidths = [20, 20, 15, 15, 20, 10]
  const mdColTitles = [
    "Nazwa użytkownika",
    "Imię i nazwisko",
    "Zaakceptowany",
    "Email potwierdzony",
    "Rola",
    "Akcje",
  ]
  const colTitle = "Użytkownicy"

  const emptyText = "Brak użytkowników"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    manageUsersPageTableContent,
    null,
    emptyText,
    userList.filter(applyFilters),
    true
  )

  return (
    <Page className="form-page">
      <PageTitle title="Zarządzanie użytkownikami" />
      <SetUserListContext.Provider value={setUserList}>
        <UsersContext.Provider value={userList}>
          <FilteredUsersContext.Provider value={userList.filter(applyFilters)}>
            <div className="form-page-content d-flex flex-column align-items-center w-100">
              <AddUserForm fetchUsers={fetchData} />
              <div className={"d-flex flex-row flex-wrap justify-content-end w-100"}>
                {anyStringFilterOptions.map((anyStringFilter, index) => (
                  <div key={index} className={`d-none d-md-flex flex-column col-md-3 p-1`}>
                    <input
                      className="field-common"
                      placeholder={anyStringFilter.label}
                      onChange={(e) => {
                        anyStringFilter.filter(e.target.value)
                      }}
                    />
                  </div>
                ))}
                <button
                  className={`btn  m-1 ${notAcceptedToggle ? "btn-danger" : "btn-primary"}`}
                  onClick={() => {
                    setNotAcceptedToggle(!notAcceptedToggle)
                  }}
                >
                  Niezaakceptowani
                </button>
                <button
                  className={`btn m-1 ${withoutConfirmedMailToggle ? "btn-danger" : "btn-primary "}`}
                  onClick={() => {
                    setWithoutConfirmedMailToggle(!withoutConfirmedMailToggle)
                  }}
                >
                  Niepotwierdzony mail
                </button>
              </div>

              <Render className={"w-100"} />
            </div>
          </FilteredUsersContext.Provider>
        </UsersContext.Provider>
      </SetUserListContext.Provider>
    </Page>
  )
}

export default ManageUsersPage
