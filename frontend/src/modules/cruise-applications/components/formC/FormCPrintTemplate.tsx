/* eslint-disable @eslint-react/no-array-index-key */
import dayjs from 'dayjs';
import { Fragment, RefObject } from 'react';

import { cn } from '@/core/lib/utils';
import { PrintableResearchTaskDetails } from '@/cruise-applications/components/common/printable-research-task-details/PrintableResearchTaskDetails';
import { PrintingPage } from '@/cruise-applications/components/common/printing/PrintingPage';
import { PrintingPageSection } from '@/cruise-applications/components/common/printing/PrintingPageSection';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';
import { mapPersonToText } from '@/cruise-applications/helpers/PersonMappers';
import { getContractCategoryName } from '@/cruise-applications/models/ContractDto';
import { getPublicationCategoryLabel } from '@/cruise-applications/models/PublicationDto';
import { getTaskName } from '@/cruise-applications/models/ResearchTaskDto';

function getAction(action: 'Put' | 'Collect'): string {
  if (action === 'Put') {
    return 'Pozostawienie';
  }

  if (action === 'Collect') {
    return 'Zabranie';
  }

  throw new Error('Invalid action');
}

type Props = {
  ref: RefObject<HTMLDivElement | null>;
};
export function FormCPrintTemplate({ ref }: Props) {
  const { formAInitValues, formBInitValues, form, formA, formB, cruise } = useFormC();
  const values = form.state.values;

  return (
    <PrintingPage ref={ref} title="Formularz C">
      <PrintingPageSection title="1. Informacje o rejsie">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Numer rejsu: </span>
          <span>{cruise.number}</span>
          <span>Terminy rozpoczęcia i zakończenia: </span>
          <span>
            {dayjs(cruise.startDate).format('DD.MM.YYYY HH:mm')} - {dayjs(cruise.endDate).format('DD.MM.YYYY HH:mm')}
          </span>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="2. Kierownik zgłaszanego rejsu">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Kierownik rejsu: </span>
          <span>{mapPersonToText(formAInitValues.cruiseManagers.find((x) => x.id === formA.cruiseManagerId))}</span>
          <span>Zastępca kierownika rejsu: </span>
          <span>{mapPersonToText(formAInitValues.deputyManagers.find((x) => x.id === formA.deputyManagerId))}</span>
          <span>Rok: </span>
          <span>{formA.year}</span>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="3. Sposób wykorzystania statku">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Sposób wykorzystania statku:</span>
          <span>{formAInitValues?.shipUsages.find((_, i) => i === parseInt(values.shipUsage))}</span>
          <span>Inny sposób użycia:</span>
          <span>{values.differentUsage}</span>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="4. Dodatkowe pozwolenia do przeprowadzonych w trakcie rejsu badań">
        <div className="grid grid-cols-10 gap-x-4">
          <div className="mb-4 font-semibold col-span-1 text-center">Lp.</div>
          <div className="mb-4 font-semibold col-span-3 text-center">Treść pozwolenia</div>
          <div className="mb-4 font-semibold col-span-3 text-center">Organ wydający</div>
          <div className="mb-4 font-semibold col-span-3 text-center">Skan</div>
          {values.permissions.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>{x.description}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>{x.executive}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>
                {x.scan?.name || 'Brak skanu'}
              </div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="5. Rejon prowadzenia badań">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Rejon prowadzenia badań: </span>
          <span>{formAInitValues.researchAreas.find((x) => x.id === values.researchAreaId)?.name}</span>
          <span>Informacje dodatkowe: </span>
          <span>{formA.researchAreaInfo}</span>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="6. Cel rejsu">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Cel rejsu: </span>
          <span>{formAInitValues.cruiseGoals.find((_, i) => i === parseInt(formA.cruiseGoal))}</span>
          <span>Opis: </span>
          <span>{formA.cruiseGoalDescription}</span>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="7. Zadania przypisane do rejsu - efekty rejsu">
        <div className="grid grid-cols-9 gap-x-8">
          <div className="mb-4 font-semibold col-span-1 text-center">Lp.</div>
          <div className="mb-4 font-semibold col-span-2 text-center">Zadanie</div>
          <div className="mb-4 font-semibold col-span-3 text-center">Szczegóły</div>
          <div className="mb-4 font-semibold col-span-3 text-center" />
          {values.researchTasksEffects.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>
                <div>{i + 1}.</div>
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 flex items-center')}>
                <div>{getTaskName(x.type)}</div>
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 flex items-center')}>
                <div className="w-full">
                  <PrintableResearchTaskDetails data={x} />
                </div>
              </div>
              <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid grid-cols-4')}>
                <div className="col-span-3">Zrealizowane: </div>
                <div>{x.done === 'true' ? 'Tak' : 'Nie'}</div>
                <div className="col-span-3">Punkty naliczone kierownikowi: </div>
                <div>{x.managerConditionMet === 'true' ? 'Tak' : 'Nie'}</div>
                <div className="col-span-3">Punkty naliczone zastępcy: </div>
                <div>{x.deputyConditionMet === 'true' ? 'Tak' : 'Nie'}</div>
              </span>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="8. Umowy regulujące współpracę, w ramach której zostały zrealizowane zadania badawcze">
        <div className="grid grid-cols-9 gap-x-8">
          <span className="mb-2 font-semibold col-span-1 text-center">Lp.</span>
          <span className="mb-2 font-semibold col-span-2 text-center">Kategoria</span>
          <span className="mb-2 font-semibold col-span-6 text-center">Pozostałe szczegóły</span>
          {values.contracts.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-8' : '', 'col-span-1 grid place-items-center')}>
                <span>{i + 1}.</span>
              </div>
              <div className={cn(i > 0 ? 'mt-8' : '', 'col-span-2 grid place-items-center')}>
                <span>{getContractCategoryName(x.category)}</span>
              </div>
              <div className={cn(i > 0 ? 'mt-8' : '', 'col-span-6 flex flex-col')}>
                <div className="font-semibold">Szczegóły</div>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <span>Nazwa instytucji:</span>
                    <span>{x.institutionName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Jednostka:</span>
                    <span>{x.institutionUnit}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Lokalizacja instytucji:</span>
                    <span>{x.institutionLocalization}</span>
                  </div>
                </div>
                <div className="font-semibold">Opis</div>
                <div className="mb-4">{x.description}</div>
                <div className="font-semibold">Skany</div>
                <div>
                  {x.scans.length === 0
                    ? 'Brak skanów'
                    : x.scans.map((file, fileIndex) => <div key={fileIndex}>{file.name}</div>)}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="9. Zespoły badawcze, które uczestniczyły w rejsie">
        <div className="grid grid-cols-9 gap-x-8 mb-16">
          <div className="mb-4 font-semibold col-span-1 text-center">Lp.</div>
          <div className="mb-4 font-semibold col-span-3 text-center">Jednostka</div>
          <div className="mb-4 font-semibold col-span-3 text-center">Liczba pracowników</div>
          <div className="mb-4 font-semibold col-span-2 text-center">Liczba studentów</div>
          {values.ugTeams.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>
                {formAInitValues.ugUnits.find(({ id }) => id === x.ugUnitId)?.name}
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>{x.noOfEmployees}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.noOfStudents}</div>
            </Fragment>
          ))}
        </div>

        <div className="grid grid-cols-9 gap-x-8 mb-16">
          <div className="mb-4 font-semibold col-span-1 text-center">Lp.</div>
          <div className="mb-4 font-semibold col-span-6 text-center">Instytucja</div>
          <div className="mb-4 font-semibold col-span-2 text-center">Liczba osób</div>
          {values.guestTeams.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-6 grid place-items-center')}>{x.name}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.noOfPersons}</div>
            </Fragment>
          ))}
        </div>

        <div className="grid grid-cols-9 gap-x-8">
          <div className="mb-2 font-semibold col-span-1 text-center">Lp.</div>
          <div className="mb-2 font-semibold col-span-2 text-center">Dane osobowe</div>
          <div className="mb-2 font-semibold col-span-4 text-center">Dokument tożsamości</div>
          <div className="mb-2 font-semibold col-span-2 text-center">Nazwa jednostki</div>
          {formB.crewMembers.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                {x.title} {x.firstName} {x.lastName}
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4')}>
                <div className="flex justify-between items-center">
                  <span>Miejsce urodzenia:</span>
                  <span>{x.birthPlace}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data urodzenia:</span>
                  <span>{dayjs(x.birthDate).format('DD.MM.YYYY')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Numer ID dokumentu:</span>
                  <span>{x.documentNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data ważności dokumentu:</span>
                  <span>{dayjs(x.documentExpiryDate).format('DD.MM.YYYY')}</span>
                </div>
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.institution}</div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="10. Publikacje">
        <div className="grid grid-cols-9 gap-x-8">
          <span className="mb-2 font-semibold col-span-1 text-center">Lp.</span>
          <span className="mb-2 font-semibold col-span-1 text-center">Kategoria</span>
          <span className="mb-2 font-semibold col-span-5 text-center">Informacje</span>
          <span className="mb-2 font-semibold col-span-1 text-center">Rok wydania</span>
          <span className="mb-2 font-semibold col-span-1 text-center">Punkty minister.</span>
          {formA.publications.map((x, i) => (
            <Fragment key={i}>
              <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</span>
              <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>
                {getPublicationCategoryLabel(x.category)}
              </span>
              <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-5 px-4')}>
                <div className="flex justify-between items-center">
                  <span>DOI:</span>
                  <span>{x.doi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Autorzy:</span>
                  <span>{x.authors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tytuł:</span>
                  <span>{x.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Czasopismo:</span>
                  <span>{x.magazine}</span>
                </div>
              </span>
              <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.year}</span>
              <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>
                {x.ministerialPoints}
              </span>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="11. Zadania SPUB, z którymi pokrywają się zadania zrealizowane na rejsie">
        <div className="grid grid-cols-9 gap-x-8">
          <div className="mb-2 font-semibold col-span-1 text-center">Lp.</div>
          <div className="mb-2 font-semibold col-span-2 text-center">Rok rozpoczęcia</div>
          <div className="mb-2 font-semibold col-span-2 text-center">Rok zakończenia</div>
          <div className="mb-2 font-semibold col-span-4 text-center">Nazwa zadania</div>
          {values.spubTasks.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.yearFrom}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.yearTo}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.name}</div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="12. Szczegóły rejsu">
        <div>
          <h3 className="text-xl mb-2">Wystawienie sprzętu</h3>
          <div className="grid grid-cols-9 gap-x-8">
            <div className="mb-2 font-semibold col-span-1 text-center">Lp.</div>
            <div className="mb-2 font-semibold col-span-2 text-center">Od</div>
            <div className="mb-2 font-semibold col-span-2 text-center">Do</div>
            <div className="mb-2 font-semibold col-span-4 text-center">Nazwa sprzętu</div>
            {values.shortResearchEquipments.map((x, i) => (
              <Fragment key={i}>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                  {dayjs(x.startDate).format('DD.MM.YYYY')}
                </div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                  {dayjs(x.endDate).format('DD.MM.YYYY')}
                </div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.name}</div>
              </Fragment>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl mb-2">Pozostawienie lub zabranie sprzętu</h3>
          <div className="grid grid-cols-9 gap-x-8">
            <div className="mb-2 font-semibold col-span-1 text-center">Lp.</div>
            <div className="mb-2 font-semibold col-span-2 text-center">Czynność</div>
            <div className="mb-2 font-semibold col-span-2 text-center">Czas</div>
            <div className="mb-2 font-semibold col-span-4 text-center">Nazwa sprzętu</div>
            {values.longResearchEquipments.map((x, i) => (
              <Fragment key={i}>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                  {getAction(x.action)}
                </div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.duration}</div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.name}</div>
              </Fragment>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl mb-2">Wchodzenie lub wychodzenie z portu</h3>
          <div className="grid grid-cols-9 gap-x-8">
            <div className="mb-2 font-semibold col-span-1 text-center">Lp.</div>
            <div className="mb-2 font-semibold col-span-2 text-center">Wejście</div>
            <div className="mb-2 font-semibold col-span-2 text-center">Wyjście</div>
            <div className="mb-2 font-semibold col-span-4 text-center">Nazwa portu</div>
            {values.ports.map((x, i) => (
              <Fragment key={i}>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                  {dayjs(x.startTime).format('DD.MM.YYYY HH:mm')}
                </div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                  {dayjs(x.endTime).format('DD.MM.YYYY HH:mm')}
                </div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.name}</div>
              </Fragment>
            ))}
          </div>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="13. Szczegółowy plan zadań zrealizowanych podczas rejsu">
        <div className="grid grid-cols-6 gap-x-8">
          <div className="mb-2 font-semibold col-span-1 text-center">Dzień</div>
          <div className="mb-2 font-semibold col-span-1 text-center">Liczba godzin</div>
          <div className="mb-2 font-semibold col-span-1 text-center">Nazwa zadania</div>
          <div className="mb-2 font-semibold col-span-1 text-center">Rejon zadania</div>
          <div className="mb-2 font-semibold col-span-1 text-center">Pozycja</div>
          <div className="mb-2 font-semibold col-span-1 text-center">Uwagi</div>
          {values.cruiseDaysDetails.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.number}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.hours}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.taskName}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.region}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.position}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.comment}</div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="14. Lista sprzętu i aparatury badawczej użytej podczas rejsu">
        <div className="grid grid-cols-9 gap-x-8">
          <div className="mb-2 font-semibold col-span-1 text-center">Lp.</div>
          <div className="mb-2 font-semibold col-span-3 text-center">Nazwa sprzętu / aparatury</div>
          <div className="mb-2 font-semibold col-span-3 text-center">Data zgłoszenia do ubezpieczenia</div>
          <div className="mb-2 font-semibold col-span-2 text-center">Zgoda opiekuna</div>
          {values.researchEquipments.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>{x.name}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>
                {x.insuranceStartDate ? dayjs(x.insuranceStartDate).format('DD.MM.YYYY') : ''}
                {x.insuranceStartDate || x.insuranceEndDate ? ' - ' : ''}
                {x.insuranceEndDate ? dayjs(x.insuranceEndDate).format('DD.MM.YYYY') : ''}
                {!x.insuranceStartDate && !x.insuranceEndDate ? 'Nie zgłoszono' : ''}
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                {x.permission === 'true' ? 'Tak' : 'Nie'}
              </div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="15. Elementy techniczne statku wykorzystywane podczas rejsu">
        <div className="grid grid-cols-9 gap-x-8">
          <div className="mb-2 font-semibold col-span-7 text-center">Element</div>
          <div className="mb-2 font-semibold col-span-2 text-center">W użyciu</div>
          {formBInitValues.shipEquipments.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-7 grid place-items-center')}>{x.name}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                {values.shipEquipmentsIds.filter((id) => id === x.id).length > 0 ? 'Tak' : 'Nie'}
              </div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="16. Lista próbek pobranych i poddanych analizie podczas rejsu">
        <div className="grid grid-cols-10 gap-x-8">
          <div className="mb-2 font-semibold col-span-2 text-center">Rodzaj materiału badawczego</div>
          <div className="mb-2 font-semibold col-span-1 text-center">Ilość</div>
          <div className="mb-2 font-semibold col-span-4 text-center">Analizy przeprowadzone na zebranym materiale</div>
          <div className="mb-2 font-semibold col-span-3 text-center">Publiczność danych</div>
          {values.collectedSamples.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.type}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.amount}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.analysis}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>{x.publishing}</div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="17. Dodatkowe dane do raportu SPUB">
        <div className="mx-6 text-justify">{values.spubReportData}</div>
      </PrintingPageSection>

      <PrintingPageSection title="18. Krótki opis podsumowujący dany rejs">
        <div className="mx-6 text-justify">{values.additionalDescription}</div>
        <div className="text-center text-xl">Załączniki</div>
        <div className="grid grid-cols-9 gap-4">
          <div className="mb-2 font-semibold col-span-1 text-center">Lp.</div>
          <div className="mb-2 font-semibold col-span-8 text-center">Nazwa pliku</div>
          {values.photos.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-8 grid place-items-center')}>{x.name}</div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>
    </PrintingPage>
  );
}
