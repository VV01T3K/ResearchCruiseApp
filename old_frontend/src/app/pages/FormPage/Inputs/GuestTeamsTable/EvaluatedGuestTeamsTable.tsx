import { OrdinalNumber } from "../TableParts"
import { FieldTableWrapper } from "../../Wrappers/FieldTableWrapper"
import { FieldLabel } from "../FieldWrapper"
import { InstitutionField, NoOfPersonsField } from "./GuestTeamsTableFields"
import { DisplayValueContext, DisplayWrapper } from "../TaskTable/EvaluatedTaskTable"
import { GuestsTeam } from "./GuestTeamsTable"

type Props = {
  className?: string
  guestTeams: GuestsTeam[]
  fieldLabel: string
}

const guestTeamsTableContent = () => [
  () => <OrdinalNumber label={"Instytucja"} />,
  DisplayWrapper(InstitutionField),
  DisplayWrapper(NoOfPersonsField),
]

function EvaluatedGuestTeamsTable(props: Props) {
  const mdColWidths = [10, 60, 30]
  const mdColTitles = ["Lp.", "Instytucja", "Liczba osób"]
  const colTitle = "Jednostki"
  const emptyText = "Nie dodano żadnej instytucji"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    guestTeamsTableContent,
    null,
    emptyText,
    props.guestTeams
  )

  return (
    <div className={props.className + " field-wrapper"}>
      <FieldLabel fieldLabel={props.fieldLabel} />
      <DisplayValueContext.Provider value={props.guestTeams}>
        <Render />
      </DisplayValueContext.Provider>
    </div>
  )
}

export default EvaluatedGuestTeamsTable
