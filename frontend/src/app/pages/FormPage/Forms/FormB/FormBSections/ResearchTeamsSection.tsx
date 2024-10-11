import React from 'react';
import { CrewField } from './ResearchTeamsSectionFields';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import {
    GuestTeamsField,
    UgTeamsField,
} from '@app/pages/FormPage/Forms/FormA/FormASections/ResearchTeamsSectionFields';

export const researchTeamsSectionFieldNames = {
    ugTeams: 'ugTeams',
    guestTeams: 'guestTeams',
    crew: 'crew',
};

export const ResearchTeamsSection = () => SectionWrapper(
    {
        shortTitle: 'Z. badawcze',
        longTitle: 'Zespoły badawcze, jakie miałyby uczestniczyć w rejsie',
        sectionFieldNames: researchTeamsSectionFieldNames,
        children:
            <>
                <UgTeamsField />
                <GuestTeamsField />
                <CrewField />
            </>,
    },
);