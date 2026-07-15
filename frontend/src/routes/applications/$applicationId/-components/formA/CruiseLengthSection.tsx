import { useSelector } from '@tanstack/react-form';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppAlert } from '@/components/shared/AppAlert';
import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { getErrors } from '@/integrations/tanstack/form/errors';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { getPeriodEdgeDateString, parsePeriodRangeInput } from '@/lib/applications/periodUtils';
import { CruisePeriodType } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import type { BlockadeResponse as BlockadePeriod } from '@/api/generated/schemas';

import { CruiseApplicationPeriodInput } from './CruiseApplicationPeriodInput';
import { BlockadeWarning } from './BlockadeWarning';

function isValidPeriod(period: unknown): period is CruisePeriodType {
  return Array.isArray(period) && period.length === 2 && period[0] !== '' && period[1] !== '';
}

type OverlappingBlockade = {
  title: string;
  start: Date;
  end: Date;
};

function getOverlappingBlockadesForRange(
  blockades: BlockadePeriod[] | undefined,
  rangeStart: string,
  rangeEnd: string
): OverlappingBlockade[] {
  if (!blockades || blockades.length === 0 || !rangeStart || !rangeEnd) {
    return [];
  }

  const start = new Date(rangeStart);
  const end = new Date(rangeEnd);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return [];
  }

  return blockades
    .map((b) => ({
      title: b.title,
      start: new Date(b.startDate),
      end: new Date(b.endDate),
    }))
    .filter((b) => !Number.isNaN(b.start.getTime()) && !Number.isNaN(b.end.getTime()))
    .filter((b) => b.end > start && b.start < end)
    .map((b) => ({
      title: b.title?.trim() ? b.title : 'Bez tytułu',
      start: b.start < start ? start : b.start,
      end: b.end > end ? end : b.end,
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

function getCurrentFortnight(year: string): number {
  const today = new Date();
  // If the year is in the future, return 0 (the first fortnight so it doesn't block the slider )
  if (today.getFullYear() < parseInt(year, 10)) {
    return 0;
  }
  const month = today.getMonth();
  const day = today.getDate();
  return month * 2 + (day > 15 ? 1 : 0);
}

function getOverlappingBlockadesForPeriod(
  blockades: BlockadePeriod[] | undefined,
  year: string,
  period: CruisePeriodType | ''
): OverlappingBlockade[] {
  const parsedPeriodRange = parsePeriodRangeInput(year, period, isValidPeriod);
  if (!parsedPeriodRange) {
    return [];
  }

  return getOverlappingBlockadesForRange(
    blockades,
    getPeriodEdgeDateString(parsedPeriodRange.parsedYear, parsedPeriodRange.startEdge),
    getPeriodEdgeDateString(parsedPeriodRange.parsedYear, parsedPeriodRange.endEdge)
  );
}

export function CruiseLengthSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly, initValues, blockades } = context;

  const year = useSelector(form.store, (state) => state.values.year);
  const periodSelectionType = useSelector(form.store, (state) => state.values.periodSelectionType ?? 'period');
  const acceptablePeriod = useSelector(form.store, (state) => state.values.acceptablePeriod);
  const optimalPeriod = useSelector(form.store, (state) => state.values.optimalPeriod);
  const precisePeriodStart = useSelector(form.store, (state) => state.values.precisePeriodStart);
  const precisePeriodEnd = useSelector(form.store, (state) => state.values.precisePeriodEnd);

  // Initialize checkbox state based on whether saved start date is in the past
  const [allowPastDates, setAllowPastDates] = useState(() => {
    const currentFortnight = getCurrentFortnight(year);

    // Check if precisePeriodStart is in the past
    if (precisePeriodStart) {
      const startDate = new Date(precisePeriodStart);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        return true;
      }
    }

    // Check if acceptablePeriod start is in the past (fortnight-based)
    if (isValidPeriod(acceptablePeriod)) {
      const acceptableStart = parseInt(acceptablePeriod[0], 10);
      if (acceptableStart < currentFortnight) {
        return true;
      }
    }

    return false;
  });

  const minPeriodValue = allowPastDates ? 0 : getCurrentFortnight(year);

  const overlappingPreciseBlockades = useMemo(
    () => getOverlappingBlockadesForRange(blockades, precisePeriodStart, precisePeriodEnd),
    [blockades, precisePeriodStart, precisePeriodEnd]
  );
  const overlappingAcceptablePeriodBlockades = useMemo(
    () => getOverlappingBlockadesForPeriod(blockades, year, acceptablePeriod),
    [blockades, year, acceptablePeriod]
  );

  const overlappingBlockadesForCurrentSelection = useMemo(
    () => (periodSelectionType === 'period' ? overlappingAcceptablePeriodBlockades : overlappingPreciseBlockades),
    [periodSelectionType, overlappingAcceptablePeriodBlockades, overlappingPreciseBlockades]
  );

  const savedPeriodValuesRef = useRef<{
    acceptable: CruisePeriodType;
    optimal: CruisePeriodType;
  } | null>(null);
  const savedPreciseValuesRef = useRef<{ start: string; end: string } | null>(null);

  useEffect(() => {
    if (periodSelectionType !== 'period' || isReadonly) return;

    if (!isValidPeriod(acceptablePeriod)) {
      form.setFieldValue('acceptablePeriod', ['0', '24'] as CruisePeriodType);
    }
    if (!isValidPeriod(optimalPeriod)) {
      form.setFieldValue('optimalPeriod', ['0', '24'] as CruisePeriodType);
    }
  }, [periodSelectionType, isReadonly, acceptablePeriod, optimalPeriod, form]);

  function handlePeriodSelectionChange(value: 'precise' | 'period') {
    if (periodSelectionType === 'period' && isValidPeriod(acceptablePeriod) && isValidPeriod(optimalPeriod)) {
      savedPeriodValuesRef.current = { acceptable: acceptablePeriod, optimal: optimalPeriod };
    } else if (periodSelectionType === 'precise' && (precisePeriodStart || precisePeriodEnd)) {
      savedPreciseValuesRef.current = { start: precisePeriodStart, end: precisePeriodEnd };
    }

    if (value === 'period') {
      const restored = savedPeriodValuesRef.current;
      form.setFieldValue('acceptablePeriod', restored?.acceptable ?? (['0', '24'] as CruisePeriodType));
      form.setFieldValue('optimalPeriod', restored?.optimal ?? (['0', '24'] as CruisePeriodType));
      form.setFieldValue('precisePeriodStart', '');
      form.setFieldValue('precisePeriodEnd', '');
    } else {
      const restored = savedPreciseValuesRef.current;
      form.setFieldValue('acceptablePeriod', '');
      form.setFieldValue('optimalPeriod', '');
      form.setFieldValue('precisePeriodStart', restored?.start ?? '');
      form.setFieldValue('precisePeriodEnd', restored?.end ?? '');
    }
  }

  return (
    <AppAccordion
      title="2. Czas trwania zgłaszanego rejsu"
      expandedByDefault
      data-testid="form-a-cruise-length-section"
    >
      <div className="space-y-4">
        <BlockadeWarning year={+year} blockades={blockades} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {!isReadonly && (
            <div className="lg:col-span-2">
              <form.AppField
                name="periodSelectionType"
                children={(field) => (
                  <field.SelectField
                    onChange={(value) => {
                      field.handleChange(value as 'precise' | 'period');
                      handlePeriodSelectionChange(value as 'precise' | 'period');
                    }}
                    label="Wybierz sposób określenia terminu rejsu"
                    allOptions={[
                      { value: 'precise', inlineLabel: 'Dokładny termin' },
                      { value: 'period', inlineLabel: 'Okres dopuszczalny/optymalny' },
                    ]}
                    showRequiredAsterisk
                    data-testid="form-a-period-selection-type"
                    data-testid-button="form-a-period-selection-type-button"
                  />
                )}
              />
            </div>
          )}
          {periodSelectionType === 'precise' && (
            <>
              <form.AppField
                name="precisePeriodStart"
                children={(field) => (
                  <field.DateField
                    onChange={(newValue) => field.handleChange(newValue ?? '')}
                    label="Dokładny termin rozpoczęcia rejsu"
                    type="date"
                    showRequiredAsterisk
                    disabled={isReadonly}
                    minimalDate={allowPastDates ? undefined : new Date()}
                  />
                )}
              />

              <form.Subscribe
                selector={(state) => state.values.precisePeriodStart}
                children={(precisePeriodStart) => (
                  <form.AppField
                    name="precisePeriodEnd"
                    children={(field) => (
                      <field.DateField
                        onChange={(newValue) => field.handleChange(newValue ?? '')}
                        label="Dokładny termin zakończenia rejsu"
                        type="date"
                        showRequiredAsterisk
                        disabled={isReadonly}
                        selectionStartDate={precisePeriodStart ? new Date(precisePeriodStart) : undefined}
                        minimalDate={
                          precisePeriodStart && !allowPastDates
                            ? new Date(precisePeriodStart)
                            : allowPastDates
                              ? undefined
                              : new Date()
                        }
                      />
                    )}
                  />
                )}
              />
            </>
          )}

          {periodSelectionType === 'period' && (
            <>
              <form.AppField
                name="acceptablePeriod"
                children={(field) => (
                  <CruiseApplicationPeriodInput
                    name={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                    label="Dopuszczalny okres, w którym miałby się odbywać rejs"
                    showRequiredAsterisk
                    disabled={isReadonly}
                    minPeriodValue={minPeriodValue}
                  />
                )}
              />

              <form.Subscribe
                selector={(state) => state.values.acceptablePeriod}
                children={(acceptablePeriod) => (
                  <form.AppField
                    name="optimalPeriod"
                    children={(field) => (
                      <CruiseApplicationPeriodInput
                        name={field.name}
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                        maxValues={acceptablePeriod}
                        label="Optymalny okres, w którym miałby się odbywać rejs"
                        showRequiredAsterisk
                        disabled={isReadonly}
                        minPeriodValue={minPeriodValue}
                      />
                    )}
                  />
                )}
              />
            </>
          )}

          {overlappingBlockadesForCurrentSelection.length > 0 && (
            <div className="lg:col-span-2" data-testid="form-a-blockade-period-warning">
              <AppAlert variant="warning">
                <div>
                  <span className="font-bold">Utrudniające blokady w wybranym zakresie:</span>
                  <div className="mt-2 space-y-1" data-testid="form-a-blockade-collision-errors">
                    {overlappingBlockadesForCurrentSelection.map((blockade) => (
                      <div
                        key={`${blockade.title}-${blockade.start.toISOString()}-${blockade.end.toISOString()}`}
                        className="text-sm"
                      >
                        <span className="font-bold">{blockade.title}</span>:{' '}
                        {blockade.start.toLocaleDateString('pl-PL')} - {blockade.end.toLocaleDateString('pl-PL')}
                      </div>
                    ))}
                  </div>
                </div>
              </AppAlert>
            </div>
          )}

          {!isReadonly && (
            <div className="lg:col-span-2">
              <AppCheckbox
                name="allowPastDates"
                checked={allowPastDates}
                onChange={setAllowPastDates}
                label="Zezwól na wybór dat z przeszłości"
              />
            </div>
          )}

          <form.Subscribe
            selector={(state) => state.values.cruiseDays * 24 + state.values.cruiseHours}
            children={(totalCruiseHours) => (
              <form.AppField
                name="cruiseDays"
                children={(field) => (
                  <field.NumberField
                    value={totalCruiseHours / 24}
                    onChange={(days) => {
                      field.handleChange(Math.floor(days));
                      form.setFieldValue('cruiseHours', Math.round((days % 1) * 24));
                    }}
                    minimum={0}
                    maximum={60}
                    step={1}
                    type="float"
                    label="Liczba planowanych dób rejsowych"
                    showRequiredAsterisk
                    disabled={isReadonly}
                    data-testid="form-a-cruise-days"
                    data-testid-input="form-a-cruise-days-input"
                  />
                )}
              />
            )}
          />

          <form.Subscribe
            selector={(state) => state.values.cruiseDays * 24 + state.values.cruiseHours}
            children={(totalCruiseHours) => (
              <form.AppField
                name="cruiseHours"
                children={(field) => (
                  <field.NumberField
                    value={totalCruiseHours}
                    onChange={(hours) => {
                      form.setFieldValue('cruiseDays', Math.floor(hours / 24));
                      field.handleChange(hours % 24);
                    }}
                    minimum={0}
                    maximum={1440}
                    type="integer"
                    label="Liczba planowanych godzin rejsowych"
                    showRequiredAsterisk
                    disabled={isReadonly}
                    data-testid="form-a-cruise-hours"
                    data-testid-input="form-a-cruise-hours-input"
                    data-testid-errors="form-a-cruise-hours-errors"
                  />
                )}
              />
            )}
          />

          <form.AppField
            name="periodNotes"
            children={(field) => (
              <div className="lg:col-span-2">
                <field.TextField
                  label="Uwagi dotyczące terminu"
                  placeholder='np. "Rejs w okresie wakacyjnym"'
                  disabled={isReadonly}
                  data-testid="form-a-period-notes-input"
                />
              </div>
            )}
          />

          <form.AppField
            name="shipUsage"
            children={(field) => (
              <div className="lg:col-span-2">
                <field.SelectField
                  label="Statek na potrzeby badań będzie wykorzystywany"
                  showRequiredAsterisk
                  allOptions={initValues?.shipUsages.map((shipUsage, i) => ({
                    value: i.toString(),
                    inlineLabel: shipUsage,
                  }))}
                  disabled={isReadonly}
                  data-testid-button="form-a-ship-usage-button"
                />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => state.values.shipUsage}
            children={(shipUsage) => (
              <div className="lg:col-span-2">
                <AnimatePresence>
                  {shipUsage === '4' && (
                    <motion.div
                      initial={{ opacity: 0, translateY: '-10%' }}
                      animate={{ opacity: 1, translateY: '0' }}
                      exit={{ opacity: 0, translateY: '-10%' }}
                      transition={{ ease: 'easeOut', duration: 0.2 }}
                    >
                      <form.AppField
                        name="differentUsage"
                        children={(field) => (
                          <field.TextField
                            label="Inny sposób użycia"
                            placeholder="np. statek badawczy"
                            showRequiredAsterisk
                            disabled={isReadonly}
                            data-testid="form-a-alternative-ship-usage-input"
                          />
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          />
        </div>
      </div>
    </AppAccordion>
  );
}
