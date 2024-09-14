import {FormSectionType, SectionIdFromTitle} from "../../Wrappers/FormASections";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";

export const spubTasksSectionFieldNames = {
    spubTasks:"spubTasks",
}

export const SpubTasksSection = (): FormSectionType => {
    const shortTitle = "SPUB"
    const longTitle =
        "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props: SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>

        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:spubTasksSectionFieldNames}
}