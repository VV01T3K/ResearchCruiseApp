import React, { useEffect, useState} from "react";
import {Controller, ControllerRenderProps, FieldValues, get, useFieldArray, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../LoginPage/ErrorCode";
import Select from "react-select";
import ReadOnlyTextInput from "../../../CommonComponents/ReadOnlyTextInput";
import ReadOnlyTextArea from "../../../CommonComponents/ReadOnlyTextArea";


type EvaluatedSpubTask = {
    yearFrom: string,
    yearTo: string,
    name: string,
    calculatedPoints: string
}

type Props = {
    evaluatedSpubTasks: EvaluatedSpubTask[],
}


function SpubTasksPoints(props: Props){
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
        <div className="col-12 p-3">
            <div className="table-striped w-100">
                <div className="text-white text-center bg-primary">
                    <div className="d-flex flex-row center">
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "5%"}}>
                            <b>Lp.</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "13%"}}>
                            <b>Rok rozpoczęcia</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "13%"}}>
                            <b>Rok zakończenia</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "60%"}}>
                            <b>Nazwa zadania</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "9%"}}>
                            <b>Punkty</b>
                        </div>

                        <div className="d-flex justify-content-center d-xl-none p-2 col-12">
                            <b>Zadania</b>
                        </div>
                    </div>
                </div>
                <div className="w-100 bg-light">
                    {!props.evaluatedSpubTasks.length &&
                        <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                            <div className="text-center">Nie dodano żadnego zadania</div>
                        </div>
                    }
                    {props.evaluatedSpubTasks.map((row: EvaluatedSpubTask, index: number) => (
                        <div key={index}
                             className={`d-flex flex-wrap flex-row justify-content-center border-bottom border-start border-end ${index % 2 == 0 ? "bg-light" : "bg-white"}`}
                        >
                            <div className="d-none d-xl-flex justify-content-center align-items-center p-2"
                                 style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                            >
                                {index + 1}.
                            </div>
                            <div className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                <b>Zadanie {index + 1}.</b>
                            </div>

                            <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                                 style={{width: windowWidth >= 1200 ? "13%" : "100%"}}
                            >
                                <div className="col-12 d-flex d-xl-none justify-content-center">Rok rozpoczęcia</div>
                                <ReadOnlyTextInput value={row.yearFrom} />
                            </div>
                            <div className="d-flex flex-wrap ustify-content-center align-items-center p-2"
                                 style={{width: windowWidth >= 1200 ? "13%" : "100%"}}
                            >
                                <div className="col-12 d-flex d-xl-none justify-content-center">Rok zakończenia</div>
                                <ReadOnlyTextInput value={row.yearTo} />
                            </div>
                            <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                                 style={{width: windowWidth >= 1200 ? "60%" : "100%"}}
                            >
                                <div className="col-12 d-flex d-xl-none justify-content-center">Nazwa</div>
                                <ReadOnlyTextArea value={row.name} />
                            </div>
                            <div className="d-flex flex-wrap text-center justify-content-center align-items-center p-2 border-start"
                                 style={{width: windowWidth >= 1200 ? "9%" : "100%"}}
                            >
                                <div className="col-12 d-xl-none">Punkty</div>
                                <ReadOnlyTextInput value={row.calculatedPoints} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default SpubTasksPoints
