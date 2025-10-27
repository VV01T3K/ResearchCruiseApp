declare module '@citation-js/core' {
  export default class Cite {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(input: string | Record<string, any>);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAll(): any[];
  }
}
