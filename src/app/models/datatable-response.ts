export class DatatableResponse<T> {
  constructor(public recordsTotal: number,
              public recordsFiltered: number,
              public data: T[]) {
  }
}
