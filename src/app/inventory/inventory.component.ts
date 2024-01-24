import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTable} from "../shared/dataTable";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ModalDirective} from "../shared/modal/modal.directive";
import {BatchLot} from "../models/batchLot";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../shared/modal/modal.service";
import {BatchesLotsService} from "../services/batches-lots.service";
import {ShelfStorageService} from "../services/shelf-storage.service";
import {Operations} from "../shared/operations";
import {BodyDeleteFailedComponent} from "../shared/body-delete-failed/body-delete-failed.component";
import {Site} from "../models/site";
import {SitesService} from "../services/sites.service";
import {ItemLabelService} from "../services/item-label.service";
import {map, Subscription} from "rxjs";
import {InventoryIntelComponent} from "./inventory-intel/inventory-intel.component";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  providers: [ShelfStorageService]
})
export class InventoryComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['Description', 'CatalogNumber', 'CategoryName', 'CompanyName', 'BatchLotNumber', 'Bin', 'AvgCost',
    'ValueInStock', 'InStock', 'Committed' ];
  dataSource: DataTable<BatchLot>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;
  isLoading: boolean;
  jsonData = {value: ''};
  sites: Array<Site>;
  venSpon = 'Vendor';
  sub: Subscription;
  isSponsor = false;
  totalHeader = ['Total', 'VIS', 'IS', 'r-brd'];

  constructor(public blService: BatchesLotsService,
              public router: Router,
              private itemLabelService: ItemLabelService,
              private route: ActivatedRoute,
              private modalService: ModalService,
              public sitesService: SitesService) {
    if (this.route.snapshot.url[0].path === 'sponsor-materials') {
      this.isSponsor = true;
      this.totalHeader.splice(1, 1);
      this.venSpon = 'Sponsor name';
      this.jsonData.value = 'SponsorMaterials';
      this.displayedColumns.splice(this.displayedColumns.indexOf('AvgCost'), 1);
      this.displayedColumns.splice(this.displayedColumns.indexOf('ValueInStock'), 1);
    }

    if (this.route.snapshot.url[0].path === 'finish-goods')
      this.jsonData.value = 'FinishedGoods';

    this.dataSource =
      new DataTable<BatchLot>(this.displayedColumns,
        this.blService,
        this.router,
        this.route,
        JSON.stringify(this.jsonData));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sitesService.getAll()
      .subscribe(res => this.sites = res);

    this.sub = this.itemLabelService.shelfCodeAdded
      .subscribe(_ => {
      this.dataSource.isLoading.next(true);
      this.dataSource.loadData();
      this.dataSource.row = null;
    });
  }

  @Input()
  set pageIndex(index: number) {
    this.dataSource.pageIndex = index;
  }

  @Input()
  set pageOrder(value: SortDirection) {
    this.dataSource.pageOrder = value;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.init();
  }

  onOperate(operation: Operations) {
    switch (operation) {
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            btnSuccess: true,
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.blService.delete(this.dataSource.row?.batchLotId, this.dataSource.row?.siteId)
                .subscribe({
                  next: _ => {
                    this.dataSource.loadData();
                    this.dataSource.row = null;
                  },
                  error: _ => {
                    this.modalService.show(this.modal.viewContainerRef,
                      {btnSuccess: false},
                      BodyDeleteFailedComponent);

                    this.dataSource.isLoading.next(false);
                  }
                });
            }
          });
        }
      break;
    }
  }

  /*disBtnDelOnEmptyBL() {
    return <number>this.dataSource.row
      ?.inventoryIntels
      .reduce((acc, curr) => acc + curr.qty, 0) > 0;
  }*/

  onSiteChange(site: Site) {
    this.blService.siteId = site.siteId;
    this.dataSource.isLoading.next(true);
    this.dataSource.loadData();
  }

  onQtyCommitted(batchLot: BatchLot) {
    if (this.blService.getCommittedQty(batchLot) < 1)
      return;
  }

  getTotalInStock() {
    return this.dataSource
      .connect()
      .pipe(
        map(value => value.flatMap(v => v.inventoryIntels)
          .reduce((a, c) => a + c.qty, 0).toLocaleString()),
      );
  }

  getTotalValueInStock() {
    return this.dataSource
      .connect()
      .pipe(
        map(value =>
          value.flatMap(v => v.inventoryIntels)
            .reduce((a, c) => a + c.pricePerQty * c.qty, 0)
            .toLocaleString())
      );
  }

  showTrailInv(event: MouseEvent, batchLot: BatchLot) {
    this.modalService.show(
      this.modal.viewContainerRef,
      {
        title: 'Inventory intel of ' + batchLot.material.catalogDescription + ', Batch/Lot #: ' + batchLot.batchLotNumber,
        modalSize: 'modal-lg',
        btnSuccess: false
      },
      InventoryIntelComponent,
      {
        batchLot: batchLot
      });

    event.stopPropagation();
  }
}
