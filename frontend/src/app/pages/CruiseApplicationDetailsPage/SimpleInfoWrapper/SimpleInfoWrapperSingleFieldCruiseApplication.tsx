import { SimpleInfoContextWrapperSingleField } from '@components/SimpleInfoContextWrapperSingleField';
import { CruiseApplication } from '@types/CruiseApplication';
import { ApplicationsContext } from '@contexts/ApplicationsContext';
import { CruiseApplicationContext } from '@contexts/CruiseApplicationContext';

export const SimpleInfoWrapperSingleFieldCruiseApplication = (props: {
    title: string,
    selector: keyof CruiseApplication
}) =>
    <SimpleInfoContextWrapperSingleField<CruiseApplication> context={CruiseApplicationContext} {...props} />;