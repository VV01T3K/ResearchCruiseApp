import {FormSectionType, SectionIdFromTitle} from "../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../FormPage/Wrappers/FormSection";
import {EvaluatedSpubTaskTable} from "../../FormPage/Inputs/EvaluatedSpubTasksTable";


const spubTasksSectionFieldNames = {
    spubTasks:"spubTasks",
}

const SpubTaskField = () => {
    return (
        <EvaluatedSpubTaskTable
            fieldLabel={""}
            className={"single-field"}
            fieldName={spubTasksSectionFieldNames.spubTasks}
            evaluatedSpubTasks={
            [
                {
                    id:"sad",
                    spubTask: {
                        yearFrom: "2020",
                        yearTo: "2021",
                        name: "Badanie nowych właściwości wodno-tlenowych Morza Bałtyckiego w obszarze Zatoki Gdańskiej"
                    },
                    calculatedPoints:"21"
                },
                ]}
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