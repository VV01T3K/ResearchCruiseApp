import { CruiseApplication } from 'CruiseApplication';

export const sortCruiseApplicationsByPoints = (cruiseApplications?: CruiseApplication[]) => cruiseApplications ? [
    ...cruiseApplications?.sort((a, b): number =>
        (parseInt(a.points) - parseInt(b.points)),
    ),
] : [];

export const sortCruiseApplicationsByDate = (cruiseApplications?: CruiseApplication[]) => cruiseApplications ? [
    ...cruiseApplications?.sort((a: CruiseApplication, b: CruiseApplication): number =>
        (Date.parse(a.date) - Date.parse(b.date)),
    ),
] : [];

export const sortCruiseApplicationsByYear = (cruiseApplications?: CruiseApplication[]) => cruiseApplications ? [
    ...cruiseApplications?.sort((a: CruiseApplication, b: CruiseApplication): number =>
        (Number(a.year) - Number(b.year)),
    ),
] : [];

export const cruiseApplicationsSortOptions = (cruiseApplications: CruiseApplication[]) => [
    {
        label: 'Data utworzenia (rosnąco)', value: () => sortCruiseApplicationsByDate(cruiseApplications),
    },
    {
        label: 'Data utworzenia (malejąco)', value: () => sortCruiseApplicationsByDate(cruiseApplications).reverse(),
    },
    {
        label: 'Rok rejsu (rosnąco)', value: () => sortCruiseApplicationsByYear(cruiseApplications),
    },
    {
        label: 'Rok rejsu (malejąco)', value: () => sortCruiseApplicationsByYear(cruiseApplications).reverse(),
    },
    {
        label: 'Punkty (rosnąco)', value: () => sortCruiseApplicationsByPoints(cruiseApplications),
    },
    {
        label: 'Punkty (malejąco)', value: () => sortCruiseApplicationsByPoints(cruiseApplications).reverse(),
    },
];