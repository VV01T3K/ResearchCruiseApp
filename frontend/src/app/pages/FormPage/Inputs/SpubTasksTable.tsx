import {useContext} from 'react';
import {FieldValues} from 'react-hook-form';
import {FDateFieldOnlyYear, FTextField} from './CellFormFields';
import {BottomMenuWithAddButtonAndHistory, OrdinalNumber, RemoveRowButton,} from './TableParts';
import {FieldProps} from './FormRadio';
import FieldWrapper from './FieldWrapper';
import {notEmptyArray} from './PublicationsTable/PublicationsTable';
import {FieldContextWrapper} from './PermissionsTable/PermissionsTable';
import {FormContext} from '@contexts/FormContext';
import {SpubTask} from 'SpubTask';
import {spubTaskDefaultValue} from '@helpers/spubTaskDefaultValue';
import {FieldTableWrapper} from '../Wrappers/FieldTableWrapper';
import {KeyContext} from '@contexts/KeyContext';

export const NameField = () => {
    return (
        <KeyContext.Provider value={'name'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>Nazwa zadania</label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const StartYearField = () => {
    return (
        <KeyContext.Provider value={'yearFrom'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>Rok rozpoczęcia</label>
                <FDateFieldOnlyYear />
            </div>
        </KeyContext.Provider>
    );
};

export const EndYearField = () => {
    return (
        <KeyContext.Provider value={'yearTo'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>Rok zakończenia</label>
                <FDateFieldOnlyYear />
            </div>
        </KeyContext.Provider>
    );
};

const ThesesTableContent = () => [
    () => <OrdinalNumber label={'Zadanie'} />,
    StartYearField,
    EndYearField,
    NameField,
    RemoveRowButton,
];

type ThesesTableProps = FieldProps & { historicalSpubTasks?: SpubTask[] };

const SpubTaskRowLabel = (row: SpubTask) =>
    `${row.name} (${row.yearFrom}–${row.yearTo})`;

export const SpubTaskTable = (props: ThesesTableProps) => {
    const formContext = useContext(FormContext);

    const selectOptions =
        props.historicalSpubTasks?.map((row: SpubTask) => ({
            label: SpubTaskRowLabel(row),
            value: row,
        })) ?? [];

    const mdColWidths = [5, 15, 15, 60, 5];
    const mdColTitles = [
        'Lp.',
        'Rok rozpoczęcia',
        'Rok zakończenia',
        'Nazwa zadania',
        '',
    ];
    const colTitle = 'Zadania';
    const bottomMenu = (
        <BottomMenuWithAddButtonAndHistory
            newOption={spubTaskDefaultValue}
            historicalOptions={selectOptions}
        />
    );
    const emptyText = 'Nie dodano żadnego zadania';
    const { Render } = FieldTableWrapper(
        colTitle,
        mdColWidths,
        mdColTitles,
        ThesesTableContent,
        bottomMenu,
        emptyText,
        formContext!.getValues(props.fieldName),
    );

    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<SpubTask>,
                rightYearPeriod: (value: FieldValues) => {
                    if (value.some((row: SpubTask) => new Date(row.yearTo) < new Date(row.yearFrom))) {
                        return 'Rok zakończenia nie może być wcześniejszy niż rok rozpoczęcia';
                    }
                },
            },
        },
        render: FieldContextWrapper(Render),
    };

    return <FieldWrapper {...fieldProps} />;
};
