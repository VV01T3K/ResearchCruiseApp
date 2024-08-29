import React, {useEffect, useState} from "react";
import {Controller, ControllerRenderProps, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../../CommonComponents/ErrorCode";
import Select from "react-select";
import FileDownloader from "../../../../CommonComponents/FileDownloader";
import {prop} from "react-data-table-component/dist/DataTable/util";
import useWindowWidth from "../../../../CommonComponents/useWindowWidth";
import FilePicker from "../ContractsInput/FilePicker";


export type Permission = {
    description: string,
    executive: string,
    scan: {
        name: string,
        content: string
    }
}

type Props = {
    className: string,
    label: string,
    scannable: boolean,
    name: string,
    form?: UseFormReturn,
    historicalPermissions: Permission[],
    required?: boolean,
    readonly?: boolean
}


export default function PermissionsInput(props: Props){
    const windowWidth = useWindowWidth()
    const disabled = props.form!.formState.errors[props.name]?.type =="notEmpty"

    return (
        <div className={props.className + " p-3"}>
            <Controller
                name={props.name}
                control={props.form!.control}
                defaultValue={[]}
                rules = {{
                    required: true,
                    validate: {
                        notEmpty: (values: Permission[]) => {
                            for (const row of values) {
                                if (((props.scannable) && (row.description === "" || row.executive === "" || row.scan.name === "" || row.scan.content === "")) || ((!props.scannable) && (row.description === "" || row.executive === ""))) {
                                    return "Uzupełnij wszystkie pola";
                                }
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
                                <div className="d-flex flex-row center align-items-center">
                                    <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "5%"}}>
                                        <b>Lp.</b>
                                    </div>
                                    <div className="text-center d-none d-xl-block p-2 border-end"
                                         style={{width: props.scannable ? "35%" : "45%"}}>
                                        <b>Treść pozwolenia</b>
                                    </div>
                                    <div className="text-center d-none d-xl-block p-2 border-end"
                                         style={{width: props.scannable ? "35%" : "45%"}}>
                                        <b>Organ wydający pozwolenie</b>
                                    </div>
                                    {props.scannable &&
                                        <div className="text-center d-none d-xl-block p-2 border-end"
                                         style={{width: "20%"}}>
                                            <b>Skan</b>
                                         </div>}
                                    <div className="text-center d-none d-xl-block p-2" style={{width: "5%"}}/>


                                </div>
                            </div>
                            <div className="w-100 bg-light">
                                {!field.value?.length &&
                                    <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                                        <div className="text-center">Nie dodano żadnego pozwolenia</div>
                                    </div>
                                }
                                {field.value?.map((row: Permission, index: number) => (
                                    <div key={index}
                                         className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                                    >
                                        <div className="text-center d-none d-xl-flex justify-content-center align-items-center p-2
                                             border-end"
                                             style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                        >
                                            {index + 1}.
                                        </div>
                                        <div
                                            className="text-center d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                            <b>Pozwolenie {index + 1}.</b>
                                        </div>

                                        <div
                                            className="text-center d-inline-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                            style={{width: windowWidth >= 1200 ? (props.scannable ? "35%" : "45%") : "100%"}}
                                        >
                                            <div className="col-12 d-xl-none">Treść pozwolenia</div>
                                            <textarea
                                                {...field}
                                                disabled={props.readonly ?? false}
                                                value={row.description}
                                                className="col-12 p-1 form-control"
                                                style={{fontSize: "inherit"}}
                                                onChange={(e) => {
                                                    if (e.target.value.length < 100) {
                                                        row.description = e.target.value
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
                                                rows={3}
                                            />
                                        </div>
                                        <div
                                            className="text-center d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                            style={{width: windowWidth >= 1200 ? (props.scannable ? "35%" : "45%") : "100%"}}
                                        >
                                            <div className="col-12 d-xl-none">Organ wydający pozwolenie</div>
                                            <textarea
                                                {...field}
                                                disabled={props.readonly ?? false}
                                                value={row.executive}
                                                className="col-12 p-1 form-control"
                                                style={{fontSize: "inherit"}}
                                                onChange={(e) => {
                                                    if (e.target.value.length < 100) {
                                                        row.executive = e.target.value
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
                                                rows={3}
                                            />

                                        </div>

                                        {props.scannable &&
                                            <div
                                            className="text-center d-flex flex-wrap align-items-center justify-content-center p-2 border-end"
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
                                            </div>}
                                        <div
                                            className={`text-center d-flex justify-content-center align-items-center p-2`}
                                            style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                        >
                                            <button type="button"
                                                    className={`btn btn-info ${props.readonly ? "d-none" : ""}`}
                                                    style={{fontSize: "inherit"}}
                                                    onClick={() => {
                                                        const val: Permission[] = field.value;
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

                        <div
                            className={`d-flex flex-row flex-wrap justify-content-center w-100 ${props.readonly ? "d-none" : ""}`}>
                            <div
                                className="d-flex col-12 col-xl-6 text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                                <button
                                    style={{fontSize: "inherit"}}
                                    className={`btn btn-info w-100 
                                    ${disabled ? "disabled" : ""}`}
                                    type="button"
                                    onClick={() => {
                                        const newPermission: Permission = {
                                            description: "",
                                            executive: "",
                                            scan: {
                                                name: "",
                                                content: ""
                                            }
                                        }
                                        props.form!.setValue(
                                            props.name,
                                            [...field.value, newPermission],
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true
                                            }
                                        )
                                    }}
                                >
                                    Dodaj nowe pozwolenie
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
                                options ={
                                    props.historicalPermissions.map((permission: Permission) => ({
                                        label: `${permission.description} ${permission.executive} ${permission.scan}`,
                                        value: permission
                                    }))
                                }
                                value={""}
                                onChange={(selectedOption: { label: string, value: Permission })=> {
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
