import React, {createContext, Dispatch, useContext, useEffect, useState} from "react";
import {CruiseApplication, CruiseApplicationStatus} from "./CruiseApplicationsPage";
import Api from "../../Tools/Api";
import {AnyStringFilterOption, SelectStringFilterOption} from "../CommonComponents/ListFilterMenu";
import {FormPageLocationState} from "../FormPage/FormPage";
import {FieldContext, FieldTableWrapper} from "../FormPage/Wrappers/FieldTableWrapper";
import {cruiseApplicationsSortOptions, sortCruiseApplicationsByDate} from "./CruiseApplicationsListMisc";
import {SelectWrapper} from "../FormPage/Wrappers/ReactSelectWrapper";
import {CruiseApplicationsTableContent} from "./CruiseApplicationsTableContent";
import {CruiseApplicationsContext} from "../CruiseFormPage/CruiseFormPage";

const selectStringFilterDefaultOption: Option = {
    label: "--- Filtr wyłączony ---",
    value: ""
}

export enum CruiseApplicationListMode {
    Deletion = "deletion",
    Add = "add"
}

type CruiseApplicationsSetter =
    Dispatch<any> |
    ((applications: CruiseApplication[], disableAddingMode?: boolean) => void)

type Props = {
    mode?: CruiseApplicationListMode
    className?:string
}

const RowShouldBeShown = (mode)=> {
    const fieldContext = useContext(FieldContext)
    return (row):boolean => (( (mode == undefined) ) ||
        ((mode == CruiseApplicationListMode.Add) && !(fieldContext!.value.includes(row.id))) ||
        ((mode == CruiseApplicationListMode.Deletion) && fieldContext!.value.includes(row.id)))

}


export const ListModeContext = createContext<null|{mode?:CruiseApplicationListMode}>(null)

export const ApplicationsContext = createContext<CruiseApplication[]>([])

export default function CruiseApplicationsList(props: Props) {
    const applicationsContext = useContext(CruiseApplicationsContext)

    const [fetchedCruiseApplications, setFetchedCruiseApplications]: [CruiseApplication[], CruiseApplicationsSetter]
        = useState(applicationsContext ?? [])
    useEffect(() => {
        if (fetchedCruiseApplications.length <= 0)
            if (applicationsContext)
                setFetchedCruiseApplications(applicationsContext)
            else
                Api.get('/api/CruiseApplications').then(response =>
                    setFetchedCruiseApplications(response?.data))
    }, []);

    const [yearFilter, setYearFilter] = useState("")
    const [cruiseManagerLastNameFilter, setCruiseManagerLastNameFilter]
        = useState("")
    const [statusFilter, setStatusFilter] = useState("")


    const anyStringFilterOptions: AnyStringFilterOption[] = [
        {
            label: "Rok rejsu",
            filter: setYearFilter
        },
        {
            label: "Nazwisko kierownika",
            filter: setCruiseManagerLastNameFilter
        }
    ]
    const selectStringFilterOptions: SelectStringFilterOption[] = [
        {
            label: "Status",
            selectValues: Object.values(CruiseApplicationStatus),
            setFilter: setStatusFilter
        }
    ]


    const applyFilters = (row: CruiseApplication): boolean => {
        return (
            (yearFilter == "" || row.year.toString().toLowerCase().includes(yearFilter.toLowerCase()))
            && (cruiseManagerLastNameFilter == "" || row.cruiseManagerLastName.toLowerCase()
                    .includes(cruiseManagerLastNameFilter.toLowerCase()))
            && ( statusFilter == "" || row.status.toString() == statusFilter )
        )
    }

    const rowShouldBeShown = RowShouldBeShown(props.mode)
    const applicationsToDisplay = sortCruiseApplicationsByDate(fetchedCruiseApplications).reverse().filter(rowShouldBeShown).filter(applyFilters)

    const mdColWidths = [14, 10, 21,  12,12,15, 16]
    const mdColTitles = ["Numer/data", "Rok rejsu", "Kierownik", "Formularze", "Punkty", "Status", "Akcje", ]
    const colTitle = "Zgłoszenia"
    const emptyText = "Brak zgłoszeń"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, CruiseApplicationsTableContent,
        null, emptyText, applicationsToDisplay)

    const sortOptions = cruiseApplicationsSortOptions(fetchedCruiseApplications)
    return (
        <div className={"table-with-filters"}>
            {!(props.mode == CruiseApplicationListMode.Deletion) &&
            <div className={"w-100 d-flex flex-row p-2"}>
                        <SelectWrapper className="d-flex col-3 p-1" options={sortOptions} placeHolder={"Sortuj"}
                                       onChange={(selectedOption) => setFetchedCruiseApplications(selectedOption!.value())}/>
                        {anyStringFilterOptions.map((anyStringFilter, index) =>
                            <div key={index} className={`d-flex flex-column col-3 p-1`}>
                                <input
                                    className="field-common" placeholder={anyStringFilter.label}
                                    onChange={(e) => {
                                        anyStringFilter.filter(e.target.value)
                                    }}
                                />
                            </div>
                        )}
                        {selectStringFilterOptions.map((selectStringFilter, index) =>
                            <SelectWrapper className={"col-3 d-flex p-1"}
                                           placeHolder={"Sortuj"}
                                           options={
                                               [selectStringFilterDefaultOption].concat(
                                                   selectStringFilter.selectValues.map(selectValue => ({
                                                       label: selectValue,
                                                       value: selectValue
                                                   }))
                                               )
                                           }
                                           defaultValue={selectStringFilterDefaultOption}
                                           onChange={selectedOption =>
                                               selectStringFilter.setFilter(selectedOption?.value)
                                           }
                            />
                        )}
            </div>
            }
            <ListModeContext.Provider value={{mode:props.mode}}>
                <ApplicationsContext.Provider value={applicationsToDisplay}>
                    <Render className={"overflow-y-scroll " + props.className}/>
                </ApplicationsContext.Provider>
            </ListModeContext.Provider>
            {props.mode == CruiseApplicationListMode.Add && <b className="text-white bg-primary w-100 justify-content-center p-2 d-flex ">Dołączanie zgłoszenia</b> }
        </div>
    )
}