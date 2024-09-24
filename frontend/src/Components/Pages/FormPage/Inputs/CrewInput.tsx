import React from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../CommonComponents/ErrorCode";
import Select from "react-select";
import DatePicker from "react-datepicker";
import useWindowWidth from "../../../CommonComponents/useWindowWidth";
import {Thesis} from "./ThesesInput/ThesesInput";


type Props = {
    className: string,
    label: string,
    name:string,
    form?: UseFormReturn,
    historicalCrew: Crew[],
    required? :boolean,
    readonly?: boolean
}

export type Crew = {
    title: string,
    names: string,
    surname: string,
    birthPlace: string,
    birthDate: string,
    ID: string,
    expiryDate: string,
    institution: string
}


function CrewInput(props: Props){
    const disabled = props.form!.formState.errors[props.name]?.type =="noEmptyRowFields"
    const windowWidth = useWindowWidth()


    return (
        <div className={props.className + " p-3 d-flex flex-column justify-content-center align-self-start"}>
            <Controller name={props.name}  control={props.form!.control}
                        defaultValue={[]}
                        rules = {{
                            required: true,
                            validate: {
                                noEmptyRowFields: (value: Thesis[]) => {
                                    if (value.some((row: Thesis) => {
                                        return Object
                                            .values(row)
                                            .some(rowField => !rowField)
                                    })
                                    )
                                        return "Wypełnij wszystkie pola"
                                },
                            }
                        }}

                        render={({field}) => (
                            <>
                                <div className="table-striped w-100">
                                    <div className="text-white text-center bg-primary">
                                        <div className="d-flex flex-row center">
                                            <div className="w-100 p-2">
                                                <b>{props.label}</b>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-white text-center bg-secondary">
                                        <div className="d-flex flex-row center">
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "5%"}}>
                                                <b>Lp.</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "60%"}}>
                                                <b>Dane osobowe</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "30%"}}>
                                                <b>
                                                    Nazwa jednostki organizacyjnej UG lub instytucji zewnętrznej</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2"
                                                style={{width: "5%"}}>

                                            </div>


                                        </div>
                                    </div>
                                    {!field.value.length &&
                                        <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                                            <div className={"text-center"}>Nie dodano żadnego członka załogi</div>
                                        </div>
                                    }
                                    {field.value.map((row: Crew, index: number) => (
                                        <div key={index}
                                             className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                                        >
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                            >
                                                {index + 1}.
                                            </div>
                                            <div
                                                className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                                <b>Członek załogi {index + 1}.</b>
                                            </div>

                                            <div
                                                className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                                style={{width: windowWidth >= 1200 ? "30%" : "100%"}}
                                            >
                                                <div
                                                    className="col-12 d-flex d-xl-none justify-content-center">Dane
                                                    osobowe
                                                </div>

                                                <div className="col-12">
                                                    Tytuł (nauk., zawod.)
                                                </div>
                                                <textarea
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    value={row.title}
                                                    className="col-12 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 100) {
                                                            row.title = e.target.value
                                                            props.form!.setValue(
                                                                props.name,
                                                                field.value,
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldTouch: true,
                                                                    shouldValidate: true
                                                                }
                                                            )
                                                            field.onChange(field.value)
                                                        }
                                                    }}
                                                    rows={1}
                                                />
                                                <div className="col-12">Imiona</div>
                                                <textarea
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    value={row.names}
                                                    className="col-12 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 100) {
                                                            row.names = e.target.value
                                                            props.form!.setValue(
                                                                props.name,
                                                                field.value,
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldTouch: true,
                                                                    shouldValidate: true
                                                                }
                                                            )
                                                            field.onChange(field.value)
                                                        }
                                                    }}
                                                    rows={1}
                                                />
                                                <div className="col-12">Nazwisko</div>
                                                <textarea
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    value={row.surname}
                                                    className="col-12 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 100) {
                                                            row.surname = e.target.value
                                                            props.form!.setValue(
                                                                props.name,
                                                                field.value,
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldTouch: true,
                                                                    shouldValidate: true
                                                                }
                                                            )
                                                            field.onChange(field.value)
                                                        }
                                                    }}
                                                    rows={1}
                                                />
                                                <div className="col-12">Miejsce urodzenia</div>
                                                <textarea
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    value={row.birthPlace}
                                                    className="col-12 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 100) {
                                                            row.birthPlace = e.target.value
                                                            props.form!.setValue(
                                                                props.name,
                                                                field.value,
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldTouch: true,
                                                                    shouldValidate: true
                                                                }
                                                            )
                                                            field.onChange(field.value)
                                                        }
                                                    }}
                                                    rows={1}
                                                />

                                            </div>
                                            <div
                                                className="text-center d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                style={{width: windowWidth >= 1200 ? "30%" : "100%"}}
                                            >
                                                <div className="col-12">Data urodzenia</div>
                                                <DatePicker
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    // onBlur = {()=>{if(getFieldValue(field, index, item, t).endDate)field.onBlur()}}
                                                    showYearDropdown
                                                    className={"text-center w-100 border border-opacity-75 rounded-2 p-1"}
                                                    selectsEnd
                                                    locale={"pl"}
                                                    selected={row.birthDate ? new Date(row.birthDate) : null}
                                                    onChange={(e: Date)=> {
                                                        if (e != null) {
                                                            const tmp = row;
                                                            tmp["birthDate"] = e.toISOString();
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
                                                    }}
                                                    // getPopupContainer={trigger => trigger.parentElement}
                                                    dateFormat="dd/MM/yyyy"
                                                />

                                                <div className="col-12">Numer ID (dowód osobisty lub paszport)</div>
                                                <textarea
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    value={row.ID}
                                                    className="col-12 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 100) {
                                                            row.ID = e.target.value
                                                            props.form!.setValue(
                                                                props.name,
                                                                field.value,
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldTouch: true,
                                                                    shouldValidate: true
                                                                }
                                                            )
                                                            field.onChange(field.value)
                                                        }
                                                    }}
                                                    rows={1}
                                                />

                                                <div className="col-12">
                                                    Data ważności dokumetu tożsamości (dowód osobisty lub paszport)</div>
                                                <DatePicker
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    // onBlur = {()=>{if(getFieldValue(field, index, item, t).endDate)field.onBlur()}}
                                                    showYearDropdown
                                                    className={"text-center w-100 border border-opacity-75 rounded-2 p-1"}
                                                    selectsEnd
                                                    locale={"pl"}
                                                    selected={row.expiryDate ? new Date(row.expiryDate) : null}
                                                    onChange={(e: Date)=> {
                                                        if (e != null) {
                                                            const tmp = row;
                                                            tmp["expiryDate"] = e.toISOString();
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
                                                    }}
                                                    // getPopupContainer={trigger => trigger.parentElement}
                                                    dateFormat="dd/MM/yyyy"
                                                />




                                            </div>

                                            <div
                                                className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                                style={{width: windowWidth >= 1200 ? "30%" : "100%"}}
                                            >
                                                <div className="col-12 d-flex d-xl-none justify-content-center">R
                                                    Nazwa jednostki organizacyjnej UG lub instytucji zewnętrznej
                                                </div>
                                                <textarea
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    value={row.institution}
                                                    className="col-12 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 100) {
                                                            row.institution = e.target.value
                                                            props.form!.setValue(
                                                                props.name,
                                                                field.value,
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldTouch: true,
                                                                    shouldValidate: true
                                                                }
                                                            )
                                                            field.onChange(field.value)
                                                        }
                                                    }}
                                                    rows={2}
                                                />

                                            </div>
                                            <div className="d-flex justify-content-center align-items-center p-2"
                                                 style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                            >
                                                <button type="button"
                                                        className={`${props.readonly ? "d-none" : ""} btn btn-info`}
                                                        style={{fontSize: "inherit"}}
                                                        onClick={() => {
                                                            const val = field.value;
                                                            val.splice(index, 1)
                                                            props.form!.clearErrors(props.name)
                                                            props.form!.setValue(props.name, val, {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                                shouldTouch: true
                                                            })
                                                        }
                                                        }
                                                >
                                                    -
                                                </button>

                                            </div>

                                        </div>
                                    ))}
                                </div>

                                <div
                                    className={`${props.readonly ? "d-none" : "d-flex"} flex-row flex-wrap justify-content-center w-100`}>
                                    <div
                                        className="d-flex col-12 col-xl-6 text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                                        <button
                                            style={{fontSize: "inherit"}}
                                            className={`btn btn-info w-100
                                                ${disabled ? "disabled" : ""}`
                                            }
                                            type="button"
                                            onClick={() => {
                                                const newCrew: Crew = {
                                                    title: "",
                                                    names: "",
                                                    surname: "",
                                                    birthPlace: "",
                                                    birthDate: "",
                                                    ID: "",
                                                    expiryDate: "",
                                                    name: ""
                                                }
                                                props.form!.setValue(
                                                    props.name,
                                                    [...field.value, newCrew],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true
                                                    }
                                                )
                                                field.onChange([...field.value, newCrew])
                                            }}
                                        >
                                            Dodaj nowego członka załogi
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
                                            props.historicalCrew.map((crew: Crew) => ({
                                                label: `${crew.names} ${crew.surname} ${crew.ID} ${crew.title} ${crew.birthPlace} ${crew.birthPlace} ${crew.expiryDate} ${crew.institution}`,
                                                value: crew
                                            }))
                                        }
                                        value={""}
                                        onChange={(selectedOption: { label: string, value: Crew })=> {
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
                                        <ErrorCode code={props.form!.formState.errors[props.name]!.message}/>
                                    }
                                </div>
                            </>
                        )}
            />
        </div>
    )
}


export default CrewInput