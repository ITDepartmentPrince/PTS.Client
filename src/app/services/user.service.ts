import {HttpClient, HttpHeaders} from "@angular/common/http";
import {exhaustMap, Observable, take} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {User} from "../models/user";
import {OidcSecurityService} from "angular-auth-oidc-client";
import {EventEmitter, Injectable} from "@angular/core";
import {IService} from "../shared/interface/IService";
import { DatatableResponse } from "../models/datatable-response";
import { QueryParams } from "../models/query-params";
import {UserRole} from "../models/user-role";

@Injectable({providedIn: 'root'})
export class UserService implements IService<User> {
  model: User;
  userLoaded = new EventEmitter<void>();

  constructor(private httpClient: HttpClient,
              private authService: OidcSecurityService) {
  }

  getRequired(qp: QueryParams): Observable<DatatableResponse<User>> {
    return this.authService.getAccessToken()
      .pipe(
        take(1),
        exhaustMap(token => {
          return this.httpClient
            .post<DatatableResponse<User>>(AuthConstant.idpRoot + '/Api/Users/GetRequired', qp, {
              headers: new HttpHeaders().append('Content-Type', 'application/json')
                .append('Authorization', `Bearer ${token}`)
            });
        }));
  }

  get(userId: number): Observable<User> {
    return this.authService.getAccessToken()
      .pipe(
        take(1),
        exhaustMap(token => {
          return this.httpClient.get<User>(AuthConstant.idpRoot + `/Api/Users/${userId}`, {
            headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
          });
        }));
  }

  getUserRoles(userId: number): Observable<UserRole[]> {
    return this.authService.getAccessToken()
      .pipe(
        take(1),
        exhaustMap(token => {
          return this.httpClient.get<UserRole[]>(AuthConstant.idpRoot + `/Api/Users/${userId}/GetUserRoles`, {
            headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
          });
        }));
  }

  edit(): Observable<any> {
    return this.authService.getAccessToken()
      .pipe(
        take(1),
        exhaustMap(token => {
          return this.httpClient.put<User>(AuthConstant.idpRoot + '/Api/Users', this.model, {
            headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
          });
        }));
  }

  delete(id: number | undefined) {
    return this.httpClient.delete(AuthConstant.idpRoot + `/Users/${id}`);
  }
}
