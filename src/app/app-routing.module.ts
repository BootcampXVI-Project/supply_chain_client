import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// layouts
import { AdminComponent } from './layouts/admin/admin.component';
import { AuthComponent } from './layouts/auth/auth.component';

// admin views
import { DashboardComponent } from './views/admin/dashboard/dashboard.component';
import { MapsComponent } from './views/admin/maps/maps.component';
import { SettingsComponent } from './views/admin/settings/settings.component';
import { TablesComponent } from './views/admin/tables/tables.component';

// auth views
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { ProductsComponent } from './views/auth/products/products.component';

// no layouts views
import { IndexComponent } from './views/index/index.component';
import { ProfileComponent } from './views/profile/profile.component';
import {SupplierComponent} from "./supplier/supplier.component";
import {AuthGuard} from "./_guards/auth.guard";
import {ManufacturerComponent} from "./manufacturer/manufacturer.component";
import { TableSupplierComponent } from './supplier/table-supplier/table-supplier.component';
import { Chart } from 'chart.js';
import { ChartComponent } from './supplier/chart/chart.component';
import { ManufacturerChartComponent } from './manufacturer/manufacturer-chart/manufacturer-chart.component';
import { ManageProductComponent } from './manufacturer/manage-product/manage-product.component';
import {ViewOrderComponent} from "./manufacturer/view-order/view-order.component";
import { HistoryTransactionComponent } from './layouts/history-transaction/history-transaction.component';
import { ManageAccountComponent } from './manufacturer/manage-account/manage-account.component';

const routes: Routes = [
  // admin views
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'maps', component: MapsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  // supplier views

  {
    path: "supplier",
    component: SupplierComponent,
    canActivate: [AuthGuard],
    children: [
      // { path: "all", component: ViewProductComponent },

      { path: 'chart-supplier', component: ChartComponent },
      { path: 'table-supplier', component: TableSupplierComponent },
      { path: '**', redirectTo: 'chart-supplier', pathMatch: 'full' },

    ],
  },

  {
    path: "manufacturer",
    component: ManufacturerComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'chart-manufacturer', component: ManufacturerChartComponent },
      { path: 'table-manufacturer', component: ManageProductComponent },
      { path: 'request-manufacturer', component: ViewOrderComponent },
      { path: 'history-manager', component: ManageProductComponent },
      { path: 'account-manager', component: ManageAccountComponent },
      { path: '**', redirectTo: 'chart-manufacturer', pathMatch: 'full' },
    ],
  },

  {
    path: "product-commercial/:productId",
    component: HistoryTransactionComponent,
  },
  // auth views
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // no layout views
  { path: 'product', component: ProductsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', component: IndexComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
