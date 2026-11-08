import { Accordion } from '@/components/shared/Accordion';
import { UploadedFileList } from '@/components/shared/inputs/parts/UploadedFileList';
import { useApplicationEvaluation } from '@/features/applications/hooks/useApplicationDetails';

export function ResearchAreaFilesSection() {
  const evaluation = useApplicationEvaluation();

  return (
    <Accordion title="8. Załączniki do rejonów prowadzenia badań" expandedByDefault>
      {evaluation.researchAreaFiles.length === 0 ? (
        <p className="pb-2 text-center">Nie dodano załączników.</p>
      ) : (
        <UploadedFileList files={evaluation.researchAreaFiles} disabled />
      )}
    </Accordion>
  );
}
