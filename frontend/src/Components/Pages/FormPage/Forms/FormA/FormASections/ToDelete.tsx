import {ThesesTable} from "../../../Inputs/ThesesTable/ThesesTable";
import {publicationsSectionFieldNames} from "./PublicationsSection";
import React from "react";

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
            // @ts-ignore
            fieldName={publicationsSectionFieldNames.theses}
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