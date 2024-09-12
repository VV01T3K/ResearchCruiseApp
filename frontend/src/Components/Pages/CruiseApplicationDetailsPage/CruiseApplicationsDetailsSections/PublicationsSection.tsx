import {FormSectionType, SectionIdFromTitle} from "../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../FormPage/Wrappers/FormSection";
import EvaluatedPublicationsTable from "../../FormPage/Inputs/PublicationsTable/EvaluatedPublicationsTable";


const PublicationsSectionFieldNames = {
    publications:"publications",
}

const PublicationsField = () =>
{
    return(
       <EvaluatedPublicationsTable
           fieldLabel={""}
           className={"single-field"}
           fieldName={PublicationsSectionFieldNames.publications}
            evaluatedPublications={    [
                {
                    id:"sda",
                    publication:{
                        category: "subject",
                        doi: "10.1016/j.marenvres.2023.106132",
                        authors: "Urszula Kwasigroch, Katarzyna Łukawska-Matuszewska, Agnieszka Jędruch, Olga Brocławik, Magdalena Bełdowska",
                        title: "Mobility and bioavailability of mercury in sediments of the southern Baltic sea in relation to the chemical fractions of iron: Spatial and temporal patterns",
                        magazine: "Marine Environmental Research",
                        year: "2023",
                        ministerialPoints: "1"
                    },
                    calculatedPoints:"2"
                },
                {
                    id:"sda",
                    publication:{
                        category: "postscript",
                        doi: "10.1016/j.marenvres.2023.106132",
                        authors: "Urszula Kwasigroch, Katarzyna Łukawska-Matuszewska, Agnieszka Jędruch, Olga Brocławik, Magdalena Bełdowska",
                        title: "Mobility and bioavailability of mercury in sediments of the southern Baltic sea in relation to the chemical fractions of iron: Spatial and temporal patterns",
                        magazine: "Marine Environmental Research",
                        year: "2023",
                        ministerialPoints: "2023"
                    },
                    calculatedPoints:"2"
                },
            ]}
       />
    )
}

export const PublicationsSection = (): FormSectionType => {
    const shortTitle = "Publikacje"
    const longTitle = "Publikacje"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props: SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <PublicationsField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:PublicationsSectionFieldNames}
}