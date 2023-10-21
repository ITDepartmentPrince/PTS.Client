import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {MatlCategory} from "../models/matl-category";
import {MatlClassification} from "../models/matl-classification";

@Injectable({providedIn: 'root'})
export class MatlCategoriesService implements IService<MatlCategory> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<MatlCategory>> {
    return this.httpClient
      .post<DatatableResponse<MatlCategory>>(AuthConstant.apiRoot + '/MatlCategories/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<MatlCategory[]> {
    return this.httpClient.get<MatlCategory[]>(AuthConstant.apiRoot + `/MatlCategories`);
  }

  get(categoryId: number): Observable<MatlCategory> {
    return this.httpClient.get(AuthConstant.apiRoot + `/MatlCategories/${categoryId}`);
  }

  create(model: MatlCategory): Observable<any> {
    return this.httpClient.post<MatlCategory>(AuthConstant.apiRoot + '/MatlCategories', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: MatlCategory): Observable<any> {
    return this.httpClient.put<MatlCategory>(AuthConstant.apiRoot + '/MatlCategories', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(categoryId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/MatlCategories/${categoryId}`);
  }
}
