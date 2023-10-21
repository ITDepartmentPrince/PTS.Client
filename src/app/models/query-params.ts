export class QueryParams {
  constructor(public length: number,
              public position: number,
              public sort: string,
              public column: string,
              public searchColumn: string,
              public search?: string,
              public jsonData?: string) {
  }
}
