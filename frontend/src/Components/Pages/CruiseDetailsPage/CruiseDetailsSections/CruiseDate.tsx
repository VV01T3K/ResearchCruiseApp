import {Cruise} from "../../CruisesPage/CruisesPage";
import React from "react";
import DatePicker from "react-datepicker";
import {UseFormReturn} from "react-hook-form";
import DateTimeFormPicker from "../../../CommonComponents/DateTimeFormPicker/DateTimeFormPicker";

type Props = {
    cruise: Cruise
}


export default function CruiseDate(props: Props) {
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12 h-100">
            <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center">
                <div className="d-flex col-12 justify-content-center">Czas rozpoczecia</div>
                <DateTimeFormPicker
                    boundedDateTime={props.cruise.startDate}
                    minDate={props.cruise.startDate}
                    maxDate={props.cruise.endDate}
                />
            </div>
            <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center">
                <div className="d-flex col-12 justify-content-center">Czas zakończenia</div>
                <DateTimeFormPicker
                    boundedDateTime={props.cruise.endDate}
                    minDate={props.cruise.startDate}
                    maxDate={props.cruise.endDate}
                />
            </div>
        </div>
    )
}