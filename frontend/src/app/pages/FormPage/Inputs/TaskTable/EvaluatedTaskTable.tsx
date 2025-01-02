import React, {createContext, useContext} from 'react';
import {FieldValues} from 'react-hook-form';
import {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {pl} from 'date-fns/locale/pl';
import 'react-dropdown/style.css';
import FieldWrapper from '../FieldWrapper';
import {FieldProps} from '../FormRadio';
import {CellTools, OrdinalNumber} from '../TableParts';
import {FIntField} from '../CellFormFields';
import {FieldForKey, ResearchTask, taskTypes, taskTypesDefaultValues} from './TaskTable';
import {FieldContext} from '@contexts/FieldContext';
import {Guid} from 'Guid';
import {KeyContext} from '@contexts/KeyContext';
import {FieldTableWrapper} from '../../Wrappers/FieldTableWrapper';

registerLocale('pl', pl);

export type EvaluatedReseachTask = {
    id: string,
    researchTask: ResearchTask,
    points: string
}

const FieldsCell = () => {
    const { rowValue } = CellTools();
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center w-100">
            {rowValue && Object.keys(taskTypesDefaultValues[rowValue.type]).map((key, index) =>
                (<KeyContext.Provider value={key} key={index}>
                    {key != 'type' && <FieldForKey />}
                </KeyContext.Provider>),
            )}
        </div>
    );
};


const TaskTypeLabel = () => {
    const { rowValue } = CellTools();
    return (
        <>{taskTypes[Number(rowValue.type)]}</>
    );
};

export const DisplayWrapper = (Element: React.JSXElementConstructor<any>) => () => {
    const displayValueContext = useContext(DisplayValueContext);
    return (
        <DisplayContext.Provider value={displayValueContext}>
            <Element />
        </DisplayContext.Provider>
    );
};
export const PointsField = () => {
    return (
        <KeyContext.Provider value={'newPoints'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Przyznane punkty
                </label>
                <FIntField />
            </div>
        </KeyContext.Provider>
    );
};


const taskTableContent = () =>
    [
        () => (<OrdinalNumber label={'Zadanie'} />),
        DisplayWrapper(TaskTypeLabel),
        DisplayWrapper(FieldsCell),
        PointsField,
    ];

type EvaluatedTableProps = FieldProps &
    { evaluatedReseachTasks?: EvaluatedReseachTask[] }

export const DisplayContext = createContext<any>(null);
export const DisplayValueContext = createContext<any>(null);

type Evaluation = {
    evaluationId: Guid,
    newPoints: string
}

export const pointsNotEmpty = <T extends Evaluation>(value: FieldValues) => value.length <= 0 || !value.some((row: T) => (row.evaluationId && row.newPoints == ''));
export const pointFieldRules = {
    validate: { notEmptyArray: pointsNotEmpty },
};
export const EvaluatedTasksTable = (props: EvaluatedTableProps) => {
    const mdColWidths = [5, 20, 65, 10];
    const mdColTitles = ['Lp.', 'Zadanie', 'Szczegóły', 'Punkty'];
    const colTitle = 'Zadania';
    const emptyText = 'Nie dodano żadnego zadania';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, taskTableContent,
        null, emptyText, props.evaluatedReseachTasks);
    const idAndPoints = props.evaluatedReseachTasks?.map((value) =>
        ({ evaluationId: value.id, newPoints: value.points }));
    const displayValue = props.evaluatedReseachTasks?.map((value) =>
        ({ ...value.researchTask }));

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
