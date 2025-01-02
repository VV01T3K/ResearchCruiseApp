import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {researchTeamsSectionFieldNames} from './ResearchTeamsSectionFieldNames';
import {UgTeamsField} from './UgTeamsField';
import {GuestTeamsField} from './GuestTeamsField';
import {CalculatedPointsField} from './CalculatedPointsField';

export const ResearchTeamsSection = () =>
    SectionWrapper({
        shortTitle: 'Z. badawcze',
        longTitle: 'Zespoły badawcze, które miałyby uczestniczyć w rejsie',
        sectionFieldNames: researchTeamsSectionFieldNames,
        children: (
            <>
                <UgTeamsField />
                <GuestTeamsField />
                <CalculatedPointsField />
            </>
        ),
    });
