import { z as zod } from 'zod';

export const TokenResponse = zod.object({
  "accessToken": zod.string(),
  "accessTokenExpirationDate": zod.iso.datetime({"offset":true}),
  "refreshToken": zod.string(),
  "refreshTokenExpirationDate": zod.iso.datetime({"offset":true})
});

export type TokenResponse = zod.input<typeof TokenResponse>;
export type TokenResponseOutput = zod.output<typeof TokenResponse>;
