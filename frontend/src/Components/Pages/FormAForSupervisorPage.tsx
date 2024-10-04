import React, {useEffect} from 'react';
import Api from "../Tools/Api";
import {useNavigate} from "react-router-dom";
import {Path} from "../Tools/Path";
import {formType} from "./CommonComponents/FormTitleWithNavigation";

export default function FormAForSupervisorPage() {
    const navigate = useNavigate()

    const queryParams = new URLSearchParams(window.location.search);
    const applicationId = queryParams.get('cruiseApplicationId');
    const supervisorCode = queryParams.get('supervisorCode');


    useEffect(() => {
        if (applicationId && supervisorCode) {
            navigate(Path.Form,
                { state: { formType: formType.A, cruiseApplicationId: applicationId, supervisorCode: supervisorCode, readOnly :true } })
        }
        else {
            navigate(Path.Default)
        }

    }, []);
    return (
        <>
            ssa
        </>
    )
}