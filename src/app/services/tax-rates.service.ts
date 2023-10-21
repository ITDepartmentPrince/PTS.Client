import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {TaxRate} from "../models/tax-rate";

@Injectable({providedIn: 'root'})
export class TaxRateService implements IService<TaxRate> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<TaxRate>> {
    return this.httpClient
      .post<DatatableResponse<TaxRate>>(AuthConstant.apiRoot + '/TaxRates/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<TaxRate[]> {
    return this.httpClient.get<TaxRate[]>(AuthConstant.apiRoot + `/TaxRates`);
  }

  get(taxId: number): Observable<TaxRate> {
    return this.httpClient.get<TaxRate>(AuthConstant.apiRoot + `/TaxRates/${taxId}`);
  }

  create(model: TaxRate): Observable<any> {
    return this.httpClient.post<TaxRate>(AuthConstant.apiRoot + '/TaxRates', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: TaxRate): Observable<any> {
    return this.httpClient.put<TaxRate>(AuthConstant.apiRoot + '/TaxRates', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(taxId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/TaxRates/${taxId}`);
  }
}
