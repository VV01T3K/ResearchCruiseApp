import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../Wrappers/FormASections";
import PublicationsTable from "../../Inputs/PublicationsTable/PublicationsTable";
import {ThesesTable} from "../../Inputs/ThesesTable/ThesesTable";

const PandTSectionFieldNames = {
    theses:"theses",
    publications:"publications",

}

const PublicationsDescription = () => (
    <div className={"p-4 pb-0 text-center"}>
        <h5 className={"text-center"}>Publikacje związane tematycznie</h5>
        <p>Publikacje z ubiegłych 5-lat, związane <strong>bezpośrednio </strong>tematycznie z zadaniami
            do realizacji na planowanym rejsie, <strong>opublikowane przez zespół zaangażowany w
                realizację rejsu, z afiliacją UG.</strong></p>
        <h5 className={"text-center"}>Publikacje zawierające dopisek</h5>
        <p>Publikacje autorstwa zespołu zaangażowanego w realizację rejsu, ALE zawierające dopisek w
            treści publikacji (w wersji angielskiej lub w innym języku): <strong>„…the research/study
                was conducted onboard r/v Oceanograf (the research vessel owned by the University of
                Gdańsk)…” lub „… samples for the present study were collected during a research cruise
                onboard r/v Oceanograf…” </strong>lub podobny, ale wskazujący jednoznacznie że badania w
            ramach niniejszej publikacji były prowadzone z pokładu jednostki RV Oceanograf.</p>
    </div>
)

const ThesesDesription = () => (
    <div className={`pb-0 p-4 text-center`}>
        <h5 className={"text-center"}>Prace dyplomowe/doktorskie zawierające dopisek</h5>
        <p>Prace licencjackie, magisterskie oraz doktorskie zawierające informację w treści pracy
            wskazujący jednoznacznie że <strong>badania w ramach niniejszej pracy były prowadzone z
                pokładu jednostki RV Oceanograf.</strong></p>
    </div>
)

const ThesesField = () => {
    return (
        <ThesesTable
            className={"single-field"}
            fieldLabel="Prace"
            fieldName={PandTSectionFieldNames.theses}
            historicalTheses={[
                {
                    category: "doctor",
                    author: "Marian Domogolski",
                    title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
                    promoter: "Elżbieta Widłogrodzka",
                    year: 2020

                },
                {
                    category: "master",
                    author: "Marian Domogolski",
                    title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
                    promoter: "Elżbieta Widłogrodzka",
                    year: 2020
                },
                {
                    category: "bachelor",
                    author: "Marian Domogolski",
                    title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
                    promoter: "Elżbieta Widłogrodzka",
                    year: 2020
                }
            ]}
        />
    )
}

const PublicationsField = () =>
{
    return(
       <PublicationsTable
           className={"single-field"}
           fieldName={PandTSectionFieldNames.publications}
           fieldLabel={"Publikacje"}
            historicalPublications={    [
                {
                    category: "subject",
                    doi: "10.1016/j.marenvres.2023.106132",
                    authors: "Urszula Kwasigroch, Katarzyna Łukawska-Matuszewska, Agnieszka Jędruch, Olga Brocławik, Magdalena Bełdowska",
                    title: "Mobility and bioavailability of mercury in sediments of the southern Baltic sea in relation to the chemical fractions of iron: Spatial and temporal patterns",
                    magazine: "Marine Environmental Research",
                    year: 2023,
                    ministerialPoints: 0

                },
                {
                    category: "subject",
                    doi: "10.1016/j.csr.2018.08.008",
                    authors: "Aleksandra Brodecka-Goluch, Katarzyna Łukawska-Matuszewska",
                    title: "Porewater dissolved organic and inorganic carbon in relation to methane occurrence in sediments of the Gdańsk Basin (southern Baltic Sea)",
                    magazine: "Continental Shelf Research",
                    year: 2018,
                    ministerialPoints: 30
                },
                {
                    category: "postscript",
                    doi: "10.3390/biology12020147",
                    authors: "Natalia Miernik, Urszula Janas, Halina Kendzierska",
                    title: "Role of macrofaunal communities in the Vistula River plume, the Baltic Sea - bioturbation and bioirrigation potential",
                    magazine: "Biology",
                    year: 2023,
                    ministerialPoints: 100
                },
                {
                    category: "postscript",
                    doi: "10.1016/j.scitotenv.2020.140306",
                    authors: "Jakub Idczak, Aleksandra Brodecka-Goluch, Katarzyna Łukawska-Matuszewska, Bożena Graca, Natalia Gorska, Zygmunt Klusek, Patryk Pezacki, Jerzy Bolałek",
                    title: "A geophysical, geochemical and microbiological study of a newly discovered pockmark with active gas seepage and submarine groundwater discharge (MET1-BH, central Gulf of Gdańsk, southern Baltic Sea)",
                    magazine: "Science of the Total Environment",
                    year: 2020,
                    ministerialPoints: 200
                }
            ]}
       />
    )
}

export const PublicationAndThesesSection = (): FormSectionType => {
    const shortTitle = "Publikacje/prace"
    const longTitle = "Publikacje i prace"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props: SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <PublicationsDescription/>
            <PublicationsField/>
            <ThesesDesription/>
            <ThesesField/>

        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:PandTSectionFieldNames}
}