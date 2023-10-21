import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {BatchLot} from "../models/batchLot";

@Injectable({providedIn: 'root'})
export class BatchesLotsService {
  constructor(private httpClient: HttpClient) { }

  create(model: BatchLot): Observable<any> {
    return this.httpClient.post<BatchLot>(AuthConstant.apiRoot + '/BatchesLots', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
