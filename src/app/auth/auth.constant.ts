export class AuthConstant {
  public static clientId = 'PTS.Client.SPA';
  public static clientSecret = 'ptsclientspasecret';
  public static clientRoot = 'https://172.16.4.166:4487';
  public static apiRoot = 'https://172.16.4.166:4488/Api';
  public static apiSignalRConn = 'https://172.16.4.166:4488/notification';
  public static idpRoot = 'https://172.16.4.166:4489';
  /*public static clientRoot = 'http://localhost:4200';
  public static apiRoot = 'https://localhost:7230/Api';
  public static apiSignalRConn = 'https://localhost:7230/notification';
  public static idpRoot = 'https://localhost:5001';*/
  public static redirectUri = `${this.clientRoot}/login-callback`;
  public static postLogoutRedirectUri = `${this.clientRoot}/logout-callback`;
  public static silentRedirectUri = `${this.clientRoot}/assets/silent-callback.html`;
  public static scope = 'openid profile offline_access roles ptsapi.read ptsapi.write IdentityServerApi';
  public static responseType = 'code';
}
