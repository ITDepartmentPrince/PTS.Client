import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataTable} from "../../shared/dataTable";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {ModalService} from "../../shared/modal/modal.service";
import {Operations} from "../../shared/operations";
import {MeasurementUnit} from "../../models/measurement-unit";
import {MeasurementUnitsService} from "../../services/measurement-units.service";
import {BodyDeleteFailedComponent} from "../../shared/body-delete-failed/body-delete-failed.component";

@Component({
  selector: 'app-measurement-units',
  templateUrl: './measurement-units.component.html'
})
export class MeasurementUnitsComponent implements AfterViewInit {
  displayedColumns = ['ShortUnit', 'LongUnit', 'CreateDate', 'CreatedBy', 'LastUpdate', 'UpdatedBy'];
  dataSource: DataTable<MeasurementUnit>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(private measurementUnitsService: MeasurementUnitsService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {
    this.dataSource =
      new DataTable<MeasurementUnit>(this.displayedColumns,
        this.measurementUnitsService,
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

  onOperate(operation: Operations) {
    switch (operation) {
      case Operations.Create:
        this.router?.navigate(['create'], {
          relativeTo: this.route,
          queryParamsHandling: 'preserve'
        });
        break;
      case Operations.View:
        if (this.dataSource.row)
          this.router?.navigate([this.dataSource.row?.unitId], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Edit:
        if (this.dataSource.row)
          this.router?.navigate([this.dataSource.row?.unitId, 'edit'], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.measurementUnitsService.delete(this.dataSource.row?.unitId)
                .subscribe({
                  next: _ => {
                    this.dataSource.loadData();
                    this.dataSource.row = null;
                  },
                  error: _ => {
                    this.modalService.show(this.modal.viewContainerRef,
                      {btnSuccess: true},
                      BodyDeleteFailedComponent);

                    this.dataSource.isLoading.next(false);
                  }
                })
            }
          });
        }
        break;
    }
  }
}
