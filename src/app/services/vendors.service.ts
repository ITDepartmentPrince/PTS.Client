import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {Vendor} from "../models/vendor";
import {State} from "../models/state";

@Injectable({providedIn: 'root'})
export class VendorsService implements IService<Vendor> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<Vendor>> {
    return this.httpClient
      .post<DatatableResponse<Vendor>>(AuthConstant.apiRoot + '/Vendors/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<Vendor[]> {
    return this.httpClient.get<Vendor[]>(AuthConstant.apiRoot + `/Vendors`);
  }

  get(vendorId: number): Observable<Vendor> {
    return this.httpClient.get<Vendor>(AuthConstant.apiRoot + `/Vendors/${vendorId}`);
  }

  create(model: Vendor): Observable<any> {
    return this.httpClient.post<Vendor>(AuthConstant.apiRoot + '/Vendors', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: Vendor): Observable<any> {
    return this.httpClient.put<Vendor>(AuthConstant.apiRoot + '/Vendors', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(vendorId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/Vendors/${vendorId}`);
  }
}
