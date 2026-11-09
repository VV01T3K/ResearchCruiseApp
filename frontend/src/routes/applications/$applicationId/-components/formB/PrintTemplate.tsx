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
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';
import type { FormBValues } from '@/features/applications/schemas/formB.schema';
import { getTaskName } from '@/features/applications/schemas/types/ResearchTaskValues';

type Props = {
  values: FormBValues;
  ref: RefObject<HTMLDivElement | null>;
  context: FormBViewModel;
};
export function PrintTemplate({ ref, context, values }: Props) {
  const { cruise, formAInitValues, formBInitValues, formA } = context;

  return (
    <PrintingPage ref={ref} title="Formularz B">
      <CruiseInfoPrintSection cruise={cruise} />

      <CruiseManagerPrintSection formA={formA} formAInitValues={formAInitValues}>
        <span>Czy kierownik jest obecny na rejsie: </span>
        <span>{values.isCruiseManagerPresent === true ? 'Tak' : 'Nie'}</span>
      </CruiseManagerPrintSection>

      <ShipUsagePrintSection
        shipUsages={formAInitValues.shipUsages}
        shipUsage={formA.shipUsage}
        differentUsage={formA.differentUsage}
      />

      <PermissionsPrintSection
        title="4. Dodatkowe pozwolenia do planowanych podczas rejsu badań"
        permissions={values.permissions}
      />

      <ResearchAreasPrintSection researchAreas={formAInitValues.researchAreas} areas={formA.researchAreaDescriptions} />

      <CruiseGoalPrintSection formA={formA} formAInitValues={formAInitValues} />

      <PrintingPageSection title="7. Zadania do zrealizowania w trakcie rejsu">
        <div className="grid grid-cols-9 gap-x-8">
          <div className="col-span-1 mb-4 text-center font-semibold">Lp.</div>
          <div className="col-span-2 mb-4 text-center font-semibold">Zadanie</div>
          <div className="col-span-6 mb-4 text-center font-semibold">Szczegóły</div>
          {formA.researchTasks.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>
                <div>{i + 1}.</div>
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 flex items-center')}>
                <div>{getTaskName(x.type)}</div>
              </div>
              <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-6')}>
                <PrintableResearchTaskDetails data={x} />
              </span>
            </Fragment>
          ))}
        </div>
      </PrintingPageSection>

      <ContractsPrintSection
        title="8. Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze"
        contracts={formA.contracts}
      />

      <MembersPrintSection
        title="9. Zespoły badawcze, które miałyby uczestniczyć w rejsie"
        ugUnits={formAInitValues.ugUnits}
        ugTeams={values.ugTeams}
        guestTeams={values.guestTeams}
        crewMembers={values.crewMembers}
      />

      <PublicationsPrintSection publications={formA.publications} />

      <SpubTasksPrintSection
        title="11. Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
        spubTasks={formA.spubTasks}
      />

      <CruiseDetailsPrintSection values={values} />

      <CruiseDaysPrintSection
        title="13. Szczegółowy plan zadań do realizacji podczas rejsu"
        days={values.cruiseDaysDetails}
      />

      <ResearchEquipmentsPrintSection
        title="14. Lista sprzętu i aparatury badawczej planowanej do użycia podczas rejsu"
        equipments={values.researchEquipments}
      />

      <ShipEquipmentsPrintSection
        shipEquipments={formBInitValues.shipEquipments}
        shipEquipmentsIds={values.shipEquipmentsIds}
      />
    </PrintingPage>
  );
}
