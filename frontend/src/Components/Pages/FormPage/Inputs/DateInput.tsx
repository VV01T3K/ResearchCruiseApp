import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateInput.css'
import pl from "date-fns/locale/pl"; // the locale you want
registerLocale("pl", pl); // register it with the name you want
import {
    Controller,
} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";


type Props = {
    className?: string,
    label: string,
    name: string,
    values: string[], form?: any
}


function DateInput(props: Props) {
    return (
        <InputWrapper {...props}>
            <Controller
                defaultValue={"" }
                name={props.name}
                control={props.form!.control}
                rules={{required: 'Wybierz datę'}}
                render={({ field }) => (
                    <DatePicker
                        className={"w-100 text-center"}

                        closeOnScroll={true}
                        locale={"pl"}
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(selectedOption) => {
                            props.form!.setValue(props.name, selectedOption ? new Date(selectedOption).toISOString(): "", { shouldDirty: true, shouldValidate: true, shouldTouch:true });
                        }}
                        onBlur={field.onBlur}
                        getPopupContainer={trigger => trigger.parentElement}
                        dateFormat="dd/MM/yyyy"
                        // placeholderText={props.label}
                    />
                )}
            />
        </InputWrapper>
    )
}


export default DateInput