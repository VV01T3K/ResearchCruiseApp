import {FieldValues} from 'react-hook-form';
import {OrdinalNumber} from '../TableParts';
import {FieldProps} from '../FormRadio';
import FieldWrapper from '../FieldWrapper';
import {CategoryPicker, ContractDescriptionField, DownloadField, InstitutionCell} from './ContractTableFields';
import {DisplayValueContext, DisplayWrapper, pointFieldRules, PointsField} from '../TaskTable/EvaluatedTaskTable';
import {FieldTableWrapper} from '../../Wrappers/FieldTableWrapper';
import {FieldContext} from '@contexts/FieldContext';
import {EvaluatedContract} from 'EvaluatedContract';

const ContractTableContent = () => {
    return [
        () => (<OrdinalNumber label={'Umowa'} />),
        DisplayWrapper(CategoryPicker),
        DisplayWrapper(InstitutionCell),
        DisplayWrapper(ContractDescriptionField),
        DisplayWrapper(DownloadField),
        PointsField,
    ];
};

type ContractTableProps = FieldProps &
    { evaluatedContracts?: EvaluatedContract[] }

export const EvaluatedContractTable = (props: ContractTableProps) => {
    const mdColWidths = [5, 20, 24, 26, 15, 10];
    const mdColTitles = ['Lp.', 'Kategoria', 'Instytucja', 'Opis', 'Skan', 'Punkty'];
    const colTitle = 'Umowy';
    const emptyText = 'Nie dodano żadnej umowy';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, ContractTableContent,
        null, emptyText, props.evaluatedContracts);

    const idAndPoints = props.evaluatedContracts?.map((value) =>
        ({ evaluationId: value.id, newPoints: value.points }));
    const displayValue = props.evaluatedContracts?.map((value) =>
        ({ ...value.contract }));

    const fieldProps = {
        ...props,
        defaultValue: idAndPoints,
        rules: pointFieldRules,
        render: ({ field }: FieldValues) => (
            <FieldContext.Provider value={field}>
                <DisplayValueContext.Provider value={displayValue}>
                    <Render />
                </DisplayValueContext.Provider>
            </FieldContext.Provider>
        ),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
};


