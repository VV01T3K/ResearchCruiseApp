import SimpleInfoTile from "../../../CommonComponents/SimpleInfoTile";
import ReadOnlyTextInput from "../../../CommonComponents/ReadOnlyTextInput";
import React from "react";
import {Cruise} from "../../CruisesPage/CruisesPage";
import CruiseApplicationsList from "../../CruisesPage/CruiseApplicationsList";
import {UseFormReturn} from "react-hook-form";


type Props = {
    cruise?: Cruise
}


export default function CruiseBasicInfo(props: Props) {
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12">
            <SimpleInfoTile title="Numer rejsu" colsXl={4}>
                <ReadOnlyTextInput
                    value={props.cruise?.number ?? ""}
                    className={!props.cruise ? "bg-light" : ""}
                />
            </SimpleInfoTile>
        </div>
    )
}