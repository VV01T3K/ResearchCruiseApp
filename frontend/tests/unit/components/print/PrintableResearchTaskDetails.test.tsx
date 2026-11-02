import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vite-plus/test';
import { PrintableResearchTaskDetails } from '@/components/print/research-task-details/PrintableResearchTaskDetails';
import { mapResearchTaskToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

const print = (task: Parameters<typeof mapResearchTaskToValues>[0]) =>
  renderToStaticMarkup(<PrintableResearchTaskDetails data={mapResearchTaskToValues(task)} />);

describe('printed task details', () => {
  it('shows unreadable amounts as stored and formats readable ones', () => {
    const printed = print({ type: '4', financingAmount: '12h', securedAmount: '15.5' });
    expect(printed).toContain('12h zł');
    expect(printed).toContain('15.50 zł');
  });

  it('does not print an unreadable financing decision as approved', () => {
    expect(print({ type: '3', financingApproved: 'tak' })).not.toContain('Tak');
  });
});
