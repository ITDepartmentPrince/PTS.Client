import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {ModalService} from "../../shared/modal/modal.service";
import {Operations} from "../../shared/operations";
import {DataTable} from "../../shared/dataTable";
import {BodyDeleteFailedComponent} from "../../shared/body-delete-failed/body-delete-failed.component";
import {Site} from "../../models/site";
import {SitesService} from "../../services/sites.service";
import {RolesConstant} from "../../auth/roles-constant";

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html'
})
export class SitesComponent implements AfterViewInit {
  displayedColumns = ['SiteName', 'Address', 'CreateDate', 'CreatedBy', 'LastUpdate', 'UpdatedBy'];
  dataSource: DataTable<Site>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;
  protected readonly RolesConstant = RolesConstant;

  constructor(private siteService: SitesService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {
    this.dataSource =
      new DataTable<Site>(this.displayedColumns,
        this.siteService,
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
          this.router?.navigate([this.dataSource.row?.siteId], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Edit:
        if (this.dataSource.row)
          this.router?.navigate([this.dataSource.row?.siteId, 'edit'], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            btnSuccess: true,
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.siteService.delete(this.dataSource.row?.siteId)
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
                })
            }
          });
        }
        break;
    }
  }
}
