import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Operations} from "../../shared/operations";
import {AuthPolicy} from "../../auth/auth-policy";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {Site} from "../../models/site";
import {SitesService} from "../../services/sites.service";
import {StockTransferService} from "../../services/stock-transfer-service";

@Component({
  selector: 'app-stock-transfer-form',
  templateUrl: './stock-transfer-form.component.html'
})
export class StockTransferFormComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() action: Operations;
  @Output() submitted = new EventEmitter();
  @ViewChild(ModalDirective) modal: ModalDirective;
  protected readonly AuthPolicy = AuthPolicy;
  operations = Operations;
  controlState: boolean;
  sites: Array<Site>;
  DesSites: Array<Site>;

  constructor(public router: Router,
              public route: ActivatedRoute,
              public stService: StockTransferService,
              private sitesService: SitesService) {
  }

  onSubmit() {
    this.isLoading = true;
    this.submitted.emit();
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;

    this.sitesService.getAll()
      .subscribe(res => {
        this.sites = res;
        this.DesSites = res.filter(r => r.siteId !== this.sitesService.localSite);

        this.isLoading = false;
      });
  }

  onTransferDateChange(event: any) {
    this.stService.stockTransfer.createDate = event.target.value
  }
}
