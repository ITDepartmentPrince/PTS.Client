import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {CountriesService} from "../../services/countries.service";
import {ModalService} from "../../shared/modal/modal.service";
import {Operations} from "../../shared/operations";
import {DataTable} from "../../shared/dataTable";
import {Country} from "../../models/country";
import {BodyDeleteFailedComponent} from "../../shared/body-delete-failed/body-delete-failed.component";

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html'
})
export class CountriesComponent implements AfterViewInit {
  displayedColumns = ['CountryCode', 'CountryName', 'CreateDate', 'CreatedBy', 'LastUpdate', 'UpdatedBy'];
  dataSource: DataTable<Country>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(private countriesService: CountriesService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {
    this.dataSource =
      new DataTable<Country>(this.displayedColumns,
        this.countriesService,
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
          this.router?.navigate([this.dataSource.row?.countryCode], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Edit:
        if (this.dataSource.row)
          this.router?.navigate([this.dataSource.row?.countryCode, 'edit'], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.countriesService.delete(this.dataSource.row?.countryCode)
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
