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
import {ViewProductComponent} from "./supplier/components/view-product/view-product.component";
import {DetailProductComponent} from "./supplier/components/view-product/detail-product/detail-product.component";
import {SupplierComponent} from "./supplier/components/supplier.component";
import {AuthGuard} from "./_guards/auth.guard";
import {ManufacturerComponent} from "./manufacturer/manufacturer.component";

const routes: Routes = [
  // admin views
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'tables', component: TablesComponent },
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
      { path: "all", component: ViewProductComponent },
      { path: "", redirectTo: "supplier", pathMatch: "full" },
    ],
  },

  {
    path: "manufacturer",
    component: ManufacturerComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "all", component: ViewProductComponent },
      { path: "", redirectTo: "supplier", pathMatch: "full" },
    ],
  },
  // auth views
  {
    path: 'auth',
    component: AuthComponent,
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
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
