import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {MatlClassification} from "../models/matl-classification";
import {SizeVariant} from "../models/size-variant";

@Injectable({providedIn: 'root'})
export class MatlClassificationsService implements IService<MatlClassification> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<MatlClassification>> {
    return this.httpClient
      .post<DatatableResponse<MatlClassification>>(AuthConstant.apiRoot + '/MatlClassifications/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<MatlClassification[]> {
    return this.httpClient.get<MatlClassification[]>(AuthConstant.apiRoot + `/MatlClassifications`);
  }

  get(classificationId: number): Observable<MatlClassification> {
    return this.httpClient.get<MatlClassification>(AuthConstant.apiRoot + `/MatlClassifications/${classificationId}`);
  }

  create(model: MatlClassification): Observable<any> {
    return this.httpClient.post<MatlClassification>(AuthConstant.apiRoot + '/MatlClassifications', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: MatlClassification): Observable<any> {
    return this.httpClient.put<MatlClassification>(AuthConstant.apiRoot + '/MatlClassifications', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(classificationId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/MatlClassifications/${classificationId}`);
  }
}
