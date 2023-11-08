import {Injectable} from "@angular/core";
import {IService} from "../shared/interface/IService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QueryParams} from "../models/query-params";
import {Observable} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {AuthConstant} from "../auth/auth.constant";
import {Shipping} from "../models/shipping";

@Injectable({providedIn: 'root'})
export class ShippingsService implements IService<Shipping> {
  shipping: Shipping;

  constructor(private httpClient: HttpClient) {
  }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<Shipping>> {
    return this.httpClient
      .post<DatatableResponse<Shipping>>(AuthConstant.apiRoot + '/Shippings/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<Shipping[]> {
    return this.httpClient.get<Shipping[]>(AuthConstant.apiRoot + `/Shippings`);
  }

  get(id: number): Observable<Shipping> {
    return this.httpClient.get<Shipping>(AuthConstant.apiRoot + `/Shippings/${id}`);
  }

  create(): Observable<any> {
    return this.httpClient.post<Shipping>(AuthConstant.apiRoot + '/Shippings', this.shipping, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(): Observable<any> {
    return this.httpClient.put<Shipping>(AuthConstant.apiRoot + '/Shippings', this.shipping, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(id: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/Shippings/${id}`);
  }
}
