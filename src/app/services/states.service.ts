import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {State} from "../models/state";

@Injectable({providedIn: 'root'})
export class StatesService implements IService<State> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<State>> {
    return this.httpClient
      .post<DatatableResponse<State>>(AuthConstant.apiRoot + '/States/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<State[]> {
    return this.httpClient.get<State[]>(AuthConstant.apiRoot + `/States`);
  }

  get(stateCode: string): Observable<State> {
    return this.httpClient.get<State>(AuthConstant.apiRoot + `/States/${stateCode}`);
  }

  create(model: State): Observable<any> {
    return this.httpClient.post<State>(AuthConstant.apiRoot + '/States', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: State): Observable<any> {
    return this.httpClient.put<State>(AuthConstant.apiRoot + '/States', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(stateCode: string | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/States/${stateCode}`);
  }
}
