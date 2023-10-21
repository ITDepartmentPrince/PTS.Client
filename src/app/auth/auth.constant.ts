export class AuthConstant {
  public static clientId = 'PTS.Client.SPA';
  public static clientSecret = 'ptsclientspasecret';
  public static clientRoot = 'http://localhost:4200';
  public static apiRoot = 'https://localhost:7230/Api';
  public static idpRoot = 'https://localhost:5001';
  public static redirectUri = `${this.clientRoot}/login-callback`;
  public static postLogoutRedirectUri = `${this.clientRoot}/logout-callback`;
  public static silentRedirectUri = `${this.clientRoot}/assets/silent-callback.html`;
  public static scope = 'openid profile offline_access roles ptsapi.read ptsapi.write';
  public static responseType = 'code';
}
