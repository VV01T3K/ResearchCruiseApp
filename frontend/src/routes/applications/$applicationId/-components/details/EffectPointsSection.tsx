import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { useApplicationDetails } from '@/contexts/applications/ApplicationDetailsContext';

export function EffectPointsSection() {
  const { evaluation } = useApplicationDetails();

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
