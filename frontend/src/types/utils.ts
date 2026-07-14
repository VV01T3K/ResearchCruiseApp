export type DeepPresent<T> = T extends readonly (infer Item)[]
  ? DeepPresent<Exclude<Item, null | undefined>>[]
  : T extends object
    ? { [Key in keyof T]-?: DeepPresent<Exclude<T[Key], null | undefined>> }
    : Exclude<T, null | undefined>;

export type DeepRequired<T> = T extends readonly (infer Item)[]
  ? DeepRequired<Exclude<Item, undefined>>[]
  : T extends object
    ? { [Key in keyof T]-?: DeepRequired<Exclude<T[Key], undefined>> }
    : Exclude<T, undefined>;
