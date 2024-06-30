import {Cruise} from "../../CruisesPage/CruisesPage";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {Controller, set, UseFormReturn, useWatch} from "react-hook-form";
import FormTimePicker from "../../../CommonComponents/DateTimeFormPicker/FormTimePicker";
import {start} from "@popperjs/core";
import {Time} from "../../FormPage/Inputs/TaskInput/TaskInput";
import ErrorCode from "../../LoginPage/ErrorCode";

type Props = {
    cruiseDetailsForm: UseFormReturn<Cruise>
}


export default function CruiseDate(props: Props) {
    const startWatch = useWatch({
        control: props.cruiseDetailsForm.control,
        name: "date.start"
    })
    const endWatch = useWatch({
        control: props.cruiseDetailsForm.control,
        name: "date.end"
    })

    const validateDateRange = () => {
        console.log("Sprawdzam")
        if (new Date(endWatch) <= new Date(startWatch)) {
            console.log("1 źle")
            return "Data rozpoczęcia musi być wcześniejsza niż data zakończenia"
        }
    }

    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12 h-100">
            <Controller
                name="date.start"
                control={props.cruiseDetailsForm.control}
                rules={{
                    validate: {
                        startBeforeEnd: (value: string) => {
                            console.log("Sprawdzam 1")
                            if (new Date(endWatch) <= new Date(value)) {
                                console.log("1 źle")
                                return "Data rozpoczęcia musi być wcześniejsza niż data zakończenia"
                            }
                        }
                    }
                }}
                render={(field) => (
                    <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center h-100 py-2">
                        <div className="d-flex col-12 justify-content-center mb-2">Czas rozpoczecia</div>
                        <DatePicker
                            className={"d-flex w-100 text-center border border-opacity-75 rounded-2 p-1"}
                            closeOnScroll={true}
                            showYearDropdown
                            showTimeSelect
                            timeCaption="Godzina"
                            locale={"pl"}
                            selected={startWatch ? new Date(startWatch) : null}
                            onChange={(selectedOption) => {
                                props.cruiseDetailsForm.setValue(
                                    "date.start",
                                    selectedOption ? new Date(selectedOption).toISOString() : "",
                                    { shouldDirty: true, shouldValidate: true, shouldTouch: true }
                                );
                            }}
                            dateFormat="dd/MM/yyyy HH:mm"
                        />
                    </div>
                )}
            />
            <Controller
                name="date.end"
                control={props.cruiseDetailsForm.control}
                rules={{
                    validate: {
                        startBeforeEnd: (value: string) => {
                            console.log("Sprawdzam 2")
                            if (new Date(value) <= new Date(startWatch)) {
                                console.log("2 źle")
                                return "Data rozpoczęcia musi być wcześniejsza niż data zakończenia"
                            }
                        }
                    }
                }}
                render={(field) => (
                    <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center h-100 py-2">
                        <div className="d-flex col-12 justify-content-center mb-2">Czas zakończenia</div>
                        <DatePicker
                            className={"d-flex w-100 text-center border border-opacity-75 rounded-2 p-1"}
                            closeOnScroll={true}
                            showYearDropdown
                            showTimeSelect
                            timeCaption="Godzina"
                            locale={"pl"}
                            selected={endWatch ? new Date(endWatch) : null}
                            onChange={(selectedOption) => {
                                props.cruiseDetailsForm.setValue(
                                    "date.end",
                                    selectedOption ? new Date(selectedOption).toISOString() : "",
                                    { shouldDirty: true, shouldValidate: true, shouldTouch: true }
                                );
                            }}
                            dateFormat="dd/MM/yyyy HH:mm"
                        />
                    </div>
                )}
            />
            {props.cruiseDetailsForm?.formState.errors.date?.start ?
                <ErrorCode code={props.cruiseDetailsForm?.formState.errors.date?.start.message} /> :
                props.cruiseDetailsForm?.formState.errors.date?.end ?
                    <ErrorCode code={props.cruiseDetailsForm?.formState.errors.date?.end.message} /> :
                    ""
            }
        </div>
    )
}