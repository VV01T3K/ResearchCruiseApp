import React, {createContext, Dispatch, useEffect, useState} from "react";
import {CruiseApplication, CruiseApplicationStatus} from "./CruiseApplicationsPage";
import Api from "../../Tools/Api";
import {AnyStringFilterOption, SelectStringFilterOption} from "../CommonComponents/ListFilterMenu";
import {FormPageLocationState} from "../FormPage/FormPage";
import {FieldTableWrapper} from "../FormPage/Wrappers/FieldTableWrapper";
import {cruiseApplicationsSortOptions} from "./CruiseApplicationsListMisc";
import {SelectWrapper} from "../FormPage/Wrappers/ReactSelectWrapper";
import {CruiseApplicationsTableContent} from "./CruiseApplicationsTableContent";

const selectStringFilterDefaultOption: Option = {
    label: "--- Filtr wyłączony ---",
    value: ""
}

type CruiseApplicationsSetter =
    Dispatch<any> |
    ((applications: CruiseApplication[], disableAddingMode?: boolean) => void)

type Props = {
    // Only defined if the component is called from the cruise's details page.
    // It then contains the cruiseApplications already assigned to a cruise
    boundCruiseApplications?: CruiseApplication[]

    // Callback to the function in the parent component that updates the cruiseApplications
    // assigned to a cruise
    setBoundCruiseApplications?: CruiseApplicationsSetter

    // Indicates if the list should allow adding a cruiseApplication to a cruise
    addingMode?: boolean,

    // Indicated if the list should allow deleting cruiseApplications from a cruise
    deletionMode?: boolean
}

export const ListModeContext = createContext<null|{addingMode?:boolean, deletionMode?:boolean}>(null)

export const ApplicationsContext = createContext(null)

export default function CruiseApplicationsList(props: Props) {

    const [fetchedCruiseApplications, setFetchedCruiseApplications]: [CruiseApplication[], CruiseApplicationsSetter]
        = useState([])
    useEffect(() => {
        if (!props.deletionMode) {
            Api.get('/api/CruiseApplications').then(response =>
                setFetchedCruiseApplications(response?.data))
        }
    }, []);

    const getDisplayedCruiseApplications = () => props.deletionMode
        ? props.boundCruiseApplications // In deletion mode bound cruise applications are displayed
        : fetchedCruiseApplications! // Outside deletion mode fetched cruise applications are displayed

    const getDisplayedCruiseApplicationsSetter = () => props.deletionMode
        ? props.setBoundCruiseApplications // In deletion mode bound cruise applications are displayed
        : setFetchedCruiseApplications // Outside deletion mode fetched cruise applications are displayed

    const setDisplayedCruiseApplications = (newValues: CruiseApplication[]): void => {
        const setter: CruiseApplicationsSetter = getDisplayedCruiseApplicationsSetter()
        setter(newValues, false)
    }

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
    const rowShouldBeShown = (row: CruiseApplication): boolean => {
        return (
            (
                // this list does not enable assigning applications to a cruise
                !props.addingMode
            ) ||
            (
                // the application is not already assigned to the cruise
                props.addingMode && !props.boundCruiseApplications!
                    .filter(application => application.number == row.number)
                    .length
            )
        )
    }



    const getFormPageLocationState = (formType: string, cruiseApplicationId?: string): FormPageLocationState => {
        return {
            formType: formType,
            cruiseApplicationId: cruiseApplicationId ?? undefined,
            readonly: true
        }
    }
    const getRowBackground = (index: number) => {
        return index % 2 == 0 ? "bg-light" : "bg-white"
    }

    const applicationsToDisplay = getDisplayedCruiseApplications()?.filter(applyFilters).filter(rowShouldBeShown)

    const mdColWidths = [14, 10, 21,  12,12,15, 16]
    const mdColTitles = ["Numer/data", "Rok rejsu", "Kierownik", "Formularze", "Punkty", "Status", "Akcje", ]
    const colTitle = "Zgłoszenia"
    const emptyText = "Brak zgłoszeń"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, CruiseApplicationsTableContent,
        null, emptyText, applicationsToDisplay)

    const sortOptions = cruiseApplicationsSortOptions(getDisplayedCruiseApplications()!)
    return (
        <div className={"table-with-filters"}>
            <div className={"w-100 d-flex flex-row p-2"}>
                <SelectWrapper className="d-flex col-3 p-1" options={sortOptions} placeHolder={"Sortuj"}
                    onChange={(selectedOption) => setDisplayedCruiseApplications(selectedOption!.value())}/>
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
                    // </div>
                )}
                {/*</div>*/}
            </div>
            <ListModeContext.Provider value={{addingMode:props.addingMode, deletionMode:props.deletionMode}}>
                <ApplicationsContext.Provider value={applicationsToDisplay}>
                    <Render className={"overflow-y-scroll"}/>
                </ApplicationsContext.Provider>
            </ListModeContext.Provider>
            {props.addingMode && <b className="text-white bg-primary w-100 justify-content-center p-2 d-flex ">Dołączanie zgłoszenia</b> }
        </div>
    )
}