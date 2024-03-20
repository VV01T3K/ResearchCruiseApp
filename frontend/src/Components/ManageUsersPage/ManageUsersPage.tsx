import React, {useEffect, useState} from 'react';
import Page from "../Tools/Page";
import Api from "../Tools/Api";
import DataTable from 'react-data-table-component';
import './ManageUsersPage.css'
import {set} from "react-hook-form";
type Props = {
    className?: string
}


function ManageUsersPage(props: Props) {
    const [userList, setUserList] = useState(
        [])

    useEffect(
        () => {
            const fetchData = async () => {
                return  Api.get(
                    '/Users',)
                    .then(response => {
                        return response.data;
                    })

            }
            fetchData().then(response => setUserList(response))
        },[]
    )

        const columns = [

            {
                name: 'Nazwa użytkownika',
                selector: row => row.userName,
                sortable: true,
                center:true,
                wrap:true

            },
            {
                name: 'Imię',
                selector: row => row.firstName,
                sortable: true,
                center:true
            },

            {
                name: 'Nazwisko',
                selector: row => row.lastName,
                sortable: true,
                center:true
            },
            {
                name: 'Zaakceptowany',
                selector: row => row.accepted ? "tak": "nie",
                sortable: true,
                center:true,
                conditionalCellStyles: [
                    {
                        when: row => row.accepted === false,
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                    }],

            },
            {
                name: 'Email potwierdzony',
                selector: row => row.emailConfirmed ? "tak": "nie",
                sortable: true,
                center:true,
                conditionalCellStyles: [ {
                    when: row => row.emailConfirmed === false,
                    style: {
                        backgroundColor: 'red',
                        color: 'white',
                    },
                },
                ]

            },


            {
                name: 'Rola',
                selector: row => row.roles,
                sortable: true,
            },
            {
                name: 'Akcje',
                button: true,
                cell: row => (
                    <div className={"d-flex flex-wrap"}>
                        {!row.accepted && <button className={"btn btn-primary d-flex m-1"} style={{fontSize:"0.8rem"}} onClick={()=>{}}>Potwierdź</button>
                        }
                        {!row.emailConfirmed && <button className={"btn btn-primary d-flex m-1"} style={{fontSize:"0.8rem"}} onClick={()=>{}}>Wyślij mail</button>
                        }
                    </div>
                ),
            },
            {
                name: 'Usuń',
                button: true,
                cell: row => (
                        <button  onClick={()=>{}} className={"btn btn-danger d-flex m-1"} disabled={row.roles.includes("Administrator")} style={{fontSize:"0.8rem"}} onClick={()=>{}}>-</button>
                ),
            },
        ];



    const [filterText, setFilterText] = React.useState('');


    const nameFilter = (list: any[]) => list.filter(
        item => item.firstName && item.lastName && (item.firstName.toLowerCase().includes(filterText.toLowerCase())
        || item.lastName.toLowerCase().includes(filterText.toLowerCase())),
    );


    const [notAcceptedToggle, setNotAcceptedToggle] = useState(false)
    const [withoutConfirmedMailToggle, setWithoutConfirmedMailToggle] = useState(false)
    const notAccepted = (list: any[]) => list.filter(
        item => !item.accepted,
    );
    const withoutConfirmedMail =  (list: any[]) => list.filter(
        item => !item.emailConfirmed,
    );

    const applyFilters = (list:any[]) => {
        var tmp = list
        if(tmp.length) {
            if (notAcceptedToggle)
                tmp = notAccepted(tmp)
            if (withoutConfirmedMailToggle)
                tmp = withoutConfirmedMail(tmp)
            tmp = nameFilter(tmp)
        }
        return tmp
    }

    const subHeaderComponentMemo =
            <>
                <>
                    <input className={"btn btn-primary text-white "}

                           id="search"
                           type="text"
                           placeholder="Wyszukaj po imieniu lub nazwisku"
                           aria-label="Search Input"
                           value={filterText}
                           onChange={e => {setFilterText(e.target.value)}}
                    />
                    <button className={"btn btn-danger"} type="button" onClick={()=>setFilterText("")}>
                        X
                    </button>
                </>
                <button className={`btn  m-1 ${notAcceptedToggle ? "btn-danger": "btn-primary"}`} onClick={() => {
                    setNotAcceptedToggle(!notAcceptedToggle)
                }}>Niezaakceptowani
                </button>
                <button className={`btn m-1 ${withoutConfirmedMailToggle ? "btn-danger": "btn-primary "}`} onClick={() => {
                    setWithoutConfirmedMailToggle(!withoutConfirmedMailToggle)
                }}>Niepotwierdzony mail
                </button>
            </>

    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);
    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);
    const contextActions = React.useMemo(() => {
        const handleDelete = () => {
            // eslint-disable-next-line no-alert
            if (window.confirm(`Czy na pewno chcesz usunąć:\n\n ${selectedRows.map(r => r.userName).join('\n')}?`)) {
                setToggleCleared(!toggleCleared);
                const neww = Api.get('/Users').then(response => {
                        return [];
                    })
                setUserList(selectedRows)
                // setData(differenceBy(data, selectedRows, 'title'));
            }
        };
        const handleAccept = () => {
            if (window.confirm(`Czy na pewno chcesz zaakcptować:\n\n ${selectedRows.map(r => r.userName).join('\n')}?`)) {
                setToggleCleared(!toggleCleared);
                Api.patch('/Users')
                // setData(differenceBy(data, selectedRows, 'title'));
            }
        }

        const handleSendMail = () => {
            if (window.confirm(`Czy na pewno chcesz wysłać email:\n\n ${selectedRows.map(r => r.userName).join('\n')}?`)) {
                setToggleCleared(!toggleCleared);
                // setData(differenceBy(data, selectedRows, 'title'));
            }
        }

        return <>
            <button className={"btn btn-primary m-1"} onClick={handleAccept}>
                Zaakceptuj
            </button>
            <button className={"btn btn-primary m-1"} onClick={handleSendMail}>
                Wyślij Mail
            </button>
            <button className={"btn btn-danger m-1"} onClick={handleDelete}>
                Usuń
            </button>

        </>;
    }, [selectedRows, toggleCleared]);

    return (
        <>
            <Page className={props.className + " justify-content-center "}>
                <div className="bg-white w-100 d-flex flex-column pb-1 m-2 center align-self-start
                                justify-content-center p-2"
                >
                   <h1 style={{fontSize:"2rem"}}>Zarządzanie użytkownikami</h1>

                    <div className="d-flex flex-column flex-wrap justify-content-center  p-2 p-xl-5 align-items-center">
                        <DataTable className={"dataTable"}
                            title="Lista użytkowników"
                            columns={columns}
                            data={applyFilters(userList)}
                            pagination // Włącza paginację
                            highlightOnHover // Podświetla wiersze przy najechaniu
                            responsive // Sprawia, że tabela jest responsywna
                            striped // Dodaj paski kolorystyczne dla wierszy
                            selectableRows // Dodaj możliwość zaznaczania wierszy
                            selectableRowsHighlight // Podświetl zaznaczone wiersze
                            pointerOnHover // Zmień kursor na hoverze wierszy
                            noDataComponent="Nie znaleziono użytkowników" // Komunikat, gdy brak danych
                            paginationComponentOptions={{ rowsPerPageText: 'Wierszy na stronę:', rangeSeparatorText: 'z', noRowsPerPage: false, selectAllRowsItem: true, selectAllRowsItemText: 'Wszystkie' }}
                           contextMessage={{ singular: 'wiersz', plural: 'wiersze', message: 'zaznaczone' }}
                           subHeader
                           subHeaderComponent={subHeaderComponentMemo}
                           contextActions={contextActions}
                           onSelectedRowsChange={handleRowSelected}
                           clearSelectedRows={toggleCleared}
                        />
                    </div>
                </div>
            </Page>
        </>
    )
}


export default ManageUsersPage