import {GuestTeamsField, UgTeamsField} from './ResearchTeamsSectionFields';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';

export const researchTeamsSectionFieldNames = {
    ugTeams: 'ugTeams',
    guestTeams: 'guestTeams',
};

export const ResearchTeamsSection = () => SectionWrapper(
    {
        shortTitle: 'Z. badawcze',
        longTitle: 'Zespoły badawcze, które miałyby uczestniczyć w rejsie',
        sectionFieldNames: researchTeamsSectionFieldNames,
        children:
            <>
                <UgTeamsField />
                <GuestTeamsField />
            </>,
    },
);