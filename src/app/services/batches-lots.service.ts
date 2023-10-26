import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {BatchLot} from "../models/batchLot";

@Injectable({providedIn: 'root'})
export class BatchesLotsService {
  constructor(private httpClient: HttpClient) { }

  getAllByMaterial(siteId: number, materialId: number): Observable<Array<BatchLot>> {
    return this.httpClient.get<Array<BatchLot>>(AuthConstant.apiRoot +
      `/BatchesLots/${siteId}/Materials/${materialId}`);
  }

  get(batchLotId: number, siteId: number): Observable<BatchLot> {
    return this.httpClient.get<BatchLot>(AuthConstant.apiRoot + `/BatchesLots/${batchLotId}/${siteId}`);
  }

  create(model: BatchLot): Observable<BatchLot> {
    return this.httpClient.post<BatchLot>(AuthConstant.apiRoot + '/BatchesLots', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
