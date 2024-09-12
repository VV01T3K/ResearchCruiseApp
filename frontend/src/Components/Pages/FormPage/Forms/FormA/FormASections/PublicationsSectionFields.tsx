import {ThesesTable} from "../../../Inputs/ThesesTable/ThesesTable";
import PublicationsTable from "../../../Inputs/PublicationsTable/PublicationsTable";
import React from "react";
import {PublicationsSectionFieldNames} from "./PublicationsSection";

export const PublicationsDescription = () => (
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

export const ThesesDesription = () => (
    <div className={`pb-0 p-4 text-center`}>
        <h5 className={"text-center"}>Prace dyplomowe/doktorskie zawierające dopisek</h5>
        <p>Prace licencjackie, magisterskie oraz doktorskie zawierające informację w treści pracy
            wskazujący jednoznacznie że <strong>badania w ramach niniejszej pracy były prowadzone z
                pokładu jednostki RV Oceanograf.</strong></p>
    </div>
)

export const ThesesField = () => {
    return (
        <ThesesTable
            className={"single-field"}
            fieldLabel="Prace"
            fieldName={PublicationsSectionFieldNames.theses}
            historicalTheses={[
                {
                    category: "doctor",
                    author: "Marian Domogolski",
                    title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
                    promoter: "Elżbieta Widłogrodzka",
                    year: 2020

                },
            ]}
        />
    )
}

export const PublicationsField = () =>
{
    return(
        <PublicationsTable
            className={"single-field"}
            fieldName={PublicationsSectionFieldNames.publications}
            fieldLabel={"Publikacje"}
            historicalPublications={    [
                {
                    category: "subject",
                    doi: "10.1016/j.marenvres.2023.106132",
                    authors: "Urszula Kwasigroch, Katarzyna Łukawska-Matuszewska, Agnieszka Jędruch, Olga Brocławik, Magdalena Bełdowska",
                    title: "Mobility and bioavailability of mercury in sediments of the southern Baltic sea in relation to the chemical fractions of iron: Spatial and temporal patterns",
                    magazine: "Marine Environmental Research",
                    year: "2023",
                    ministerialPoints: "0"

                }
            ]}
        />
    )
}