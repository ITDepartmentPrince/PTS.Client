import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RecvdItemLotBatch} from "../models/recvdItemLotBatch";
import {Observable, of} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";

@Injectable({providedIn: 'root'})
export class RecvdItemsLotsBatchesService {
  constructor(private httpClient: HttpClient) {
  }

  create(roNumber: string,
         siteId: number,
         notes: string,
         model: Array<RecvdItemLotBatch>): Observable<Array<RecvdItemLotBatch>> {
    return this.httpClient.put<Array<RecvdItemLotBatch>>(AuthConstant.apiRoot +
        `/Sites/${siteId}/Receiving/${roNumber}/RecvdItemsLotsBatches`,
      { model: model, notes: notes },
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
    // return of(new Array<RecvdItemLotBatch>());
  }

  delete(roNumber: string, siteId: number): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot +
      `/Sites/${siteId}/Receiving/${roNumber}/RecvdItemsLotsBatches`);
  }
}
