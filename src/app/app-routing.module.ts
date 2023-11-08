import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AutoLoginPartialRoutesGuard} from "angular-auth-oidc-client";
import {HomeComponent} from "./home/home.component";
import {LoginCallbackComponent} from "./auth/login-callback/login-callback.component";
import {LogoutCallbackComponent} from "./auth/logout-callback/logout-callback.component";
import {AuthConfigModule} from "./auth/auth-config.module";
import {MaterialsManagementComponent} from "./materials-management/materials-management.component";
import {MaterialsComponent} from "./materials-management/materials/materials.component";
import {SizeVariantComponent} from "./materials-management/size-variant/size-variant.component";
import {SizeVariantCreateComponent} from "./materials-management/size-variant/create/size-variant-create.component";
import {SizeVariantViewComponent} from "./materials-management/size-variant/view/size-variant-view.component";
import {SizeVariantEditComponent} from "./materials-management/size-variant/edit/size-variant-edit.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {MeasurementUnitsComponent} from "./materials-management/measurement-units/measurement-units.component";
import {MeasurementUnitsEditComponent} from "./materials-management/measurement-units/edit/measurement-units-edit.component";
import {MeasurementUnitsViewComponent} from "./materials-management/measurement-units/view/measurement-units-view.component";
import {MeasurementUnitsCreateComponent} from "./materials-management/measurement-units/create/measurement-units-create.component";
import {MatlClassificationsComponent} from "./materials-management/matl-classifications/matl-classifications.component";
import {MatlClassificationsCreateComponent} from "./materials-management/matl-classifications/create/matl-classifications-create.component";
import {MatlClassificationsViewComponent} from "./materials-management/matl-classifications/view/matl-classifications-view.component";
import {MatlClassificationsEditComponent} from "./materials-management/matl-classifications/edit/matl-classifications-edit.component";
import {ManageVendorsComponent} from "./manage-vendors/manage-vendors.component";
import {CountriesComponent} from "./manage-vendors/countries/countries.component";
import {CountriesCreateComponent} from "./manage-vendors/countries/create/countries-create.component";
import {CountriesEditComponent} from "./manage-vendors/countries/edit/countries-edit.component";
import {CountriesViewComponent} from "./manage-vendors/countries/view/countries-view.component";
import {StatesComponent} from "./manage-vendors/states/states.component";
import {StatesCreateComponent} from "./manage-vendors/states/create/states-create.component";
import {StatesEditComponent} from "./manage-vendors/states/edit/states-edit.component";
import {StatesViewComponent} from "./manage-vendors/states/view/states-view.component";
import {VendorsComponent} from "./manage-vendors/vendors/vendors.component";
import {VendorsCreateComponent} from "./manage-vendors/vendors/create/vendors-create.component";
import {VendorsEditComponent} from "./manage-vendors/vendors/edit/vendors-edit.component";
import {VendorsViewComponent} from "./manage-vendors/vendors/view/vendors-view.component";
import {VendorContactsComponent} from "./manage-vendors/vendor-contacts/vendor-contacts.component";
import {VendorContactsCreateComponent} from "./manage-vendors/vendor-contacts/create/vendor-contacts-create.component";
import {VendorContactsViewComponent} from "./manage-vendors/vendor-contacts/view/vendor-contacts-view.component";
import {VendorContactsEditComponent} from "./manage-vendors/vendor-contacts/edit/vendor-contacts-edit.component";
import {MatlCategoriesComponent} from "./materials-management/matl-categories/matl-categories.component";
import {MatlCategoriesViewComponent} from "./materials-management/matl-categories/view/matl-categories-view.component";
import {
  MatlCategoriesCreateComponent
} from "./materials-management/matl-categories/create/matl-categories-create.component";
import {MatlCategoriesEditComponent} from "./materials-management/matl-categories/edit/matl-categories-edit.component";
import {MaterialsCreateComponent} from "./materials-management/materials/create/materials-create.component";
import {MaterialsViewComponent} from "./materials-management/materials/view/materials-view.component";
import {MaterialsEditComponent} from "./materials-management/materials/edit/materials-edit.component";
import {PurchaseReqsNavComponent} from "./buy/purchase-reqs/purchase-reqs-nav.component";
import {PurchaseReqsComponent} from "./buy/purchase-reqs/purchase-reqs.component";
import {PurchaseReqsCreateComponent} from "./buy/purchase-reqs/create/purchase-reqs-create.component";
import {PurchaseReqsViewComponent} from "./buy/purchase-reqs/view/purchase-reqs-view.component";
import {PurchaseReqsEditComponent} from "./buy/purchase-reqs/edit/purchase-reqs-edit.component";
import {BaseRecordsComponent} from "./base-records/base-records.component";
import {TaxRatesComponent} from "./base-records/tax-rates/tax-rates.component";
import {TaxRatesViewComponent} from "./base-records/tax-rates/view/tax-rates-view.component";
import {TaxRatesCreateComponent} from "./base-records/tax-rates/create/tax-rates-create.component";
import {TaxRatesEditComponent} from "./base-records/tax-rates/edit/tax-rates-edit.component";
import {PurchaseOrdersNavComponent} from "./buy/purchase-orders/purchase-orders-nav.component";
import {PurchaseOrdersComponent} from "./buy/purchase-orders/purchase-orders.component";
import {ReceivingNavComponent} from "./receiving/receiving-nav.component";
import {ReceivingComponent} from "./receiving/receiving.component";
import {ReceivingViewComponent} from "./receiving/view/receiving-view.component";
import {ReceivingEditComponent} from "./receiving/edit/receiving-edit.component";
import {AddSponsorReceivingComponent} from "./receiving/add-sponsor-receiving/add-sponsor-receiving.component";
import {InventoryComponent} from "./inventory/inventory.component";
import {InventoryNavComponent} from "./inventory/inventory-nav.component";
import {DepartmentsCreateComponent} from "./base-records/department/create/departments-create.component";
import {DepartmentsComponent} from "./base-records/department/departments.component";
import {DepartmentsViewComponent} from "./base-records/department/view/departments-view.component";
import {DepartmentsEditComponent} from "./base-records/department/edit/departments-edit.component";
import {ShippingsComponent} from "./base-records/shippings/shippings.component";
import {ShippingsEditComponent} from "./base-records/shippings/edit/shippings-edit.component";
import {ShippingsViewComponent} from "./base-records/shippings/view/shippings-view.component";
import {ShippingsCreateComponent} from "./base-records/shippings/create/shippings-create.component";
import {SitesViewComponent} from "./base-records/sites/view/sites-view.component";
import {SitesEditComponent} from "./base-records/sites/edit/sites-edit.component";
import {SitesCreateComponent} from "./base-records/sites/create/sites-create.component";
import {SitesComponent} from "./base-records/sites/sites.component";
import {PayTermsComponent} from "./manage-vendors/pay-terms/pay-terms.component";
import {PayTermsEditComponent} from "./manage-vendors/pay-terms/edit/pay-terms-edit.component";
import {PayTermsViewComponent} from "./manage-vendors/pay-terms/view/pay-terms-view.component";
import {PayTermsCreateComponent} from "./manage-vendors/pay-terms/create/pay-terms-create.component";

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AutoLoginPartialRoutesGuard] },

  { path: 'home', component: HomeComponent, canActivate: [AutoLoginPartialRoutesGuard] },

  {
    path: 'materials-management',
    component: MaterialsManagementComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    children: [
      { path: 'materials', component: MaterialsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'materials/create', component: MaterialsCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'materials/:materialId', component: MaterialsViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'materials/:materialId/edit', component: MaterialsEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: 'size-variant', component: SizeVariantComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'size-variant/create', component: SizeVariantCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'size-variant/:sizeId', component: SizeVariantViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'size-variant/:sizeId/edit', component: SizeVariantEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: 'measurement-units', component: MeasurementUnitsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'measurement-units/create', component: MeasurementUnitsCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'measurement-units/:unitId', component: MeasurementUnitsViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'measurement-units/:unitId/edit', component: MeasurementUnitsEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: 'matl-classifications', component: MatlClassificationsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'matl-classifications/create', component: MatlClassificationsCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'matl-classifications/:classificationId', component: MatlClassificationsViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'matl-classifications/:classificationId/edit', component: MatlClassificationsEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: 'matl-categories', component: MatlCategoriesComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'matl-categories/create', component: MatlCategoriesCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'matl-categories/:categoryId', component: MatlCategoriesViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'matl-categories/:categoryId/edit', component: MatlCategoriesEditComponent, canActivate: [AutoLoginPartialRoutesGuard] }
    ],
  },

  {
    path: 'manage-vendors',
    component: ManageVendorsComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'vendors'},
      { path: 'vendors', component: VendorsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'vendors/create', component: VendorsCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'vendors/:vendorId', component: VendorsViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'vendors/:vendorId/edit', component: VendorsEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: '', pathMatch: 'full', redirectTo: 'countries'},
      { path: 'countries', component: CountriesComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'countries/create', component: CountriesCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'countries/:countryCode', component: CountriesViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'countries/:countryCode/edit', component: CountriesEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: '', pathMatch: 'full', redirectTo: 'states'},
      { path: 'states', component: StatesComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'states/create', component: StatesCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'states/:stateCode', component: StatesViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'states/:stateCode/edit', component: StatesEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: '', pathMatch: 'full', redirectTo: 'vendor-contacts'},
      { path: 'vendor-contacts', component: VendorContactsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'vendor-contacts/create', component: VendorContactsCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'vendor-contacts/:contactId', component: VendorContactsViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'vendor-contacts/:contactId/edit', component: VendorContactsEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: '', pathMatch: 'full', redirectTo: 'pay-terms'},
      { path: 'pay-terms', component: PayTermsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'pay-terms/create', component: PayTermsCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'pay-terms/:id', component: PayTermsViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'pay-terms/:id/edit', component: PayTermsEditComponent, canActivate: [AutoLoginPartialRoutesGuard] }
    ]
  },

  {
    path: 'purchase-requisitions',
    component: PurchaseReqsNavComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'open'},
      { path: 'open', component: PurchaseReqsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'done', component: PurchaseReqsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
    ]
  },

  { path: 'purchase-requisitions/create', component: PurchaseReqsCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },

  { path: 'purchase-requisitions/:prNumber', component: PurchaseReqsViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },

  { path: 'purchase-requisitions/:prNumber/edit', component: PurchaseReqsEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

  {
    path: 'purchase-orders',
    component: PurchaseOrdersNavComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'open'},
      { path: 'open', component: PurchaseOrdersComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'done', component: PurchaseOrdersComponent, canActivate: [AutoLoginPartialRoutesGuard] },
    ]
  },

  {
    path: 'receiving',
    component: ReceivingNavComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'open'},
      { path: 'open',
        component: ReceivingComponent,
        canActivate: [AutoLoginPartialRoutesGuard],
        data: { refreshComponent: true, pathEnd: 'open' }
      },
      { path: 'done',
        component: ReceivingComponent,
        canActivate: [AutoLoginPartialRoutesGuard],
        data: { refreshComponent: true, pathEnd: 'done' }
      },
    ]
  },

  { path: 'receiving/:roNumber', component: ReceivingViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },

  {
    path: 'receiving/:roNumber/edit',
    component: ReceivingEditComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    data: { refreshComponent: true }
  },

  { path: 'receiving/sponsor/create', component: AddSponsorReceivingComponent, canActivate: [AutoLoginPartialRoutesGuard] },

  {
    path: 'inventory',
    component: InventoryNavComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'material'},
      { path: 'material',
        component: InventoryComponent,
        canActivate: [AutoLoginPartialRoutesGuard],
        data: { refreshComponent: true, pathEnd: 'material' }
      },
      { path: 'finish-goods',
        component: InventoryComponent,
        canActivate: [AutoLoginPartialRoutesGuard],
        data: { refreshComponent: true, pathEnd: 'finish-goods' }
      },
    ]
  },

  {
    path: 'base-records',
    component: BaseRecordsComponent,
    canActivate: [AutoLoginPartialRoutesGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sites'},
      { path: 'sites', component: SitesComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'sites/create', component: SitesCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'sites/:siteId', component: SitesViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'sites/:siteId/edit', component: SitesEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: 'tax-rates', component: TaxRatesComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'tax-rates/create', component: TaxRatesCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'tax-rates/:taxId', component: TaxRatesViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'tax-rates/:taxId/edit', component: TaxRatesEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: 'departments', component: DepartmentsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'departments/create', component: DepartmentsCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'departments/:id', component: DepartmentsViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'departments/:id/edit', component: DepartmentsEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },

      { path: 'shippings', component: ShippingsComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'shippings/create', component: ShippingsCreateComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'shippings/:id', component: ShippingsViewComponent, canActivate: [AutoLoginPartialRoutesGuard] },
      { path: 'shippings/:id/edit', component: ShippingsEditComponent, canActivate: [AutoLoginPartialRoutesGuard] },
    ]
  },

  { path: 'login-callback', component: LoginCallbackComponent },
  { path: 'logout-callback', component: LogoutCallbackComponent },
  { path: 'not-found', component: PageNotFoundComponent, data: { message: 'Page not found!' } },
  { path: 'unauthorized', component: PageNotFoundComponent },
  { path: 'forbidden', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
]

@NgModule({
  imports: [
    AuthConfigModule,
    RouterModule.forRoot(appRoutes, {
      bindToComponentInputs: true
    })
  ],
  exports: [
    AuthConfigModule,
    RouterModule
  ]
})
export class AppRoutingModule {
}
