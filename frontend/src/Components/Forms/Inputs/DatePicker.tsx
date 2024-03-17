import 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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


function DatePicker(props: Props) {
    return (
        <InputWrapper {...props}>
            <Controller
                defaultValue={""}
                name={props.name}
                control={props.form!.control}
                render={({field}) => (
                    <DatePicker {...field}
                        name="exampleDate"
                        // selected={null} // Tutaj możesz ustawić wartość początkową, np. new Date()
                        // onChange={(date) => console.log(date)}
                        // onBlur={handleBlur} // Wywołuje trigger podczas zdarzenia onBlur (dotknięcia)
                        dateFormat="dd/MM/yyyy"
                    />
                )}
            />
        </InputWrapper>
    )
}


export default DatePicker