import {useContext, useEffect, useState} from 'react';
import {
    AnyStringFilterOption,
    SelectStringFilterOption,
} from '../../../../ToBeMoved/Pages/CommonComponents/ListFilterMenu';
import {FieldTableWrapper} from '../../FormPage/Wrappers/FieldTableWrapper';
import {cruiseApplicationsSortOptions, sortCruiseApplicationsByNumber,} from './CruiseApplicationsListMisc';
import {SelectSingleValue, SelectWrapper,} from '../../FormPage/Wrappers/ReactSelectWrapper';
import {CruiseApplicationsTableContent} from '../CruiseApplicationsTableContent';
import {FieldContext} from '@contexts/FieldContext';
import {CruiseApplicationListMode} from 'CruiseApplicationListMode';
import {ApplicationsContext} from '@contexts/ApplicationsContext';
import {ListModeContext} from '@contexts/ListModeContext';
import {CruiseApplication} from 'CruiseApplication';
import {CruiseApplicationStatus} from 'CruiseApplicationStatus';
import {getCruiseApplications} from '@api/requests';

export const selectStringFilterDefaultOption: SelectSingleValue = {
  label: '--- Filtr wyłączony ---',
  value: '',
};

type Props = {
  mode?: CruiseApplicationListMode;
  className?: string;
};

const RowShouldBeShown = (mode?: CruiseApplicationListMode) => {
  const fieldContext = useContext(FieldContext);
  return (row: CruiseApplication): boolean =>
    mode == undefined ||
    (mode == CruiseApplicationListMode.Add &&
      !fieldContext!.value.includes(row.id)) ||
    (mode == CruiseApplicationListMode.Deletion &&
      fieldContext!.value.includes(row.id));
};

export default function CruiseApplicationsList(props: Props) {
  const cruiseApplicationsContext = useContext(ApplicationsContext);

  const [fetchedCruiseApplications, setFetchedCruiseApplications] = useState(
    cruiseApplicationsContext ?? []
  );
  useEffect(() => {
    if (cruiseApplicationsContext != undefined) {
      setFetchedCruiseApplications(
        sortCruiseApplicationsByNumber(cruiseApplicationsContext).reverse()
      );
    } else {
      getCruiseApplications().then((response) =>
        setFetchedCruiseApplications(
          sortCruiseApplicationsByNumber(response?.data).reverse()
        )
      );
    }
  }, []);

  const [yearFilter, setYearFilter] = useState('');
  const [cruiseManagerLastNameFilter, setCruiseManagerLastNameFilter] =
    useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const anyStringFilterOptions: AnyStringFilterOption[] = [
    {
      label: 'Rok rejsu',
      filter: setYearFilter,
    },
    {
      label: 'Nazwisko kierownika',
      filter: setCruiseManagerLastNameFilter,
    },
  ];
  const selectStringFilterOptions: SelectStringFilterOption[] = [
    {
      label: 'Status',
      selectValues: Object.values(CruiseApplicationStatus),
      setFilter: setStatusFilter,
    },
  ];

  const applyFilters = (row: CruiseApplication): boolean => {
    return (
      (yearFilter == '' ||
        row.year.toString().toLowerCase().includes(yearFilter.toLowerCase())) &&
      (cruiseManagerLastNameFilter == '' ||
        row.cruiseManagerLastName
          .toLowerCase()
          .includes(cruiseManagerLastNameFilter.toLowerCase())) &&
      (statusFilter == '' || row.status.toString() == statusFilter)
    );
  };

  const rowShouldBeShown = RowShouldBeShown(props.mode);
  const applicationsToDisplay = fetchedCruiseApplications
    .filter(rowShouldBeShown)
    .filter(applyFilters);

  const mdColWidths = [14, 10, 21, 12, 12, 15, 16];
  const mdColTitles = [
    'Numer/data',
    'Rok rejsu',
    'Kierownik',
    'Formularze',
    'Punkty',
    'Status',
    'Akcje',
  ];
  const colTitle = 'Zgłoszenia';
  const emptyText = 'Brak zgłoszeń';
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    CruiseApplicationsTableContent,
    null,
    emptyText,
    applicationsToDisplay,
    !props.mode
  );

  const sortOptions = cruiseApplicationsSortOptions(fetchedCruiseApplications);
  return (
    <div className={'table-with-filters'}>
      {!(props.mode == CruiseApplicationListMode.Deletion) && (
        <div className={'w-100 d-flex flex-row p-2'}>
          <SelectWrapper
            className='d-flex col-6 col-md-3 p-1'
            options={sortOptions}
            placeHolder={'Sortuj'}
            onChange={(selectedOption) => {
              setFetchedCruiseApplications(
                (selectedOption!.value as () => CruiseApplication[])()
              );
            }}
          />
          {anyStringFilterOptions.map((anyStringFilter, index) => (
            <div
              key={index}
              className={`d-none d-md-flex flex-column col-3 p-1`}
            >
              <input
                className='field-common'
                placeholder={anyStringFilter.label}
                onChange={(e) => {
                  anyStringFilter.filter(e.target.value);
                }}
              />
            </div>
          ))}
          {selectStringFilterOptions.map((selectStringFilter, index) => (
            <SelectWrapper
              key={index}
              className={'col-6 col-md-3 d-flex p-1'}
              placeHolder={'Sortuj'}
              options={[selectStringFilterDefaultOption].concat(
                selectStringFilter.selectValues.map((selectValue) => ({
                  label: selectValue,
                  value: selectValue,
                }))
              )}
              defaultValue={selectStringFilterDefaultOption}
              onChange={(selectedOption) =>
                selectStringFilter.setFilter(selectedOption?.value)
              }
            />
          ))}
        </div>
      )}
      <ListModeContext.Provider value={{ mode: props.mode }}>
        <ApplicationsContext.Provider value={applicationsToDisplay}>
          <Render className={'' + props.className} />
        </ApplicationsContext.Provider>
      </ListModeContext.Provider>
      {props.mode == CruiseApplicationListMode.Add && (
        <b className='text-white bg-primary w-100 justify-content-center p-2 d-flex '>
          Dołączanie zgłoszenia
        </b>
      )}
    </div>
  );
}
