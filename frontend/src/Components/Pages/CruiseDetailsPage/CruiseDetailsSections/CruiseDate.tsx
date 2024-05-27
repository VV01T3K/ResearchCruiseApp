import {Cruise} from "../../CruisesPage/CruisesPage";
import React from "react";
import DatePicker from "react-datepicker";

type Props = {
    cruise: Cruise
}


export default function CruiseDate(props: Props) {
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12">
            <div className="d-flex col-12 col-xl-6 justify-content-center">
                <div className="d-flex col-12 justify-content-center">Czas rozpoczecia</div>
                {/*<DatePicker*/}
                {/*    className={"w-100 text-center"}*/}

                {/*    closeOnScroll={true}*/}
                {/*    locale={"pl"}*/}
                {/*    selected={field.value ? new Date(field.value) : null}*/}
                {/*    onChange={(selectedOption) => {*/}
                {/*        props.form!.setValue(props.name, selectedOption ? new Date(selectedOption).toISOString(): "", { shouldDirty: true, shouldValidate: true, shouldTouch:true });*/}
                {/*    }}*/}
                {/*    onBlur={field.onBlur}*/}
                {/*    getPopupContainer={trigger => trigger.parentElement}*/}
                {/*    dateFormat="dd/MM/yyyy"*/}
                {/*    // placeholderText={props.label}*/}
                {/*/>*/}
            </div>
            <div className="d-flex col-12 col-xl-6 justify-content-center">
                <div className="d-flex col-12 justify-content-center">Czas zakończenia</div>
            </div>
        </div>
    )
}