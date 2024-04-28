import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Page from "../Tools/Page";
import Api from "../Tools/Api";
import DataTable from 'react-data-table-component';
import useCustomEvent from "../Tools/useCustomEvent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";


type Props = {
    className?: string
}


function CruisesPage(props: Props) {
    type LogicalCruise = {
        id: string,
        number: string,
        year: string,
        cruiseManagerFirstName: string,
        cruiseManagerLastName: string,
        formAId: string | null,
        formBId: string | null,
        formCId: string | null,
        points: string,
        status: string
    }

    const generateLogicalCruises = () => {
        const records: LogicalCruise[] = [];
        for (let i = 1; i <= 100; i++) {
            const record: LogicalCruise = {
                id: (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString(),
                number: `2024/${i}`,
                year: (2025 + Math.floor(Math.random() * 3)).toString(),
                cruiseManagerFirstName: i % 3 == (Math.floor(Math.random() * 3)) ? "Sławomir" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Mieczysław" : "Trzebiesław"),
                cruiseManagerLastName: i % 3 == (Math.floor(Math.random() * 3)) ? "Kiędonorski" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Adamczykowski" : "Sokołogonogonogonogonowski"),
                formAId: (i * 100).toString(),
                formBId: i % 2 === 0 ? null : (i * 1000).toString(),
                formCId:  null,
                points: (Math.floor(Math.random() * 300) + 1).toString(),
                status: i % 2 === 0 ? "Odrzucony" : "Zgłoszony"
            };
            records.push(record);
        }
        return records;
    };

    const [logicalCruises, setLogicalCruises]: [LogicalCruise[], Dispatch<any>]
        = useState(generateLogicalCruises())

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

    const [sortAscending, setSortAscending] = useState(true)

    const sortLogicalCruisesByPoints = () => {
        setLogicalCruises(
            logicalCruises?.sort((a: LogicalCruise, b: LogicalCruise): number =>
                (parseInt(a.points) - parseInt(b.points)) * (sortAscending ? -1 : 1)
            )
        )
        setSortAscending(!sortAscending)
    }

    const { dispatchEvent } = useCustomEvent('busy')

    // const fetchData = async () => {
    //     return  Api.get(
    //         '/Users',)
    //         .then(response => {
    //             return response.data;
    //         })
    //         .then(response => setUserList(response))
    //         .finally(() => dispatchEvent(null))
    //         .catch(()=>{})
    //
    // }

    return (
        <>
            <Page className={props.className + " justify-content-center col-12 col-xl-9 bg-white"}>
                <div className="bg-white w-100 d-flex flex-column pb-1 m-2 center align-self-start justify-content-center p-2">
                   <h1 style={{fontSize:"2rem"}}>Rejsy</h1>

                    <div className="table-striped w-100 p2 p-xl-5">
                        <div className="text-white text-center bg-primary">
                            <div className="d-flex flex-row center">
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "13%"}}>
                                    <b>Numer</b>
                                </div>
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "13%"}}>
                                    <b>Rok rejsu</b>
                                </div>
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "26%"}}>
                                    <b>Kierownik</b>
                                </div>
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "21%"}}>
                                    <b>Formularze</b>
                                </div>
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "12%", cursor: "pointer"}}
                                     onClick={sortLogicalCruisesByPoints}
                                >
                                    <b>Punkty</b>
                                    <div className="p-0 ms-2">
                                        {sortAscending ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}
                                    </div>
                                </div>
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "15%"}}>
                                    <b>Status</b>
                                </div>
                                <div className="d-flex d-xl-none justify-content-center p-2 col-12">
                                    <b>Rejsy</b>
                                </div>
                            </div>
                        </div>
                        <div className="w-100 bg-light">
                            {!logicalCruises.length &&
                                <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                                    <div className={"text-center"}>Brak rejsów</div>
                                </div>
                            }
                            {logicalCruises.map((row: LogicalCruise, index: number) => (
                                <div key={index}
                                     className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                                >
                                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                         style={{width: windowWidth >= 1200 ? "13%" : "100%"}}
                                    >
                                        <div className="col-12 d-flex d-xl-none justify-content-center">Numer:</div>
                                        {row.number}
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                         style={{width: windowWidth >= 1200 ? "13%" : "100%"}}
                                    >
                                        <div className="col-12 d-flex d-xl-none justify-content-center">Rok rejsu:</div>
                                        <input
                                            type="text"
                                            className="d-flex text-center col-12 bg-light border-0 p-0"
                                            value={row.year}
                                            readOnly
                                        />
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                         style={{width: windowWidth >= 1200 ? "26%" : "100%"}}
                                    >
                                        <div className="col-12 d-flex d-xl-none justify-content-center">Kierownik:</div>
                                        <input
                                            type="text"
                                            className="d-flex text-center col-12 bg-light border-0 p-0"
                                            value={row.cruiseManagerFirstName}
                                            readOnly
                                        />
                                        <input
                                            type="text"
                                            className="d-flex text-center col-12 bg-light border-0 p-0"
                                            value={row.cruiseManagerLastName}
                                            readOnly
                                        />
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                         style={{width: windowWidth >= 1200 ? "21%" : "100%"}}
                                    >
                                        <Link
                                            className={`col-12 d-flex justify-content-center ${!row.formAId ? "text-muted text-decoration-none" : ""}`}
                                            to={row.formAId ? `/${row.formAId}` : "#"}
                                            style={!row.formAId ? {cursor: "default"} : {}}
                                        >
                                            Formularz A
                                        </Link>
                                        <Link
                                            className={`col-12 d-flex justify-content-center ${!row.formBId ? "text-muted text-decoration-none" : ""}`}
                                            to={row.formBId ? `/${row.formBId}` : "#"}
                                            style={!row.formBId ? {cursor: "default"} : {}}
                                        >
                                            Formularz B
                                        </Link>
                                        <Link
                                            className={`col-12 d-flex justify-content-center ${!row.formCId ? "text-muted text-decoration-none" : ""}`}
                                            to={row.formCId ? `/${row.formCId}` : "#"}
                                            style={!row.formCId ? {cursor: "default"} : {}}
                                        >
                                            Formularz C
                                        </Link>
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                         style={{width: windowWidth >= 1200 ? "12%" : "100%"}}
                                    >
                                        <div className="col-12 d-flex d-xl-none justify-content-center">Punkty:</div>
                                        <Link
                                            className={`col-12 d-flex justify-content-center`}
                                            to={"/cruisePoints/" + row.id}
                                        >
                                            {row!.points}
                                        </Link>
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                                         style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                                    >
                                        <div className="col-12 d-flex d-xl-none justify-content-center">Status:</div>
                                        <div className="col-4 d-flex justify-content-center">
                                            <i>{row!.status}</i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}


export default CruisesPage