import {HttpClient, HttpHeaders} from "@angular/common/http";
import {exhaustMap, Observable, take} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {User} from "../models/user";
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private httpClient: HttpClient,
              private authService: OidcSecurityService) {}

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
}
