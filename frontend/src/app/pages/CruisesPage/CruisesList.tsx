import React, { createContext, useContext } from 'react';
import { CruiseStateContext } from './CruisesPage';
import { SelectWrapper } from '../FormPage/Wrappers/ReactSelectWrapper';
import {
    FieldTableWrapper,
} from '../FormPage/Wrappers/FieldTableWrapper';
import {
    Number,
    Actions,
    Cruises,
    EndDate,
    MainCruiseManagerId,
    StartDate,
} from './CruiseListFields';
import {
    CruisesListFilterAndSort,
    FilterMapper,
} from './CruiseListFilterAndSort';
import { Cruise } from 'Cruise';
import { CellContext } from '@contexts/CellContext';

export const CruisesTools = () => {
    const cellContext = useContext(CellContext);
    const cruisesContext = useContext(CruisesContext);

    const cruise: Cruise = cruisesContext![cellContext?.rowIndex!];
    return { cruise };
};

export const CruisesContext = createContext<undefined | Cruise[]>(undefined);

const CruisesListTableContent = () => [
    Number,
    StartDate,
    EndDate,
    MainCruiseManagerId,
    Cruises,
    Actions,
];

export default function CruisesList() {
    const cruiseStateContext = useContext(CruiseStateContext);
    const { cruisesToDisplay, sortOptions, anyStringFilterOptions } =
        CruisesListFilterAndSort();

    // const _UpperMenu = UpperMenu()
    const mdColWidths = [12, 16, 16, 23, 17, 16];
    const mdColTitles = [
        'Numer',
        'Czas rozpoczęcia',
        'Czas zakończenia',
        'Kierownik główny',
        'Zgłoszenia',
        'Akcje',
    ];
    const colTitle = 'Rejsy';
    const emptyText = 'Brak rejsów';
    const { Render } = FieldTableWrapper(
        colTitle,
        mdColWidths,
        mdColTitles,
        CruisesListTableContent,
        null,
        emptyText,
        cruisesToDisplay,
    );

    return (
        <div className={'table-with-filters w-100'}>
            <div className={'d-flex flex-row w-100'}>
                <SelectWrapper
                    className="d-flex col-3 p-1"
                    options={sortOptions}
                    placeHolder={'Sortuj'}
                    onChange={(selectedOption) =>
                        cruiseStateContext!.setCruises((selectedOption!.value as () => Cruise[])())
                    }
                />
                <FilterMapper
                    filterOptions={anyStringFilterOptions}
                    optionClassName="d-flex col-3 p-1"
                />
            </div>
            <CruisesContext.Provider value={cruisesToDisplay}>
                <Render className={'overflow-y-scroll'} />
            </CruisesContext.Provider>
        </div>
    );
}
