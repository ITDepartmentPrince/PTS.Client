import { NgModule } from '@angular/core';
import {AuthModule, LogLevel} from 'angular-auth-oidc-client';
import {AuthConstant} from "./auth.constant";

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: AuthConstant.idpRoot,
        redirectUrl: AuthConstant.redirectUri,
        postLogoutRedirectUri: AuthConstant.postLogoutRedirectUri,
        clientId: AuthConstant.clientId,
        scope: AuthConstant.scope,
        responseType: AuthConstant.responseType,
        silentRenew: true,
        silentRenewUrl: AuthConstant.silentRedirectUri,
        renewTimeBeforeTokenExpiresInSeconds: 10,
        useRefreshToken: true,
        postLoginRoute: '/',
        forbiddenRoute: '/forbidden',
        unauthorizedRoute: '/unauthorized',
        logLevel: LogLevel.Debug
      }
    })
  ],
  exports: [AuthModule]
})
export class AuthConfigModule {}
