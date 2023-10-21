import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RecvdItemLotBatch} from "../models/recvdItemLotBatch";
import {Observable} from "rxjs";
import {PurchaseReq} from "../models/purchase-req";
import {AuthConstant} from "../auth/auth.constant";

@Injectable({providedIn: 'root'})
export class RecvdItemsLotsBatchesService {
  constructor(private httpClient: HttpClient) {
  }
  create(roNumber: string, siteId: number, model: Array<RecvdItemLotBatch>): Observable<any> {
    return this.httpClient.post<PurchaseReq>(AuthConstant.apiRoot +
        `/RecvdItemsLotsBatches/${roNumber}/${siteId}`,
      model,
      {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  delete(roNumber: string, siteId: number): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/RecvdItemsLotsBatches/${roNumber}/${siteId}`);
  }
}
