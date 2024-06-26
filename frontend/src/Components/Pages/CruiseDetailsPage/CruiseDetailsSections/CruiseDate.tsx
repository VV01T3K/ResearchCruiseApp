import {Cruise} from "../../CruisesPage/CruisesPage";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {set, UseFormReturn} from "react-hook-form";
import DateTimeFormPicker from "../../../CommonComponents/DateTimeFormPicker/DateTimeFormPicker";
import {start} from "@popperjs/core";

type Props = {
    cruiseDetailsForm: UseFormReturn<Cruise>
}


export default function CruiseDate(props: Props) {
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12 h-100">
            <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center h-100 py-2">
                <div className="d-flex col-12 justify-content-center mb-2">Czas rozpoczecia</div>
                <DateTimeFormPicker
                    form={props.cruiseDetailsForm}
                    formFieldName="startDate"
                    endDateFieldName="endDate"
                />
            </div>
            <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center h-100 py-2">
                <div className="d-flex col-12 justify-content-center mb-2">Czas zakończenia</div>
                <DateTimeFormPicker
                    form={props.cruiseDetailsForm}
                    formFieldName="endDate"
                    startDateFieldName="startDate"
                />
            </div>
        </div>
    )
}