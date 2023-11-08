import {Injectable} from "@angular/core";
import {IService} from "../shared/interface/IService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QueryParams} from "../models/query-params";
import {Observable} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {AuthConstant} from "../auth/auth.constant";
import {PayTerm} from "../models/pay-term";

@Injectable({providedIn: 'root'})
export class PayTermsService implements IService<PayTerm> {
  payTerm: PayTerm;

  constructor(private httpClient: HttpClient) {
  }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<PayTerm>> {
    return this.httpClient
      .post<DatatableResponse<PayTerm>>(AuthConstant.apiRoot + '/PayTerms/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<PayTerm[]> {
    return this.httpClient.get<PayTerm[]>(AuthConstant.apiRoot + `/PayTerms`);
  }

  get(id: number): Observable<PayTerm> {
    return this.httpClient.get<PayTerm>(AuthConstant.apiRoot + `/PayTerms/${id}`);
  }

  create(): Observable<any> {
    return this.httpClient.post<PayTerm>(AuthConstant.apiRoot + '/PayTerms', this.payTerm, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(): Observable<any> {
    return this.httpClient.put<PayTerm>(AuthConstant.apiRoot + '/PayTerms', this.payTerm, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(id: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/PayTerms/${id}`);
  }
}
