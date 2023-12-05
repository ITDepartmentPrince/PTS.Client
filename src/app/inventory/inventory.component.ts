import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataTable} from "../shared/dataTable";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ModalDirective} from "../shared/modal/modal.directive";
import {BatchLot} from "../models/batchLot";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../shared/modal/modal.service";
import {BatchesLotsService} from "../services/batches-lots.service";
import {AddViewShelfComponent} from "./add-view-shelf/add-view-shelf.component";
import {ShelvesService} from "../services/shelves.service";
import {ShelfNotAvailableComponent} from "./shelf-not-available/shelf-not-available.component";
import {ShelfStorageService} from "../services/shelf-storage.service";
import {Operations} from "../shared/operations";
import {BodyDeleteFailedComponent} from "../shared/body-delete-failed/body-delete-failed.component";
import {Site} from "../models/site";
import {SitesService} from "../services/sites.service";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  providers: [ShelfStorageService]
})
export class InventoryComponent implements OnInit, AfterViewInit {
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

  constructor(public blService: BatchesLotsService,
              public router: Router,
              private shelvesService: ShelvesService,
              private ssService: ShelfStorageService,
              private route: ActivatedRoute,
              private modalService: ModalService,
              public sitesService: SitesService) {
    if (this.route.snapshot.url[0].path === 'sponsor-materials') {
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

  ngOnInit(): void {
    this.sitesService.getAll()
      .subscribe(res => this.sites = res);

    this.blService.siteId = this.sitesService.localSite;
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

  async onShelfNumChange(event: Event) {
    this.isLoading = true;
    const input = (event.target as HTMLInputElement);

    const res = await new Promise<boolean>(resolve => {
      this.shelvesService.isShelfAvailable(input.value)
        .subscribe(value => {
          resolve(value);
          this.isLoading = false;
        });
    });

    if (!res) {
      this.modalService.show(this.modal.viewContainerRef, {
        title: 'Not available',
        btnSuccess: false,
        closeCallback: () => { input.value = ''; }
      }, ShelfNotAvailableComponent);
      return;
    }

    this.ssService.shelfCode = input.value;

    if (this.route.snapshot.data['pathEnd'] === 'prince-materials') {
      this.modalService.show(this.modal.viewContainerRef, {
        modalSize: 'modal-xl',
        btnSuccess: true,
        btnSuccessLabel: 'Save',
        btnCloseLabel: 'Cancel',
        title: `shelf number ${input.value}, <<< PRINCE MATERIALS >>>`,
        successCallback: _ => {
          this.dataSource.isLoading.next(true);

          this.ssService.create()
            ?.subscribe(_ => {
              this.dataSource.loadData();
            });

          input.value = '';
          this.ssService.toAddShelfStorage = [];
        },
        closeCallback: () => {
          input.value = '';
          this.ssService.toAddShelfStorage = [];
        }
      }, AddViewShelfComponent);
    }
    else if (this.route.snapshot.data['pathEnd'] === 'sponsor-materials') {
      this.modalService.show(this.modal.viewContainerRef, {
        modalSize: 'modal-xl',
        btnSuccessLabel: 'Save',
        btnCloseLabel: 'Cancel',
        title: `shelf number ${input.value}, <<< SPONSOR MATERIALS >>>`,
        successCallback: _ => {

          input.value = '';
        },
        closeCallback: () => { input.value = ''; }
      }, AddViewShelfComponent);
    }
    else if (this.route.snapshot.data['pathEnd'] === 'finish-goods') {
      this.modalService.show(this.modal.viewContainerRef, {
        modalSize: 'modal-xl',
        btnSuccessLabel: 'Save',
        btnCloseLabel: 'Cancel',
        title: `shelf number ${input.value}, <<< FINISH GOODS >>>`,
        successCallback: _ => {

          input.value = '';
        },
        closeCallback: () => { input.value = ''; }
      }, AddViewShelfComponent);
    }
  }

  disBtnDelOnEmptyBL() {
    return <number>this.dataSource.row
      ?.inventoryIntels
      .reduce((acc, curr) => acc + curr.qty, 0) > 0;
  }

  onSiteChange(site: Site) {
    this.blService.siteId = site.siteId;
    this.dataSource.isLoading.next(true);
    this.dataSource.loadData();
  }

  onQtyCommitted(batchLot: BatchLot) {
    if (this.blService.getCommittedQty(batchLot) < 1)
      return;
  }
}
