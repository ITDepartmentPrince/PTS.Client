import { Injectable } from '@angular/core';
import {IService} from "../shared/interface/IService";
import {PurchaseReq} from "../models/purchase-req";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QueryParams} from "../models/query-params";
import {Observable} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {AuthConstant} from "../auth/auth.constant";

@Injectable({
  providedIn: 'root'
})
export class PrDurationService implements IService<PurchaseReq> {
  constructor(private httpClient: HttpClient) {}

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<PurchaseReq>> {
    return this.httpClient
      .post<DatatableResponse<PurchaseReq>>(AuthConstant.apiRoot + '/PurchaseReqs/GetPrForDuration',
        queryParams,
        { headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
}
