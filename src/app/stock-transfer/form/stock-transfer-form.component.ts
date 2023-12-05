import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Operations} from "../../shared/operations";
import {AuthPolicy} from "../../auth/auth-policy";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {MatlClassification} from "../../models/matl-classification";
import {Site} from "../../models/site";
import {MatlClassificationsService} from "../../services/matl-classifications.service";
import {SitesService} from "../../services/sites.service";
import {zip} from "rxjs";
import {StockTransferService} from "../../services/stock-transfer-service";
import {Vendor} from "../../models/vendor";
import {VendorsService} from "../../services/vendors.service";

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
  classifications: Array<MatlClassification>;
  sites: Array<Site>;
  DesSites: Array<Site>;
  vendors: Array<Vendor>;

  constructor(public router: Router,
              public route: ActivatedRoute,
              public stService: StockTransferService,
              private matClasService: MatlClassificationsService,
              private sitesService: SitesService,
              private vendorsService: VendorsService) {
  }

  onSubmit() {
    this.isLoading = true;
    this.submitted.emit();
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;

    zip(this.matClasService.getAll(),
        this.sitesService.getAll(),
        this.vendorsService.getAll())
      .subscribe(res => {
        this.classifications = res[0];
        this.sites = res[1];
        this.DesSites = res[1].filter(r => r.siteId !== this.sitesService.localSite);
        this.vendors = res[2];

        this.isLoading = false;
      });
  }

  onClassificationChange() {
    this.stService.stockTransfer.stockTransferItems = [];
    this.stService.changeItems.next();
  }

  onTransferDateChange(event: any) {
    this.stService.stockTransfer.createDate = event.target.value
  }

  onVendorChange() {
    this.stService.stockTransfer.stockTransferItems = [];
    this.stService.changeItems.next();
  }
}
