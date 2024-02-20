import {Component, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {BellNotificationService} from "../../services/bell-notification.service";
import {SignalRService} from "../../services/signalR.Service";
import {AuthConstant} from "../../auth/auth.constant";
import {AuthPolicy} from "../../auth/auth-policy";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  protected readonly AuthPolicy = AuthPolicy;
  loadNotifications = false;
  unReadCount = 0;
  user: User | null;

  constructor(public authService: OidcSecurityService,
              public bnService: BellNotificationService,
              private signalRService: SignalRService,
              private userService: UserService) {}

  logout() {
    this.authService
      .logoffAndRevokeTokens()
      .subscribe(result => {
        console.log(result)
      });
  }

  ngOnInit(): void {
    this.authService.getUserData()
      .subscribe(value => {
        this.userService.get(value.sub as number)
          .subscribe(user => {
            this.user = user;
          });
      });

    this.bnService.getUnReadCount()
      .subscribe(res => this.unReadCount = res);

    this.signalRService.startConnection();
    this.signalRService.getServerNotification();
    this.signalRService.onNotified
      .subscribe(_ => {
        this.bnService.getUnReadCount()
          .subscribe(res => {
            if (res > 0) {
              const audio = new Audio('/assets/sound/notification.mp3');
              audio.play().then();
              audio.onended = _ => {
                this.unReadCount = res;
              }
            }
          });
      });

    this.bnService.notificationRead
      .subscribe(_ =>
        this.bnService.getUnReadCount()
          .subscribe(res =>
            this.unReadCount = res));

    const bellDd = document.querySelector('.bell-dd')
    bellDd?.addEventListener('show.bs.dropdown', () => {
      this.loadNotifications = true;
    });

    bellDd?.addEventListener('hide.bs.dropdown', () => {
      this.loadNotifications = false;
    });
  }

  profile() {
    this.authService.getAuthorizeUrl()
      .subscribe(value => {
        window.location.replace(AuthConstant.idpRoot +
          '/Identity/Account/Manage?ReturnUrl=' +
          encodeURIComponent(value?.substring(value?.indexOf('/connect')) as string));
      });
  }

  registerNewUser() {
    this.authService.getAuthorizeUrl()
      .subscribe(value => {
        window.location.replace(AuthConstant.idpRoot +
          '/Identity/Account/Register?ReturnUrl=' +
          encodeURIComponent(value?.substring(value?.indexOf('/connect')) as string));
      });
  }
}
