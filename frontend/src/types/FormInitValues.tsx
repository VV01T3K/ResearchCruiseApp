import {FormAInitValues} from 'FormAInitValues';
import {FormBInitValues} from 'FormBInitValues';
import {FormCInitValues} from 'FormCInitValues';
import {CruiseApplicationDetailsFormInitValues} from 'CruiseApplicationDetailsFormInitValues';
import {CruiseFormInitValues} from 'CruiseFormInitValues';

export type FormInitValues =
    FormAInitValues
    | FormBInitValues
    | FormCInitValues
    | CruiseApplicationDetailsFormInitValues
    | CruiseFormInitValues