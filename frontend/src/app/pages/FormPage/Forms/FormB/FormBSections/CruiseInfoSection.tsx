import {useContext} from 'react';
import CruiseBasicInfo from '../../../../CruiseFormPage/CruiseFormSections/CruiseBasicInfo';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {CruiseContext} from '@contexts/CruiseContext';
import SimpleInfoTile from '../../../../../../ToBeMoved/CommonComponents/SimpleInfoTile';
import ReadOnlyTextInput from '../../../../../../ToBeMoved/CommonComponents/ReadOnlyTextInput';
import LinkWithState from '@components/Navigation/LinkWithState';
import {Path} from '../../../../../../ToBeMoved/Tools/Path';


export const BasicInfo = () => {
    const cruise = useContext(CruiseContext);
    return (
        <CruiseBasicInfo cruise={cruise} />
    );
};

const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
};
export const CruiseExtraInfo = () => {
    const cruise = useContext(CruiseContext);

    return (
        <>
            <SimpleInfoTile title="Data rozpoczęcia">
                <ReadOnlyTextInput
                    value={cruise ? new Date(cruise.startDate).toLocaleString('pl-PL', dateOptions) : ''}
                    className={!cruise ? 'bg-secondary' : ''}
                />
            </SimpleInfoTile>
            <SimpleInfoTile title="Data zakończenia">
                <ReadOnlyTextInput
                    value={cruise ? new Date(cruise.endDate).toLocaleString('pl-PL', dateOptions) : ''}
                    className={!cruise ? 'bg-secondary' : ''}
                />
            </SimpleInfoTile>
            <LinkWithState to={Path.CruiseForm} className={'text-center'}
                           state={{ cruise: cruise, readOnly: true }} label={'Pokaż rejs'}
                           useWindow={true} />
        </>

    );
};


export const CruiseInfoSection = () => SectionWrapper(
    {
        shortTitle: 'Rejs',
        longTitle: 'Informacje o rejsie',
        children:
            <>
                <BasicInfo />
                <CruiseExtraInfo />
            </>,
    },
);