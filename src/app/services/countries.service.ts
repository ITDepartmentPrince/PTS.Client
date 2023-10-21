import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {Country} from "../models/country";

@Injectable({providedIn: 'root'})
export class CountriesService implements IService<Country> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<Country>> {
    return this.httpClient
      .post<DatatableResponse<Country>>(AuthConstant.apiRoot + '/Countries/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(AuthConstant.apiRoot + `/Countries`);
  }

  get(countryCode: string): Observable<Country> {
    return this.httpClient.get<Country>(AuthConstant.apiRoot + `/Countries/${countryCode}`);
  }

  create(model: Country): Observable<any> {
    return this.httpClient.post<Country>(AuthConstant.apiRoot + '/Countries', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: Country): Observable<any> {
    return this.httpClient.put<Country>(AuthConstant.apiRoot + '/Countries', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(countryCode: string | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/Countries/${countryCode}`);
  }
}
