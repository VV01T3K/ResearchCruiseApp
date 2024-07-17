import React, { useEffect, useState} from "react";
import {Controller, ControllerRenderProps, FieldValues, get, useFieldArray, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../CommonComponents/ErrorCode";
import Select from "react-select";
import {prop} from "react-data-table-component/dist/DataTable/util";


export type SpubTask = {
    yearFrom: string,
    yearTo: string,
    name: string
}

type Props = {
    className: string,
    name: string,
    form?: UseFormReturn,
    historicalSpubTasks: SpubTask[],
    required: boolean,
    readonly?:boolean
}


export default function SpubTasksInput(props: Props){
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(
        () => {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        },
        []
    );

    const disabled = props.form!.formState.errors[props.name] != undefined
    const minYear = 1900
    const maxYear = 2100


    const onYearChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        row: SpubTask,
        setYearFrom: boolean,
        field: ControllerRenderProps<FieldValues, string>
    ) => {
        const re = /^[0-9\b]+$/;

        if (re.test(e.target.value)) {
            let newRowFieldValueInt = parseInt(e.target.value)
            const newRowFieldValue = String(
                // We cannot check if newRowFieldValueInt >= minYear because first it will be 1 digit, then 2 digits and so on,
                // so first it will be certainly "newRowFieldValueInt < minYear". This is however checked in onBlur method
                newRowFieldValueInt > maxYear ? maxYear : newRowFieldValueInt
            )
            newRowFieldValueInt = parseInt(newRowFieldValue)

            if (setYearFrom) {
                if (newRowFieldValueInt <= parseInt(row.yearTo))
                    row.yearFrom = newRowFieldValue
                else
                    row.yearFrom = row.yearTo
            }
            else { // set yearTo
                // Cannot check "if newRowFieldValueInt >= yearFrom" because first it will be 1 digit, then 2 digits and so on,
                // so first it will be certainly "newRowFieldValueInt < yearFrom". This is however checked in onBlur method
                row.yearTo = newRowFieldValue
            }
        }
        else {
            if (setYearFrom)
                row.yearFrom = row.yearTo
            else
                row.yearTo = row.yearFrom
        }

        props.form!.setValue(
            props.name,
            field.value,
            {
                shouldTouch: true,
                shouldValidate: true,
                shouldDirty: true
            }
        )
        field.onChange(field.value)
    }
    const onYearBlur = (
        e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement, globalThis.MouseEvent>,
        row: SpubTask,
        setYearFrom: boolean,
        field: ControllerRenderProps<FieldValues, string>
    ) => {
        let newRowFieldValueInt = parseInt(e.currentTarget.value)
        let newRowFieldValue = String(newRowFieldValueInt)
        let yearIsChanged = false

        // We know that newRowFieldValueInt <= maxYear since it was checked in onChange method.
        // And now we can check if newRowFieldValueInt >= minYear
        if (newRowFieldValueInt < minYear) {
            newRowFieldValueInt = minYear
            newRowFieldValue = String(newRowFieldValueInt)
            yearIsChanged = true
        }

        if (setYearFrom) {
            if (yearIsChanged)
                row.yearFrom = newRowFieldValue
        }
        else { // set yearTo
            // Now we can check it. We could not do so in onChange method
            if (newRowFieldValueInt < parseInt(row.yearFrom)) {
                row.yearTo = row.yearFrom
                yearIsChanged = true
            }
        }

        if (yearIsChanged) {
            props.form!.setValue(
                props.name,
                field.value,
                {
                    shouldTouch: true,
                    shouldValidate: true,
                    shouldDirty: true
                }
            )
            field.onChange(field.value)
        }
    }

    return (
        <div className={props.className + " p-3"}>
            <Controller name={props.name}
                        control={props.form!.control}
                        defaultValue={[]}
                        rules = {{
                            required: false,
                            validate: {
                                noEmptyRowFields: (value: SpubTask[]) => {
                                    if (value.some((row: SpubTask) => {
                                        return Object
                                            .values(row)
                                            .some(rowField => !rowField)
                                        })
                                    )
                                        return "Wypełnij wszystkie pola"
                                }
                            }
                        }}
                        render={({ field}) => (
                            <>
                                <div className="table-striped w-100">
                                    <div className="text-white text-center bg-primary">
                                        <div className="d-flex flex-row center">
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "5%"}}>
                                                <b>Lp.</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "15%"}}>
                                                <b>Rok rozpoczęcia</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "15%"}}>
                                                <b>Rok zakończenia</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "60%"}}>
                                                <b>Nazwa zadania</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "5%"}} />

                                            <div className="d-flex justify-content-center d-xl-none p-2 col-12">
                                                <b>Zadania</b>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-100 bg-light">
                                        {!field.value.length &&
                                            <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                                                <div className="text-center">Nie dodano żadnego zadania</div>
                                            </div>
                                        }
                                        {field.value.map((row: SpubTask, index: number) => (
                                            <div key={index}
                                                 className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                                            >
                                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                     style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                                >
                                                    {index + 1}.
                                                </div>
                                                <div className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                                    <b>Zadanie {index + 1}.</b>
                                                </div>

                                                <div className="d-flex flex-wrap justify-content-center align-items-center border-end p-2"
                                                     style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                                                >
                                                    <div className="col-12 d-flex d-xl-none justify-content-center">Rok rozpoczęcia</div>
                                                    <input
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        value={row.yearFrom}
                                                        onChange={(e) => {
                                                            onYearChange(e, row, true,  field)
                                                        }}
                                                        onBlur={(e) => {
                                                            onYearBlur(e, row, true, field)
                                                        }}
                                                        type="number"
                                                        min="1900"
                                                        max="2100"
                                                        className="col-12 p-1 form-control"
                                                        style={{fontSize: "inherit"}}
                                                    />
                                                </div>
                                                <div className="d-flex flex-wrap ustify-content-center align-items-center p-2 border-end"
                                                     style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                                                >
                                                    <div className="col-12 d-flex d-xl-none justify-content-center">Rok zakończenia</div>
                                                    <input
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        value={row.yearTo}
                                                        onChange={(e) => {
                                                            onYearChange(e, row, false,  field)
                                                        }}
                                                        onBlur={(e) => {
                                                            onYearBlur(e, row, false, field)
                                                        }}
                                                        onMouseUp={(e) => {
                                                            onYearBlur(e, row, false, field)
                                                        }}
                                                        type="number"
                                                        min="1900"
                                                        max="2100"
                                                        className="col-12 p-1 form-control"
                                                        style={{fontSize: "inherit"}}
                                                    />
                                                </div>
                                                <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                     style={{width: windowWidth >= 1200 ? "60%" : "100%"}}
                                                >
                                                    <div className="col-12 d-flex d-xl-none justify-content-center">Nazwa</div>
                                                    <textarea
                                                        {...field}
                                                        disabled={props.readonly ?? false}
                                                        value={row.name}
                                                        onChange = {(e)=> {
                                                            row.name = e.target.value
                                                            props.form?.setValue(
                                                                props.name,
                                                                field.value,
                                                                {
                                                                    shouldTouch: true,
                                                                    shouldValidate: true,
                                                                    shouldDirty: true
                                                                }
                                                            )
                                                            field.onChange(field.value)
                                                        }}
                                                        className="col-12 p-1 form-control"
                                                        style={{fontSize: "inherit"}}
                                                        rows={1}
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center p-2"
                                                     style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                                >
                                                    <button type="button"
                                                            style={{fontSize:"inherit"}}
                                                            className={`btn btn-info ${props.readonly ? 'd-none':''}`}
                                                            onClick={() => {
                                                                const val: SpubTask[] = field.value;

                                                                val.splice(index, 1)
                                                                props.form!.setValue(
                                                                    props.name,
                                                                    val,
                                                                    {
                                                                        shouldValidate: true,
                                                                        shouldDirty: true,
                                                                        shouldTouch: true
                                                                    }
                                                                )
                                                            }}
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`d-flex flex-row flex-wrap justify-content-center w-100 ${props.readonly ? 'd-none':''}`}>
                                    <div className="d-flex col-12 col-xl-6 text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                                        <button
                                            style={{fontSize: "inherit"}}
                                            className={`btn btn-info w-100
                                                ${ disabled ? "disabled" : ""}`
                                            }
                                            type="button"
                                            onClick={() => {
                                                const newSpubTask: SpubTask = {
                                                    yearFrom: `${new Date().getFullYear()}`,
                                                    yearTo: `${new Date().getFullYear()}`,
                                                    name: ""
                                                }
                                                props.form!.setValue(
                                                    props.name,
                                                    [...field.value, newSpubTask],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true
                                                    }
                                                )
                                                field.onChange([...field.value, newSpubTask])
                                            }}
                                        >
                                            Dodaj nowe
                                        </button>
                                    </div>
                                    <Select
                                        minMenuHeight={300}
                                        className="d-flex col-12 col-xl-6 text-start pt-1 pb-2 pt-xl-2 ps-xl-2 pb-xl-2"
                                        isDisabled={disabled}
                                        menuPlacement="auto"
                                        placeholder="Dodaj z historii"
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                boxShadow: "none",
                                                border: "1px solid grey",
                                                width: "100%",
                                                cursor: "pointer"
                                            }),
                                            placeholder: (provided: any) => ({
                                                ...provided,
                                                textAlign: "center"
                                            }),
                                            input: (provided: any) => ({
                                                ...provided
                                            }),
                                            menu: provided => ({
                                                ...provided,
                                                zIndex: 9999
                                            })
                                        }}
                                        options ={
                                            props.historicalSpubTasks.map((spubTask: SpubTask) => ({
                                                label: `${spubTask.name} (${spubTask.yearFrom}–${spubTask.yearTo})`,
                                                value: spubTask
                                            }))
                                        }
                                        value={""}
                                        onChange={(selectedOption: { label: string, value: SpubTask })=> {
                                            if (selectedOption) {
                                                props.form!.setValue(
                                                    props.name,
                                                    [...field.value, selectedOption.value],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                        shouldTouch: true
                                                    }
                                                )
                                                field.onChange([...field.value, selectedOption.value])
                                            }
                                        }}
                                    />
                                    {props.form!.formState.errors[props.name] &&
                                        <ErrorCode code={props.form!.formState.errors[props.name].message} />
                                    }
                                </div>
                            </>
                        )}
            />
        </div>
    )
}
