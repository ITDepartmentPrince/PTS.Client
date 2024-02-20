import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {OidcSecurityService} from "angular-auth-oidc-client";
import {exhaustMap, Observable, take} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {Role} from "../models/role";
import {IService} from "../shared/interface/IService";
import { DatatableResponse } from '../models/datatable-response';
import { QueryParams } from '../models/query-params';

@Injectable({providedIn: 'root'})
export class RoleService implements IService<Role> {
  model: Role;

  constructor(private httpClient: HttpClient,
              private authService: OidcSecurityService) {
  }

  getRequired(qp: QueryParams): Observable<DatatableResponse<Role>> {
    return this.authService.getAccessToken()
      .pipe(
        take(1),
        exhaustMap(token => {
          return this.httpClient
            .post<DatatableResponse<Role>>(AuthConstant.idpRoot + '/Api/Roles/GetRequired', qp, {
              headers: new HttpHeaders().append('Content-Type', 'application/json')
                .append('Authorization', `Bearer ${token}`)
            });
        }));
  }

  get(roleId: number): Observable<Role> {
    return this.authService.getAccessToken()
      .pipe(
        take(1),
        exhaustMap(token => {
          return this.httpClient.get<Role>(AuthConstant.idpRoot + `/Api/Roles/${roleId}`, {
            headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
          });
        }));
  }

  create(): Observable<any> {
    return this.authService.getAccessToken()
      .pipe(
        take(1),
        exhaustMap(token => {
          return this.httpClient.post<Role>(AuthConstant.idpRoot + `/Api/Roles`, this.model, {
            headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
          });
        }));
  }

  getAll(): Observable<Role[]> {
    return this.authService.getAccessToken()
      .pipe(
        take(1),
        exhaustMap(token => {
          return this.httpClient.get<Role[]>(AuthConstant.idpRoot + `/Api/Roles`, {
            headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
          });
        }));
  }

  edit(): Observable<any> {
    return this.authService.getAccessToken()
      .pipe(
        take(1),
        exhaustMap(token => {
          return this.httpClient.put<Role>(AuthConstant.idpRoot + '/Api/Roles', this.model, {
            headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
          });
        }));
  }

  delete(id: number | undefined) {
    return this.httpClient.delete(AuthConstant.idpRoot + `/Api/Roles/${id}`);
  }
}
