import {useContext} from "react";
import {FormContext} from "@contexts/FormContext";
import {CruiseApplicationDetailsFormInitValues} from "CruiseApplicationDetailsFormInitValues";
import ReadOnlyTextInput from "../../../../../ToBeMoved/CommonComponents/ReadOnlyTextInput";
import {FieldLabel} from "@app/pages/FormPage/Inputs/FieldWrapper";

export const EffectsPointsField = () => {
    const formContext = useContext(FormContext);
    const effectsPoints = (formContext!.initValues as CruiseApplicationDetailsFormInitValues)?.effectsPoints;

    return (
        <div className="">
            <FieldLabel fieldLabel="Liczba punktów przyznanych za zrealizowane efekty rejsów zgłoszone do momentu
                                    wysłania Formularza A:"
            />
            <ReadOnlyTextInput className="d-flex mx-auto" value={effectsPoints} />
        </div>
    )
};