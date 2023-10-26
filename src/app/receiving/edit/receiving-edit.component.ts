import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Operations} from "../../shared/operations";
import {Router} from "@angular/router";
import {ReceivingForSiteService} from "../../services/receiving-for-site.service";
import {IFormModel} from "../../shared/interface/IFormModel";
import {Receiving} from "../../models/receiving";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-receiving-edit',
  templateUrl: './receiving-edit.component.html'
})
export class ReceivingEditComponent implements OnInit, OnDestroy {
  operations = Operations;
  isLoading = true;
  sub: Subscription;
  private _roNumber: string;
  constructor(private router: Router,
              private rfsService: ReceivingForSiteService) {
  }

  @Input()
  set roNumber(roNumber: string) {
    this._roNumber = roNumber;
    this.rfsService.get(roNumber)
      .subscribe({
        next: ro => {
          this.rfsService.receiving = ro;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  ngOnInit(): void {
    this.sub = this.rfsService.receiveStatusChanged
      .subscribe(_ => {
        this.isLoading = true;
        this.rfsService.get(this._roNumber)
          .subscribe({
            next: ro => {
              this.rfsService.receiving = ro;

              this.isLoading = false;
            },
            error: _ => {
              this.isLoading = false;
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSubmitted(formModel: IFormModel<Receiving>) {
    this.router?.navigate([`/receiving/${formModel.model.roNumber}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
