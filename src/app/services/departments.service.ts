import {Injectable} from "@angular/core";
import {IService} from "../shared/interface/IService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QueryParams} from "../models/query-params";
import {Observable} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {AuthConstant} from "../auth/auth.constant";
import {Department} from "../models/department";

@Injectable({providedIn: 'root'})
export class DepartmentsService implements IService<Department> {
  department: Department;

  constructor(private httpClient: HttpClient) {
  }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<Department>> {
    return this.httpClient
      .post<DatatableResponse<Department>>(AuthConstant.apiRoot + '/Departments/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<Department[]> {
    return this.httpClient.get<Department[]>(AuthConstant.apiRoot + `/Departments`);
  }

  get(id: number): Observable<Department> {
    return this.httpClient.get<Department>(AuthConstant.apiRoot + `/Departments/${id}`);
  }

  create(): Observable<any> {
    return this.httpClient.post<Department>(AuthConstant.apiRoot + '/Departments', this.department, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(): Observable<any> {
    return this.httpClient.put<Department>(AuthConstant.apiRoot + '/Departments', this.department, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(id: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/Departments/${id}`);
  }
}
