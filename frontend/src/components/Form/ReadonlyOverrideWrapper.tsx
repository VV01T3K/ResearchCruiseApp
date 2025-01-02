import {FormContext} from '@contexts/FormContext';
import {useContext} from 'react';
import {ReadOnlyContext} from '@contexts/ReadOnlyContext';

const ReadonlyOverrideWrapper = (props: { children: React.ReactNode }) => {
    const formContext = useContext(FormContext);
    const newForm = { ...formContext! };
    newForm.readOnly = true;
    return (
        <FormContext.Provider value={newForm}>
            <ReadOnlyContext.Provider value={true}>
                {props.children}
            </ReadOnlyContext.Provider>
        </FormContext.Provider>
    );
};

export default ReadonlyOverrideWrapper;