import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from "./home/home.component";
import {RouteReuseStrategy, RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import {AuthInterceptorService} from "./auth/auth-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {LogoutCallbackComponent} from "./auth/logout-callback/logout-callback.component";
import {LoginCallbackComponent} from "./auth/login-callback/login-callback.component";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {AuthDirective} from "./auth/auth.directive";
import {NavbarComponent} from "./header/navbar/navbar.component";
import {SidebarComponent} from './sidebar/sidebar.component';
import {SidebarDirective} from './sidebar/sidebar.directive';
import {MaterialsManagementComponent} from './materials-management/materials-management.component';
import {LoadingSpinnerComponent} from "./shared/loading-spinner/loading-spinner.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {CommandBarComponent} from "./shared/command-bar/command-bar.component";
import {ModalDirective} from "./shared/modal/modal.directive";
import {MaterialsComponent} from "./materials-management/materials/materials.component";
import {ColumnSearchComponent} from "./shared/column-search/column-search.component";
import {ResizeColumnDirective} from "./shared/directives/resize-column.directive";
import {HighlightOnSearchDirective} from "./shared/column-search/highlight-on-search.directive";
import {SearchBuilderComponent} from "./shared/search-builder/search-builder.component";
import {SizeVariantComponent} from "./materials-management/size-variant/size-variant.component";
import {SizeVariantFormComponent} from "./materials-management/size-variant/form/size-variant-form.component";
import {SizeVariantCreateComponent} from "./materials-management/size-variant/create/size-variant-create.component";
import {SizeVariantViewComponent} from "./materials-management/size-variant/view/size-variant-view.component";
import {SizeVariantEditComponent} from "./materials-management/size-variant/edit/size-variant-edit.component";
import {MeasurementUnitsComponent} from './materials-management/measurement-units/measurement-units.component';
import {MeasurementUnitsViewComponent} from './materials-management/measurement-units/view/measurement-units-view.component';
import {MeasurementUnitsEditComponent} from './materials-management/measurement-units/edit/measurement-units-edit.component';
import {MeasurementUnitsCreateComponent} from "./materials-management/measurement-units/create/measurement-units-create.component";
import {MeasurementUnitsFormComponent} from "./materials-management/measurement-units/form/measurement-units-form.component";
import {ModalComponent} from "./shared/modal/modal.component";
import {MatlClassificationsComponent} from "./materials-management/matl-classifications/matl-classifications.component";
import {
  MatlClassificationsCreateComponent
} from "./materials-management/matl-classifications/create/matl-classifications-create.component";
import {
  MatlClassificationsFormComponent
} from "./materials-management/matl-classifications/form/matl-classifications-form.component";
import {
  MatlClassificationsViewComponent
} from "./materials-management/matl-classifications/view/matl-classifications-view.component";
import {
  MatlClassificationsEditComponent
} from "./materials-management/matl-classifications/edit/matl-classifications-edit.component";
import {CountriesComponent} from "./manage-vendors/countries/countries.component";
import {countriesFormComponent} from "./manage-vendors/countries/form/countries-form.component";
import {CountriesCreateComponent} from "./manage-vendors/countries/create/countries-create.component";
import {CountriesEditComponent} from "./manage-vendors/countries/edit/countries-edit.component";
import {CountriesViewComponent} from "./manage-vendors/countries/view/countries-view.component";
import { StatesComponent } from './manage-vendors/states/states.component';
import {statesFormComponent} from "./manage-vendors/states/form/states-form.component";
import {StatesCreateComponent} from "./manage-vendors/states/create/states-create.component";
import {MatSelectModule} from "@angular/material/select";
import { SelectSearchComponent } from './shared/select-search/select-search.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {StatesEditComponent} from "./manage-vendors/states/edit/states-edit.component";
import {StatesViewComponent} from "./manage-vendors/states/view/states-view.component";
import {VendorsComponent} from "./manage-vendors/vendors/vendors.component";
import {vendorsFormComponent} from "./manage-vendors/vendors/form/vendors-form.component";
import {VendorsCreateComponent} from "./manage-vendors/vendors/create/vendors-create.component";
import {VendorsEditComponent} from "./manage-vendors/vendors/edit/vendors-edit.component";
import {VendorsViewComponent} from "./manage-vendors/vendors/view/vendors-view.component";
import {VendorContactsComponent} from "./manage-vendors/vendor-contacts/vendor-contacts.component";
import {VendorContactsFormComponent} from "./manage-vendors/vendor-contacts/form/vendor-contacts-form.component";
import {VendorContactsCreateComponent} from "./manage-vendors/vendor-contacts/create/vendor-contacts-create.component";
import {VendorContactsViewComponent} from "./manage-vendors/vendor-contacts/view/vendor-contacts-view.component";
import {VendorContactsEditComponent} from "./manage-vendors/vendor-contacts/edit/vendor-contacts-edit.component";
import {MatlCategoriesComponent} from "./materials-management/matl-categories/matl-categories.component";
import {
  MatlCategoriesCreateComponent
} from "./materials-management/matl-categories/create/matl-categories-create.component";
import {MatlCategoriesFormComponent} from "./materials-management/matl-categories/form/matl-categories-form.component";
import {MatlCategoriesViewComponent} from "./materials-management/matl-categories/view/matl-categories-view.component";
import {MatlCategoriesEditComponent} from "./materials-management/matl-categories/edit/matl-categories-edit.component";
import {MaterialsFormComponent} from "./materials-management/materials/form/materials-form.component";
import {MaterialsCreateComponent} from "./materials-management/materials/create/materials-create.component";
import {MaterialsViewComponent} from "./materials-management/materials/view/materials-view.component";
import {MaterialsEditComponent} from "./materials-management/materials/edit/materials-edit.component";
import {PurchaseReqsNavComponent} from "./buy/purchase-reqs/purchase-reqs-nav.component";
import {PurchaseReqsComponent} from "./buy/purchase-reqs/purchase-reqs.component";
import {PurchaseReqsCreateComponent} from "./buy/purchase-reqs/create/purchase-reqs-create.component";
import { ItemsMaterialsComponent } from './buy/purchase-reqs/items-materials/items-materials.component';
import {PurchaseReqsViewComponent} from "./buy/purchase-reqs/view/purchase-reqs-view.component";
import {PurchaseReqsEditComponent} from "./buy/purchase-reqs/edit/purchase-reqs-edit.component";
import {BaseRecordsComponent} from "./base-records/base-records.component";
import { TaxRatesComponent } from './base-records/tax-rates/tax-rates.component';
import {TaxRatesFormComponent} from "./base-records/tax-rates/form/tax-rates-form.component";
import {TaxRatesViewComponent} from "./base-records/tax-rates/view/tax-rates-view.component";
import {TaxRatesCreateComponent} from "./base-records/tax-rates/create/tax-rates-create.component";
import {TaxRatesEditComponent} from "./base-records/tax-rates/edit/tax-rates-edit.component";
import { ControlDecimalDirective } from './shared/directives/control-decimal.directive';
import {BodyNotesComponent} from "./shared/body-notes/body-notes.component";
import { BodyDirective } from './shared/directives/body.directive';
import {AuthReverseDirective} from "./auth/auth-reverse.directive";
import { PurchaseOrdersNavComponent } from './buy/purchase-orders/purchase-orders-nav.component';
import {PurchaseOrdersComponent} from "./buy/purchase-orders/purchase-orders.component";
import {ReceivingNavComponent} from "./receiving/receiving-nav.component";
import {ReceivingComponent} from "./receiving/receiving.component";
import {ReceivingViewComponent} from "./receiving/view/receiving-view.component";
import {ReceivingFormComponent} from "./receiving/form/receiving-form.component";
import { ReceivingItemsComponent } from './receiving/receiving-items/receiving-items.component';
import {ReceivingEditComponent} from "./receiving/edit/receiving-edit.component";
import { ReceiveItemsLotsBatchesComponent } from './receiving/receive-items-lots-batches/receive-items-lots-batches.component';
import {NgOptimizedImage} from "@angular/common";
import {AppRouteReuseStrategy} from "./shared/app-route-reuse-strategy";
import { AddSponsorReceivingComponent } from './receiving/add-sponsor-receiving/add-sponsor-receiving.component';
import { AddSponsorReceivingItemsMaterialsComponent } from './receiving/add-sponsor-receiving/add-sponsor-receiving-items/add-sponsor-receiving-items-materials.component';
import { InventoryComponent } from './inventory/inventory.component';
import {InventoryNavComponent} from "./inventory/inventory-nav.component";
import { AddViewShelfComponent } from './inventory/add-view-shelf/add-view-shelf.component';
import { ShelfNotAvailableComponent } from './inventory/shelf-not-available/shelf-not-available.component';
import {DepartmentsComponent} from "./base-records/department/departments.component";
import {DepartmentsFormComponent} from "./base-records/department/form/departments-form.component";
import {DepartmentsEditComponent} from "./base-records/department/edit/departments-edit.component";
import {DepartmentsViewComponent} from "./base-records/department/view/departments-view.component";
import {DepartmentsCreateComponent} from "./base-records/department/create/departments-create.component";
import {ShippingsComponent} from "./base-records/shippings/shippings.component";
import {ShippingsFormComponent} from "./base-records/shippings/form/shippings-form.component";
import {ShippingsEditComponent} from "./base-records/shippings/edit/shippings-edit.component";
import {ShippingsViewComponent} from "./base-records/shippings/view/shippings-view.component";
import {ShippingsCreateComponent} from "./base-records/shippings/create/shippings-create.component";
import {SitesComponent} from "./base-records/sites/sites.component";
import {SitesFormComponent} from "./base-records/sites/form/sites-form.component";
import {SitesEditComponent} from "./base-records/sites/edit/sites-edit.component";
import {SitesViewComponent} from "./base-records/sites/view/sites-view.component";
import {SitesCreateComponent} from "./base-records/sites/create/sites-create.component";
import {PayTermsComponent} from "./manage-vendors/pay-terms/pay-terms.component";
import {PayTermsFormComponent} from "./manage-vendors/pay-terms/form/pay-terms-form.component";
import {PayTermsEditComponent} from "./manage-vendors/pay-terms/edit/pay-terms-edit.component";
import {PayTermsViewComponent} from "./manage-vendors/pay-terms/view/pay-terms-view.component";
import {PayTermsCreateComponent} from "./manage-vendors/pay-terms/create/pay-terms-create.component";
import {ManageVendorsComponent} from "./manage-vendors/manage-vendors.component";
import {PurchaseReqsFormComponent} from "./buy/purchase-reqs/form/purchase-reqs-form.component";

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginCallbackComponent,
    LogoutCallbackComponent,
    HomeComponent,
    SizeVariantComponent,
    SearchBuilderComponent,
    CommandBarComponent,
    SizeVariantFormComponent,
    SizeVariantCreateComponent,
    SizeVariantViewComponent,
    SizeVariantEditComponent,
    ModalDirective,
    ModalComponent,
    AuthDirective,
    NavbarComponent,
    SidebarComponent,
    SidebarDirective,
    MaterialsManagementComponent,
    ColumnSearchComponent,
    ResizeColumnDirective,
    LoadingSpinnerComponent,
    HighlightOnSearchDirective,
    MeasurementUnitsComponent,
    MeasurementUnitsCreateComponent,
    MeasurementUnitsViewComponent,
    MeasurementUnitsEditComponent,
    MeasurementUnitsFormComponent,
    MatlClassificationsComponent,
    MatlClassificationsCreateComponent,
    MatlClassificationsFormComponent,
    MatlClassificationsViewComponent,
    MatlClassificationsEditComponent,
    ManageVendorsComponent,
    CountriesComponent,
    countriesFormComponent,
    CountriesCreateComponent,
    CountriesEditComponent,
    CountriesViewComponent,
    StatesComponent,
    statesFormComponent,
    StatesCreateComponent,
    StatesEditComponent,
    StatesViewComponent,
    SelectSearchComponent,
    VendorsComponent,
    vendorsFormComponent,
    VendorsCreateComponent,
    VendorsEditComponent,
    VendorsViewComponent,
    VendorContactsComponent,
    VendorContactsFormComponent,
    VendorContactsCreateComponent,
    VendorContactsViewComponent,
    VendorContactsEditComponent,
    MatlCategoriesComponent,
    MatlCategoriesCreateComponent,
    MatlCategoriesFormComponent,
    MatlCategoriesViewComponent,
    MatlCategoriesEditComponent,
    MaterialsComponent,
    MaterialsCreateComponent,
    MaterialsFormComponent,
    MaterialsViewComponent,
    MaterialsEditComponent,
    PurchaseReqsNavComponent,
    PurchaseReqsComponent,
    PurchaseReqsCreateComponent,
    PurchaseReqsFormComponent,
    ItemsMaterialsComponent,
    PurchaseReqsViewComponent,
    PurchaseReqsEditComponent,
    BaseRecordsComponent,
    TaxRatesComponent,
    TaxRatesFormComponent,
    TaxRatesViewComponent,
    TaxRatesCreateComponent,
    TaxRatesEditComponent,
    ControlDecimalDirective,
    BodyNotesComponent,
    BodyDirective,
    AuthReverseDirective,
    PurchaseOrdersNavComponent,
    PurchaseOrdersComponent,
    ReceivingNavComponent,
    ReceivingComponent,
    ReceivingViewComponent,
    ReceivingFormComponent,
    ReceivingItemsComponent,
    ReceivingEditComponent,
    ReceiveItemsLotsBatchesComponent,
    AddSponsorReceivingComponent,
    AddSponsorReceivingItemsMaterialsComponent,
    InventoryComponent,
    InventoryNavComponent,
    AddViewShelfComponent,
    ShelfNotAvailableComponent,
    DepartmentsComponent,
    DepartmentsFormComponent,
    DepartmentsEditComponent,
    DepartmentsViewComponent,
    DepartmentsCreateComponent,
    ShippingsComponent,
    ShippingsFormComponent,
    ShippingsEditComponent,
    ShippingsViewComponent,
    ShippingsCreateComponent,
    SitesComponent,
    SitesFormComponent,
    SitesEditComponent,
    SitesViewComponent,
    SitesCreateComponent,
    PayTermsComponent,
    PayTermsFormComponent,
    PayTermsEditComponent,
    PayTermsViewComponent,
    PayTermsCreateComponent,

  ],
    imports: [
        AppRoutingModule,
        RouterOutlet,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        NgSelectModule,
        NgOptimizedImage,
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
