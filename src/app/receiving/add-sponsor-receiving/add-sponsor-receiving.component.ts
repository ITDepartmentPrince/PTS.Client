import {Component, OnInit, ViewChild} from '@angular/core';
import {MatlClassification} from "../../models/matl-classification";
import {SourceType} from "../../shared/source-type";
import {Router} from "@angular/router";
import {ReceivingService} from "../../services/receiving.service";
import {Source} from "../../models/source";
import {ItemType} from "../../shared/item-type";
import {AddSponsorReceivingService} from "../../services/add-sponsor-receiving.service";
import {Sponsor} from "../../models/sponsor";
import {NgForm} from "@angular/forms";
import {SiteService} from "../../services/site-service";
import {Utils} from "../../shared/utils";

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
  sponsors: Array<Sponsor>;
  @ViewChild('f') form: NgForm;

  constructor(public router: Router,
              private receivingService: ReceivingService,
              public asrService: AddSponsorReceivingService,
              private siteService: SiteService) {
    this.asrService.receiving.siteId = this.siteService.site;
    this.asrService.receiving.deliveryDate = new Date();
    this.asrService.receiving.createDate = new Date();
    this.asrService.receiving.source = new Source();
    this.asrService.receiving.source.srSiteId = this.siteService.site;
    this.asrService.receiving.source.sourceType = SourceType.Sponsor;
  }

  ngOnInit(): void {
    this.receivingService.getRefsList()
      .subscribe({
        next: refs => {
          this.classifications = refs.classifications;
          this.sponsors = refs.sponsors;

          this.asrService.receiving.classificationId = this.classifications?.find(c =>
            c.classificationName?.
            includes('Raw Materials'))
            ?.classificationId as number;

          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
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
    this.receivingService.create(this.asrService.receiving)
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

  isClassifiedAs(classificationId: number, classifiedAs: ItemType): boolean {
    return !!this.classifications
      ?.find(c =>
        c.classificationId === classificationId &&
        c.classifiedAs === classifiedAs);
  }

  onClassificationChange() {
    this.asrService.receiving.receivingItems = [];
    this.asrService.itemsChange.next();
  }
}
