import React, {useEffect, useState} from "react";
import {Controller, ControllerRenderProps, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../../CommonComponents/ErrorCode";
import Select from "react-select";
import FilePicker from "./FilePicker";
import ContractCategoryPicker from "./ContractCategoryPicker";
import FileDownloader from "../../../../CommonComponents/FileDownloader";
import {prop} from "react-data-table-component/dist/DataTable/util";
import {FormValues} from "../../Wrappers/FormTemplate";


export type Contract = {
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
    name: string,
    form?: UseFormReturn,
    historicalContracts: Contract[],
    required: boolean,
    readonly?: boolean
}


export default function ContractsInput(props: Props){
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
            <Controller
                name={props.name}
                control={props.form!.control}
                defaultValue={[]}
                rules = {{
                    required: false,
                    validate: {
                        noEmptyInputs: (value: Contract[]) => {
                            if (props.readonly)
                                return undefined
                            if (value.some((row: Contract) => {
                                return Object
                                    .values(row)
                                    .some((rowField: object | string) => {
                                        if (typeof rowField == 'object') {
                                            return Object
                                                .values(rowField)
                                                .some((rowSubField: string) => !rowSubField)
                                        }
                                        return !rowField
                                    })
                            })
                            )
                                return "Wypełnij wszystkie pola"
                        }
                    }
                }}
                render={({field}) => (
                    <>
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
                                    <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "30%"}}>
                                        <b>Opis</b>
                                    </div>
                                    <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "20%"}}>
                                        <b>Skan</b>
                                    </div>
                                    <div className="text-center d-none d-xl-block p-2" style={{width: "5%"}} />

                                    <div className="text-center d-block d-xl-none p-2 col-12">
                                        <b>Umowy</b>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 bg-light">
                                {!field.value?.length &&
                                    <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                                        <div className="text-center">Nie dodano żadnej umowy</div>
                                    </div>
                                }
                                {field.value?.map((row: Contract, index: number) => (
                                    <div key={index}
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
                                            <ContractCategoryPicker
                                                readonly={props.readonly}
                                                name={props.name}
                                                row={row}
                                                field={field}
                                                form={props.form!}
                                            />
                                        </div>
                                        <div className="text-center d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                             style={{width: windowWidth >= 1200 ? "25%" : "100%"}}
                                        >
                                            <div className="col-12">Nazwa instytucji</div>
                                            <input {...field}
                                                   disabled={props.readonly ?? false}
                                                   type="text"
                                                   className="col-12 p-1 form-control bg-white"
                                                   style={{fontSize: "inherit"}}
                                                   value={row.institution.name}
                                                   onChange = {(e)=> {
                                                       row.institution.name = e.target.value
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

                                            <div className="col-12">Jednostka</div>
                                            <input {...field}
                                                   disabled={props.readonly ?? false}
                                                   type="text"
                                                   className="col-12 p-1 form-control bg-white"
                                                   style={{fontSize: "inherit"}}
                                                   value={row.institution.unit}
                                                   onChange = {(e)=> {
                                                       row.institution.unit = e.target.value
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

                                            <div className="col-12">Lokalizacja instytucji</div>
                                            <input {...field}
                                                   disabled={props.readonly ?? false}
                                                   type="text"
                                                   className="col-12 p-1 form-control bg-white"
                                                   style={{fontSize: "inherit"}}
                                                   value={row.institution.localization}
                                                   onChange = {(e)=> {
                                                       row.institution.localization = e.target.value
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
                                        <div className="text-center d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                             style={{width: windowWidth >= 1200 ? "30%" : "100%"}}
                                        >
                                            <div className="col-12 d-xl-none">Opis</div>
                                            <textarea
                                                {...field}
                                                disabled={props.readonly ?? false}
                                                className="col-12 p-1 form-control bg-white"
                                                style={{fontSize: "inherit"}}
                                                value={row.description}
                                                onChange = {(e)=> {
                                                    row.description = e.target.value
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
                                        <div className="text-center d-flex flex-wrap align-items-center justify-content-center p-2 border-end"
                                             style={{width: windowWidth >= 1200 ? "20%" : "100%"}}
                                        >
                                            <div className="col-12 d-xl-none">Skan</div>
                                            {props.readonly &&
                                                <FileDownloader
                                                    fileName={field.value[index].scan?.name}
                                                    fileContent={field.value[index].scan?.content}
                                                    bg="bg-light"
                                                />
                                            }
                                            {!props.readonly &&
                                            <FilePicker
                                                field={field}
                                                name={props.name}
                                                fileFieldName="scan"
                                                row={row}
                                                rowIdx={index}
                                                form={props.form!}
                                            />
                                            }
                                        </div>
                                        <div className={`text-center d-flex justify-content-center align-items-center p-2`}
                                             style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                        >
                                            <button type="button"
                                                    className={`btn btn-info ${props.readonly ? "d-none": ""}`}
                                                    style={{fontSize:"inherit"}}
                                                    onClick={() => {
                                                        const val: Contract[] = field.value;
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

                        <div className={`d-flex flex-row flex-wrap justify-content-center w-100 ${props.readonly ? "d-none": ""}`}>
                            <div className="d-flex col-12 col-xl-6 text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                                <button
                                    style={{fontSize:"inherit"}}
                                    className={`btn btn-info w-100 ${props.form!.formState.errors[props.name] ? "disabled" : ""}`}
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
                                        props.form!.setValue(
                                            props.name,
                                            [...field.value, newContract],
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true
                                            }
                                        )
                                    }}
                                >
                                    Dodaj nową
                                </button>
                            </div>
                            <Select
                                minMenuHeight={300}
                                className="d-flex col-12 col-xl-6 text-start pt-1 pb-2 pt-xl-2 ps-xl-2 pb-xl-2"
                                isDisabled={!!props.form!.formState.errors[props.name]}
                                menuPlacement="auto"
                                placeholder="Dodaj z historii"
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        boxShadow: "none",
                                        border: "1px solid grey",
                                        width: "100%"
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        textAlign: "center"
                                    }),
                                    input: (provided) => ({
                                        ...provided
                                    }),
                                    menu: provided => ({
                                        ...provided,
                                        zIndex: 9999
                                    })
                                }}
                                options ={[
                                    {
                                        label: "Krajowe",
                                        options:
                                            props.historicalContracts
                                                .filter((contract: Contract) => contract.category == "domestic")
                                                .map((contract: Contract) => ({
                                                    label: `${contract.institution.name}, ${contract.institution.unit}, ${contract.institution.localization}: ${contract.description}`,
                                                    value: contract
                                                }))
                                    },
                                    {
                                        label: "Międzynarodowe",
                                        options:
                                            props.historicalContracts
                                                .filter((contract: Contract) => contract.category == "international")
                                                .map((contract: Contract) => ({
                                                    label: `${contract.institution.name}, ${contract.institution.unit}, ${contract.institution.localization}: ${contract.description}`,
                                                    value: contract
                                                }))
                                    }
                                ]}
                                value={""}
                                onChange={(selectedOption: { label: string, value: Contract })=> {
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
                                <ErrorCode code={props.form!.formState.errors[props.name]!.message} />
                            }
                        </div>
                    </>
                )}
            />
        </div>
    )
}
