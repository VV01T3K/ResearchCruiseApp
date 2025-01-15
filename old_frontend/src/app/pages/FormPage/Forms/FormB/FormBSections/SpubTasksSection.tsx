import { SectionWrapper } from "@components/Form/Section/SectionWrapper"
import ReadonlyOverrideWrapper from "@components/Form/ReadonlyOverrideWrapper"
import { SpubTaskField } from "@app/pages/FormPage/Forms/FormA/FormASections/SpubTasksSectionFields"

export const spubTasksSectionFieldNames = {
  spubTasks: "spubTasks",
}

export const SpubTasksSection = () =>
  SectionWrapper({
    shortTitle: "SPUB",
    longTitle: "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie",
    sectionFieldNames: spubTasksSectionFieldNames,
    children: (
      <ReadonlyOverrideWrapper>
        <SpubTaskField />,
      </ReadonlyOverrideWrapper>
    ),
  })
