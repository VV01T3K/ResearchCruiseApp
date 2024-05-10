import React, {useEffect, useState} from "react";
import {Controller, ControllerRenderProps, FieldValues, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../../LoginPage/ErrorCode";
import Select from "react-select";
import PublicationsCategoryPicker from "./PublicationsCategoryPicker"


type Props = {
    className: string,
    label: string,
    name:string,
    form?: UseFormReturn,
    historicalGuestsInstitutions: string[],
    required? :boolean
}

export type Attributes = {
    category: string,
    year: string,
    points: string,
    info: {
        DOI: string,
        authors: string,
        title: string,
        magazine: string
    }
}


function PublicationsInput(props: Props){
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
                        rules = {{required:props.required ?? true,validate: {
                                notEmpty: (value) => {
                                    for (const key in value) {
                                        if (value.hasOwnProperty(key) && (value[key].value === "" || value[key].count === "")) {
                                            return "Uzupełnij wszystkie pola";
                                        }
                                    }
                                    return true;
                                }
                            }}}

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
                                                style={{width: "15%"}}>
                                                <b>Kategoria</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "55%"}}>
                                                <b>Informacje</b>
                                            </div>

                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "10%"}}>
                                                <b>Rok wydania</b>
                                            </div>
                                            <div
                                                className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: "10%"}}>
                                                <b>Punkty</b>
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
                                    {field.value.map((row: Attributes, index: number) => (
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
                                                <b>Instytucja {index + 1}.</b>
                                            </div>

                                            <div
                                                className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                                style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                                            >
                                                <div
                                                    className="col-12 d-flex d-xl-none justify-content-center">Instytucja
                                                </div>
                                                <PublicationsCategoryPicker
                                                    {...field}
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
                                                <div className="col-12">DOI</div>
                                                <input {...field}
                                                       type="text"
                                                       className="col-12 p-1"
                                                       value={row.info.DOI}
                                                       onChange={(e) => {
                                                           row.info.DOI = e.target.value
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
                                                       }}
                                                />

                                                <div className="col-12">Autorzy</div>
                                                <input {...field}
                                                       type="text"
                                                       className="col-12 p-1"
                                                       value={row.info.authors}
                                                       onChange={(e) => {
                                                           row.info.authors = e.target.value
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
                                                       }}
                                                />

                                                <div className="col-12">Tytuł</div>
                                                <input {...field}
                                                       type="text"
                                                       className="col-12 p-1"
                                                       value={row.info.title}
                                                       onChange={(e) => {
                                                           row.info.title = e.target.value
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
                                                       }}
                                                />

                                                <div className="col-12">Czasopismo</div>
                                                <input {...field}
                                                       type="text"
                                                       className="col-12 p-1"
                                                       value={row.info.magazine}
                                                       onChange={(e) => {
                                                           row.info.magazine = e.target.value
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
                                                       }}
                                                />

                                            </div>

                                            <div
                                                className="d-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                                            >
                                                <input
                                                    type="text"
                                                    {...field}
                                                    className="text-center placeholder-glow w-100 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    value={row.year}
                                                    onChange={(e) => {
                                                        const sanitizedValue = parseInt(e.target.value);
                                                        var val = field.value;
                                                        console.log(sanitizedValue)
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

                                            <div
                                                className="d-flex justify-content-center align-items-center p-2 border-end"
                                                style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                                            >
                                                <input
                                                    type="text"
                                                    {...field}
                                                    className="text-center placeholder-glow w-100 p-1 form-control"
                                                    style={{fontSize: "inherit"}}
                                                    value={row.points}
                                                    onChange={(e) => {
                                                        const sanitizedValue = parseInt(e.target.value);
                                                        var val = field.value;
                                                        console.log(sanitizedValue)
                                                        if (!isNaN(sanitizedValue) && sanitizedValue < 9999) {
                                                            val[index].points = sanitizedValue
                                                        } else {
                                                            val[index].points = '0'
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
                                                        className="btn btn-info"
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

                                <div className="d-flex flex-row flex-wrap justify-content-center w-100">
                                    <div
                                        className="d-flex col-12 col-xl-3 text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                                        <button
                                            style={{fontSize: "inherit"}}
                                            className={`btn btn-info w-100
                                                        ${props.form!.formState.errors[props.name] != undefined ? "disabled" : ""}`
                                            }
                                            type="button"
                                            onClick={() => {
                                                const newGuestsCount: Attributes = {
                                                    category: "",
                                                    year: "",
                                                    points: "",
                                                    info: {
                                                        DOI: "",
                                                        authors: "",
                                                        title: "",
                                                        magazine: ""
                                                    }
                                                }
                                                props.form!.setValue(
                                                    props.name,
                                                    [...field.value, newGuestsCount],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true
                                                    }
                                                )
                                                field.onChange([...field.value, newGuestsCount])
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
                                        options={
                                            props.historicalGuestsInstitutions.map((institution: string) => ({
                                                label: institution,
                                                value: institution
                                            }))
                                        }
                                        value={""}
                                        onChange={(selectedOption: { label: string, value: string }) => {
                                            if (selectedOption) {
                                                const newGuestsCount: Attributes = {
                                                    institution: selectedOption.value,
                                                    count: ""
                                                }
                                                props.form!.setValue(
                                                    props.name,
                                                    [...field.value, newGuestsCount],
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                        shouldTouch: true
                                                    }
                                                )
                                                field.onChange([...field.value, newGuestsCount])
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


export default PublicationsInput