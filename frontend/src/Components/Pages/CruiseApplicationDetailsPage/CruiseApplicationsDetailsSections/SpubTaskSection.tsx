import {FormSectionType, SectionIdFromTitle} from "../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../FormPage/Wrappers/FormSection";
import {EvaluatedSpubTaskTable} from "../../FormPage/Inputs/EvaluatedSpubTasksTable";
import {useContext} from "react";
import {FormContext} from "../../FormPage/Wrappers/FormTemplate";


const spubTasksSectionFieldNames = {
    spubTasks:"spubTaskEvaluationsEdits",
}

const SpubTaskField = () => {
    const formContext = useContext(FormContext)
    return (
        <EvaluatedSpubTaskTable
            fieldLabel={""}
            className={"single-field"}
            fieldName={spubTasksSectionFieldNames.spubTasks}
            evaluatedSpubTasks={formContext!.initValues?.formASpubTasks}
        />
    )
}

export const SpubTaskSection = (): FormSectionType => {
    const shortTitle = "SPUB"
    const longTitle =
        "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props: SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <SpubTaskField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:spubTasksSectionFieldNames}
}