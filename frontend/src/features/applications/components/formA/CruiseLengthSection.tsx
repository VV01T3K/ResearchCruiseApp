import { getProblemDetail } from '@/api/errors';
import { useSelector } from '@tanstack/react-form';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Accordion } from '@/components/shared/Accordion';
import { Alert } from '@/components/shared/Alert';
import { Checkbox } from '@/components/shared/inputs/Checkbox';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { getErrors } from '@/integrations/tanstack/form/errors';
import type { FormAViewModel } from '@/features/applications/models/formA-view-model';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';
import { getPeriodEdgeDateString, parsePeriodRangeInput } from '@/lib/applications/periodUtils';
import { formatDate, parseCalendarDate, parsePolishDayStart, useNow } from '@/lib/dateUtils';
import { CruisePeriodType } from '@/features/applications/schemas/types/FormAValues';
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

  const start = parsePolishDayStart(rangeStart);
  const end = parsePolishDayStart(rangeEnd);
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

function getCurrentFortnight(year: string, today: Date): number {
  // If the year is in the future, return 0 (the first fortnight, so it doesn't block the slider)
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
  const { isReadonly, initValues, blockades, blockadesError } = context;

  const year = useSelector(form.store, (state) => state.values.year);
  const periodSelectionType = useSelector(form.store, (state) => state.values.periodSelectionType ?? 'period');
  const acceptablePeriod = useSelector(form.store, (state) => state.values.acceptablePeriod);
  const optimalPeriod = useSelector(form.store, (state) => state.values.optimalPeriod);
  const precisePeriodStart = useSelector(form.store, (state) => state.values.precisePeriodStart);
  const precisePeriodEnd = useSelector(form.store, (state) => state.values.precisePeriodEnd);

  const nowMs = useNow((now) => now.setSeconds(0, 0));

  const [allowPastDates, setAllowPastDates] = useState(() => {
    const currentFortnight = getCurrentFortnight(year, new Date(nowMs));

    if (precisePeriodStart) {
      const startDate = parseCalendarDate(precisePeriodStart);
      const today = new Date(nowMs);
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        return true;
      }
    }

    if (isValidPeriod(acceptablePeriod)) {
      const acceptableStart = parseInt(acceptablePeriod[0], 10);
      if (acceptableStart < currentFortnight) {
        return true;
      }
    }

    return false;
  });

  const minPeriodValue = allowPastDates || isReadonly ? 0 : getCurrentFortnight(year, new Date(nowMs));

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
      form.setFieldValue('acceptablePeriod', ['0', '24'] as CruisePeriodType, { dontUpdateMeta: true });
    }
    if (!isValidPeriod(optimalPeriod)) {
      form.setFieldValue('optimalPeriod', ['0', '24'] as CruisePeriodType, { dontUpdateMeta: true });
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
    <Accordion title="2. Czas trwania zgłaszanego rejsu" expandedByDefault>
      <div className="space-y-4">
        <BlockadeWarning year={+year} blockades={blockades} />
        {!!blockadesError && !isReadonly && (
          <Alert variant="danger">
            Nie udało się wczytać blokad statku, więc kolizje terminów sprawdzi dopiero zapis formularza:{' '}
            {getProblemDetail(blockadesError, 'Nieznany błąd.')}
          </Alert>
        )}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {!isReadonly && (
            <div className="lg:col-span-2">
              <form.AppField name="periodSelectionType">
                {(field) => (
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
                  />
                )}
              </form.AppField>
            </div>
          )}
          {periodSelectionType === 'precise' && (
            <>
              <form.AppField name="precisePeriodStart">
                {(field) => (
                  <field.DateField
                    label="Dokładny termin rozpoczęcia rejsu"
                    type="date"
                    showRequiredAsterisk
                    disabled={isReadonly}
                    minimalDate={allowPastDates ? undefined : new Date(nowMs)}
                  />
                )}
              </form.AppField>

              <form.Subscribe selector={(state) => state.values.precisePeriodStart}>
                {(precisePeriodStart) => (
                  <form.AppField name="precisePeriodEnd">
                    {(field) => (
                      <field.DateField
                        label="Dokładny termin zakończenia rejsu"
                        type="date"
                        showRequiredAsterisk
                        disabled={isReadonly}
                        selectionStartDate={precisePeriodStart ? parseCalendarDate(precisePeriodStart) : undefined}
                        minimalDate={
                          precisePeriodStart && !allowPastDates
                            ? parseCalendarDate(precisePeriodStart)
                            : allowPastDates
                              ? undefined
                              : new Date(nowMs)
                        }
                      />
                    )}
                  </form.AppField>
                )}
              </form.Subscribe>
            </>
          )}

          {periodSelectionType === 'period' && (
            <>
              <form.AppField name="acceptablePeriod">
                {(field) => (
                  <CruiseApplicationPeriodInput
                    name={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onNormalize={(period) => field.setValue(period, { dontUpdateMeta: true })}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                    label="Dopuszczalny okres, w którym miałby się odbywać rejs"
                    showRequiredAsterisk
                    disabled={isReadonly}
                    minPeriodValue={minPeriodValue}
                    helper={
                      !isReadonly &&
                      minPeriodValue > 0 &&
                      'Okresy z przeszłości są niedostępne. Aby je wybrać, zaznacz „Zezwól na wybór dat z przeszłości”.'
                    }
                  />
                )}
              </form.AppField>

              <form.Subscribe selector={(state) => state.values.acceptablePeriod}>
                {(acceptablePeriod) => (
                  <form.AppField name="optimalPeriod">
                    {(field) => (
                      <CruiseApplicationPeriodInput
                        name={field.name}
                        value={field.state.value}
                        onChange={field.handleChange}
                        onNormalize={(period) => field.setValue(period, { dontUpdateMeta: true })}
                        onBlur={field.handleBlur}
                        errors={getErrors(field.state.meta, form.state.submissionAttempts)}
                        maxValues={acceptablePeriod}
                        label="Optymalny okres, w którym miałby się odbywać rejs"
                        showRequiredAsterisk
                        disabled={isReadonly}
                        minPeriodValue={minPeriodValue}
                      />
                    )}
                  </form.AppField>
                )}
              </form.Subscribe>
            </>
          )}

          {overlappingBlockadesForCurrentSelection.length > 0 && (
            <div className="lg:col-span-2">
              <Alert variant="warning">
                <div>
                  <span className="font-bold">Utrudniające blokady w wybranym zakresie:</span>
                  <div className="mt-2 space-y-1">
                    {overlappingBlockadesForCurrentSelection.map((blockade) => (
                      <div
                        key={`${blockade.title}-${blockade.start.toISOString()}-${blockade.end.toISOString()}`}
                        className="text-sm"
                      >
                        <span className="font-bold">{blockade.title}</span>: {formatDate(blockade.start, 'date')} -{' '}
                        {formatDate(blockade.end, 'date')}
                      </div>
                    ))}
                  </div>
                </div>
              </Alert>
            </div>
          )}

          {!isReadonly && (
            <div className="lg:col-span-2">
              <Checkbox
                name="allowPastDates"
                checked={allowPastDates}
                onChange={setAllowPastDates}
                label="Zezwól na wybór dat z przeszłości"
              />
            </div>
          )}

          <form.Subscribe selector={(state) => state.values.cruiseDays * 24 + Number(state.values.cruiseHours)}>
            {(totalCruiseHours) => (
              <form.AppField name="cruiseDays">
                {(field) => (
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
                  />
                )}
              </form.AppField>
            )}
          </form.Subscribe>

          <form.Subscribe selector={(state) => state.values.cruiseDays * 24 + Number(state.values.cruiseHours)}>
            {(totalCruiseHours) => (
              <form.AppField name="cruiseHours">
                {(field) => (
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
                  />
                )}
              </form.AppField>
            )}
          </form.Subscribe>

          <form.AppField name="periodNotes">
            {(field) => (
              <div className="lg:col-span-2">
                <field.TextField
                  label="Uwagi dotyczące terminu"
                  placeholder='np. "Rejs w okresie wakacyjnym"'
                  disabled={isReadonly}
                />
              </div>
            )}
          </form.AppField>

          <form.AppField name="shipUsage">
            {(field) => (
              <div className="lg:col-span-2">
                <field.SelectField
                  label="Statek na potrzeby badań będzie wykorzystywany"
                  showRequiredAsterisk
                  allOptions={initValues?.shipUsages.map((shipUsage, i) => ({
                    value: i.toString(),
                    inlineLabel: shipUsage,
                  }))}
                  disabled={isReadonly}
                />
              </div>
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.shipUsage}>
            {(shipUsage) => (
              <div className="lg:col-span-2">
                <AnimatePresence>
                  {shipUsage === '4' && (
                    <motion.div
                      initial={{ opacity: 0, translateY: '-10%' }}
                      animate={{ opacity: 1, translateY: '0' }}
                      exit={{ opacity: 0, translateY: '-10%' }}
                      transition={{ ease: 'easeOut', duration: 0.2 }}
                    >
                      <form.AppField name="differentUsage">
                        {(field) => (
                          <field.TextField
                            label="Inny sposób użycia"
                            placeholder="np. statek badawczy"
                            showRequiredAsterisk
                            disabled={isReadonly}
                          />
                        )}
                      </form.AppField>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </form.Subscribe>
        </div>
      </div>
    </Accordion>
  );
}
