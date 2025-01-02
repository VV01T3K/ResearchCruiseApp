import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import FormA from './Forms/FormA/FormA';
import FormB from './Forms/FormB/FormB';
import NotFoundPage from '../NotFoundPage';
import {Path} from '../../../ToBeMoved/Tools/Path';

import {extendedUseLocation} from '@hooks/extendedUseLocation';
import {FormType} from '../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';

export type FormPageLocationState = {
    formType: string;
    cruiseApplicationId?: string;
    readonly?: boolean;
};

function FormPage() {
    const location = extendedUseLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (!location?.state) {
            navigate(Path.Default);
        }
    }, []);

    return (
        <>
            {location?.state?.formType == FormType.A && <FormA />}
            {location?.state?.formType == FormType.AForSupervisor && <FormA />}
            {location?.state?.formType == FormType.B && <FormB />}
            {location?.state?.formType == FormType.C && <NotFoundPage />}
            {!location?.state && <NotFoundPage />}
        </>
    );
}

export default FormPage;
