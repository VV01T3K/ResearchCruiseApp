import React, { useEffect, useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorMessageIfPresent from "../../CommonComponents/ErrorMessageIfPresent";
import Select from "react-select";

import DatePicker  from 'react-datepicker';

export type Action = {
    startDate: string,
    endDate: string,
    name: string,
    insurance: boolean,
    permission:boolean
}

type Props = {
    className: string,
    name: string,
    form?: UseFormReturn,
    history?: Action[],
    required?: boolean,
    readonly?:boolean, }


export default function TechnicalElementsUsedInput(props: Props){

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

                                        return !row.name || (row.insurance && !(row.startDate && row.endDate))
                                        // .some(rowField => !rowField)
                                    })
                                    )
                                        return "Wypełnij wszystkie pola"
                                },
                            }
                        }}
                        render={({ field}) => (
                            <>
                                <div className="table-striped w-100 bg-primary text-white">

                                    <div className={"w-100 d-flex flex-row border flex-wrap p-3"}>

                                        <div
                                            className={"col-12 d-flex flex-row align-items-center justify-content-center border bg-secondary"}>
                                            <div className={"col-4 border h-100 d-xl-flex justify-content-center align-items-center "}>Żurawiki hydrograficzne
                                            </div>
                                            <div className={"col-8 d-flex flex-row flex-wrap d-xl-flex justify-content-center align-items-center"}>
                                                <div className={"col-6 border d-xl-flex justify-content-center align-items-center"}>dziobowy prawa burta</div>
                                                <div className={"col-6 border "}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                                <div className={"col-6 border d-xl-flex justify-content-center align-items-center"}>rufowy prawa burta</div>
                                                <div className={"col-6 border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                                <div className={"col-6 border d-xl-flex justify-content-center align-items-center"}>rufowy lewa burta</div>
                                                <div className={"col-6 border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                            </div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Dźwig główny</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100 bg-secondary"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Bom STBS (prawa burta)</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100 bg-secondary"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Bom PS (lewa burta)</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100 bg-secondary"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Kablolina 35 kN</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Kablolina 5 kN</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Bramownica główna (rufowa)</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Bramownica pomocnicza STBS (prawa burta)</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Winda trałowa STBS (prawa burta)</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Winda trałowa PS (lewa burta)</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Łódź robocza</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                        </div>
                                        <div className={"col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"}>
                                            <div className={"col-8  border d-xl-flex justify-content-center align-items-center"}>Obserwatorium
                                                (bocianie gniazdo)</div>
                                            <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                        </div>

                                    </div>
                                </div>
                            </>
                        )}
            />


        </div>
    )
}
