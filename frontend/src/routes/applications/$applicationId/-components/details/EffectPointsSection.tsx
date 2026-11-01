import { Accordion } from '@/components/shared/Accordion';
import { Input } from '@/components/shared/inputs/Input';
import { useApplicationEvaluation } from '@/routes/applications/$applicationId/-hooks/useApplicationDetails';

export function EffectPointsSection() {
  const evaluation = useApplicationEvaluation();

  return (
    <Accordion title="3. Efekty osiągnięte po poprzednich rejsach" expandedByDefault>
      <div className="px-2 pb-2">
        <Input
          name="effectPoints"
          value={evaluation.effectsPoints}
          label="Liczba punktów przyznanych za zrealizowane efekty rejsów zgłoszone do momentu wysłania Formularza A:"
          disabled
        />
      </div>
    </Accordion>
  );
}
