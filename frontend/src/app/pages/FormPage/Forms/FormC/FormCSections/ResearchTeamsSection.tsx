import {CrewField} from './ResearchTeamsSectionFields';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {GuestTeamsField, UgTeamsField,} from '@app/pages/FormPage/Forms/FormA/FormASections/ResearchTeamsSectionFields';

export const researchTeamsSectionFieldNames = {
    ugTeams: 'ugTeams',
    guestTeams: 'guestTeams',
    crewMembers: 'crewMembers',
};

export const ResearchTeamsSection = () => SectionWrapper(
    {
        shortTitle: 'Z. badawcze',
        longTitle: 'Zespoły badawcze, które uczestniczyły w rejsie',
        sectionFieldNames: researchTeamsSectionFieldNames,
        children:
            <>
                <UgTeamsField />
                <GuestTeamsField />
                <CrewField />
            </>,
    },
);