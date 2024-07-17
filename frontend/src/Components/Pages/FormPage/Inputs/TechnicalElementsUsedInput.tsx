import React, { useEffect, useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../CommonComponents/ErrorCode";
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
                            <div className="table-striped w-100">

                                <div className={"w-100 d-flex flex-row border flex-wrap p-3"}>

                                    <div
                                        className={"col-12 d-flex flex-row align-items-center justify-content-center border"}>
                                        <div className={"col-4 border h-100 "}>Żurawiki hydrograficzne
                                        </div>
                                        <div className={"col-8 d-flex flex-row flex-wrap"}>
                                            <div className={"col-6 border"}>dziobowy prawa burta</div>
                                            <div className={"col-6 border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                            <div className={"col-6 border"}>rufowy prawa burta</div>
                                            <div className={"col-6 border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                            <div className={"col-6 border"}>rufowy lewa burta</div>
                                            <div className={"col-6 border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                        </div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Dźwig główny</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Bom STBS (prawa burta)</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Bom PS (lewa burta)</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Kablolina 35 kN</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Kablolina 5 kN</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Bramownica główna (rufowa)</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Bramownica pomocnicza STBS (prawa burta)</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Winda trałowa STBS (prawa burta)</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Wind trałowa PS (lewa burta)</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Łódź robocza</div>
                                        <div className={"col-4  border"}><input type={"checkbox"} className={"w-100 h-100"}/></div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center justify-content-center"}>
                                        <div className={"col-8  border"}>Obserwatorium
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
