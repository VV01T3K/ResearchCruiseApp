import {KeyContext} from '@contexts/KeyContext';
import {useContext} from 'react';
import {FDateFieldDayAndHour, FTextField} from '@app/pages/FormPage/Inputs/CellFormFields';
import {CruiseContext} from "@contexts/CruiseContext";


export const EntranceDateField = () => {
    const cruise = useContext(CruiseContext)
    return (
        <KeyContext.Provider value={'startTime'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Wejście
                </label>
                <FDateFieldDayAndHour minDate={cruise?.startDate}
                                      maxDate={cruise?.endDate}
                                      className={'w-100'} />
            </div>
        </KeyContext.Provider>
    );
};

export const ExitDateField = () => {
    const cruise = useContext(CruiseContext)
    return (
        <KeyContext.Provider value={'endTime'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Wyjście
                </label>
                <FDateFieldDayAndHour className={'w-100'}
                                      minDate={cruise?.startDate}
                                      maxDate={cruise?.endDate}/>
            </div>
        </KeyContext.Provider>
    );
};

export const NameField = () => {
    return (
        <KeyContext.Provider value={'name'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Nazwa portu
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

