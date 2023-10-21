import {QueryParams} from "../../models/query-params";
import {Observable} from "rxjs";
import {DatatableResponse} from "../../models/datatable-response";

export interface IService<T> {
  getRequired(qp: QueryParams): Observable<DatatableResponse<T>>;
}
