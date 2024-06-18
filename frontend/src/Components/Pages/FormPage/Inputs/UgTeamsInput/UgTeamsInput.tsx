import React, {useEffect, useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../../LoginPage/ErrorCode";
import Select from "react-select";
import {prop} from "react-data-table-component/dist/DataTable/util";


export type UgTeam = {
    value: string,
    noOfEmployees: string,
    noOfStudents: string
}

type Props = {
    className: string,
    label: string,
    name: string,
    form?: UseFormReturn
    required?: boolean,
    values: string[],
    readonly?:boolean
}


function UgTeamsInput(props: Props) {
    const requiredMsg = "Dodaj przynajmniej jedno zadanie"
    const disabled = props.form!.formState.errors[props.name] && props.form!.formState.errors[props.name]!.message != requiredMsg

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
            <Controller
                name={props.name} control={props.form!.control}
                defaultValue={[]}
                rules={{
                    required: props.required ?? requiredMsg, validate: {
                        notEmpty: (value:{value: { value:string }}) => {
                                if (Object.values(value).some((row: { value:string })=>Object.values(row).some((val)=>val===""))) {
                                    return "Uzupełnij wszystkie pola";
                                }
                            return true;
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
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "10%"}}>
                                        <b>Lp.</b>
                                    </div>
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "36%"}}>
                                        <b>Jednostka</b>
                                    </div>
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "22%"}}>
                                        <b>Liczba pracowników</b>
                                    </div>
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "22%"}}>
                                        <b>Liczba studentów</b>
                                    </div>
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "10%"}} />
                                </div>
                            </div>
                            {!field.value.length &&
                                <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                                    <div className={"text-center"}>Nie dodano żadnej jednostki</div>
                                </div>
                            }
                            {field.value.map((item: UgTeam, index: number) => (
                                <div className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                                     key={index}
                                >
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                                         style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                                    >
                                        {index + 1}.
                                    </div>
                                    <div className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                        <b>Jednostka {index + 1}.</b>
                                    </div>

                                    <div className="d-flex justify-content-center align-items-center p-2 border-end text-center"
                                         style={{width: windowWidth >= 1200 ? "36%" : "100%"}}
                                    >
                                        <span>{props.values[item.value]}</span>
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                         style={{width: windowWidth >= 1200 ? "22%" : "100%"}}
                                    >
                                        <div className="col-12 d-flex d-xl-none justify-content-center">Liczba pracowników</div>
                                        <input
                                            type="text"
                                            {...field}
                                            disabled={props.readonly ?? false}
                                            className="text-center placeholder-glow w-100 p-1 form-control bg-light"
                                            style={{fontSize: "inherit"}}
                                            value={item.noOfEmployees}
                                            onChange={(e) => {
                                                const sanitizedValue = parseInt(e.target.value);
                                                var val = field.value;
                                                console.log(sanitizedValue)
                                                if (!isNaN(sanitizedValue) && sanitizedValue < 9999) {
                                                    val[index].noOfEmployees = sanitizedValue

                                                }
                                                else {
                                                    val[index].noOfEmployees = '0'
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
                                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                         style={{width: windowWidth >= 1200 ? "22%" : "100%"}}
                                    >
                                        <div className="col-12 d-flex d-xl-none justify-content-center">Liczba studentów</div>
                                        <input
                                            type="text"
                                            {...field}
                                            disabled={props.readonly ?? false}
                                            className="text-center placeholder-glow w-100 p-1 form-control bg-light"
                                            style={{fontSize: "inherit"}}
                                            value={item.noOfStudents}
                                            onChange={(e) => {
                                                const sanitizedValue = parseInt(e.target.value);
                                                var val = field.value;
                                                if (!isNaN(sanitizedValue) && sanitizedValue < 9999) {
                                                    val[index].noOfStudents = sanitizedValue
                                                }
                                                else {
                                                    val[index].noOfStudents = '0'
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
                                    <div className={`d-flex justify-content-center align-items-center p-2`}
                                         style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                                    >
                                        <button
                                            type="button"
                                            className={`btn btn-info ${props.readonly ? "d-none":""}`}
                                            style={{fontSize:"inherit"}}
                                            onClick={() => {
                                                const val = field.value;
                                                val.splice(index, 1)
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

                        <div className={`d-flex flex-row flex-wrap justify-content-center w-100 pt-2 pb-1 ${props.readonly ? 'd-none':""}`}>
                            <Select minMenuHeight={300}
                                    menuPlacement="auto"
                                    isDisabled={disabled}
                                    className="bg-info text-white d-flex col-12 rounded-2"
                                    placeholder={disabled ? "": "Wybierz opcję lub wyszukaj"}
                                    styles={{
                                        control: (provided, state) => ({
                                            ...provided,
                                            boxShadow: "none",
                                            border: "none",
                                            backgroundColor: "inherit",
                                            color: "inherit",
                                            width: "100%",
                                            cursor: "pointer"
                                        }),
                                        placeholder: (provided: any) => ({
                                            ...provided,
                                            color: 'inherit',
                                            textAlign: "center"
                                        }),
                                        input: (provided: any) => ({
                                            ...provided,
                                            color: 'inherit'
                                        }),
                                        menu: provided => ({
                                            ...provided,
                                            zIndex: 9999,
                                            color: "black"
                                        })
                                    }}
                                    options={
                                        props.values
                                            .filter((_, index) =>
                                                !field.value
                                                    .map((item: {value:[]}) => item.value)
                                                    .includes(index)
                                            )
                                            ?.map((value) => ({
                                                label: value,
                                                value: props.values.findIndex(element => element === value)
                                            }))
                                        ?? { label: "", value: "" }
                                    }
                                    {...field}
                                    value={null}
                                    onChange={(selectedOption) => {
                                        const newUgTeam: UgTeam = {
                                            value: selectedOption!.value,
                                            noOfEmployees: "",
                                            noOfStudents: ""
                                        }
                                        props.form!.setValue(
                                            props.name,
                                            [...field.value,newUgTeam],
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                                shouldTouch: true
                                            }
                                        )
                                    }}
                            />
                            {props.form!.formState.errors[props.name] &&
                                <ErrorCode code={props.form!.formState.errors[props.name]!.message} />
                            }
                        </div>
                    </>
                )}
            />
        </div>
    )
}


export default UgTeamsInput