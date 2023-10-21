import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {PurchaseReq} from "../models/purchase-req";
import {TaxRate} from "../models/tax-rate";
import {ToPatch} from "../models/to-patch";
import {RefsList} from "../models/refs-list";

@Injectable({providedIn: 'root'})
export class PurchaseReqsService implements IService<PurchaseReq> {
  purchaseReq: PurchaseReq;
  taxRates: TaxRate[];
  changeItems = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<PurchaseReq>> {
    return this.httpClient
      .post<DatatableResponse<PurchaseReq>>(AuthConstant.apiRoot + '/PurchaseReqs/GetRequired',
        queryParams,
        { headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  getAll(): Observable<PurchaseReq[]> {
    return this.httpClient.get<PurchaseReq[]>(AuthConstant.apiRoot + `/PurchaseReqs`);
  }

  getRefsList(): Observable<RefsList> {
    return this.httpClient.get<RefsList>(AuthConstant.apiRoot + `/PurchaseReqs/GetPurchaseReqsRefsList`);
  }

  get(prNumber: string): Observable<PurchaseReq> {
    return this.httpClient.get<PurchaseReq>(AuthConstant.apiRoot + `/PurchaseReqs/${prNumber}`);
  }

  create(model: PurchaseReq): Observable<any> {
    return this.httpClient.post<PurchaseReq>(AuthConstant.apiRoot + '/PurchaseReqs',
      model,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  edit(model: PurchaseReq): Observable<any> {
    return this.httpClient.put<PurchaseReq>(AuthConstant.apiRoot + '/PurchaseReqs',
      model,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  delete(prNumber: string | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/PurchaseReqs/${prNumber}`);
  }

  submitPr(prNumber: string, model: Array<ToPatch>): Observable<any> {
    return this.httpClient.patch(AuthConstant.apiRoot + `/PurchaseReqs/submitPr/${prNumber}`,
      model,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  approvePr(prNumber: string, notes: string): Observable<any> {
    return this.httpClient.post(AuthConstant.apiRoot + `/PurchaseReqs/approvePr/${prNumber}/createPo`,
      {notes: notes},
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  disApprovePr(prNumber: string, notes: string): Observable<any> {
    return this.httpClient.put(AuthConstant.apiRoot + `/PurchaseReqs/disApprovePr/${prNumber}`,
      {notes: notes},
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  purchaseItemsControlDecimal(limit = 2) {
    for (const item of this.purchaseReq.purchaseReqItems)
      item.pricePerQty = parseFloat(item.pricePerQty.toFixed(limit));
  }

  getTotalQty() {
    return this.purchaseReq.purchaseReqItems.reduce((accumulator, currentValue) =>
      accumulator + currentValue.quantity, 0);
  }

  getTotalPricePerQty() {
    return this.purchaseReq.purchaseReqItems.reduce((accumulator, currentValue) =>
      accumulator + currentValue.pricePerQty, 0);
  }

  getTotal() {
    return this.purchaseReq.purchaseReqItems.reduce((accumulator, currentValue) =>
      accumulator + (currentValue.quantity * currentValue.pricePerQty), 0);
  }

  getTotalTaxRate() {
    return this.purchaseReq.purchaseReqItems.reduce((accumulator, currentValue) => {
      let rate = this.taxRates
        ?.find(tr => tr.taxId === currentValue.taxId)
        ?.rate;

      if (!rate)
        rate = 0;

      return accumulator + (currentValue.quantity * currentValue.pricePerQty * rate / 100.0)
    }, 0);
  }

  getAddChargesTotal() {
    return this.purchaseReq.purchaseReqCharges.reduce((accumulator, currentValue) =>
      accumulator + currentValue.amount, 0);
  }
}
