import { expect, it } from 'vite-plus/test';
import {
  ApplicationResponse,
  CruiseApplicationEvaluation,
  CruiseResponse,
  CurrentUserResponse,
  FormAFields,
  FormBFields,
  FormCFields,
  FormAOptions,
  PublicationResponse,
  TokenResponse,
} from '@/api/generated/schemas';
import { admin, publication, session } from '@tests/data/accounts';
import { application, cruise, evaluation } from '@tests/data/cruises';
import { filledFormA, filledFormB, filledFormC, formA, formB, formC, formOptions } from '@tests/data/forms';

it.each([
  ['account', CurrentUserResponse, () => admin],
  ['session', TokenResponse, session],
  ['publication', PublicationResponse, publication],
  ['application', ApplicationResponse, application],
  ['cruise', CruiseResponse, cruise],
  ['evaluation', CruiseApplicationEvaluation, evaluation],
  ['form A', FormAFields, formA],
  ['form B', FormBFields, formB],
  ['form C', FormCFields, formC],
  ['filled form A', FormAFields, filledFormA],
  ['filled form B', FormBFields, filledFormB],
  ['filled form C', FormCFields, filledFormC],
  ['form options', FormAOptions, formOptions],
] as const)('%s fixture satisfies the generated API schema', (_, schema, make) => {
  expect(schema.safeParse(make()).success).toBe(true);
});
