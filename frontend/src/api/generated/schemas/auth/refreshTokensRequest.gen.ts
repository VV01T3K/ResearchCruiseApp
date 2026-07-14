import { z as zod } from 'zod';

export const RefreshTokensRequest = zod.object({
  "accessToken": zod.string(),
  "refreshToken": zod.string()
});

export type RefreshTokensRequest = zod.input<typeof RefreshTokensRequest>;
export type RefreshTokensRequestOutput = zod.output<typeof RefreshTokensRequest>;
