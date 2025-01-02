import DatePicker from 'react-datepicker';
import React, {HTMLProps, useContext} from 'react';
import {datePickerCommon, datePickerDayAndHour, datePickerDayCommon, datePickerPeriodCommon,} from './DatePickerCommon';
import {ParseIntInput} from './Misc';
import TextareaAutosize from 'react-textarea-autosize';
import {CellFormTools, CellTools} from './TableParts';
import {SelectOptions, SelectSingleValue, SelectWrapper} from '../Wrappers/ReactSelectWrapper';
import {DisplayContext} from './TaskTable/EvaluatedTaskTable';
import {ReadOnlyContext} from '@contexts/ReadOnlyContext';
import CustomConverter from '../../../../ToBeMoved/Tools/CustomConverter';
import {FloatInputOnBlur} from '@app/pages/FormPage/Inputs/FloatInputOnBlur';

export const FStandardDateField = (props: HTMLProps<any>) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <StandardDateField {...props} />
    ) : (
        <FormStandardDateField {...props} />
    );
};

export const FormStandardDateField = (props: { className?: string }) => {
    const { cellValue, setCellValue, field } = CellFormTools();
    const readOnlyContext = useContext(ReadOnlyContext);
    return (
        <DatePicker
            disabled={readOnlyContext!}
            className={'field-common ' + props.className}
            {...datePickerDayCommon}
            onBlur={() => field!.onBlur()}
            selected={cellValue ? new Date(cellValue) : null}
            onChange={(e) => setCellValue(e?.toISOString())}
        />
    );
};

export const StandardDateField = (props: { className?: string }) => {
    const { cellValue } = CellTools();
    return (
        <DatePicker
            disabled={true}
            className={'field-common ' + props.className}
            {...datePickerDayCommon}
            selected={cellValue ? new Date(cellValue) : null}
            onChange={() => {
            }}
        />
    );
};

export const FDateFieldDayAndHour = (props: any) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <DateFieldDayAndHour {...props} />
    ) : (
        <FormDateFieldDayAndHour {...props} />
    );
};

export const FormDateFieldDayAndHour = (props: { className?: string, minDate?:Date, maxDate?:Date }) => {
    const { cellValue, setCellValue, field } = CellFormTools();
    const readOnlyContext = useContext(ReadOnlyContext);
    return (
        <DatePicker
            disabled={readOnlyContext!}
            // showYearPicker
            minDate={props.minDate}
            maxDate={props.maxDate}
            className={'field-common w-100 ' + props.className}
            onBlur={() => field!.onBlur()}
            {...datePickerDayAndHour}
            selected={cellValue ? new Date(cellValue) : null}
            onChange={(e) => {
                setCellValue(e?.toISOString());
                field!.onBlur();
            }}
        />
    );
};

export const DateFieldDayAndHour = (props: { className?: string }) => {
    const { cellValue } = CellTools();
    return (
        <DatePicker
            disabled={true}
            // showYearPicker
            className={'field-common w-100 ' + props.className}
            {...datePickerDayAndHour}
            selected={cellValue ? new Date(cellValue) : null}
            onChange={() => {
            }}
        />
    );
};

export const FDateFieldOnlyYear = (props: HTMLProps<any>) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <DateFieldOnlyYear {...props} />
    ) : (
        <FormDateFieldOnlyYear {...props} />
    );
};

export const FormDateFieldOnlyYear = (props: { className?: string }) => {
    const { cellValue, setCellValue, field } = CellFormTools();
    const readOnlyContext = useContext(ReadOnlyContext);
    return (
        <DatePicker
            disabled={readOnlyContext!}
            dateFormat="yyyy"
            showYearPicker
            className={'field-common w-100 ' + props.className}
            onBlur={() => field!.onBlur()}
            {...datePickerCommon}
            selected={cellValue ? new Date(cellValue, 0) : null}
            onChange={(e) => setCellValue(e?.getFullYear().toString())}
        />
    );
};

export const DateFieldOnlyYear = (props: { className?: string }) => {
    const { cellValue } = CellTools();
    return (
        <DatePicker
            disabled={true}
            dateFormat="yyyy"
            showYearPicker
            className={'field-common w-100 ' + props.className}
            {...datePickerCommon}
            selected={cellValue ? new Date(cellValue, 0) : null}
            onChange={() => {
            }}
        />
    );
};

export const FDateFieldEnd = (props: HTMLProps<any>) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <StandardDateField {...props} />
    ) : (
        <FormDateFieldEnd {...props} />
    );
};

export const FormDateFieldEnd = (props: { className?: string }) => {
    const { cellValue, rowValue, setCellValue, field } = CellFormTools();
    const readOnlyContext = useContext(ReadOnlyContext);
    return (
        <DatePicker
            disabled={readOnlyContext!}
            className={'field-common ' + props.className}
            startDate={rowValue.startDate ? new Date(rowValue.startDate) : undefined}
            endDate={cellValue ? new Date(cellValue) : undefined}
            minDate={rowValue.startDate ? new Date(rowValue.startDate) : undefined}
            selectsEnd
            onBlur={() => field!.onBlur()}
            {...datePickerPeriodCommon}
            selected={cellValue}
            onChange={(e) => setCellValue(e?.toISOString())}
        />
    );
};

export const FDateFieldStart = (props: HTMLProps<any>) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <StandardDateField {...props} />
    ) : (
        <FormDateFieldStart {...props} />
    );
};

export const FormDateFieldStart = (props: { className?: string }) => {
    const { cellValue, rowValue, setCellValue, field } = CellFormTools();
    const readOnlyContext = useContext(ReadOnlyContext);

    return (
        <DatePicker
            disabled={readOnlyContext!}
            className={'field-common ' + props.className}
            endDate={rowValue.endDate ? new Date(rowValue.endDate) : undefined}
            startDate={cellValue ? new Date(cellValue as string) : undefined}
            maxDate={rowValue.endDate ? new Date(rowValue.endDate) : undefined}
            selectsStart
            onBlur={() => field!.onBlur()}
            {...datePickerPeriodCommon}
            selected={cellValue}
            onChange={(e) => setCellValue(e?.toISOString())}
        />
    );
};

export const FFloatField = (props: HTMLProps<any>) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <TextField {...props} />
    ) : (
        <FormFloatField {...props} />
    );
};

export const FormFloatField = (props: { className?: string }) => {
    const { cellValue, setCellValue, field } = CellFormTools();
    const onBlur = FloatInputOnBlur();
    const readOnlyContext = useContext(ReadOnlyContext);
    return (
        <input
            disabled={readOnlyContext!}
            className={'field-common ' + props.className}
            inputMode="numeric"
            {...field}
            value={cellValue}
            onChange={(e) => {
                setCellValue(e.target.value);
            }}
            onBlur={onBlur}
            placeholder="0"
        />
    );
};

export const IntInputOnBlur = () => {
    const { setCellValue, field } = CellFormTools();
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        setCellValue(String(ParseIntInput(e.target.value)));
        field!.onBlur(field!.value);
    };
};

export const FIntField = (props: HTMLProps<any>) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <TextField {...props} />
    ) : (
        <FormIntField {...props} />
    );
};

export const FormIntField = (props: { className?: string }) => {
    const { cellValue, setCellValue, field } = CellFormTools();
    const onBlur = IntInputOnBlur();
    const readOnlyContext = useContext(ReadOnlyContext);
    return (
        <input
            className={'field-common ' + props.className}
            disabled={readOnlyContext!}
            inputMode="numeric"
            {...field}
            value={cellValue}
            onChange={(e) => {
                setCellValue(e.target.value);
            }}
            onBlur={onBlur}
            placeholder="0"
        />
    );
};

export const FTextField = (props: HTMLProps<any>) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <TextField {...props} />
    ) : (
        <FormTextField {...props} />
    );
};
export const FBoolField = (props: HTMLProps<any>) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <BoolField {...props} />
    ) : (
        <FormBoolField {...props} />
    );
};

export const FormTextField = (props: { className?: string }) => {
    const { cellValue, setCellValue, field } = CellFormTools();
    const readOnlyContext = useContext(ReadOnlyContext);
    return (
        <TextareaAutosize
            maxLength={200}
            disabled={readOnlyContext!}
            className={'field-common ' + props.className}
            {...field}
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
        />
    );
};
export const TextField = (props: { className?: string }) => {
    const { cellValue } = CellTools();
    return (
        <TextareaAutosize
            disabled={true}
            className={'field-common ' + props.className}
            value={cellValue}
        />
    );
};
export const FormBoolField = () => {
    const { cellValue, setCellValue, field } = CellFormTools();
    const readOnlyContext = useContext(ReadOnlyContext);
    const isTrue = CustomConverter.stringToBoolean(cellValue);
    return (
        <div className={'d-flex flex-row w-100'}>
            <button disabled={readOnlyContext}
                className={
                    ' field-common col-6 ' + (isTrue ? ' radio-button-selected' : 'radio-button-not-selected')
                }
                onClick={!readOnlyContext ? () => {
                    setCellValue('true');
                    field!.onBlur();
                } : () => {
                }}
            >
                Tak
            </button>
            <button disabled={readOnlyContext}
                className={
                    'field-common col-6 ' + (!isTrue ? ' radio-button-selected' : 'radio-button-not-selected')
                }
                onClick={!readOnlyContext ? () => {
                        setCellValue('false');
                        field!.onBlur();
                    }
                    : () => {
                    }}
            >
                Nie
            </button>
        </div>
    );
};
export const BoolField = () => {
    const { cellValue } = CellTools();
    return (
        <div className={'d-flex flex-row w-100'}>
            <button
                disabled
                className={
                    ' field-common col-6 ' +
                    (cellValue ? ' btn btn-primary' : '')
                }
            >
                Tak
            </button>
            <button disabled
                className={
                    'field-common col-6 ' +
                    (!cellValue ? ' btn btn-primary' : '')
                }
            >
                Nie
            </button>
        </div>
    );
};

export const FSelectField = (props: any) => {
    const displayContext = useContext(DisplayContext);
    return displayContext ? (
        <SelectField {...props} />
    ) : (
        <FormSelectField {...props} />
    );
};

export const FormSelectField = (props: {
    className?: string;
    options?: SelectOptions;
}) => {
    const { cellValue, setCellValue } = CellFormTools();
    return (
        <SelectWrapper
            value={props.options!.find(
                (option) => (option as SelectSingleValue)!.value == cellValue,
            )}
            options={props.options}
            onChange={(e) => setCellValue(e?.value)}
        />
    );
};

export const SelectField = (props: {
    className?: string;
    options?: SelectOptions;
}) => {
    const { cellValue } = CellTools();
    return (
        <SelectWrapper
            disabled
            value={props.options!.find(
                (option) => (option as SelectSingleValue)!.value == cellValue,
            )}
            onChange={() => {
            }}
            options={[]}
        />
    );
};
