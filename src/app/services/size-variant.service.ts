import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {SizeVariant} from "../models/size-variant";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";

@Injectable({providedIn: 'root'})
export class SizeVariantService implements IService<SizeVariant> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<SizeVariant>> {
    return this.httpClient
      .post<DatatableResponse<SizeVariant>>(AuthConstant.apiRoot + '/SizeVariants/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<SizeVariant[]> {
    return this.httpClient.get<SizeVariant[]>(AuthConstant.apiRoot + `/SizeVariants`);
  }

  get(sizeId: number): Observable<SizeVariant> {
    return this.httpClient.get(AuthConstant.apiRoot + `/SizeVariants/${sizeId}`);
  }

  create(model: SizeVariant): Observable<any> {
    return this.httpClient.post<SizeVariant>(AuthConstant.apiRoot + '/SizeVariants', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: SizeVariant): Observable<any> {
    return this.httpClient.put<SizeVariant>(AuthConstant.apiRoot + '/SizeVariants', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(sizeId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/SizeVariants/${sizeId}`);
  }
}
