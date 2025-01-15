import { SpubTaskField } from "./SpubTasksSectionFields"
import { SectionWrapper } from "@components/Form/Section/SectionWrapper"

export const spubTasksSectionFieldNames = {
  spubTasks: "spubTasks",
}

export const SpubTasksSection = () =>
  SectionWrapper({
    shortTitle: "SPUB",
    longTitle: "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie",
    sectionFieldNames: spubTasksSectionFieldNames,
    children: <SpubTaskField />,
  })
