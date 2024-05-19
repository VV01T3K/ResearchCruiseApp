import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import React, { useEffect, useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../LoginPage/ErrorCode";
import Select from "react-select";

import DatePicker  from 'react-datepicker';
import {Simulate} from "react-dom/test-utils";
import resize = Simulate.resize;
import {SpubTask} from "./SpubTasksInput";

export type DetailedPlan = {
    day:string, hours:string, taskName:string, region:string, position:string, notes:string
}

type Props = {
    className?: string,
    name: string,
    form?: UseFormReturn,
    required?: boolean,
    readonly?:boolean,
}


export default function DetailedPlanInput(props: Props){
    const disabled = props.form!.formState.errors[props.name]?.type =="noEmptyRowFields"
    let x = 7;

    return (
        <div className={props.className + " p-3"}>
            <Controller name={props.name}
                        control={props.form!.control}
                        defaultValue={[]}
                        rules = {{
                            required: true,
                            validate: {
                                noEmptyRowFields: (value: Action[]) => {
                                    if (value.some((row: Action) => {
                                        return Object
                                            .values(row)
                                            .some(rowField => !rowField)
                                    })
                                    )
                                        return "Wypełnij wszystkie pola"
                                },
                            }
                        }}
                        render={({ field}) => (
                            <>
                                {/*<Table>*/}
                                {/*    <Thead className={"bg-primary text-white text-center"}>*/}
                                {/*        <Tr >*/}
                                {/*            <Th className={"border-end"}>Dzień</Th>*/}
                                {/*            <Th className={"border-end"}>Liczba godzin</Th>*/}
                                {/*            <Th className={"border-end"}>Nazwa zadania</Th>*/}
                                {/*            <Th className={"border-end"}>Rejon</Th>*/}
                                {/*            <Th className={"border-end"}>Pozycja*</Th>*/}
                                {/*            <Th className={"border-end"}>Uwagi**</Th>*/}
                                {/*        </Tr>*/}
                                {/*    </Thead>*/}
                                {/*    <Tbody>*/}
                                {/*        {field.value.sort((a, b) => a.day - b.day).map((row , index: number) => (*/}
                                {/*        <Tr key={row}>*/}
                                {/*            <Td className={"text-center"}>{row.day}</Td>*/}
                                {/*            <Td><textarea onChange={props.form} rows={4} type={"text"} style={{resize: "none"}}*/}
                                {/*                          className={"w-100 h-100 flex-grow-0"}/></Td>*/}
                                {/*            <Td><textarea rows={4} type={"text"} style={{resize: "none"}}*/}
                                {/*                          className={"w-100 h-100 flex-grow-0"}/></Td>*/}
                                {/*            <Td><textarea rows={4} type={"text"} style={{resize: "none"}}*/}
                                {/*                          className={"w-100 h-100 flex-grow-0"}/></Td>*/}
                                {/*            <Td><textarea rows={4} type={"text"} style={{resize: "none"}}*/}
                                {/*                          className={"w-100 h-100 flex-grow-0"}/></Td>*/}
                                {/*            <Td><textarea rows={4} type={"text"} style={{resize: "none"}}*/}
                                {/*                          className={"w-100 h-100 flex-grow-0"}/></Td>*/}
                                {/*        </Tr>))*/}
                                {/*        }*/}
                                {/*    </Tbody>*/}
                                {/*</Table>*/}
                                <div className="table-striped w-100">
                                    <div className="text-white text-center bg-primary">
                                        <div className="d-flex flex-row center">
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "5%"}}>
                                                <b>Dzień</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "25%"}}>
                                                <b>Liczba godzin</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "25%"}}>
                                                <b>Nazwa zadania</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "40%"}}>
                                                <b>Rejon</b>
                                            </div>
                                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "5%"}} />

                                            <div className="d-flex justify-content-center d-xl-none p-2 col-12">
                                                <b>Pozycja*</b>
                                            </div>
                                            <div className="d-flex justify-content-center d-xl-none p-2 col-12">
                                                <b>Uwagi**</b>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<div className="w-100 bg-light">*/}
                                    {/*    {!field.value.length &&*/}
                                    {/*        <div className="d-flex flex-row justify-content-center bg-light p-2 border">*/}
                                    {/*            <div className="text-center">Nie dodano żadnego {props.actionName.toLowerCase()}u</div>*/}
                                    {/*        </div>*/}
                                    {/*    }*/}
                                    {/*    {field.value.map((row: Action, index: number) => (*/}
                                    {/*        <div key={index}*/}
                                    {/*             className="d-flex flex-wrap flex-row justify-content-center border bg-light"*/}
                                    {/*        >*/}
                                    {/*            <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"*/}
                                    {/*                 style={{width: windowWidth >= 1200 ? "5%" : "100%"}}*/}
                                    {/*            >*/}
                                    {/*                {index + 1}.*/}
                                    {/*            </div>*/}
                                    {/*            <div className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">*/}
                                    {/*                <b>{props.actionName} {index + 1}.</b>*/}
                                    {/*            </div>*/}

                                    {/*            <div className="d-flex flex-wrap justify-content-center align-items-center border-end p-2"*/}
                                    {/*                 style={{width: windowWidth >= 1200 ? "25%" : "100%"}}*/}
                                    {/*            >*/}
                                    {/*                <div className="col-12 d-flex d-xl-none justify-content-center">Od</div>*/}
                                    {/*                <DatePicker*/}
                                    {/*                    {...field}*/}
                                    {/*                    disabled={props.readonly ?? false}*/}

                                    {/*                    //  onBlur = {()=>{if(getFieldValue(field, index, item, t).startDate)field.onBlur()}}*/}
                                    {/*                    showMonthYearPicker*/}
                                    {/*                    showMonthYearDropdown*/}
                                    {/*                    className={"text-center w-100 rounded-1 p-1"}*/}
                                    {/*                    style={{fontSize: "inherit"}}*/}
                                    {/*                    selectsStart*/}
                                    {/*                    startDate={row.startDate ? new Date(row.startDate) : null}*/}
                                    {/*                    maxDate={row.endDate ? new Date(row.endDate) : null}*/}
                                    {/*                    endDate={row.endDate ? new Date(row.endDate) : null}*/}
                                    {/*                    locale={"pl"}*/}
                                    {/*                    showTimeSelect*/}
                                    {/*                    selected={row.startDate ? new Date(row.startDate) : null}*/}
                                    {/*                    onChange={(e: Date)=> {*/}
                                    {/*                        if (e != null) {*/}
                                    {/*                            const tmp = row;*/}
                                    {/*                            tmp["startDate"] = e.toString();*/}
                                    {/*                            props.form!.setValue(*/}
                                    {/*                                props.name,*/}
                                    {/*                                field.value,*/}
                                    {/*                                {*/}
                                    {/*                                    shouldTouch: true,*/}
                                    {/*                                    shouldValidate: true,*/}
                                    {/*                                    shouldDirty: true*/}
                                    {/*                                }*/}
                                    {/*                            )*/}
                                    {/*                            // handleChange(field, row, rowIndex, valIdx, tmp)*/}
                                    {/*                        }*/}
                                    {/*                    }}*/}
                                    {/*                    // getPopupContainer={trigger => trigger.parentElement}*/}
                                    {/*                    dateFormat="dd/MM/yyyy HH:mm"*/}
                                    {/*                />*/}
                                    {/*            </div>*/}
                                    {/*            <div className="d-flex flex-wrap ustify-content-center align-items-center p-2 border-end"*/}
                                    {/*                 style={{width: windowWidth >= 1200 ? "25%" : "100%"}}*/}
                                    {/*            >*/}
                                    {/*                <div className="col-12 d-flex d-xl-none justify-content-center">Do</div>*/}
                                    {/*                <DatePicker*/}
                                    {/*                    {...field}*/}
                                    {/*                    disabled={props.readonly ?? false}*/}
                                    {/*                    // onBlur = {()=>{if(getFieldValue(field, index, item, t).endDate)field.onBlur()}}*/}
                                    {/*                    showYearDropdown*/}
                                    {/*                    showTimeSelect*/}
                                    {/*                    className={"text-center w-100 rounded-1 p-1"}*/}
                                    {/*                    style={{fontSize: "inherit"}}*/}
                                    {/*                    startDate={row.startDate ? new Date(row.startDate) : null}*/}
                                    {/*                    endDate={row.endDate ? new Date(row.endDate) : null}*/}
                                    {/*                    minDate={row.startDate ? new Date(row.startDate) : null}*/}
                                    {/*                    selectsEnd*/}
                                    {/*                    locale={"pl"}*/}
                                    {/*                    selected={row.endDate ? new Date(row.endDate) : null}*/}
                                    {/*                    onChange={(e: Date)=> {*/}
                                    {/*                        if (e != null) {*/}
                                    {/*                            const tmp = row;*/}
                                    {/*                            tmp["endDate"] = e.toString();*/}
                                    {/*                            props.form!.setValue(*/}
                                    {/*                                props.name,*/}
                                    {/*                                field.value,*/}
                                    {/*                                {*/}
                                    {/*                                    shouldTouch: true,*/}
                                    {/*                                    shouldValidate: true,*/}
                                    {/*                                    shouldDirty: true*/}
                                    {/*                                }*/}
                                    {/*                            )*/}
                                    {/*                        }*/}
                                    {/*                    }}*/}
                                    {/*                    // getPopupContainer={trigger => trigger.parentElement}*/}
                                    {/*                    dateFormat="dd/MM/yyyy HH:mm"*/}
                                    {/*                />*/}
                                    {/*            </div>*/}
                                    {/*            <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"*/}
                                    {/*                 style={{width: windowWidth >= 1200 ? "40%" : "100%"}}*/}
                                    {/*            >*/}
                                    {/*                <div className="col-12 d-flex d-xl-none justify-content-center">Nazwa {props.actionName.toLowerCase()}u</div>*/}
                                    {/*                <textarea*/}
                                    {/*                    {...field}*/}
                                    {/*                    disabled={props.readonly ?? false}*/}
                                    {/*                    value={row.name}*/}
                                    {/*                    onChange = {(e)=> {*/}
                                    {/*                        row.name = e.target.value*/}
                                    {/*                        props.form?.setValue(*/}
                                    {/*                            props.name,*/}
                                    {/*                            field.value,*/}
                                    {/*                            {*/}
                                    {/*                                shouldTouch: true,*/}
                                    {/*                                shouldValidate: true,*/}
                                    {/*                                shouldDirty: true*/}
                                    {/*                            }*/}
                                    {/*                        )*/}
                                    {/*                        field.onChange(field.value)*/}
                                    {/*                    }}*/}
                                    {/*                    className="col-12 p-1 form-control"*/}
                                    {/*                    style={{fontSize: "inherit", resize:"none"}}*/}
                                    {/*                    rows={2}*/}

                                    {/*                />*/}
                                    {/*            </div>*/}
                                    {/*            <div className="d-flex justify-content-center align-items-center p-2"*/}
                                    {/*                 style={{width: windowWidth >= 1200 ? "5%" : "100%"}}*/}
                                    {/*            >*/}
                                    {/*                <button type="button"*/}
                                    {/*                        style={{fontSize:"inherit"}}*/}
                                    {/*                        className={`btn btn-info ${props.readonly ? 'd-none':''}`}*/}
                                    {/*                        onClick={() => {*/}
                                    {/*                            const val: Action[] = field.value;*/}

                                    {/*                            val.splice(index, 1)*/}
                                    {/*                            props.form!.setValue(*/}
                                    {/*                                props.name,*/}
                                    {/*                                val,*/}
                                    {/*                                {*/}
                                    {/*                                    shouldValidate: true,*/}
                                    {/*                                    shouldDirty: true,*/}
                                    {/*                                    shouldTouch: true*/}
                                    {/*                                }*/}
                                    {/*                            )*/}
                                    {/*                        }}*/}
                                    {/*                >*/}
                                    {/*                    -*/}
                                    {/*                </button>*/}
                                    {/*            </div>*/}
                                    {/*        </div>*/}
                                    {/*    ))}*/}
                                    {/*</div>*/}
                                </div>

                                <div className={`d-flex flex-row flex-wrap justify-content-center w-100 ${props.readonly ? 'd-none':''}`}>
                                    <Select
                                        minMenuHeight={300}
                                        className="d-flex col-12  text-start pt-1 pb-2 pt-xl-2 ps-xl-2 pb-xl-2"
                                        isDisabled={disabled}
                                        menuPlacement="auto"
                                        placeholder="Wybierz dzień"
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
                                            Array.from({length: x}, (v, k) => k + 1).map(value => ({ label: `Dzień: ${value}`, value: value }))
                                        }
                                        value={""}
                                        onChange={(selectedOption: { label: string, value: DetailedPlan })=> {
                                            if (selectedOption) {
                                                const newRow = {day:selectedOption.value, hours:"", taskName:"", region:"", position:"", notes:""}
                                                props.form!.setValue(
                                                    props.name,
                                                    [...field.value, ],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                        shouldTouch: true
                                                    }
                                                )
                                                field.onChange([...field.value, newRow])
                                            }
                                        }}
                                    />
                                    {props.form!.formState.errors[props.name] &&
                                        <ErrorCode code={props.form!.formState.errors[props.name].message} />
                                    }
                                *lub poligon zdefiniowany pozycjami
                                <br/>
                                **(np. konkretna pora dnia kiedy zadanie planowane jest do realizacji)
                                </div>
                            </>

                        )}
            />
        </div>
    )
}
