import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ReceivingForSiteService} from "../../services/receiving-for-site.service";
import {Operations} from "../../shared/operations";
import {IFormModel} from "../../shared/interface/IFormModel";
import {Receiving, ReceivingStatus} from "../../models/receiving";
import {AuthPolicy} from "../../auth/auth-policy";
import {MatlClassification} from "../../models/matl-classification";
import {Vendor} from "../../models/vendor";
import {SourceType} from "../../shared/source-type";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {MatlClassificationsService} from "../../services/matl-classifications.service";
import {VendorsService} from "../../services/vendors.service";
import {zip} from "rxjs";
import {RolesConstant} from "../../auth/roles-constant";

@Component({
  selector: 'app-receiving-form',
  templateUrl: './receiving-form.component.html'
})
export class ReceivingFormComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() action: Operations;
  @Output() submitted = new EventEmitter<IFormModel<Receiving>>();
  @ViewChild(ModalDirective) modal: ModalDirective;
  protected readonly SourceType = SourceType;
  protected readonly ReceivingStatus = ReceivingStatus;
  protected readonly AuthPolicy = AuthPolicy;
  sourcesType: { name: any; id: number }[];
  operations = Operations;
  classifications: Array<MatlClassification>;
  vendors: Array<Vendor>;

  constructor(public router: Router,
              public route: ActivatedRoute,
              public rfsService: ReceivingForSiteService,
              private clasService: MatlClassificationsService,
              private vendorService: VendorsService) {
  }

  onSubmit() {
    this.isLoading = true;

    this.submitted.emit({
      action: this.action,
      model: this.rfsService.receiving
    });
  }

  ngOnInit(): void {
    zip(this.clasService.getAll(),
      this.vendorService.getAll())
      .subscribe(res => {
          this.classifications = res[0];
          this.vendors = res[1];
      });

    this.setItemsType();
  }

  private setItemsType() {
    this.sourcesType = Object.entries(SourceType)
      .filter(entry => !isNaN(entry[0] as any))
      .map(entry => ({ name: entry[1], id: +entry[0] }));
  }

  protected readonly RolesConstant = RolesConstant;
}
