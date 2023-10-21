import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {MeasurementUnit} from "../models/measurement-unit";
import {State} from "../models/state";

@Injectable({providedIn: 'root'})
export class MeasurementUnitsService implements IService<MeasurementUnit> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<MeasurementUnit>> {
    return this.httpClient
      .post<DatatableResponse<MeasurementUnit>>(AuthConstant.apiRoot + '/MeasurementUnits/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<MeasurementUnit[]> {
    return this.httpClient.get<MeasurementUnit[]>(AuthConstant.apiRoot + `/MeasurementUnits`);
  }

  get(unitId: number): Observable<MeasurementUnit> {
    return this.httpClient.get(AuthConstant.apiRoot + `/MeasurementUnits/${unitId}`);
  }

  create(model: MeasurementUnit): Observable<any> {
    return this.httpClient.post<MeasurementUnit>(AuthConstant.apiRoot + '/MeasurementUnits', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: MeasurementUnit): Observable<any> {
    return this.httpClient.put<MeasurementUnit>(AuthConstant.apiRoot + '/MeasurementUnits', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(unitId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/MeasurementUnits/${unitId}`);
  }
}
