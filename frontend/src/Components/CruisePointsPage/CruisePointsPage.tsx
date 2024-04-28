import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Page from "../Tools/Page";
import Api from "../Tools/Api";
import DataTable from 'react-data-table-component';
import useCustomEvent from "../Tools/useCustomEvent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import {Link, useParams} from "react-router-dom";
import SpubTasksInput from "../Forms/Inputs/SpubTasksInput";


function CruisePointsPage() {
    type LogicalCruise = {
        id: string,
        year: string,
        cruiseManagerFirstName: string,
        cruiseManagerLastName: string,
        formAId: string | null,
        formBId: string | null,
        formCId: string | null,
        points: string,
        status: string
    }

    let { logicalCruiseId } = useParams()

    const generateLogicalCruises = () => {
        const records: LogicalCruise[] = [];
        for (let i = 1; i <= 100; i++) {
            const record: LogicalCruise = {
                id: `2024/${i}`,
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
            <Page className="justify-content-center col-12 col-xl-9 bg-white">
                <div className="bg-white w-100 d-flex flex-column pb-1 m-2 center align-self-start justify-content-center p-2">
                   <h1 style={{fontSize:"2rem"}}>Rejs {logicalCruiseId}</h1>

                    {/*<SpubTasksInput className={""} name={""} historicalSpubTasks={""} required={""} />*/}
                </div>
            </Page>
        </>
    )
}


export default CruisePointsPage