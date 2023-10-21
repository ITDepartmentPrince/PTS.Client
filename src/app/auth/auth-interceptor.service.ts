import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {exhaustMap, Observable, take} from 'rxjs';
import { tap } from 'rxjs/operators';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {AuthConstant} from "./auth.constant";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: OidcSecurityService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(AuthConstant.apiRoot)) {
      return this.authService.getAccessToken()
        .pipe(
          take(1),
          exhaustMap(token => {
            if (!token)
              return next.handle(req);

            return next.handle(req.clone({
              headers: req.headers
                .append('Authorization', `Bearer ${token}`)
            }))
              .pipe(
                tap({error: (error: HttpErrorResponse) => {
                  if (error && (error.status === 401 || error.status === 403))
                    this.router?.navigate(['/unauthorized']);
                  }
                })
              );
          })
        );
    }
    else {
      return next.handle(req);
    }
  }
}
