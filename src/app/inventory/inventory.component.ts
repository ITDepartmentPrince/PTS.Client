import {Component, Input, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  providers: [ShelfStorageService]
})
export class InventoryComponent {
  /*displayedColumns = ['Name', 'SKU code', 'Category', 'Batch #', 'Storage bin', 'Avg cost', 'Stock value',
    'In stock', 'In stock (base UOM)', 'Committed'];*/
  displayedColumns = ['MaterialDescription', 'CatalogNumber', 'CategoryName', 'BatchLotNumber', 'Bin', 'AvgCost',
    'ValueInStock', 'InStock'];
  dataSource: DataTable<BatchLot>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(public blService: BatchesLotsService,
              public router: Router,
              private shelvesService: ShelvesService,
              private ssService: ShelfStorageService,
              private route: ActivatedRoute,
              private modalService: ModalService) {
    this.dataSource =
      new DataTable<BatchLot>(this.displayedColumns,
        this.blService,
        this.router,
        this.route);
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

  async onShelfNumChange(event: Event) {
    const input = (event.target as HTMLInputElement);

    const res = await new Promise<boolean>(resolve => {
      this.shelvesService.isShelfAvailable(input.value)
        .subscribe(value => resolve(value));
    });

    if (!res) {
      this.modalService.show(this.modal.viewContainerRef, {
        title: 'Not available',
        btnSuccess: false,
        closeCallback: () => { input.value = ''; }
      }, ShelfNotAvailableComponent);
      return;
    }

    if (this.route.snapshot.data['pathEnd'] === 'material') {
      this.ssService.shelfCode = input.value;
      this.modalService.show(this.modal.viewContainerRef, {
        modalSize: 'modal-xl',
        btnSuccess: true,
        btnSuccessLabel: 'Save',
        btnCloseLabel: 'Cancel',
        title: `shelf number ${input.value}, <<< MATERIALS >>>`,
        successCallback: _ => {
          this.ssService.create()
            ?.subscribe();
          input.value = '';
        },
        closeCallback: () => {
          input.value = '';
          this.ssService.toAddShelfStorage = [];
        }
      }, AddViewShelfComponent);
    }
    else {
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
}
