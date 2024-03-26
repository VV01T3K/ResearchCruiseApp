import React, {useEffect, useRef, useState} from "react";
import {Controller, get, useFieldArray} from "react-hook-form";
import ErrorCode from "../../LoginPage/ErrorCode";
import {register} from "../../../serviceWorkerRegistration";
import Select from "react-select";
import {administrationUnits} from "../../../resources/administrationUnits";
import {ButtonGroup, Dropdown} from "react-bootstrap";
import Style from "./TaskInput/TaskInput.module.css";
import InputWrapper from "./InputWrapper";


type SpubTask = {
    yearFrom: string,
    yearTo: string,
    name: string
}

type Props = {
    className: string,
    name: string,
    form?,
    historicalSpubTasks: SpubTask[]
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

    const requiredMsg = "Dodaj przynajmniej jedno zadanie"
    const disabled = props.form.formState.errors[props.name] && props.form.formState.errors[props.name].message != requiredMsg

    return (
        <div className={props.className + " p-3"}>
            <Controller name={props.name}  control={props.form!.control}
                        defaultValue={[]}
                        rules = {{ required:requiredMsg,validate: {
                                notEmptyArray:(value)=>{
                                    if(
                                        value.some((val)=> {
                                            console.log(Object.values(val))
                                            return Object.values(Object.values(val)).some((x)=> !x)
                                        }))
                                        return"Wypełnij wszystkie pola"}}}}
                        render={({field})=>(
                            <>
            <div className="table-striped w-100">
                <div className="text-white text-center" style={{"backgroundColor": "#052d73"}}>
                    <div className="d-flex flex-row center">
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                             style={{width: "5%"}}
                        >
                            <b>Lp.</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                             style={{width: "15%"}}
                        >
                            <b>Rok rozpoczęcia</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                             style={{width: "15%"}}
                        >
                            <b>Rok zakończenia</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                             style={{width: "60%"}}
                        >
                            <b>Nazwa zadania</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2"
                             style={{width: "5%"}}
                        />

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
                    {field.value.map((item, index) => (
                        <div key={item.id}
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
                                                <input {...field}
                                                       value={field.value[index].yearFrom}
                                                       onChange = {(e)=>{
                                                           var newField = field.value
                                                           newField[index].yearFrom = e.target.value
                                                        props.form.setValue(props.name, newField, {shouldTouch:true, shouldValidate:true, shouldDirty:true})
                                                        field.onChange(newField)
                                                    }}
                                                       type="number"
                                                       min="1900"
                                                       max="2100"
                                                       className="col-12 p-1"
                                                />
                            </div>
                            <div className="d-flex flex-wrap ustify-content-center align-items-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                            >
                                <div className="col-12 d-flex d-xl-none justify-content-center">Rok zakończenia</div>
                                                <input {...field}
                                                       value={field.value[index].yearTo}
                                                       onChange = {(e)=>{
                                                           var newField = field.value
                                                           newField[index].yearTo = e.target.value
                                                           props.form.setValue(props.name, newField, {shouldTouch:true, shouldValidate:true, shouldDirty:true})
                                                           field.onChange(newField)
                                                       }}
                                                       type="number"
                                                       min="1900"
                                                       max="2100"
                                                       className="col-12 p-1"
                                                />
                            </div>
                            <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "60%" : "100%"}}
                            >
                                <div className="col-12 d-flex d-xl-none justify-content-center">Nazwa</div>
                                                <textarea {...field}
                                                            value={field.value[index].name}
                                                          onChange = {(e)=>{
                                                              var newField = field.value
                                                              newField[index].name = e.target.value
                                                              props.form.setValue(props.name, newField, {shouldTouch:true, shouldValidate:true, shouldDirty:true})
                                                              field.onChange(newField)
                                                          }}
                                                          className="col-12"
                                                          rows={1}
                                                />
                            </div>
                            <div className="d-flex justify-content-center align-items-center p-2"
                                 style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                            >
                                <button type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            const val = field.value;
                                            val.splice(index,1)
                                            props.form.setValue(props.name, val, {shouldValidate:true, shouldDirty:true, shouldTouched:true})
                                        }}
                                >
                                    -
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="d-flex flex-row flex-wrap justify-content-center w-100">
                <div className="d-flex col-12 col-xl-6 text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2
                                justify-content-center"
                >
                    <button
                        className={`btn btn-primary w-100
                            ${ disabled ? "disabled" : ""}`
                        }
                        type="button"
                        onClick={() => {
                            const newSpubTask: SpubTask = {
                                yearFrom: `${new Date().getFullYear()}`,
                                yearTo: `${new Date().getFullYear()}`,
                                name: ""
                            }
                            props.form.setValue(props.name, [...field.value,newSpubTask], {shouldValidate:true, shouldDirty:true, shouldTouched:true})
                            field.onChange([...field.value,newSpubTask])
                        }}
                    >
                        Dodaj nowe
                    </button>
                </div>
                <Select
                    minMenuHeight={300}
                    className="d-flex col-12 col-xl-6 text-center pt-1 pb-2 pt-xl-2 ps-xl-2 pb-xl-2
                               justify-content-center"
                    isDisabled={disabled}
                    menuPlacement="auto"
                    placeholder="Dodaj z historii"
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            boxShadow: "none",
                            border: "1px solid grey",
                            width: "100%"
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
                    placeHolder={"Wybierz"}
                    options ={props.historicalSpubTasks.map((spubTask: SpubTask) => ({
                        label: `${spubTask.name} (${spubTask.yearFrom}–${spubTask.yearTo})`,
                        value: spubTask
                    }))}
                    value={""}
                    onChange={(selectedOption: { label: string, value: SpubTask })=> {
                        if (selectedOption) {
                                props.form.setValue(props.name, [...field.value,selectedOption.value], {shouldValidate:true, shouldDirty:true, shouldTouched:true})
                                field.onChange([...field.value,selectedOption.value])
                        }
                    }}
                />
                {props.form.formState.errors[props.name] &&
                    <ErrorCode code={props.form.formState.errors[props.name].message}/>
                }
            </div>
                            </>)}/>
        </div>
    )
}
