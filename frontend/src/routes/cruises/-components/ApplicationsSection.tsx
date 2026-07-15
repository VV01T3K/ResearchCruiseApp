import { ColumnDef } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppAvatar } from '@/components/shared/AppAvatar';
import { AppButton } from '@/components/shared/AppButton';
import { AppLink } from '@/components/shared/AppLink';
import { AppTable } from '@/components/shared/table/AppTable';
import { useTypedAppFormContext } from '@/lib/form';
import { CruiseApplicationCandidate } from '@/routes/applications/$applicationId/-schemas/types/CruiseApplicationCandidate';
import { cruiseFormDefaultValues } from '@/routes/cruises/-schemas/form.schema';

export function ApplicationsSection({
  cruiseApplications,
  isReadonly,
}: {
  cruiseApplications: CruiseApplicationCandidate[];
  isReadonly: boolean;
}) {
  const form = useTypedAppFormContext({ defaultValues: cruiseFormDefaultValues });
  const [expanded, setExpanded] = React.useState(false);

  return (
    <AppAccordion title="4. Zgłoszenia przypisane do rejsu" expandedByDefault>
      <form.AppField
        name="cruiseApplicationsIds"
        mode="array"
        children={(field) => {
          const getColumns = (attached: boolean): ColumnDef<CruiseApplicationCandidate>[] => [
            { header: 'Numer', accessorFn: (row) => row.number, enableColumnFilter: !attached, size: 5 },
            { header: 'Rok rejsu', accessorFn: (row) => row.year, enableColumnFilter: !attached, size: 20 },
            {
              id: 'cruiseManagerAvatar',
              cell: ({ row }) => (
                <AppAvatar
                  fullName={`${row.original.cruiseManagerFirstName} ${row.original.cruiseManagerLastName}`}
                  variant="small"
                />
              ),
              size: 5,
            },
            {
              header: 'Kierownik',
              accessorFn: (row) => `${row.cruiseManagerFirstName} ${row.cruiseManagerLastName}`,
              enableColumnFilter: !attached,
              size: 15,
            },
            {
              header: 'Formularze',
              enableColumnFilter: false,
              enableSorting: false,
              cell: ({ row }) => (
                <div className="grid grid-cols-1 gap-1">
                  <AppLink
                    href={`/applications/${row.original.id}/formA`}
                    disabled={!row.original.hasFormA}
                    target="_blank"
                  >
                    Formularz A
                  </AppLink>
                  <AppLink
                    href={`/applications/${row.original.id}/formB`}
                    disabled={!row.original.hasFormB}
                    target="_blank"
                  >
                    Formularz B
                  </AppLink>
                  <AppLink
                    href={`/applications/${row.original.id}/formC`}
                    disabled={!row.original.hasFormC}
                    target="_blank"
                  >
                    Formularz C
                  </AppLink>
                </div>
              ),
            },
            { header: 'Punkty', accessorFn: (row) => row.points, enableColumnFilter: false, size: 10 },
            ...(!isReadonly
              ? [
                  {
                    id: 'actions',
                    cell: ({ row }) => (
                      <AppButton
                        variant={attached ? 'dangerOutline' : 'successOutline'}
                        size="sm"
                        onClick={() => {
                          if (attached) field.removeValue(field.state.value.indexOf(row.original.id));
                          else field.pushValue(row.original.id);
                          field.handleBlur();
                        }}
                      >
                        {attached ? 'Usuń' : 'Dodaj'}
                      </AppButton>
                    ),
                    size: 5,
                  } satisfies ColumnDef<CruiseApplicationCandidate>,
                ]
              : []),
          ];

          return (
            <div>
              <AppTable
                columns={getColumns(true)}
                data={cruiseApplications.filter((application) => field.state.value.includes(application.id))}
                buttons={() =>
                  isReadonly
                    ? []
                    : [
                        <AppButton onClick={() => setExpanded((prev) => !prev)} key="addNewApplication">
                          {expanded ? 'Zakończ dołączanie zgłoszeń' : 'Dodaj nowe zgłoszenie'}
                        </AppButton>,
                      ]
                }
                emptyTableMessage="Brak załączonych zgłoszeń"
                errors={undefined}
              />

              <field.FieldErrors />

              <AnimatePresence>
                {expanded && !isReadonly && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ ease: 'easeOut' }}
                    className="mt-4"
                  >
                    <div className="text-lg font-semibold">Zgłoszenia możliwe do załączenia</div>
                    <AppTable
                      columns={getColumns(false)}
                      data={cruiseApplications.filter((application) => !field.state.value.includes(application.id))}
                      buttons={() => []}
                      emptyTableMessage="Brak zgłoszeń możliwych do załączenia"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }}
      />
    </AppAccordion>
  );
}
