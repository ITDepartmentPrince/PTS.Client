import {Component, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {BellNotificationService} from "../../services/bell-notification.service";
import {SignalRService} from "../../services/signalR.Service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loadNotifications = false;
  unReadCount = 0;

  constructor(private authService: OidcSecurityService,
              public bnService: BellNotificationService,
              private signalRService: SignalRService) {}

  logout() {
    this.authService
      .logoffAndRevokeTokens()
      .subscribe((result) => console.log(result));
  }

  ngOnInit(): void {
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
}
