import {Injectable} from "@angular/core";
import {IService} from "../shared/interface/IService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QueryParams} from "../models/query-params";
import {Observable} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {AuthConstant} from "../auth/auth.constant";
import {PurchaseOrder} from "../models/purchase-order";
import {SitesService} from "./sites.service";

@Injectable({providedIn: 'root'})
export class PurchaseOrdersService implements IService<PurchaseOrder> {
  constructor(private httpClient: HttpClient, private sitesService: SitesService) {}

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

  approvePo(poNumber: string, notes: string): Observable<any> {
    return this.httpClient.post(AuthConstant.apiRoot +
        `/PurchaseOrders/ApprovePo/${poNumber}/CreateReceiving/${this.sitesService.localSite}`,
      {notes: notes},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  execApprovePo(poNumber: string, notes: string): Observable<any> {
    return this.httpClient.post(AuthConstant.apiRoot +
      `/PurchaseOrders/ExecApprovePo/${poNumber}/CreateReceiving/${this.sitesService.localSite}`,
      {notes: notes},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  disApprovePo(poNumber: string, notes: string): Observable<any> {
    return this.httpClient.post(AuthConstant.apiRoot + `/PurchaseOrders/DisApprovePo/${poNumber}`,
      {notes: notes},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
}
