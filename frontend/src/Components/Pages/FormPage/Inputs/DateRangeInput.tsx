import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateInput.css'
import pl from "date-fns/locale/pl"; // the locale you want
registerLocale("pl", pl); // register it with the name you want
import {
    Controller,
} from "react-hook-form";
import React, {useEffect} from "react";
import InputWrapper from "./InputWrapper";
import ErrorCode from "../../CommonComponents/ErrorCode";
import {Error} from "react-image-size";


type Props = {
    className?: string,
    label: string,
    name: string,
    values: string[], form?: any
}



function DateRangeInput(props: Props) {
    const fieldNameParts = props.name.split(/[.\[\]]/).filter(part => part !== '');
    const checkTouched = () => {

        return (props.form.formState.touchedFields && props.form.formState.touchedFields[fieldNameParts[0]] &&
            props.form.formState.touchedFields[fieldNameParts[0]][fieldNameParts[1]] &&
            props.form.formState.touchedFields[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]] &&
            props.form.formState.touchedFields[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]] &&
            props.form.formState.touchedFields[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]["startDate"] &&
            props.form.formState.touchedFields[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]["endDate"] &&
            !(props.form.formState.errors && props.form.formState.errors[fieldNameParts[0]] &&
            props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]] &&
            props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]] &&
            props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]] &&
                (
            props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]["startDate"] ||
            props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]["endDate"])))


    }

    useEffect(()=>{

        if(!checkTouched()){

            // console.log() // if(!props.form.formState.errors[props.name])
            if(!(props.form.formState.errors &&
                    props.form.formState.errors[fieldNameParts[0]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]])
            )
                props.form.setError(props.name, {
                    type: 'manual',
                    message: '',
                });
        }
        else {
            if((props.form.formState.errors &&
                props.form.formState.errors[fieldNameParts[0]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]))
                props.form!.clearErrors(props.name)
        }
    })
    // console.log(props.form.errors)
    return (
        <div className={props.className + ` d-flex flex-column p-3 `}>
            <label>{props.label}</label>
            <label>od</label>
            <Controller
                defaultValue={""}
                name={props.name+".startDate"}
                control={props.form!.control}
                rules={{required: 'Wybierz datę'}}
                render={({field}) => (
                    <DatePicker
                        showMonthYearPicker
                        showMonthYearDropdown
                        className={"w-100 text-center"}
                        selectsStart
                        startDate={field.value ? new Date(field.value) : null}
                        maxDate={props.form!.getValues(props.name+".endDate") ? new Date(props.form!.getValues(props.name+".endDate")) : null}
                        endDate={props.form!.getValues(props.name+".endDate") ? new Date(props.form!.getValues(props.name+".endDate")) : null}
                        closeOnScroll={true}
                        locale={"pl"}
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(selectedOption) => {
                            props.form!.setValue(props.name+".startDate", selectedOption ? new Date(selectedOption).toISOString() : "", {
                                shouldDirty: true,
                                shouldValidate: true,
                                shouldTouch: true
                            });
                        }}
                        onBlur={field.onBlur}
                        getPopupContainer={trigger => trigger.parentElement}
                        dateFormat="dd/MM/yyyy"
                        // placeholderText={props.label}
                    />
                )}

            />
            <ErrorCode code={
                props.form.formState.errors &&
                props.form.formState.errors[fieldNameParts[0]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]&&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]['startDate'] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]['startDate'].message}/>
            <label>do</label>
            <Controller
                defaultValue={""}
                name={props.name+".endDate"}
                control={props.form!.control}
                rules={{required: 'Wybierz datę'}}

                render={({field}) => (
                    <DatePicker
                        showYearDropdown
                        showMonthYearPicker
                        className={"w-100 text-center"}
                        startDate={props.form!.getValues(props.name+".startDate") ? new Date(props.form!.getValues(props.name+".startDate")) : null}
                        endDate={field.value ? new Date(field.value) : null}
                        minDate={props.form!.getValues(props.name+".startDate") ? new Date(props.form!.getValues(props.name+".startDate")) : null}
                        selectsEnd
                        closeOnScroll={true}
                        locale={"pl"}
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(selectedOption) => {
                            props.form!.setValue(props.name+".endDate", selectedOption ? new Date(selectedOption).toISOString() : "", {
                                shouldDirty: true,
                                shouldValidate: true,
                                shouldTouch: true
                            });
                        }}
                        onBlur={field.onBlur}
                        getPopupContainer={trigger => trigger.parentElement}
                        dateFormat="dd/MM/yyyy"
                        // placeholderText={props.label}
                    />

                )}


            />
            <ErrorCode code={
                props.form.formState.errors &&
                props.form.formState.errors[fieldNameParts[0]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]&&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]['endDate'] &&
                props.form.formState.errors[fieldNameParts[0]][fieldNameParts[1]][fieldNameParts[2]][fieldNameParts[3]]['endDate'].message}/>
        </div>
    )
}


export default DateRangeInput