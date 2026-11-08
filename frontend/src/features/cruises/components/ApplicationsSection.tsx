import { ColumnDef } from '@/integrations/tanstack/table/features';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { Accordion } from '@/components/shared/Accordion';
import { Avatar } from '@/components/shared/Avatar';
import { Button } from '@/components/shared/Button';
import { Link } from '@/components/shared/Link';
import { Table } from '@/components/shared/table/Table';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { CruiseApplicationCandidateResponse } from '@/api/generated/schemas';
import { cruiseFormDefaultValues } from '@/features/cruises/schemas/form.schema';
import { formatDate, parsePolishDateTime } from '@/lib/dateUtils';

export function ApplicationsSection({
  cruiseId,
  cruiseApplications,
  isReadonly,
}: {
  cruiseId?: string;
  cruiseApplications: CruiseApplicationCandidateResponse[];
  isReadonly: boolean;
}) {
  const form = useTypedAppFormContext({ defaultValues: cruiseFormDefaultValues });
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Accordion title="4. Zgłoszenia przypisane do rejsu" expandedByDefault>
      <form.AppField name="cruiseApplicationIds" mode="array">
        {(field) => {
          const getColumns = (attached: boolean): ColumnDef<CruiseApplicationCandidateResponse>[] => [
            {
              header: 'Numer',
              accessorFn: (row) => row.number,
              cell: ({ row }) => (
                <>
                  {row.original.number}
                  {row.original.cruiseId && row.original.cruiseId !== cruiseId && (
                    <div className="text-xs whitespace-nowrap text-muted-foreground">
                      obecnie w rejsie{' '}
                      <Link to="/cruises/$cruiseId" params={{ cruiseId: row.original.cruiseId }} target="_blank">
                        {row.original.cruiseNumber}
                      </Link>
                    </div>
                  )}
                </>
              ),
              enableColumnFilter: !attached,
              size: 5,
            },
            {
              header: 'Rok rejsu',
              accessorFn: (row) => row.year ?? 'Błędne dane',
              enableColumnFilter: !attached,
              size: 20,
            },
            {
              id: 'cruiseManagerAvatar',
              header: () => <span className="sr-only">Zdjęcie</span>,
              cell: ({ row }) => (
                <Avatar
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
                  <Link
                    to="/applications/$applicationId/formA"
                    params={{ applicationId: row.original.id }}
                    disabled={!row.original.hasFormA}
                    target="_blank"
                  >
                    Formularz A
                  </Link>
                  <Link
                    to="/applications/$applicationId/formB"
                    params={{ applicationId: row.original.id }}
                    disabled={!row.original.hasFormB}
                    target="_blank"
                  >
                    Formularz B
                  </Link>
                  <Link
                    to="/applications/$applicationId/formC"
                    params={{ applicationId: row.original.id }}
                    disabled={!row.original.hasFormC}
                    target="_blank"
                  >
                    Formularz C
                  </Link>
                </div>
              ),
            },
            {
              header: 'Dokładny termin',
              cell: ({ row }) => {
                const { precisePeriodStart, precisePeriodEnd, precisePeriodStartTime, precisePeriodEndTime } =
                  row.original;
                if (!precisePeriodStart || !precisePeriodEnd) return '-';
                return (
                  <div className="text-sm whitespace-nowrap">
                    <div>
                      od: {formatDate(precisePeriodStart, 'date')} {precisePeriodStartTime?.slice(0, 5)}
                    </div>
                    <div>
                      do: {formatDate(precisePeriodEnd, 'date')} {precisePeriodEndTime?.slice(0, 5)}
                    </div>
                  </div>
                );
              },
              enableColumnFilter: false,
              enableSorting: false,
              size: 15,
            },
            { header: 'Punkty', accessorFn: (row) => row.points, enableColumnFilter: false, size: 10 },
            ...(!isReadonly
              ? [
                  {
                    id: 'actions',
                    header: () => <span className="sr-only">Akcje</span>,
                    cell: ({ row }) => (
                      <Button
                        variant={attached ? 'dangerOutline' : 'successOutline'}
                        size="sm"
                        onClick={() => {
                          const { precisePeriodStart, precisePeriodEnd, precisePeriodStartTime, precisePeriodEndTime } =
                            row.original;
                          if (attached) field.removeValue(field.state.value.indexOf(row.original.id));
                          else field.pushValue(row.original.id);
                          if (
                            !attached &&
                            precisePeriodStart &&
                            precisePeriodStartTime &&
                            !form.getFieldValue('startDate')
                          )
                            form.setFieldValue(
                              'startDate',
                              parsePolishDateTime(precisePeriodStart, precisePeriodStartTime).toISOString()
                            );
                          if (!attached && precisePeriodEnd && precisePeriodEndTime && !form.getFieldValue('endDate'))
                            form.setFieldValue(
                              'endDate',
                              parsePolishDateTime(precisePeriodEnd, precisePeriodEndTime).toISOString()
                            );
                          field.handleBlur();
                        }}
                      >
                        {attached ? 'Usuń' : 'Dodaj'}
                      </Button>
                    ),
                    size: 5,
                  } satisfies ColumnDef<CruiseApplicationCandidateResponse>,
                ]
              : []),
          ];

          return (
            <div>
              <Table
                columns={getColumns(true)}
                data={cruiseApplications.filter((application) => field.state.value.includes(application.id))}
                buttons={() =>
                  isReadonly
                    ? []
                    : [
                        <Button onClick={() => setExpanded((prev) => !prev)} key="addNewApplication">
                          {expanded ? 'Zakończ dołączanie zgłoszeń' : 'Dodaj nowe zgłoszenie'}
                        </Button>,
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
                    <Table
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
      </form.AppField>
    </Accordion>
  );
}
