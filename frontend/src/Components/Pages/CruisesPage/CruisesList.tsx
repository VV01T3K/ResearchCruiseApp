import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import LinkWithState from "../../CommonComponents/LinkWithState";
import React, {Dispatch, useEffect, useState} from "react";
import {Cruise} from "./CruisesPage";
import {Application, ApplicationShortInfo} from "../ApplicationsPage/ApplicationsPage";
import CruiseApplicationsList from "./CruiseApplicationsList";
import DatePicker from "react-datepicker";
import Api from "../../Tools/Api";
import PageMenuBar from "../CommonComponents/PageMenuBar";
import ListSortMenu, {ListSortOption} from "../CommonComponents/ListSortMenu";
import ListFilterMenu, {AnyStringFilterOption} from "../CommonComponents/ListFilterMenu";


type Props = {
    cruises?: Cruise[],
    setCruises?: Dispatch<any>
}


export default function CruisesList(props: Props) {
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

    const handleDeleteCruise = (id: string) => {
        Api
            .delete(`/api/Cruises/${id}`)
            .then(response => {
                const newCruises: Cruise[] = props.cruises!
                    .filter(cruise => cruise.id != id)
                props.setCruises!(newCruises)
            })
    }

    const sortCruisesByNumber = (directionAscending: boolean) => {
        if (!props.cruises || !props.setCruises)
            return

        props.setCruises!([
            ...props.cruises!.sort((a: Cruise, b: Cruise): number =>
                (a.number.localeCompare(b.number)) * (directionAscending ? 1 : -1)
            )
        ])
    }
    const sortCruisesByStartDate = (directionAscending: boolean) => {
        if (!props.cruises || !props.setCruises)
            return

        props.setCruises!([
            ...props.cruises!.sort((a: Cruise, b: Cruise): number =>
                (Date.parse(a.date.start) - Date.parse(b.date.start)) * (directionAscending ? 1 : -1)
            )
        ])
    }

    const [cruiseManagerLastNameFilter, setCruiseManagerLastNameFilter]
        = useState("")

    const sortOptions: ListSortOption[] = [
        {
            label: "Numer (rosnąco)",
            value: "Numer (rosnąco)",
            sortMethod: sortCruisesByNumber,
            directionAscending: true
        },
        {
            label: "Numer (malejąco)",
            value: "Numer (malejąco)",
            sortMethod: sortCruisesByNumber,
            directionAscending: false
        },
        {
            label: "Czas rozpoczęcia (rosnąco)",
            value: "Czas rozpoczęcia (rosnąco)",
            sortMethod: sortCruisesByStartDate,
            directionAscending: true
        },
        {
            label: "Czas rozpoczęcia (malejąco)",
            value: "Czas rozpoczęcia (malejąco)",
            sortMethod: sortCruisesByStartDate,
            directionAscending: false
        }
    ]
    const anyStringFilterOptions: AnyStringFilterOption[] = [
        {
            label: "Nazwisko kierownika",
            setFilter: setCruiseManagerLastNameFilter
        }
    ]

    const applyFilters = (row: Cruise): boolean => {
        return (
            (
                cruiseManagerLastNameFilter == "" ||
                row.mainCruiseManagerLastName.toLowerCase().includes(cruiseManagerLastNameFilter.toLowerCase())
            )
        )
    }

    return (
        <>
            <PageMenuBar>
                <ListSortMenu
                    className="col-12 col-xl-4"
                    options={sortOptions}
                />
                <ListFilterMenu
                    anyStringFilters={anyStringFilterOptions}
                    selectStringFilters={[]}
                />
            </PageMenuBar>
            <div className="table-striped w-100">
                <div className="text-white text-center bg-primary">
                    <div className="d-flex flex-row center">
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "10%", cursor: "pointer"}}
                        >
                            <b>Numer</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "16%", cursor: "pointer"}}
                        >
                            <b>Czas rozpoczęcia</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "16%", cursor: "pointer"}}
                        >
                            <b>Czas zakończenia</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "23%"}}>
                            <b>Kierownik główny</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "19%"}}>
                            <b>Zgłoszenia</b>
                        </div>
                        <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "16%"}}>
                            <b>Akcje</b>
                        </div>

                        <div className="d-flex d-xl-none justify-content-center p-2 col-12">
                            <b>Rejsy</b>
                        </div>
                    </div>
                </div>
                <div className="w-100 bg-light">
                    {
                        (
                            !props.cruises ||
                            props.cruises
                                .filter(row => applyFilters(row))
                                .length == 0
                        ) &&
                        <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                            <div className={"text-center"}>Brak rejsów</div>
                        </div>
                    }
                    {props.cruises
                        ?.filter(row => applyFilters(row))
                        .map((row: Cruise, index: number) => (
                            <div key={index}
                                 className={`d-flex flex-wrap flex-row justify-content-center border-bottom ${index % 2 == 0 ? "bg-light" : "bg-white"}`}
                            >
                                <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                                     style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                                >
                                    <div className="col-12 d-flex d-xl-none justify-content-center">Numer</div>
                                    <ReadOnlyTextInput value={row.number} />
                                </div>
                                <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                                     style={{width: windowWidth >= 1200 ? "16%" : "100%"}}
                                >
                                    <div className="col-12 d-flex d-xl-none justify-content-center">Czas rozpoczęcia:</div>
                                    <DatePicker
                                        className={"d-flex w-100 text-center border border-opacity-75 rounded-2 p-1"}
                                        readOnly={true}
                                        locale={"pl"}
                                        selected={row.date.start ? new Date(row.date.start) : null}
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        onChange={() => {}}
                                    />
                                </div>
                                <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                                     style={{width: windowWidth >= 1200 ? "16%" : "100%"}}
                                >
                                    <div className="col-12 d-flex d-xl-none justify-content-center">Czas zakończenia:</div>
                                    <DatePicker
                                        className={"d-flex w-100 text-center border border-opacity-75 rounded-2 p-1"}
                                        closeOnScroll={true}
                                        readOnly={true}
                                        locale={"pl"}
                                        selected={row.date.end ? new Date(row.date.end) : null}
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        onChange={() => {}}
                                    />
                                </div>
                                <div className="d-flex flex-wrap justify-content-center align-content-center p-2"
                                     style={{width: windowWidth >= 1200 ? "23%" : "100%"}}
                                >
                                    <div className="col-12 d-flex d-xl-none justify-content-center">Kierownik główny:</div>
                                    {row.mainCruiseManagerId == "00000000-0000-0000-0000-000000000000" ?
                                        <div>Nie przypisano</div> :
                                        <>
                                            <ReadOnlyTextInput value={row.mainCruiseManagerFirstName} className="d-flex w-100 mb-1" />
                                            <ReadOnlyTextInput value={row.mainCruiseManagerLastName} className="d-flex w-100" />
                                        </>
                                    }
                                </div>
                                <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                                     style={{width: windowWidth >= 1200 ? "19%" : "100%"}}
                                >
                                    <div className="col-12 d-flex d-xl-none justify-content-center">Zgłoszenia:</div>
                                    <CruiseApplicationsList applicationsShortInfo={row.applicationsShortInfo} />
                                </div>
                                <div className="d-flex flex-wrap justify-content-center align-items-center p-2 text-center"
                                     style={{width: windowWidth >= 1200 ? "16%" : "100%"}}
                                >
                                    <div className="btn-group-vertical">
                                        <LinkWithState
                                            className="btn btn-info"
                                            to="/CruiseForm"
                                            label="Szczegóły"
                                            state={{ cruise: row }}
                                        />
                                        <button
                                            className="btn btn-outline-danger"
                                            style={{fontSize: "inherit"}}
                                            onClick={() => handleDeleteCruise(row.id)}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}