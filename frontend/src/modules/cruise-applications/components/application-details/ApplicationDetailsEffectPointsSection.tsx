import { AppAccordion } from '@/core/components/AppAccordion';
import { AppInput } from '@/core/components/inputs/AppInput';
import { useApplicationDetails } from '@/cruise-applications/contexts/ApplicationDetailsContext';

export function ApplicationDetailsEffectPointsSection() {
  const { evaluation } = useApplicationDetails();

  return (
    <AppAccordion title="3. Efekty osiągnięte po poprzednich rejsach" expandedByDefault>
      <div>
        <AppInput
          name="effectPoints"
          value={evaluation.effectsPoints}
          label="Liczba punktów przyznanych za zrealizowane efekty rejsów zgłoszone do momentu wysłania Formularza A:"
          disabled={true}
        />
      </div>
    </AppAccordion>
  );
}
