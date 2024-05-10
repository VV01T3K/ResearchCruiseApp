import React, {useEffect, useState} from 'react';
import Page from "../Page";
import Api from "../../Tools/Api";
import DataTable from 'react-data-table-component';
type Props = {
    className?: string
}


function MessagesPage(props: Props) {
    const [userList, setUserList] = useState(
        [])
    const [notReadToggle, setNotReadToggle] = useState(false)

    const ExpandedComponent = ({ data }) => <div className={"text-center p-3 border-bottom"}>
        <span className={"d-flex h5"}>Treść:</span>
        <p className={""}>{data.id}</p>
        </div>;

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
            name: 'Tytuł',
            selector: row => row.userName,
            sortable: true,
            center:true,
            wrap:true,
            grow:10

        },
        {
            name: 'Data',
            selector: row => row.firstName,
            sortable: true,
            center:true
        }
    ];

    const conditionalRowStyles = [
        {
            when: row => row.accepted === true,
            style: {
                backgroundColor: 'silver',
                // color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },
    ];

    const notRead =  (list: any[]) => list.filter(
        item => !item.emailConfirmed,
    );

    const applyFilters = (list:any[]) => {
        var tmp = list
        if(tmp.length) {
            if (notReadToggle)
                tmp = notRead(tmp)
        }
        return tmp
    }

    const subHeaderComponentMemo =
        <>
            <button className={`btn m-1 ${notReadToggle ? "btn-danger": "btn-primary "}`} onClick={() => {
                setNotReadToggle(!notReadToggle)
            }}>Nieprzeczytane
            </button>
        </>

    return (
        <>
            <Page className={props.className + " justify-content-center "}>
                <div className="bg-white w-100 d-flex flex-column pb-1 m-2 center align-self-start
                                justify-content-center p-2"
                >
                    <h1 style={{fontSize:"2rem"}}>Wiadomości</h1>

                    <div className="d-flex flex-column flex-wrap justify-content-center  p-2 p-xl-5 align-items-center">
                        <DataTable className={"dataTable"}
                                   // title="Lista użytkowników"
                                   columns={columns}
                                   data={applyFilters(userList)}
                                   // pagination // Włącza paginację
                                   highlightOnHover // Podświetla wiersze przy najechaniu
                                   responsive // Sprawia, że tabela jest responsywna
                                   striped // Dodaj paski kolorystyczne dla wierszy
                                   pointerOnHover // Zmień kursor na hoverze wierszy
                                   noDataComponent="Brak wiadomości" // Komunikat, gdy brak danych
                                   // paginationComponentOptions={{ rowsPerPageText: 'Wierszy na stronę:', rangeSeparatorText: 'z', noRowsPerPage: false, selectAllRowsItem: true, selectAllRowsItemText: 'Wszystkie' }}
                                   // contextMessage={{ singular: 'wiersz', plural: 'wiersze', message: 'zaznaczone' }}
                                   subHeader
                                   subHeaderComponent={subHeaderComponentMemo}
                                   expandableRows
                                   expandOnRowClicked
                                   // expandableRowExpanded={row => row.defaultExpanded}
                                   expandableRowsComponent={ExpandedComponent}
                                   conditionalRowStyles={conditionalRowStyles}
                        />
                    </div>
                </div>
            </Page>
        </>
    )
}


export default MessagesPage