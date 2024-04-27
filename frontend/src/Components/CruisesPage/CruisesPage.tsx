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
        formAId: string | null,
        formBId: string | null,
        formCId: string | null,
        points: string,
        status: string
    }

    const generateLogicalCruises = () => {
        const records = [];
        for (let i = 1; i <= 100; i++) {
            const record = {
                id: `2024/${i}`,
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

    const [logicalCruises, setLogicalCruises]: [LogicalCruise[], Dispatch<any>]
        = useState(generateLogicalCruises())

    const [sortAscending, setSortAscending] = useState(true)

    const mapLogicalCruises = () =>
        logicalCruises.map((row: LogicalCruise, index: number) => (
            <div key={index}
                 className="d-flex flex-wrap flex-row justify-content-center border bg-light"
            >
                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                     style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                >
                    {row.id}
                </div>
                <div className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                    <b>Rejs {index + 1}.</b>
                </div>

                <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                     style={{width: windowWidth >= 1200 ? "45%" : "100%"}}
                >
                    <div className="col-12 d-flex d-xl-none justify-content-center">Formularze</div>
                    <Link
                        className={`col-4 d-flex justify-content-center text-decoration-none ${!row.formAId ? "text-muted" : ""}`}
                        to={row.formAId ? `/${row.formAId}` : "#"}
                        style={!row.formAId ? {cursor: "default"} : {}}
                    >
                        Formularz A
                    </Link>
                    <Link
                        className={`col-4 d-flex justify-content-center text-decoration-none ${!row.formBId ? "text-muted" : ""}`}
                        to={row.formBId ? `/${row.formBId}` : "#"}
                        style={!row.formBId ? {cursor: "default"} : {}}
                    >
                        Formularz B
                    </Link>
                    <Link
                        className={`col-4 d-flex justify-content-center text-decoration-none ${!row.formCId ? "text-muted" : ""}`}
                        to={row.formCId ? `/${row.formCId}` : "#"}
                        style={!row.formCId ? {cursor: "default"} : {}}
                    >
                        Formularz C
                    </Link>
                </div>
                <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                     style={{width: windowWidth >= 1200 ? "12%" : "100%"}}
                >
                    <div className="col-12 d-flex d-xl-none justify-content-center">Punkty</div>
                    <div className="col-4 d-flex justify-content-center">
                        {row!.points}
                    </div>
                </div>
                <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                     style={{width: windowWidth >= 1200 ? "20%" : "100%"}}
                >
                    <div className="col-12 d-flex d-xl-none justify-content-center">Status</div>
                    <div className="col-4 d-flex justify-content-center">
                        <i>{row!.status}</i>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center p-2"
                     style={{width: windowWidth >= 1200 ? "8%" : "100%"}}
                >
                    RFU
                    {/*<button type="button"*/}
                    {/*        className="btn btn-info"*/}
                    {/*        style={{fontSize:"inherit"}}*/}
                    {/*        onClick={() => {*/}
                    {/*        }}*/}
                    {/*>*/}
                    {/*    :)*/}
                    {/*</button>*/}
                </div>

            </div>
        ))

    const [mappedLogicalCruises, setMappedLogicalCruises] = useState(
        mapLogicalCruises()
    )

    const sortLogicalCruisesByPoints = () => {
        setLogicalCruises(
            logicalCruises?.sort((a: LogicalCruise, b: LogicalCruise): number =>
                (parseInt(a.points) - parseInt(b.points)) * (sortAscending ? -1 : 1)
            )
        )
        setSortAscending(!sortAscending)
        setMappedLogicalCruises(mapLogicalCruises())
    }

    const { dispatchEvent } = useCustomEvent('busy')

    const fetchData = async () => {
        return  Api.get(
            '/Users',)
            .then(response => {
                return response.data;
            })
            .then(response => setUserList(response))
            .finally(() => dispatchEvent(null))
            .catch(()=>{})

    }

    return (
        <>
            <Page className={props.className + " justify-content-center col-12 col-xl-9 bg-white"}>
                <div className="bg-white w-100 d-flex flex-column pb-1 m-2 center align-self-start justify-content-center p-2">
                   <h1 style={{fontSize:"2rem"}}>Rejsy</h1>

                    <div className="table-striped w-100 p2 p-xl-5">
                        <div className="text-white text-center bg-primary">
                            <div className="d-flex flex-row center">
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "15%"}}>
                                    <b>Numer</b>
                                </div>
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "45%"}}>
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
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "20%"}}>
                                    <b>Status</b>
                                </div>
                                <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "8%"}}>
                                    <b>RFU</b>
                                </div>
                            </div>
                        </div>
                        {!logicalCruises.length &&
                            <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                                <div className={"text-center"}>Brak rejsów</div>
                            </div>
                        }
                        {mappedLogicalCruises}
                    </div>
                </div>
            </Page>
        </>
    )
}


export default CruisesPage