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

  /*getAll(): Observable<PurchaseOrder[]> {
    return this.httpClient.get<PurchaseOrder[]>(AuthConstant.apiRoot + `/PurchaseOrders`);
  }*/

  /*get(poNumber: string): Observable<PurchaseOrder> {
    return this.httpClient.get<PurchaseOrder>(AuthConstant.apiRoot + `/PurchaseOrders/${poNumber}`);
  }*/

  delete(poNumber: string | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/PurchaseOrders/${poNumber}`);
  }

  approvePo(po: PurchaseOrder, notes: string): Observable<PurchaseOrder> {
    return this.httpClient.post<PurchaseOrder>(AuthConstant.apiRoot +
      `/PurchaseOrders/ApprovePo/${po.poNumber}/CreateReceiving/${po.purchaseReq.shipToSiteId}`,
      {notes: notes},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  execApprovePo(po: PurchaseOrder): Observable<any> {
    return this.httpClient.post(AuthConstant.apiRoot +
      `/PurchaseOrders/ExecApprovePo/${po.poNumber}/CreateReceiving/${po.purchaseReq.shipToSiteId}`,
      {},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  disApprovePo(po: PurchaseOrder, notes: string): Observable<any> {
    return this.httpClient.post(AuthConstant.apiRoot + `/PurchaseOrders/DisApprovePo/${po.poNumber}`,
      {notes: notes},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getPoWithRefs(poNumber: string): Observable<PurchaseOrder> {
    return this.httpClient.get<PurchaseOrder>(AuthConstant.apiRoot + `/PurchaseOrders/GetPoWithRefs/${poNumber}`);
  }

  emailPo(poNumber: string, notes: string, pdfDoc: string, html: string): Observable<any> {
    return this.httpClient.put(AuthConstant.apiRoot +
      `/PurchaseOrders/${poNumber}/EmailPo`,
      {notes: notes, pdfDoc: pdfDoc, html: html},
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
}
