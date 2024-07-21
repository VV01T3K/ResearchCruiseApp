import {Cruise} from "../../CruisesPage/CruisesPage";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {Controller, set, UseFormReturn, useWatch} from "react-hook-form";
import ErrorCode from "../../CommonComponents/ErrorCode";
import {EditCruiseFormValues} from "../CruiseFormPage";
import {Time} from "../../FormPage/Inputs/TaskInput/TaskInput";

type Props = {
    editCruiseForm: UseFormReturn<EditCruiseFormValues>
}


export default function CruiseDate(props: Props) {
    const startWatch = useWatch({
        control: props.editCruiseForm.control,
        name: "date.start"
    })
    const endWatch = useWatch({
        control: props.editCruiseForm.control,
        name: "date.end"
    })

    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12 h-100">
            <Controller
                name="date"
                control={props.editCruiseForm.control}
                rules={{
                    validate: {
                        noEmptyDate: (value) => {
                            if (value.start == "" || value.end == "")
                                return "Wybierz czas rozpoczęcia i zakończenia"
                        },
                        startBeforeEnd: (value) => {
                            if (new Date(value.end) <= new Date(value.start)) {
                                return "Czas rozpoczęcia musi być wcześniejszy niż czas zakończenia"
                            }
                        }
                    }
                }}
                render={(field) => (
                    <>
                        <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center h-100 py-2">
                            <div className="d-flex col-12 justify-content-center mb-2">Czas rozpoczecia</div>
                            <DatePicker
                                className={"d-flex w-100 text-center border border-opacity-75 rounded-2 p-1"}
                                closeOnScroll={true}
                                showYearDropdown
                                showTimeSelect
                                locale="pl"
                                timeCaption="Godzina"
                                selected={startWatch ? new Date(startWatch) : null}
                                onChange={(selectedOption) => {
                                    const newValue: Time = {
                                        start: selectedOption ? new Date(selectedOption).toISOString() : "",
                                        end: endWatch
                                    }
                                    props.editCruiseForm.setValue(
                                        "date",
                                        newValue,
                                        { shouldDirty: true, shouldValidate: true, shouldTouch: true }
                                    );
                                }}
                                dateFormat="dd/MM/yyyy HH:mm"
                            />
                        </div>
                        <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center h-100 py-2">
                            <div className="d-flex col-12 justify-content-center mb-2">Czas zakończenia</div>
                            <DatePicker
                                className={"d-flex w-100 text-center border border-opacity-75 rounded-2 p-1"}
                                closeOnScroll={true}
                                showYearDropdown
                                showTimeSelect
                                locale="pl"
                                timeCaption="Godzina"
                                selected={endWatch ? new Date(endWatch) : null}
                                onChange={(selectedOption) => {
                                    const newValue: Time = {
                                        start: startWatch,
                                        end: selectedOption ? new Date(selectedOption).toISOString() : ""
                                    }
                                    props.editCruiseForm.setValue(
                                        "date",
                                        newValue,
                                        { shouldDirty: true, shouldValidate: true, shouldTouch: true }
                                    );
                                }}
                                dateFormat="dd/MM/yyyy HH:mm"
                            />
                        </div>
                    </>
                )}
            />
            {props.editCruiseForm?.formState.errors.date &&
                <ErrorCode code={props.editCruiseForm?.formState.errors.date.message} />
            }
        </div>
    )
}