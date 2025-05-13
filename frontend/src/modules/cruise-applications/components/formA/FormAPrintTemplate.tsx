/* eslint-disable @eslint-react/no-array-index-key */
import { Fragment, RefObject } from 'react';

import { cn } from '@/core/lib/utils';
import { getExplanationForPeriod } from '@/cruise-applications/components/common/cruisePeriodExplanation';
import { PrintableResearchTaskDetails } from '@/cruise-applications/components/common/printable-research-task-details/PrintableResearchTaskDetails';
import { PrintingPage } from '@/cruise-applications/components/common/printing/PrintingPage';
import { PrintingPageSection } from '@/cruise-applications/components/common/printing/PrintingPageSection';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { mapPersonToText } from '@/cruise-applications/helpers/PersonMappers';
import { getContractCategoryName } from '@/cruise-applications/models/ContractDto';
import { getPublicationCategoryLabel } from '@/cruise-applications/models/PublicationDto';
import { getTaskName } from '@/cruise-applications/models/ResearchTaskDto';

type Props = {
  ref: RefObject<HTMLDivElement | null>;
};
export function FormAPrintTemplate({ ref }: Props) {
  const { initValues, form } = useFormA();
  const values = form.state.values;

  return (
    <PrintingPage ref={ref} title="Formularz A">
      <PrintingPageSection title="1. Kierownik zgłaszanego rejsu">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Kierownik rejsu: </span>
          <span>{mapPersonToText(initValues.cruiseManagers.find((x) => x.id === values.cruiseManagerId))}</span>
          <span>Zastępca kierownika rejsu: </span>
          <span>{mapPersonToText(initValues.deputyManagers.find((x) => x.id === values.deputyManagerId))}</span>
          <span>Rok: </span>
          <span>{values.year}</span>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="2. Zgłaszany rejs">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Dopuszczalny okres, w którym miałby się odbywać rejs: </span>
          <span>
            {getExplanationForPeriod(parseInt(values.acceptablePeriod[0]), parseInt(values.acceptablePeriod[1]))}
          </span>
          <span>Optymalny okres, w którym miałby się odbywać rejs: </span>
          <span>{getExplanationForPeriod(parseInt(values.optimalPeriod[0]), parseInt(values.optimalPeriod[1]))}</span>
          <span>Liczba planowanych dób rejsowych: </span>
          <span>{parseInt(values.cruiseHours) / 24}</span>
          <span>Liczba planowanych godzin rejsowych:</span>
          <span>{values.cruiseHours} h</span>
          <span>Uwagi dotyczące terminu:</span>
          <span>{values.periodNotes}</span>
          <span>Sposób wykorzystania statku:</span>
          <span>{initValues?.shipUsages.find((_, i) => i === parseInt(values.shipUsage!))}</span>
          <span>Inny sposób użycia:</span>
          <span>{values.differentUsage}</span>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="3. Zgłaszany rejs">
        <div className="grid grid-cols-9 gap-x-8">
          <div className="mb-4 font-semibold col-span-1 text-center">Lp.</div>
          <div className="mb-4 font-semibold col-span-4 text-center">Treść pozwolenia</div>
          <div className="mb-4 font-semibold col-span-4 text-center">Organ wydający</div>
          {values.permissions.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.description}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.executive}</div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="4. Rejon prowadzenia badań">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Rejon prowadzenia badań: </span>
          <span>{initValues.researchAreas.find((x) => x.id === values.researchAreaId)?.name}</span>
          <span>Informacje dodatkowe: </span>
          <span>{values.researchAreaInfo}</span>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="5. Cel rejsu">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Cel rejsu: </span>
          <span>{initValues.cruiseGoals.find((_, i) => i === parseInt(values.cruiseGoal))}</span>
          <span>Opis: </span>
          <span>{values.cruiseGoalDescription}</span>
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="6. Zgłaszane badania">
        <div className="grid grid-cols-9 gap-x-8">
          <span className="mb-2 font-semibold col-span-1 text-center">Lp.</span>
          <span className="mb-2 font-semibold col-span-2 text-center">Zadanie</span>
          <span className="mb-2 font-semibold col-span-6 text-center">Szczegóły</span>
          {values.researchTasks.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>
                <span>{i + 1}.</span>
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                <span>{getTaskName(x.type)}</span>
              </div>
              <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-6')}>
                <PrintableResearchTaskDetails data={x} />
              </span>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="7. Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze">
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
                <div className="font-semibold">Skan</div>
                <div>{x.scan?.name}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <PrintingPageSection title="8. Zespoły badawcze, które miałyby uczestniczyć w rejsie">
        <>
          <div className="grid grid-cols-9 gap-x-8 mb-16">
            <div className="mb-4 font-semibold col-span-1 text-center">Lp.</div>
            <div className="mb-4 font-semibold col-span-3 text-center">Jednostka</div>
            <div className="mb-4 font-semibold col-span-3 text-center">Liczba pracowników</div>
            <div className="mb-4 font-semibold col-span-2 text-center">Liczba studentów</div>
            {values.ugTeams.map((x, i) => (
              <Fragment key={i}>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
                <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>
                  {initValues.ugUnits.find(({ id }) => id === x.ugUnitId)?.name}
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
        </>
      </PrintingPageSection>

      <PrintingPageSection title="9. Publikacje">
        <div className="grid grid-cols-9 gap-x-8">
          <span className="mb-2 font-semibold col-span-1 text-center">Lp.</span>
          <span className="mb-2 font-semibold col-span-1 text-center">Kategoria</span>
          <span className="mb-2 font-semibold col-span-5 text-center">Informacje</span>
          <span className="mb-2 font-semibold col-span-1 text-center">Rok wydania</span>
          <span className="mb-2 font-semibold col-span-1 text-center">Punkty minister.</span>
          {values.publications.map((x, i) => (
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

      <PrintingPageSection title="10. Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie">
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

      <PrintingPageSection title="11. Dane kontaktowe kierownika rejsu">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Adres e-mail przełożonego: </span>
          <span>{values.supervisorEmail}</span>
        </div>
      </PrintingPageSection>
    </PrintingPage>
  );
}
