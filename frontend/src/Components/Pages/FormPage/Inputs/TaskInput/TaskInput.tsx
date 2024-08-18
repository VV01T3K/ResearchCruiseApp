import React, {useEffect, useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../DateInput.css'
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);
import 'react-dropdown/style.css';
import {ButtonGroup, Dropdown} from "react-bootstrap";
import Style from "./TaskInput.module.css";
import Select from "react-select";
import ErrorCode from "../../../CommonComponents/ErrorCode";
import useWindowWidth from "../../../../CommonComponents/useWindowWidth";


export type Time = {
    start: string,
    end: string
}

export type TaskValues =
    { author: string, title: string } |
    { title: string, institution: string, date: string} |
    { title: string, time: Time, financingAmount: number } |
    { description: string }

type TaskValuesValue =
    string |
    number |
    Time

export type Task = {
    type: number,
    values: TaskValues
}

type Props = {
    className: string,
    label:string,
    form?: UseFormReturn,
    name: string,
    historicalTasks: any,
    readonly? : boolean
}


export const taskFieldsOptions= {
    'Praca licencjacka': ["Autor", "Tytuł" ],
    'Praca magisterska': ["Autor", "Tytuł" ],
    'Praca doktorska': ["Autor", "Tytuł" ],
    "Przygotowanie projektu naukowego": ["Tytuł", "Instytucja, do której składany", "Przewidywany termin składania"],
    "Realizacja projektu krajowego (NCN, NCBiR, itp.)": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
    "Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
    "Realizacja projektu wewnętrznego UG": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
    "Realizacja innego projektu naukowego":["Tytuł", "Ramy czasowe", "Kwota finansowania"],
    "Realizacja projektu komercyjnego": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
    "Dydaktyka": ["Opis zajęcia dydaktycznego"],
    "Realizacja własnego zadania badawczego": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
    "Inne zadanie": ["Opis zadania"]
}


function TaskInput(props: Props) {
    const defaultValues: TaskValues[] = [
        { author: "", title: "" },
        { author: "", title: ""},
        { author: "", title: ""},
        { title: "", institution: "", date: ""},
        { title: "", time: { start: "", end: ""}, financingAmount: 0 },
        { title: "", time: { start: "", end: ""}, financingAmount: 0 },
        { title: "", time: { start: "", end: "" }, financingAmount: 0 },
        { title: "", time: { start: "", end: "" }, financingAmount: 0 },
        { title: "", time: { start: "", end: "" }, financingAmount: 0 },
        { description: "" },
        { title: "", time: { start: "", end: "" }, financingAmount: 0 },
        { description: "" },
    ]

    const selectOptions = () => {
        const values = Object.values(props.historicalTasks).map((key) => {
            const options2 = {month: '2-digit', year: 'numeric'}
            const values = key.values
            const type = key.type
            const string = (values.author ? ("Autor: " + values.author + ", ") : "")
                + (values.title ? ("Tytuł: " + values.title + ", ") : "")
                + (values.institution ? ("Instytucja: " + values.institution + ", ") : "")
                + (values.date ? ("Data: " + new Date(values.date).toLocaleDateString('pl-PL') + ", ") : "")
                + (values.time ? ("Od: " + new Date(values.time.startDate).toLocaleDateString('pl-PL', options2) + " do: " + new Date(values.time.endDate).toLocaleDateString('pl-PL', options2) + ", ") : "")
                + (values.financingAmount ? ("Kwota: " + values.financingAmount + " zł, ") : "")
                + (values.description ? ("Opis: " + values.description + ", ") : "")

            return {type:type, label: string, value: key}
        })
        var selectOptions:Array<{label:string, options:object}> = []
        Object.keys(taskFieldsOptions)
            .forEach((value, index)=>{

            selectOptions = [...selectOptions, {label:value,options:values.filter(item => item.type == index).map(item=>{return{label: item.label, value: item.value}})}]


        })
        return selectOptions
    }

    const handleChange = (
        field: { value: Array<{values: any}> },
        row: Task,
        rowIndex: number,
        valIndex: number,
        newValue: string | Time
    ) => {
        field.value[rowIndex].values[Object.keys(row.values)[valIndex]] = newValue
        props.form!.setValue(
            props.name,
            field.value,
            {
                shouldTouch: true,
                shouldValidate: true,
                shouldDirty: true
            }
        )
    }

    const getTaskTitle = (task: Task) => {
        return Object.keys(taskFieldsOptions)[task.type]
    }

    const getFields = (task: Task) => {
        return Object.values(task.values)
    }

    const requiredMsg = "Dodaj przynajmniej jedno zadanie"
    const disabled = props.form?.formState.errors[props.name] && props.form?.formState.errors[props.name]?.message != requiredMsg

    const windowWidth = useWindowWidth()

    return (
        <div className={props.className + " p-3"}>
            <Controller
                name={props.name}
                control={props.form!.control}
                defaultValue={[]}
                rules = {{
                    required: requiredMsg,
                    validate: {
                        notEmptyArray: (value) => {
                            if (value.some((val: { values: object }) => {
                                return Object
                                    .values(val.values)
                                    .some((x)=> {
                                        if (typeof x === 'string' && x.trim() === '') {
                                            return true;
                                        }
                                        else if (typeof x === 'object' && x !== null) {
                                            if (Object
                                                .values(x)
                                                .some(y => y == '')
                                            )
                                                return true
                                        }

                                        return false;
                                    })
                            }))
                                return"Wypełnij wszystkie pola"
                        }
                    }
                }}
                render={({ field}) => (
                    <>
                        <div className="table-striped w-100">
                            <div className="text-white text-center bg-primary">
                                <div className="d-flex flex-row center align-items-center">
                                    <div className="text-center d-none d-xl-block border-end p-2" style={{width: "5%"}}>
                                        <b>Lp.</b>
                                    </div>
                                    <div className="text-center d-none d-xl-block border-end p-2" style={{width: "20%"}}>
                                        <b>Zadanie</b>
                                    </div>
                                    <div className="text-center d-none d-xl-block border-end p-2" style={{width: "70%"}}>
                                        <b>Szczegóły</b>
                                    </div>
                                    <div className="text-center d-none d-xl-block p-2" style={{width: "5%"}} />

                                    <div className="text-center d-lg-block d-xl-none p-2 col-12">
                                        <b>Zadania</b>
                                    </div>
                                </div>
                            </div>
                            <div className={"w-100"}>
                                {!field.value.length &&
                                    <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                                        <div className="text-center">Nie wybrano żadnego zadania</div>
                                    </div>
                                }
                                {field.value && field.value.map((row: Task, rowIndex: number) => (
                                    <div key={rowIndex} className="d-flex flex-wrap border bg-light">
                                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                             style={{width: "5%"}}
                                        >
                                            {rowIndex + 1}.
                                        </div>
                                        <div className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                            <b>Zadanie {rowIndex + 1}.</b>
                                        </div>

                                        <div className="text-center align-items-center justify-content-center p-2 d-inline-flex border-end"
                                             style={{width: windowWidth >= 1200 ? "20%" : "100%"}}
                                        >
                                            {getTaskTitle(row)}
                                        </div>
                                        <div className="text-center d-flex border-end"
                                             style={{width: windowWidth >= 1200 ? "70%" : "100%"}}
                                        >
                                            <div className="d-flex flex-wrap justify-content-center justify-content-xl-start pb-3 w-100">
                                                {getFields(row).map((val: TaskValuesValue, valIdx: number) => {
                                                    return (
                                                        <div key={valIdx}
                                                             className={`${getFields(row).length == 2 && "col-xl-6"} ${getFields(row).length == 3 && "col-xl-4"} col-12 p-1`}
                                                        >
                                                            <label className={"d-flex justify-content-center align-items-center"}>
                                                                {Object.values(taskFieldsOptions)[row.type][valIdx]}
                                                            </label>
                                                            {(()=> {
                                                                switch (Object.values(taskFieldsOptions)[row.type][valIdx]) {
                                                                    case "Autor":
                                                                    case "Tytuł":
                                                                        return (
                                                                            <input
                                                                                className="w-100 form-control p-1 bg-light"
                                                                                style={{fontSize: "inherit"}}
                                                                                {...field}
                                                                                disabled={props.readonly ?? false}

                                                                                value={val as string}
                                                                                onChange={(e)=> {
                                                                                    handleChange(field, row, rowIndex, valIdx, e.target.value)
                                                                                }}
                                                                            />
                                                                        )
                                                                    case "Instytucja, do której składany":
                                                                    case "Opis zajęcia dydaktycznego":
                                                                    case "Opis zadania":
                                                                        return (
                                                                            <textarea
                                                                                className="w-100 form-control p-1 bg-light"
                                                                                style={{height: "100px", fontSize: "inherit"}}
                                                                                {...field}
                                                                                disabled={props.readonly ?? false}

                                                                                value={val as string}
                                                                                onChange={(e)=> {
                                                                                    handleChange(field, row, rowIndex, valIdx, e.target.value)
                                                                                }}
                                                                            />
                                                                        )
                                                                    case "Przewidywany termin składania":
                                                                        return (
                                                                            <DatePicker
                                                                                {...field}
                                                                                disabled={props.readonly ?? false}

                                                                                className={"text-center w-100 border border-opacity-75 rounded-2 p-1"}
                                                                                closeOnScroll={true}
                                                                                locale={"pl"}
                                                                                selected={val ? new Date(val as string) : null}
                                                                                onChange={(e: Date)=>{
                                                                                    handleChange(field, row, rowIndex, valIdx, e.toISOString())
                                                                                }}
                                                                                // getPopupContainer={trigger => trigger.parentElement}
                                                                                dateFormat="dd/MM/yyyy"
                                                                                // placeholderText={props.label}
                                                                            />
                                                                        )
                                                                    case "Ramy czasowe":
                                                                        return (
                                                                            <>
                                                                                <DatePicker
                                                                                    {...field}
                                                                                    disabled={props.readonly ?? false}

                                                                                    //  onBlur = {()=>{if(getFieldValue(field, index, item, t).startDate)field.onBlur()}}
                                                                                    showMonthYearPicker
                                                                                    showMonthYearDropdown
                                                                                    className={"text-center w-100 border border-opacity-75 rounded-2 p-1 bg-light"}
                                                                                    startDate={(val as Time).start ? new Date((val as Time).start) : null}
                                                                                    maxDate={(val as Time).end ? new Date((val as Time).end) : null}
                                                                                    endDate={(val as Time).end ? new Date((val as Time).end) : null}
                                                                                    locale={"pl"}
                                                                                    selected={(val as Time).start ? new Date((val as Time).start) : null}
                                                                                    onChange={(e: Date)=> {
                                                                                        if (e != null) {
                                                                                            const tmp = val as Time;
                                                                                            tmp["start"] = e.toISOString();
                                                                                            handleChange(field, row, rowIndex, valIdx, tmp)
                                                                                        }
                                                                                    }}
                                                                                    // getPopupContainer={trigger => trigger.parentElement}
                                                                                    dateFormat="dd/MM/yyyy"
                                                                                />
                                                                                <DatePicker
                                                                                    {...field}
                                                                                    disabled={props.readonly ?? false}
                                                                                    // onBlur = {()=>{if(getFieldValue(field, index, item, t).endDate)field.onBlur()}}
                                                                                    showYearDropdown
                                                                                    showMonthYearPicker
                                                                                    className={"text-center w-100 border border-opacity-75 rounded-2 p-1 bg-light"}
                                                                                    startDate={(val as Time).start ? new Date((val as Time).start) : null}
                                                                                    endDate={(val as Time).end ? new Date((val as Time).end) : null}
                                                                                    minDate={(val as Time).start ? new Date((val as Time).start) : null}
                                                                                    selectsEnd
                                                                                    locale={"pl"}
                                                                                    selected={(val as Time).end ? new Date((val as Time).end) : null}
                                                                                    onChange={(e: Date)=> {
                                                                                        if (e != null) {
                                                                                            const tmp = val as Time;
                                                                                            tmp["end"] = e.toISOString();
                                                                                            handleChange(field, row, rowIndex, valIdx, tmp)
                                                                                        }
                                                                                    }}
                                                                                    // getPopupContainer={trigger => trigger.parentElement}
                                                                                    dateFormat="dd/MM/yyyy"
                                                                                />
                                                                            </>
                                                                        )
                                                                    case "Kwota finansowania":
                                                                        return (
                                                                            <input
                                                                                {...field}
                                                                                type="text" // Zmieniamy typ na text
                                                                                className="text-center placeholder-glow w-100 form-control p-1 bg-light"
                                                                                style={{font: "inherit"}}
                                                                                value={val as string}
                                                                                onChange={ (e) =>  handleChange(field, row, rowIndex, valIdx, e.target.value)}
                                                                                onBlur ={(e) => {
                                                                                    const { value } = e.target;
                                                                                    const sanitizedValue = parseFloat(value);
                                                                                    if (!isNaN(sanitizedValue)) {
                                                                                        handleChange(field, row, rowIndex, valIdx, sanitizedValue.toFixed(2).toString())
                                                                                    } else {
                                                                                        handleChange(field, row, rowIndex, valIdx, "0.00")
                                                                                    }
                                                                                }}
                                                                                placeholder="0"
                                                                            />
                                                                        )
                                                                }
                                                            })()}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center p-2"
                                             style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                        >
                                            <div className={"align-items-center justify-content-center d-flex"}>
                                                <button type="button"
                                                        className={`${props.readonly ? "d-none" : ""} btn btn-info`}
                                                        style={{fontSize: "inherit"}}
                                                        onClick={() => {
                                                            const val = field.value;
                                                            val.splice(rowIndex, 1)
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
                                    </div>
                                ))}
                            </div>

                            <div className={`d-flex flex-row flex-wrap justify-content-center w-100 ${props.readonly ? "d-none" : ""}`}>
                                <div className="d-flex col-12 col-xl-6 text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                                    <ButtonGroup
                                        as={Dropdown}
                                        className={"w-100 h-100 align-self-center" + Style.centeredDropdown}
                                    >
                                        <Dropdown.Toggle
                                            disabled={disabled}
                                            variant="info"
                                            style={{ fontSize: "inherit" }}
                                        >
                                            Dodaj nowe
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {Object.keys(taskFieldsOptions).map((key, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    onClick={() => {
                                                        const newTask: Task = {
                                                            type: index,
                                                            values: defaultValues[index]
                                                        }
                                                        props.form!.setValue(
                                                            props.name,
                                                            [...field.value, newTask],
                                                            {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                                shouldTouch: true
                                                            }
                                                        )
                                                    }}
                                                >
                                                    {key}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </ButtonGroup>
                                </div>
                                <Select
                                    minMenuHeight={300}
                                    className="d-flex col-12 col-xl-6 text-start pt-1 pb-2 pt-xl-2 ps-xl-2 pb-xl-2 "
                                    isDisabled={disabled}
                                    menuPlacement="auto"
                                    placeholder="Dodaj z historii"
                                    styles={{
                                        control: (provided, state)=> ({
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
                                    options ={selectOptions()}
                                    value={""}
                                    onChange={(selectedOption: { label: any, value: any })=> {
                                        props.form!.setValue(
                                            props.name,
                                            [...field.value,selectedOption.value],
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                                shouldTouch: true
                                            }
                                        )
                                        // field.onChange([...field.value,selectedOption.value])
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            />
            {props.form!.formState.errors[props.name] &&
                <ErrorCode code={props.form!.formState.errors[props.name]!.message} />
            }
        </div>
    )
}


export default TaskInput