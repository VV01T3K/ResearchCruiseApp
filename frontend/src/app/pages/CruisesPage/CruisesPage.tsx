import React, {createContext, useEffect, useState} from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PageTitle from '../../../components/Page/PageTitle';
import {CruisePageContent} from './CruisesPageMisc';
import {Cruise} from 'Cruise';
import Page from '../../../ToBeMoved/Pages/Page';
import {fetchCruises} from '@api/requests';
import {sortCruiseListByNumber} from '@app/pages/CruisesPage/CruiseListFilterAndSort';

export const CruiseStateContext = createContext<null | {
    cruises: Cruise[];
    setCruises: React.Dispatch<React.SetStateAction<Cruise[]>>;
}>(null);

export default function CruisesPage() {
    const [cruises, setCruises] = useState<Cruise[]>([]);

    useEffect(() => {
        if (cruises.length <= 0) {
            fetchCruises().then((response) => setCruises(response ? sortCruiseListByNumber(response?.data).reverse() : []));
        }
    }, []);

    return (
        <Page className="form-page">
            <PageTitle title="Rejsy" />
            <div className="form-page-content d-flex flex-column align-items-center">
                <CruiseStateContext.Provider value={{ cruises, setCruises }}>
                    <CruisePageContent />
                </CruiseStateContext.Provider>
            </div>
        </Page>
    );
}
