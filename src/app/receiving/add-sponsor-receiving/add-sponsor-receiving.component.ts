import {Component, OnInit} from '@angular/core';
import {MatlClassification} from "../../models/matl-classification";
import {SourceType} from "../../shared/source-type";
import {Router} from "@angular/router";
import {Source} from "../../models/source";
import {ItemType} from "../../shared/item-type";
import {AddSponsorReceivingService} from "../../services/add-sponsor-receiving.service";
import {SitesService} from "../../services/sites.service";
import {Utils} from "../../shared/utils";
import {MatlClassificationsService} from "../../services/matl-classifications.service";
import {Vendor} from "../../models/vendor";
import {zip} from "rxjs";
import {VendorsService} from "../../services/vendors.service";

@Component({
  selector: 'app-add-sponsor-receiving',
  templateUrl: './add-sponsor-receiving.component.html',
  providers: [AddSponsorReceivingService]
})
export class AddSponsorReceivingComponent implements  OnInit {
  protected readonly ItemType = ItemType;
  isLoading = true;
  sourcesType: { name: any; id: number }[];
  classifications: Array<MatlClassification>;
  sponsors: Array<Vendor>;

  constructor(public router: Router,
              public asrService: AddSponsorReceivingService,
              private siteService: SitesService,
              private clasService: MatlClassificationsService,
              private vendorService: VendorsService) {
    this.asrService.receiving.siteId = this.siteService.localSite;
    this.asrService.receiving.deliveryDate = new Date();
    this.asrService.receiving.createDate = new Date();
    this.asrService.receiving.source = new Source();
    this.asrService.receiving.source.srSiteId = this.siteService.localSite;
    this.asrService.receiving.source.sourceType = SourceType.Sponsor;
  }

  ngOnInit(): void {
    zip(this.clasService.getAll(),
      this.vendorService.getAll())
      .subscribe(refs => {
        this.classifications = refs[0];
        this.sponsors = refs[1];

        this.asrService.receiving.classificationId = this.classifications
          ?.find(c => c.classificationName.toLowerCase() === 'raw materials')
          ?.classificationId as number;

        this.isLoading = false;
      });

    this.setItemsType();
  }

  private setItemsType() {
    this.sourcesType = Object.entries(SourceType)
      .filter(entry => !isNaN(entry[0] as any))
      .map(entry => ({ name: entry[1], id: +entry[0] }));
  }

  onSubmit() {
    this.isLoading = true;

    this.asrService.create()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/receiving'], {
            queryParamsHandling: 'preserve'
          });
        },
        error: error => {
          Utils.handleError(error);
          this.isLoading = false;
        }
      });
  }

  isClassifiedAs(classificationId: number,
                 vendorId: number | null,
                 classifiedAs: ItemType): boolean {
    return !!this.classifications.find(c =>
            c.classificationId === classificationId
            && c.classifiedAs === classifiedAs)
        && !!vendorId;
  }

  onClassificationChange() {
    this.asrService.receiving.receivingItems = [];
    this.asrService.itemsChange.next();
  }

  onSponsorChange() {
    this.onClassificationChange();
  }

  onCreateDateChange(event: any) {
    this.asrService.receiving.createDate = event.target.value;
  }

  onDeliveryDateChange(event: any) {
    this.asrService.receiving.deliveryDate = event.target.value;
  }
}
