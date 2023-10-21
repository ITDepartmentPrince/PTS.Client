import {Injectable} from "@angular/core";
import {IService} from "../shared/interface/IService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QueryParams} from "../models/query-params";
import {Observable} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {AuthConstant} from "../auth/auth.constant";
import {OtherCharge} from "../models/other-charge";

@Injectable({providedIn: 'root'})
export class OtherChargesService implements IService<OtherCharge> {
  constructor(private httpClient: HttpClient) {
  }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<OtherCharge>> {
    return this.httpClient
      .post<DatatableResponse<OtherCharge>>(AuthConstant.apiRoot + '/OtherCharges/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<OtherCharge[]> {
    return this.httpClient.get<OtherCharge[]>(AuthConstant.apiRoot + `/OtherCharges`);
  }

  get(chargeId: number): Observable<OtherCharge> {
    return this.httpClient.get<OtherCharge>(AuthConstant.apiRoot + `/OtherCharges/${chargeId}`);
  }

  create(model: OtherCharge): Observable<any> {
    return this.httpClient.post<OtherCharge>(AuthConstant.apiRoot + '/OtherCharges', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: OtherCharge): Observable<any> {
    return this.httpClient.put<OtherCharge>(AuthConstant.apiRoot + '/OtherCharges', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(chargeId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/OtherCharges/${chargeId}`);
  }
}
