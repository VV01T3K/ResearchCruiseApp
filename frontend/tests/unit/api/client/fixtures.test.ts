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
  TokenResponse,
} from '@/api/generated/schemas';
import { admin, session } from '@tests/data/accounts';
import { application, cruise, evaluation } from '@tests/data/cruises';
import { formA, formB, formC, formOptions } from '@tests/data/forms';

it.each([
  ['account', CurrentUserResponse, () => admin],
  ['session', TokenResponse, session],
  ['application', ApplicationResponse, application],
  ['cruise', CruiseResponse, cruise],
  ['evaluation', CruiseApplicationEvaluation, evaluation],
  ['form A', FormAFields, formA],
  ['form B', FormBFields, formB],
  ['form C', FormCFields, formC],
  ['form options', FormAOptions, formOptions],
] as const)('%s fixture satisfies the generated API schema', (_, schema, make) => {
  expect(schema.safeParse(make()).success).toBe(true);
});
