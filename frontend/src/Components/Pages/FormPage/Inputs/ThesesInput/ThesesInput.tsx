import React, {useEffect, useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../../CommonComponents/ErrorCode";
import Select from "react-select";
import ThesisCategoryPicker from "./ThesisCategoryPicker";
import {Publication} from "../PublicationsInput/PublicationsInput";


type Props = {
    className: string,
    label: string,
    name:string,
    form?: UseFormReturn,
    historicalTheses: Thesis[],
    required? :boolean,
    readonly?: boolean
}

export type Thesis = {
    category: string,
    author: string,
    title: string,
    promoter: string,
    year: number
}


function ThesesInput(props: Props){
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

    return (
        <div className={props.className + " p-3 d-flex flex-column justify-content-center align-self-start"}>
            <Controller name={props.name}  control={props.form!.control}
                        defaultValue={[]}
                        rules = {{
                            required: false,
                            validate: {
                                noEmptyInputs: (value: Thesis[]) => {
                                    if (value.some((row: Thesis) => {
                                        return Object
                                            .values(row)
                                            .some((rowField) => {
                                                return (typeof rowField == 'string' && rowField === "");
                                            })
                                    })) {
                                        return "Wypełnij wszystkie pola"
                                    }
                                }
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
                                                style={{width: "20%"}}>
                                                <b>Kategoria</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "55%"}}>
                                                <b>Informacje</b>
                                            </div>

                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "15%"}}>
                                                <b>Rok obrony</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2"
                                                style={{width: "5%"}}>

                                            </div>


                                        </div>
                                    </div>
                                    {!field.value.length &&
                                        <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                                            <div className={"text-center"}>Nie dodano żadnej pracy</div>
                                        </div>
                                    }
                                    {field.value.map((row: Thesis, index: number) => (
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
                                                <b>Praca {index + 1}.</b>
                                            </div>

                                            <div
                                                className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                                style={{width: windowWidth >= 1200 ? "20%" : "100%"}}
                                            >
                                                <div
                                                    className="col-12 d-flex d-xl-none justify-content-center">Kategoria
                                                </div>
                                                <ThesisCategoryPicker
                                                    readonly={props.readonly ?? false}
                                                    name={props.name}
                                                    row={row}
                                                    field={field}
                                                    form={props.form!}
                                                />
                                            </div>
                                            <div
                                                className="text-center d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                                style={{width: windowWidth >= 1200 ? "55%" : "100%"}}
                                            >
                                                <div className="col-12">Autor</div>
                                                <textarea
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    value={row.author}
                                                    className="col-12 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 100) {
                                                            row.author = e.target.value
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

                                                <div className="col-12">Tytuł</div>
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
                                                    rows={2}
                                                />

                                                <div className="col-12">Promotor</div>
                                                <textarea
                                                    {...field}
                                                    disabled={props.readonly ?? false}
                                                    value={row.promoter}
                                                    className="col-12 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    onChange={(e) => {
                                                        if (e.target.value.length < 100) {
                                                            row.promoter = e.target.value
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
                                                className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                                style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                                            >
                                                <div className="col-12 d-flex d-xl-none justify-content-center">Rok
                                                    obrony
                                                </div>
                                                <input
                                                    disabled={props.readonly ?? false}
                                                    type="text"
                                                    {...field}
                                                    className="text-center placeholder-glow w-100 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    value={row.year}
                                                    onChange={(e) => {
                                                        const sanitizedValue = parseInt(e.target.value);
                                                        var val = field.value;
                                                        if (!isNaN(sanitizedValue) && sanitizedValue < 9999) {
                                                            val[index].year = sanitizedValue
                                                        } else {
                                                            val[index].year = '0'
                                                        }
                                                        props.form!.setValue(props.name, val, {
                                                            shouldDirty: true,
                                                            shouldTouch: true,
                                                            shouldValidate: true
                                                        })
                                                        field.onChange(val)
                                                    }}
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
                                        className="d-flex col-12 col-xl-3 text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                                        <button
                                            style={{fontSize: "inherit"}}
                                            className={`btn btn-info w-100
                                                        ${props.form!.formState.errors[props.name] != undefined ? "disabled" : ""}`
                                            }
                                            type="button"
                                            onClick={() => {
                                                const newThesis: Thesis = {
                                                    category: "",
                                                    author: "",
                                                    title: "",
                                                    promoter: "",
                                                    year: new Date().getFullYear()
                                                }
                                                props.form!.setValue(
                                                    props.name,
                                                    [...field.value, newThesis],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true
                                                    }
                                                )
                                                field.onChange([...field.value, newThesis])
                                            }}
                                        >
                                            Dodaj nową pracę
                                        </button>
                                    </div>
                                    <Select
                                        minMenuHeight={300}
                                        className="d-flex col-12 col-xl-9 text-start pt-1 pb-2 pt-xl-2 ps-xl-2 pb-xl-2"
                                        isDisabled={props.form!.formState.errors[props.name] != undefined}
                                        menuPlacement="auto"
                                        placeholder="Dodaj z dostępnych"
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
                                        options ={[
                                            {
                                                label: "Licencjackie",
                                                options:
                                                    props.historicalTheses
                                                        .filter((thesis: Thesis) => thesis.category == "bachelor")
                                                        .map((thesis: Thesis) => ({
                                                            label: `Autor: ${thesis.author}\n
                                                                    Tytuł: ${thesis.title}\n
                                                                    Promotor: ${thesis.promoter}\n
                                                                    Rok obrony: ${thesis.year}`,
                                                            value: thesis
                                                        }))
                                            },
                                            {
                                                label: "Magisterskie",
                                                options:
                                                    props.historicalTheses
                                                        .filter((thesis: Thesis) => thesis.category == "master")
                                                        .map((thesis: Thesis) => ({
                                                            label: `${thesis.author}, ${thesis.title}, ${thesis.promoter}, ${thesis.year}`,
                                                            value: thesis
                                                        }))
                                            },
                                            {
                                                label: "Doktorskie",
                                                options:
                                                    props.historicalTheses
                                                        .filter((thesis: Thesis) => thesis.category == "doctor")
                                                        .map((thesis: Thesis) => ({
                                                            label: `${thesis.author}, ${thesis.title}, ${thesis.promoter}, ${thesis.year}`,
                                                            value: thesis
                                                        }))
                                            }
                                        ]}
                                        value={""}
                                        onChange={(selectedOption: { label: string, value: Publication })=> {
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


export default ThesesInput