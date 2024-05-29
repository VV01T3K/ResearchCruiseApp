import DatePicker from "react-datepicker";
import React from "react"

import "./DateTimeFormPicker.css"


type Props = {
    boundedDateTime: string
    minDate: string,
    maxDate: string
}


export default function DateTimeFormPicker(props: Props) {
    return (
        <DatePicker
            className={"d-flex w-100 text-center border border-opacity-75 rounded-2 p-1"}
            closeOnScroll={true}
            showYearDropdown
            showTimeSelect
            timeCaption="Godzina"
            locale={"pl"}
            startDate={props.minDate ? new Date(props.minDate) : null}
            endDate={props.maxDate ? new Date(props.maxDate) : null}
            selected={props.boundedDateTime ? new Date(props.boundedDateTime) : null}
            onChange={(selectedOption) => {
                // props.form!.setValue(props.name, selectedOption ? new Date(selectedOption).toISOString(): "", { shouldDirty: true, shouldValidate: true, shouldTouch:true });
            }}
            // onBlur={field.onBlur}
            // getPopupContainer={trigger => trigger.parentElement}
            dateFormat="dd/MM/yyyy HH:mm"
            // placeholderText={props.label}
        />
    )
}