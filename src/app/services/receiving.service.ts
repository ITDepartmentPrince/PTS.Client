import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {RefsList} from "../models/refs-list";
import {AuthConstant} from "../auth/auth.constant";
import {Receiving} from "../models/receiving";

@Injectable({providedIn: 'root'})
export class ReceivingService {
  constructor(private httpClient: HttpClient) {
  }

  create(model: Receiving): Observable<any> {
    return this.httpClient.post<Receiving>(AuthConstant.apiRoot + `/Receiving`,
      model,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  getRefsList(): Observable<RefsList> {
    return this.httpClient.get<RefsList>(AuthConstant.apiRoot + `/Receiving/GetReceivingRefsList`);
  }
}
