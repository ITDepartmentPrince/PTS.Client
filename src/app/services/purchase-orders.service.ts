import {Injectable} from "@angular/core";
import {IService} from "../shared/interface/IService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QueryParams} from "../models/query-params";
import {Observable} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {AuthConstant} from "../auth/auth.constant";
import {PurchaseOrder} from "../models/purchase-order";

@Injectable({providedIn: 'root'})
export class PurchaseOrdersService implements IService<PurchaseOrder> {
  constructor(private httpClient: HttpClient) {}

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<PurchaseOrder>> {
    return this.httpClient
      .post<DatatableResponse<PurchaseOrder>>(AuthConstant.apiRoot + '/PurchaseOrders/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<PurchaseOrder[]> {
    return this.httpClient.get<PurchaseOrder[]>(AuthConstant.apiRoot + `/PurchaseOrders`);
  }

  get(poNumber: string): Observable<PurchaseOrder> {
    return this.httpClient.get<PurchaseOrder>(AuthConstant.apiRoot + `/PurchaseOrders/${poNumber}`);
  }

  delete(poNumber: string | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/PurchaseOrders/${poNumber}`);
  }
}
