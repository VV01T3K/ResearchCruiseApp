import { Fragment, RefObject } from 'react';

import { cn } from '@/lib/utils';
import { PrintableResearchTaskDetails } from '@/features/applications/components/research-tasks/PrintableResearchTaskDetails';
import { PrintingPage } from '@/components/print/layout/PrintingPage';
import {
  CruiseInfoPrintSection,
  CruiseManagerPrintSection,
  ShipUsagePrintSection,
  PermissionsPrintSection,
  ResearchAreasPrintSection,
  CruiseGoalPrintSection,
  ContractsPrintSection,
  MembersPrintSection,
  PublicationsPrintSection,
  SpubTasksPrintSection,
  CruiseDetailsPrintSection,
  CruiseDaysPrintSection,
  ResearchEquipmentsPrintSection,
  ShipEquipmentsPrintSection,
} from '@/features/applications/components/form-bc/PrintSections';
import { PrintingPageSection } from '@/components/print/layout/PrintingPageSection';
import type { FormCViewModel } from '@/features/applications/models/formC-view-model';
import type { FormCValues } from '@/features/applications/schemas/formC.schema';
import { getTaskName } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  values: FormCValues;
  ref: RefObject<HTMLDivElement | null>;
  context: FormCViewModel;
};
export function PrintTemplate({ ref, context, values }: Props) {
  const { formAInitValues, formBInitValues, formA, formB, cruise } = context;

  return (
    <PrintingPage ref={ref} title="Formularz C">
      <CruiseInfoPrintSection cruise={cruise} />

      <CruiseManagerPrintSection formA={formA} formAInitValues={formAInitValues}>
        <span>Rok: </span>
        <span>{formA.year}</span>
      </CruiseManagerPrintSection>

      <ShipUsagePrintSection
        shipUsages={formAInitValues.shipUsages}
        shipUsage={values.shipUsage}
        differentUsage={values.differentUsage}
      />

      <PermissionsPrintSection
        title="4. Dodatkowe pozwolenia do przeprowadzonych w trakcie rejsu badań"
        permissions={values.permissions}
      />

      <ResearchAreasPrintSection
        researchAreas={formAInitValues.researchAreas}
        areas={values.researchAreaDescriptions}
      />

      <CruiseGoalPrintSection formA={formA} formAInitValues={formAInitValues} />

      <PrintingPageSection title="7. Zadania przypisane do rejsu - efekty rejsu">
        <div className="grid grid-cols-9 gap-x-8">
          <div className="col-span-1 mb-4 text-center font-semibold">Lp.</div>
          <div className="col-span-2 mb-4 text-center font-semibold">Zadanie</div>
          <div className="col-span-3 mb-4 text-center font-semibold">Szczegóły</div>
          <div className="col-span-3 mb-4 text-center font-semibold" />
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
                <div>{x.done === true ? 'Tak' : 'Nie'}</div>
                <div className="col-span-3">Punkty naliczone kierownikowi: </div>
                <div>{x.managerConditionMet === true ? 'Tak' : 'Nie'}</div>
                <div className="col-span-3">Punkty naliczone zastępcy: </div>
                <div>{x.deputyConditionMet === true ? 'Tak' : 'Nie'}</div>
              </span>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <ContractsPrintSection
        title="8. Umowy regulujące współpracę, w ramach której zostały zrealizowane zadania badawcze"
        contracts={values.contracts}
      />

      <MembersPrintSection
        title="9. Zespoły badawcze, które uczestniczyły w rejsie"
        ugUnits={formAInitValues.ugUnits}
        ugTeams={values.ugTeams}
        guestTeams={values.guestTeams}
        crewMembers={formB.crewMembers}
      />

      <PublicationsPrintSection publications={formA.publications} />

      <SpubTasksPrintSection
        title="11. Zadania SPUB, z którymi pokrywają się zadania zrealizowane na rejsie"
        spubTasks={values.spubTasks}
      />

      <CruiseDetailsPrintSection values={values} />

      <CruiseDaysPrintSection
        title="13. Szczegółowy plan zadań zrealizowanych podczas rejsu"
        days={values.cruiseDaysDetails}
      />

      <ResearchEquipmentsPrintSection
        title="14. Lista sprzętu i aparatury badawczej użytej podczas rejsu"
        equipments={values.researchEquipments}
      />

      <ShipEquipmentsPrintSection
        shipEquipments={formBInitValues.shipEquipments}
        shipEquipmentsIds={values.shipEquipmentsIds}
      />

      <PrintingPageSection title="16. Lista próbek pobranych i poddanych analizie podczas rejsu">
        <div className="grid grid-cols-10 gap-x-8">
          <div className="col-span-2 mb-2 text-center font-semibold">Rodzaj materiału badawczego</div>
          <div className="col-span-1 mb-2 text-center font-semibold">Ilość</div>
          <div className="col-span-4 mb-2 text-center font-semibold">Analizy przeprowadzone na zebranym materiale</div>
          <div className="col-span-3 mb-2 text-center font-semibold">Publiczność danych</div>
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
          <div className="col-span-1 mb-2 text-center font-semibold">Lp.</div>
          <div className="col-span-8 mb-2 text-center font-semibold">Nazwa pliku</div>
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
