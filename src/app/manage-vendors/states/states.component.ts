import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {DataTable} from "../../shared/dataTable";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../../shared/modal/modal.service";
import {Operations} from "../../shared/operations";
import {State} from "../../models/state";
import {StatesService} from "../../services/states.service";
import {BodyDeleteFailedComponent} from "../../shared/body-delete-failed/body-delete-failed.component";

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html'
})
export class StatesComponent implements AfterViewInit {
  displayedColumns = ['StateCode', 'StateName', 'CountryName', 'CreateDate', 'CreatedBy', 'LastUpdate', 'UpdatedBy'];
  dataSource: DataTable<State>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(private statesService: StatesService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {
    this.dataSource =
      new DataTable<State>(this.displayedColumns,
        this.statesService,
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
          this.router?.navigate([this.dataSource.row?.stateCode], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Edit:
        if (this.dataSource.row)
          this.router?.navigate([this.dataSource.row?.stateCode, 'edit'], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.statesService.delete(this.dataSource.row?.stateCode)
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
