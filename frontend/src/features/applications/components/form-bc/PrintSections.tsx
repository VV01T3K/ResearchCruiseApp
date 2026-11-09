import { formatDate } from '@/lib/dateUtils';
import { Fragment } from 'react';

import { cn } from '@/lib/utils';
import { PrintingPageSection } from '@/components/print/layout/PrintingPageSection';
import type { FormAOptions, FormBOptions } from '@/api/generated/schemas';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';
import type { FormAValues } from '@/features/applications/schemas/formA.schema';
import type { FormBValues } from '@/features/applications/schemas/formB.schema';
import { getContractCategoryName } from '@/features/applications/schemas/types/ContractValues';
import { getPublicationCategoryLabel } from '@/features/applications/schemas/types/PublicationValues';
import { getResearchAreaName } from '@/lib/applications/researchArea';
import { mapPersonToText } from '@/lib/applications/PersonMappers';

function getAction(action: 'Put' | 'Collect'): string {
  if (action === 'Put') {
    return 'Pozostawienie';
  }

  if (action === 'Collect') {
    return 'Zabranie';
  }

  throw new Error('Invalid action');
}

export function CruiseInfoPrintSection({ cruise }: Pick<FormBViewModel, 'cruise'>) {
  return (
    <PrintingPageSection title="1. Informacje o rejsie">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span>Numer rejsu: </span>
        <span>{cruise.number}</span>
        <span>Terminy rozpoczęcia i zakończenia: </span>
        <span>
          {formatDate(cruise.startDate, 'dateTime')} - {formatDate(cruise.endDate, 'dateTime')}
        </span>
      </div>
    </PrintingPageSection>
  );
}

export function CruiseManagerPrintSection({
  formA,
  formAInitValues,
  children,
}: Pick<FormBViewModel, 'formA' | 'formAInitValues'> & { children: React.ReactNode }) {
  return (
    <PrintingPageSection title="2. Kierownik zgłaszanego rejsu">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span>Kierownik rejsu: </span>
        <span>{mapPersonToText(formAInitValues.cruiseManagers.find((x) => x.id === formA.cruiseManagerId))}</span>
        <span>Zastępca kierownika rejsu: </span>
        <span>{mapPersonToText(formAInitValues.deputyManagers.find((x) => x.id === formA.deputyManagerId))}</span>
        {children}
      </div>
    </PrintingPageSection>
  );
}

export function ShipUsagePrintSection({
  shipUsages,
  shipUsage,
  differentUsage,
}: {
  shipUsages: FormAOptions['shipUsages'];
  shipUsage: string;
  differentUsage: string;
}) {
  return (
    <PrintingPageSection title="3. Sposób wykorzystania statku">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span>Sposób wykorzystania statku:</span>
        <span>{shipUsages.find((_, i) => i === parseInt(shipUsage))}</span>
        <span>Inny sposób użycia:</span>
        <span>{differentUsage}</span>
      </div>
    </PrintingPageSection>
  );
}

export function PermissionsPrintSection({
  title,
  permissions,
}: {
  title: string;
  permissions: FormBValues['permissions'];
}) {
  return (
    <PrintingPageSection title={title}>
      <div className="grid grid-cols-10 gap-x-4">
        <div className="col-span-1 mb-4 text-center font-semibold">Lp.</div>
        <div className="col-span-3 mb-4 text-center font-semibold">Treść pozwolenia</div>
        <div className="col-span-3 mb-4 text-center font-semibold">Organ wydający</div>
        <div className="col-span-3 mb-4 text-center font-semibold">Skan</div>
        {permissions.map((x, i) => (
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
  );
}

export function ResearchAreasPrintSection({
  researchAreas,
  areas,
}: {
  researchAreas: FormAOptions['researchAreas'];
  areas: FormAValues['researchAreaDescriptions'];
}) {
  return (
    <PrintingPageSection title="5. Rejony prowadzenia badań">
      <div className="grid grid-cols-9 gap-x-8">
        <div className="col-span-1 mb-4 text-center font-semibold">Lp.</div>
        <div className="col-span-4 mb-4 text-center font-semibold">Rejon prowadzenia badań</div>
        <div className="col-span-4 mb-4 text-center font-semibold">Informacje dodatkowe</div>
        {areas.map((x, i) => (
          <Fragment key={i}>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>
              <div>{i + 1}.</div>
            </div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 flex items-center')}>
              <div>{x.areaId ? getResearchAreaName(researchAreas, x.areaId) : x.differentName}</div>
            </div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 flex items-center')}>
              <div>{x.info}</div>
            </div>
          </Fragment>
        ))}
      </div>
    </PrintingPageSection>
  );
}

export function CruiseGoalPrintSection({ formA, formAInitValues }: Pick<FormBViewModel, 'formA' | 'formAInitValues'>) {
  return (
    <PrintingPageSection title="6. Cel rejsu">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span>Cel rejsu: </span>
        <span>{formAInitValues.cruiseGoals.find((_, i) => i === parseInt(formA.cruiseGoal))}</span>
        <span>Opis: </span>
        <span>{formA.cruiseGoalDescription}</span>
      </div>
    </PrintingPageSection>
  );
}

export function ContractsPrintSection({ title, contracts }: { title: string; contracts: FormAValues['contracts'] }) {
  return (
    <PrintingPageSection title={title}>
      <div className="grid grid-cols-9 gap-x-8">
        <span className="col-span-1 mb-2 text-center font-semibold">Lp.</span>
        <span className="col-span-2 mb-2 text-center font-semibold">Kategoria</span>
        <span className="col-span-6 mb-2 text-center font-semibold">Pozostałe szczegóły</span>
        {contracts.map((x, i) => (
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
                <div className="flex items-center justify-between">
                  <span>Nazwa instytucji:</span>
                  <span>{x.institutionName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Jednostka:</span>
                  <span>{x.institutionUnit}</span>
                </div>

                <div className="flex items-center justify-between">
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
  );
}

export function MembersPrintSection({
  title,
  ugUnits,
  ugTeams,
  guestTeams,
  crewMembers,
}: {
  title: string;
  ugUnits: FormAOptions['ugUnits'];
  ugTeams: FormBValues['ugTeams'];
  guestTeams: FormBValues['guestTeams'];
  crewMembers: FormBValues['crewMembers'];
}) {
  return (
    <PrintingPageSection title={title}>
      <div className="mb-16 grid grid-cols-9 gap-x-8">
        <div className="col-span-1 mb-4 text-center font-semibold">Lp.</div>
        <div className="col-span-3 mb-4 text-center font-semibold">Jednostka</div>
        <div className="col-span-3 mb-4 text-center font-semibold">Liczba pracowników</div>
        <div className="col-span-2 mb-4 text-center font-semibold">Liczba studentów</div>
        {ugTeams.map((x, i) => (
          <Fragment key={i}>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>
              {ugUnits.find(({ id }) => id === x.ugUnitId)?.name}
            </div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>{x.noOfEmployees}</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.noOfStudents}</div>
          </Fragment>
        ))}
      </div>

      <div className="mb-16 grid grid-cols-9 gap-x-8">
        <div className="col-span-1 mb-4 text-center font-semibold">Lp.</div>
        <div className="col-span-6 mb-4 text-center font-semibold">Instytucja</div>
        <div className="col-span-2 mb-4 text-center font-semibold">Liczba osób</div>
        {guestTeams.map((x, i) => (
          <Fragment key={i}>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-6 grid place-items-center')}>{x.name}</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.noOfPersons}</div>
          </Fragment>
        ))}
      </div>

      <div className="grid grid-cols-9 gap-x-8">
        <div className="col-span-1 mb-2 text-center font-semibold">Lp.</div>
        <div className="col-span-2 mb-2 text-center font-semibold">Dane osobowe</div>
        <div className="col-span-4 mb-2 text-center font-semibold">Dokument tożsamości</div>
        <div className="col-span-2 mb-2 text-center font-semibold">Nazwa jednostki</div>
        {crewMembers.map((x, i) => (
          <Fragment key={i}>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
              {x.title} {x.firstName} {x.lastName}
            </div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4')}>
              <div className="flex items-center justify-between">
                <span>Miejsce urodzenia:</span>
                <span>{x.birthPlace}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Data urodzenia:</span>
                <span>{formatDate(x.birthDate, 'date')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Numer ID dokumentu:</span>
                <span>{x.documentNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Data ważności dokumentu:</span>
                <span>{formatDate(x.documentExpiryDate, 'date')}</span>
              </div>
            </div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.institution}</div>
          </Fragment>
        ))}
      </div>
    </PrintingPageSection>
  );
}

export function PublicationsPrintSection({ publications }: { publications: FormAValues['publications'] }) {
  return (
    <PrintingPageSection title="10. Publikacje">
      <div className="grid grid-cols-9 gap-x-8">
        <span className="col-span-1 mb-2 text-center font-semibold">Lp.</span>
        <span className="col-span-1 mb-2 text-center font-semibold">Kategoria</span>
        <span className="col-span-5 mb-2 text-center font-semibold">Informacje</span>
        <span className="col-span-1 mb-2 text-center font-semibold">Rok wydania</span>
        <span className="col-span-1 mb-2 text-center font-semibold">Punkty minister.</span>
        {publications.map((x, i) => (
          <Fragment key={i}>
            <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</span>
            <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>
              {getPublicationCategoryLabel(x.category)}
            </span>
            <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-5 px-4')}>
              <div className="flex items-center justify-between">
                <span>DOI:</span>
                <span>{x.doi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Autorzy:</span>
                <span>{x.authors}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tytuł:</span>
                <span>{x.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Czasopismo:</span>
                <span>{x.magazine}</span>
              </div>
            </span>
            <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.year}</span>
            <span className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{x.ministerialPoints}</span>
          </Fragment>
        ))}
      </div>
    </PrintingPageSection>
  );
}

export function SpubTasksPrintSection({ title, spubTasks }: { title: string; spubTasks: FormAValues['spubTasks'] }) {
  return (
    <PrintingPageSection title={title}>
      <div className="grid grid-cols-9 gap-x-8">
        <div className="col-span-1 mb-2 text-center font-semibold">Lp.</div>
        <div className="col-span-2 mb-2 text-center font-semibold">Rok rozpoczęcia</div>
        <div className="col-span-2 mb-2 text-center font-semibold">Rok zakończenia</div>
        <div className="col-span-4 mb-2 text-center font-semibold">Nazwa zadania</div>
        {spubTasks.map((x, i) => (
          <Fragment key={i}>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.yearFrom}</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.yearTo}</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.name}</div>
          </Fragment>
        ))}
      </div>
    </PrintingPageSection>
  );
}

export function CruiseDetailsPrintSection({
  values,
}: {
  values: Pick<FormBValues, 'shortResearchEquipments' | 'longResearchEquipments' | 'ports'>;
}) {
  return (
    <PrintingPageSection title="12. Szczegóły rejsu">
      <div>
        <h3 className="mb-2 text-xl">Wystawienie sprzętu</h3>
        <div className="grid grid-cols-9 gap-x-8">
          <div className="col-span-1 mb-2 text-center font-semibold">Lp.</div>
          <div className="col-span-2 mb-2 text-center font-semibold">Od</div>
          <div className="col-span-2 mb-2 text-center font-semibold">Do</div>
          <div className="col-span-4 mb-2 text-center font-semibold">Nazwa sprzętu</div>
          {values.shortResearchEquipments.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                {formatDate(x.startDate, 'date')}
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                {formatDate(x.endDate, 'date')}
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.name}</div>
            </Fragment>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xl">Pozostawienie lub zabranie sprzętu</h3>
        <div className="grid grid-cols-9 gap-x-8">
          <div className="col-span-1 mb-2 text-center font-semibold">Lp.</div>
          <div className="col-span-2 mb-2 text-center font-semibold">Czynność</div>
          <div className="col-span-2 mb-2 text-center font-semibold">Czas</div>
          <div className="col-span-4 mb-2 text-center font-semibold">Nazwa sprzętu</div>
          {values.longResearchEquipments.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{getAction(x.action)}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>{x.duration}</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.name}</div>
            </Fragment>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xl">Wchodzenie lub wychodzenie z portu</h3>
        <div className="grid grid-cols-9 gap-x-8">
          <div className="col-span-1 mb-2 text-center font-semibold">Lp.</div>
          <div className="col-span-2 mb-2 text-center font-semibold">Wejście</div>
          <div className="col-span-2 mb-2 text-center font-semibold">Wyjście</div>
          <div className="col-span-4 mb-2 text-center font-semibold">Nazwa portu</div>
          {values.ports.map((x, i) => (
            <Fragment key={i}>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                {formatDate(x.startTime, 'dateTime')}
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
                {formatDate(x.endTime, 'dateTime')}
              </div>
              <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-4 grid place-items-center')}>{x.name}</div>
            </Fragment>
          ))}
        </div>
      </div>
    </PrintingPageSection>
  );
}

export function CruiseDaysPrintSection({ title, days }: { title: string; days: FormBValues['cruiseDaysDetails'] }) {
  return (
    <PrintingPageSection title={title}>
      <div className="grid grid-cols-6 gap-x-8">
        <div className="col-span-1 mb-2 text-center font-semibold">Dzień</div>
        <div className="col-span-1 mb-2 text-center font-semibold">Liczba godzin</div>
        <div className="col-span-1 mb-2 text-center font-semibold">Nazwa zadania</div>
        <div className="col-span-1 mb-2 text-center font-semibold">Rejon zadania</div>
        <div className="col-span-1 mb-2 text-center font-semibold">Pozycja</div>
        <div className="col-span-1 mb-2 text-center font-semibold">Uwagi</div>
        {days.map((x, i) => (
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
  );
}

export function ResearchEquipmentsPrintSection({
  title,
  equipments,
}: {
  title: string;
  equipments: FormBValues['researchEquipments'];
}) {
  return (
    <PrintingPageSection title={title}>
      <div className="grid grid-cols-9 gap-x-8">
        <div className="col-span-1 mb-2 text-center font-semibold">Lp.</div>
        <div className="col-span-3 mb-2 text-center font-semibold">Nazwa sprzętu / aparatury</div>
        <div className="col-span-3 mb-2 text-center font-semibold">Data zgłoszenia do ubezpieczenia</div>
        <div className="col-span-2 mb-2 text-center font-semibold">Zgoda opiekuna</div>
        {equipments.map((x, i) => (
          <Fragment key={i}>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-1 grid place-items-center')}>{i + 1}.</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>{x.name}</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-3 grid place-items-center')}>
              {x.insuranceStartDate ? formatDate(x.insuranceStartDate, 'date') : ''}
              {x.insuranceStartDate || x.insuranceEndDate ? ' - ' : ''}
              {x.insuranceEndDate ? formatDate(x.insuranceEndDate, 'date') : ''}
              {!x.insuranceStartDate && !x.insuranceEndDate ? 'Nie zgłoszono' : ''}
            </div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
              {x.permission === true ? 'Tak' : 'Nie'}
            </div>
          </Fragment>
        ))}
      </div>
    </PrintingPageSection>
  );
}

export function ShipEquipmentsPrintSection({
  shipEquipments,
  shipEquipmentsIds,
}: {
  shipEquipments: FormBOptions['shipEquipments'];
  shipEquipmentsIds: string[];
}) {
  return (
    <PrintingPageSection title="15. Elementy techniczne statku wykorzystywane podczas rejsu">
      <div className="grid grid-cols-9 gap-x-8">
        <div className="col-span-7 mb-2 text-center font-semibold">Element</div>
        <div className="col-span-2 mb-2 text-center font-semibold">W użyciu</div>
        {shipEquipments.map((x, i) => (
          <Fragment key={i}>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-7 grid place-items-center')}>{x.name}</div>
            <div className={cn(i > 0 ? 'mt-4' : '', 'col-span-2 grid place-items-center')}>
              {shipEquipmentsIds.filter((id) => id === x.id).length > 0 ? 'Tak' : 'Nie'}
            </div>
          </Fragment>
        ))}
      </div>
    </PrintingPageSection>
  );
}
