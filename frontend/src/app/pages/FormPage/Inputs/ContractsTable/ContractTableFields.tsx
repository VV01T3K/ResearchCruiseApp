import {contractCategories, contractCategoriesPL} from './ContractsTable';
import {
    FFileDownloaderWrapper,
    FieldLabelWrapper,
    FilePickerWrapper,
    FSelectWrapper,
    FTextFieldWrapper,
} from '../PermissionsTable/PermissionsTableFields';

export const ContractDescriptionField = (props?: any) => (
    <FTextFieldWrapper {...props} keySelector={'description'} label={'Opis'} />
);

export const InstitutionField = (props?: any) => (
    <FTextFieldWrapper
        {...props}
        keySelector={'institutionName'}
        label={'Nazwa instytucji'}
    />
);

export const UnitField = (props?: any) => (
    <FTextFieldWrapper
        {...props}
        keySelector={'institutionUnit'}
        label={'Jednostka'}
    />
);

export const LocationField = (props?: any) => (
    <FTextFieldWrapper
        {...props}
        keySelector={'institutionLocalization'}
        label={'Lokalizacja instytucji'}
    />
);

export const CategoryPicker = () => {
    const contractCategoryOptions = contractCategories.map((category, index) => ({
        label: contractCategoriesPL[index],
        value: category,
    }));

    return (
        <FSelectWrapper
            keySelector={'category'}
            label={'Kategoria'}
            options={contractCategoryOptions}
        />
    );
};

export const UploadField = () => (
    <FilePickerWrapper keySelector={'scan'} label={'Skan umowy'} />
);

export const DownloadField = () => (
    <FFileDownloaderWrapper keySelector={'scan'} label={'Skan umowy'} />
);

export const InstitutionCell = () => (
    <FieldLabelWrapper label={'Instytucja:'}>
        <InstitutionField dMd={true} />
        <UnitField dMd={true} />
        <LocationField dMd={true} />
    </FieldLabelWrapper>
);
