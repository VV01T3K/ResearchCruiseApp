import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { useApplicationEvaluation } from '@/routes/applications/$applicationId/-hooks/useApplicationDetails';

export function EffectPointsSection() {
  const evaluation = useApplicationEvaluation();

  return (
    <AppAccordion title="3. Efekty osiągnięte po poprzednich rejsach" expandedByDefault>
      <div className="p-2">
        <AppInput
          name="effectPoints"
          value={evaluation.effectsPoints}
          label="Liczba punktów przyznanych za zrealizowane efekty rejsów zgłoszone do momentu wysłania Formularza A:"
          disabled
        />
      </div>
    </AppAccordion>
  );
}
