import React, {useEffect, useState} from "react";
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);
import 'react-dropdown/style.css';
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";


type Time = {
    startDate: string,
    endDate: string
}

type TaskValues =
    { author: string, title: string } |
    { title: string, institution: string, date: string} |
    { title: string, time: Time, financingAmount: string } |
    { description: string }

type EvaluatedTask = {
    type: number,
    values: TaskValues
    points: string
}

type Props = {
    evaluatedTasks: EvaluatedTask[]
}


function TasksPoints(props: Props) {
    const options= {
        'Praca licencjacka': ["Autor", "Tytuł" ],
        'Praca magisterska': ["Autor", "Tytuł" ],
        'Praca doktorska': ["Autor", "Tytuł" ],
        "Przygotowanie projektu naukowego": ["Tytuł", "Instytucja, do której składany", "Przewidywany termin składania"],
        "Realizacja projektu krajowego (NCN, NCBiR, itp.)": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Realizacja projektu wewnętrznego UG": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Realizacja innego projektu naukowego":["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Realizacja projektu komercyjnego": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Dydaktyka": ["Opis zajęcia dydaktycznego"],
        "Realizacja własnego zadania badawczego": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Inne zadanie": ["Opis zadania"]
    }

    const getTaskTitle = (item: EvaluatedTask) => {
        return Object.keys(options)[item.type]
    }

    const getFields = (item: EvaluatedTask) => {
        return Object.values(item.values)
    }

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
            <>
                <div className="table-striped w-100">
                    <div className="text-white text-center bg-primary">
                        <div className="d-flex flex-row center align-items-center">
                            <div className="text-center d-none d-xl-block border-end p-2" style={{width: "5%"}}>
                                <b>Lp.</b>
                            </div>
                            <div className="text-center d-none d-xl-block border-end p-2" style={{width: "20%"}}>
                                <b>Zadanie</b>
                            </div>
                            <div className="text-center d-none d-xl-block border-end p-2" style={{width: "70%"}}>
                                <b>Szczegóły</b>
                            </div>
                            <div className="text-center d-none d-xl-block p-2" style={{width: "5%"}}/>

                            <div className="text-center d-lg-block d-xl-none p-2 col-12">
                                <b>Zadania</b>
                            </div>
                        </div>
                    </div>
                    <div className="w-100">
                        {!props.evaluatedTasks.length &&
                            <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                                <div className="text-center">Nie wybrano żadnego zadania</div>
                            </div>
                        }
                        {props.evaluatedTasks.map((row: EvaluatedTask, rowIndex: number) => (
                            <div key={rowIndex} className="d-flex flex-wrap border bg-light">
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "5%"}}>
                                    {rowIndex + 1}.
                                </div>
                                <div className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                    <b>Zadanie {rowIndex + 1}.</b>
                                </div>

                                <div className="text-center align-items-center justify-content-center p-2 d-inline-flex border-end"
                                     style={{width: windowWidth >= 1200 ? "20%" : "100%"}}
                                >
                                    {getTaskTitle(row)}
                                </div>
                                <div className="text-center d-flex border-end"
                                     style={{width: windowWidth >= 1200 ? "70%" : "100%"}}
                                >
                                    <div className="d-flex flex-wrap justify-content-center justify-content-xl-start pb-3 w-100">
                                        {getFields(row).map((val: string | Time, valIdx: number) => {
                                            return (
                                                <div key={valIdx}
                                                     className={`${getFields(row).length == 2 && "col-xl-6"} ${getFields(row).length == 3 && "col-xl-4"} col-12 p-1`}
                                                >
                                                    <label className="d-flex justify-content-center align-items-center">
                                                        {Object.values(options)[row.type][valIdx]}
                                                    </label>
                                                    {(()=> {
                                                        switch (Object.values(options)[row.type][valIdx]){
                                                            case "Autor":
                                                            case "Tytuł":
                                                            case "Instytucja, do której składany":
                                                            case "Opis zajęcia dydaktycznego":
                                                            case "Opis zadania":
                                                                return <ReadOnlyTextInput value={val as string} />

                                                            case "Przewidywany termin składania":
                                                                return <ReadOnlyTextInput value={val as string} />
                                                            case "Ramy czasowe" :
                                                                return (
                                                                    <>
                                                                        <DatePicker
                                                                            showMonthYearPicker
                                                                            showMonthYearDropdown
                                                                            className={" text-center w-100 rounded-1 p-1"}
                                                                            style={{fontSize: "inherit"}}
                                                                            selectsStart
                                                                            startDate={(val as Time).startDate ? new Date((val as Time).startDate) : null}
                                                                            maxDate={(val as Time).endDate ? new Date((val as Time).endDate) : null}
                                                                            endDate={(val as Time).endDate ? new Date((val as Time).endDate) : null}
                                                                            locale={"pl"}
                                                                            selected={(val as Time).startDate ? new Date((val as Time).startDate) : null}
                                                                            dateFormat="dd/MM/yyyy"
                                                                            readOnly
                                                                        />
                                                                        <DatePicker
                                                                            showYearDropdown
                                                                            showMonthYearPicker
                                                                            className={"text-center w-100 rounded-1 p-1"}
                                                                            style={{fontSize: "inherit"}}
                                                                            startDate={(val as Time ).startDate ? new Date((val as Time ).startDate) : null}
                                                                            endDate={(val as Time ).endDate ? new Date((val as Time ).endDate) : null}
                                                                            minDate={(val as Time ).startDate ? new Date((val as Time ).startDate) : null}
                                                                            selectsEnd
                                                                            locale={"pl"}
                                                                            selected={(val as Time ).endDate ? new Date((val as Time ).endDate) : null}
                                                                            dateFormat="dd/MM/yyyy"
                                                                            readOnly
                                                                        />
                                                                    </>
                                                                )
                                                            case "Kwota finansowania" :
                                                                return <ReadOnlyTextInput value={val as string} />
                                                        }
                                                    })()}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="d-flex p-2 justify-content-center"
                                     style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                                >
                                    <div className={"align-items-center justify-content-center d-flex"}>
                                    <button type="button"
                                            style={{fontSize:"inherit"}}
                                            className="btn btn-info"
                                    >
                                        :)
                                    </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        </div>
    )
}


export default TasksPoints