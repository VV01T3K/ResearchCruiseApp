import {CruiseApplication} from "./CruiseApplicationsPage";

export type ListSortOption = {
    label: string,
    value: CruiseApplication[],
}

export const sortCruiseApplicationsByPoints = (cruiseApplications:CruiseApplication[]) => [
    ...cruiseApplications.sort((a, b): number =>
        (parseInt(a.points) - parseInt(b.points))
    )
]

export const sortCruiseApplicationsByDate = (cruiseApplications:CruiseApplication[]) =>[
    ...cruiseApplications.sort((a: CruiseApplication, b: CruiseApplication): number =>
        (Date.parse(a.date) - Date.parse(b.date))
    )
]

export const sortCruiseApplicationsByYear = (cruiseApplications:CruiseApplication[]) => [
    ...cruiseApplications.sort((a: CruiseApplication, b: CruiseApplication): number =>
        (Number(a.year) - Number(b.year))
    )
]

export const cruiseApplicationsSortOptions = (cruiseApplications: CruiseApplication[]) => [
    {
        label: "Data utworzenia (rosnąco)", value: () => cruiseApplications && sortCruiseApplicationsByDate(cruiseApplications)
    },
    {
        label: "Data utworzenia (malejąco)", value: () => cruiseApplications && sortCruiseApplicationsByDate(cruiseApplications).reverse()},
    {
        label: "Rok rejsu (rosnąco)", value: () => cruiseApplications && sortCruiseApplicationsByYear(cruiseApplications)
    },
    {
        label: "Rok rejsu (malejąco)", value: () => cruiseApplications && sortCruiseApplicationsByYear(cruiseApplications).reverse()
    },
    {
        label: "Punkty (rosnąco)", value: () => cruiseApplications && sortCruiseApplicationsByPoints(cruiseApplications)
    },
    {
        label: "Punkty (malejąco)", value: () => cruiseApplications && sortCruiseApplicationsByPoints(cruiseApplications).reverse()
    }
]