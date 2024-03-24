import React, {useEffect, useRef, useState} from "react";
import {Controller, get, useFieldArray, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../../LoginPage/ErrorCode";
import Select, {SingleValue} from "react-select";
import file_icon from '../../../../resources/file_icon.png'
import FilePicker from "./FilePicker";
import ContractCategoryPicker from "./ContractCategoryPicker";


type Contract = {
    category: string,
    institution: {
        name: string,
        unit: string,
        localization: string
    },
    description: string,
    scan: {
        name: string,
        content: string
    }
}

type Props = {
    className: string,
    sectionName: string,
    form: UseFormReturn,
    historicalContracts: Contract[]
}


export default function ContractsInput(props: Props){
    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control: props.form.control,
        name: props.sectionName,
    });
    console.log(props.form.getValues())

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
        <div className={props.className + " p-3"}>
            <div className="table-striped w-100">
                <div className="text-white text-center" style={{"backgroundColor": "#052d73"}}>
                    <div className="d-flex flex-row center align-items-center">
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "5%"}}>
                            <b>Lp.</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "15%"}}>
                            <b>Kategoria</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "25%"}}>
                            <b>Instytucja</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "40%"}}>
                            <b>Opis</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "10%"}}>
                            <b>Skan</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2" style={{width: "5%"}} />

                        <div className="text-center d-block d-xl-none p-2 col-12">
                            <b>Umowy</b>
                        </div>
                    </div>
                </div>
                <div className="w-100 bg-light">
                    {!fields.length &&
                        <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                            <div className="text-center">Nie dodano żadnej umowy</div>
                        </div>
                    }
                    {fields.map((item, index) => (
                        <div key={item.id}
                             className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                        >
                            <div className="text-center d-none d-xl-flex justify-content-center align-items-center p-2
                                             border-end"
                                 style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                            >
                                {index + 1}.
                            </div>
                            <div className="text-center d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                <b>Umowa {index + 1}.</b>
                            </div>

                            <div className="text-center d-inline-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                            >
                                <div className="col-12 d-xl-none">Kategoria</div>
                                <Controller name={`${props.sectionName}[${index}].category`}
                                            control={props.form.control}
                                            rules={{
                                                required: "Pole nie może być puste"
                                            }}
                                            render={({field}) => (
                                                <ContractCategoryPicker
                                                    inputName={`${props.sectionName}[${index}].category`}
                                                    form={props.form}
                                                />
                                            )}
                                />
                            </div>
                            <div className="text-center d-flex flex-wrap ustify-content-center align-items-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "25%" : "100%"}}
                            >
                                <div className="col-12">Nazwa instytucji</div>
                                <Controller name={`${props.sectionName}[${index}].institution.name`}
                                            control={props.form.control}
                                            rules={{
                                                required: "Pole nie może być puste",
                                                validate: value =>
                                                    false || "Błąd!"
                                            }}
                                            render={({field}) => (
                                                <input {...field}
                                                       type="text"
                                                       className="col-12 p-1"
                                                />
                                            )}
                                />
                                <div className="col-12">Jednostka</div>
                                <Controller name={`${props.sectionName}[${index}].institution.unit`}
                                            control={props.form.control}
                                            rules={{
                                                required: "Pole nie może być puste",
                                                validate: value =>
                                                    false || "Błąd!"
                                            }}
                                            render={({field}) => (
                                                <input {...field}
                                                       type="text"
                                                       className="col-12 p-1"
                                                />
                                            )}
                                />
                                <div className="col-12">Lokalizacja instytucji</div>
                                <Controller name={`${props.sectionName}[${index}].institution.localization`}
                                            control={props.form.control}
                                            rules={{
                                                required: "Pole nie może być puste",
                                                validate: value =>
                                                    false || "Błąd!"
                                            }}
                                            render={({field}) => (
                                                <input {...field}
                                                       type="text"
                                                       className="col-12 p-1"
                                                />
                                            )}
                                />
                            </div>
                            <div className="text-center d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "40%" : "100%"}}
                            >
                                <div className="col-12 d-xl-none">Opis</div>
                                <Controller name={`${props.sectionName}[${index}].description`}
                                            control={props.form.control}
                                            rules={{
                                                required: "Pole nie może być puste"
                                            }}
                                            render={({field}) => (
                                                <textarea
                                                    {...field}
                                                    className="col-12 p-1"
                                                />
                                            )}
                                />
                            </div>
                            <div className="text-center d-flex flex-wrap align-items-center justify-content-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                            >
                                <div className="col-12 d-xl-none">Skan</div>
                                <Controller name={`${props.sectionName}[${index}].scan.content`}
                                            control={props.form.control}
                                            rules={{
                                                required: "Pole nie może być puste"
                                            }}
                                            render={({field}) => (
                                                <FilePicker
                                                    field={field}
                                                    inputName={`${props.sectionName}[${index}].scan`}
                                                    rowIdx={index}
                                                    sectionName={props.sectionName}
                                                    fileFieldName="scan"
                                                    form={props.form}
                                                />
                                            )}
                                />
                            </div>
                            <div className="text-center d-flex justify-content-center align-items-center p-2"
                                 style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                            >
                                <button type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            remove(index)
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
                            ${props.form.formState.errors[props.sectionName] ? "disabled" : ""}`
                        }
                        type="button"
                        onClick={() => {
                            const newContract: Contract = {
                                category: "",
                                description: "",
                                institution: {
                                    localization: "",
                                    name: "",
                                    unit: ""
                                },
                                scan: {
                                    name: "",
                                    content: ""
                                }
                            }
                            append(newContract)
                        }}
                    >
                        Dodaj nową
                    </button>
                </div>
                <Select
                    minMenuHeight={300}
                    className="d-flex col-12 col-xl-6 text-center pt-1 pb-2 pt-xl-2 ps-xl-2 pb-xl-2
                               justify-content-center"
                    isDisabled={props.form.formState.errors[props.sectionName]}
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
                    // options ={props.historicalSpubTasks.map((spubTask: SpubTask) => ({
                    //     label: `${spubTask.name} (${spubTask.yearFrom}–${spubTask.yearTo})`,
                    //     value: spubTask
                    // }))}
                    value={""}
                    // onChange={(selectedOption: { label: string, value: SpubTask })=> {
                    //     if (selectedOption) {
                    //         const newSpubTask: SpubTask = {
                    //             yearFrom: `${selectedOption.value.yearFrom}`,
                    //             yearTo: `${selectedOption.value.yearTo}`,
                    //             name: `${selectedOption.value.name}`
                    //         }
                    //         append({value: newSpubTask})
                    //     }
                    // }}
                />
                {props.form.formState.errors[props.sectionName] &&
                    <ErrorCode code={props.form.formState.errors[props.sectionName].message}/>
                }
            </div>
        </div>
    )
}
