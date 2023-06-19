import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

// layouts
import {AdminComponent} from './layouts/admin/admin.component';
import {AuthComponent} from './layouts/auth/auth.component';
import {NgxLoadingModule} from 'ngx-loading';
import { DateFnsModule } from 'ngx-date-fns';
// import { jqxDateTimeInputComponent } from 'jqwidgets-ng/angular_jqxdatetimeinput';

// admin views
import {DashboardComponent} from './views/admin/dashboard/dashboard.component';
import {MapsComponent} from './views/admin/maps/maps.component';
import {SettingsComponent} from './views/admin/settings/settings.component';
import {TablesComponent} from './views/admin/tables/tables.component';

// auth views
import {LoginComponent} from './views/auth/login/login.component';
import {RegisterComponent} from './views/auth/register/register.component';

// no layouts view
import {IndexComponent} from './views/index/index.component';
import {ProfileComponent} from './views/profile/profile.component';

// components for views and layouts
import {AdminNavbarComponent} from './components/navbars/admin-navbar/admin-navbar.component';
import {AuthNavbarComponent} from './components/navbars/auth-navbar/auth-navbar.component';
import {CardBarChartComponent} from './components/cards/card-bar-chart/card-bar-chart.component';
import {CardLineChartComponent} from './components/cards/card-line-chart/card-line-chart.component';
import {CardPageVisitsComponent} from './components/cards/card-page-visits/card-page-visits.component';
import {CardProfileComponent} from './components/cards/card-profile/card-profile.component';
import {CardSettingsComponent} from './components/cards/card-settings/card-settings.component';
import {CardSocialTrafficComponent} from './components/cards/card-social-traffic/card-social-traffic.component';
import {CardStatsComponent} from './components/cards/card-stats/card-stats.component';
import {CardTableComponent} from './components/cards/card-table/card-table.component';
import {FooterAdminComponent} from './components/footers/footer-admin/footer-admin.component';
import {FooterComponent} from './components/footers/footer/footer.component';
import {FooterSmallComponent} from './components/footers/footer-small/footer-small.component';
import {HeaderStatsComponent} from './components/headers/header-stats/header-stats.component';
import {IndexNavbarComponent} from './components/navbars/index-navbar/index-navbar.component';
import {MapExampleComponent} from './components/maps/map-example/map-example.component';
import {IndexDropdownComponent} from './components/dropdowns/index-dropdown/index-dropdown.component';
import {TableDropdownComponent} from './components/dropdowns/table-dropdown/table-dropdown.component';
import {PagesDropdownComponent} from './components/dropdowns/pages-dropdown/pages-dropdown.component';
import {
  NotificationDropdownComponent
} from './components/dropdowns/notification-dropdown/notification-dropdown.component';
// import { SidebarComponent } from './components/sidebar/sidebar.component';
import {UserDropdownComponent} from './components/dropdowns/user-dropdown/user-dropdown.component';
import {SupplierNavbarComponent} from './supplier/supplier-navbar/supplier-navbar.component';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {AboutUsComponent} from './components/about-us/about-us.component';
import {ManufacturerComponent} from './manufacturer/manufacturer.component';
import {DistributorComponent} from './layouts/distributor/distributor.component';
import {RetailerComponent} from './layouts/retailer/retailer.component';
import {SupplierSidebarComponent} from './components/sidebar/supplier-sidebar/supplier-sidebar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from "ngx-toastr";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {environment} from "./environments/environment";
import {CarouselComponent} from './components/carousel/carousel.component';
import {CarouselItemDirective} from './components/carousel/carousel-item.directive';
import {CarouselItemElementDirective} from './components/carousel/carousel-item-element.directive';
import {PostImageComponent} from './components/post-image/post-image.component';
import {SupplierComponent} from './supplier/supplier.component';
import {CertificateComponent} from './components/certificate/certificate.component';
import {ViewCertificateComponent} from './components/certificate/view-certificate/view-certificate.component';
import {AddCertificateComponent} from './components/certificate/add-certificate/add-certificate.component';
import {LoadingComponent} from './components/loading/loading.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTableModule} from "@angular/material/table";
import {ManageProductComponent} from './manufacturer/manage-product/manage-product.component';
import {ManageAccountComponent} from './manufacturer/manage-account/manage-account.component';
import {ManufacturerNavbarComponent} from './manufacturer/manufacturer-navbar/manufacturer-navbar.component';
import {ManufacturerChartComponent} from './manufacturer/manufacturer-chart/manufacturer-chart.component';
import {AccountComponent} from './account/account.component';
import {TableSupplierComponent} from './supplier/table-supplier/table-supplier.component'
import {ChartComponent} from './supplier/chart/chart.component'
import {HighchartsChartModule} from 'highcharts-angular';
import {DatePipe} from "@angular/common";
import { ViewOrderComponent } from './manufacturer/view-order/view-order.component';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import { DropDownComponent } from './components/navbars/drop-down/drop-down.component';
import { LoadingTableComponent } from './loading/loading-table/loading-table.component';
import { LoadingImageComponent } from './loading/loading-image/loading-image.component';
import { LoadingDetailComponent } from './loading/loading-detail/loading-detail.component';
import { DotSeparatorPipe } from './dot-separator.pipe';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { HistoryTransactionComponent } from './layouts/history-transaction/history-transaction.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { HistoryManufacturerComponent } from './manufacturer/history-manufacturer/history-manufacturer.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CardBarChartComponent,
    CardLineChartComponent,
    IndexDropdownComponent,
    PagesDropdownComponent,
    TableDropdownComponent,
    NotificationDropdownComponent,
    UserDropdownComponent,
    FooterComponent,
    FooterSmallComponent,
    FooterAdminComponent,
    CardPageVisitsComponent,
    CardProfileComponent,
    CardSettingsComponent,
    CardSocialTrafficComponent,
    CardStatsComponent,
    CardTableComponent,
    HeaderStatsComponent,
    MapExampleComponent,
    AuthNavbarComponent,
    AdminNavbarComponent,
    IndexNavbarComponent,
    AdminComponent,
    AuthComponent,
    MapsComponent,
    SettingsComponent,
    TablesComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent,
    ProfileComponent,
    SupplierComponent,
    SupplierNavbarComponent,
    ContactUsComponent,
    AboutUsComponent,
    ManufacturerComponent,
    DistributorComponent,
    RetailerComponent,
    SupplierSidebarComponent,
    CarouselComponent,
    CarouselItemDirective,
    CarouselItemElementDirective,
    PostImageComponent,
    CertificateComponent,
    ViewCertificateComponent,
    AddCertificateComponent,
    LoadingComponent,
    ChartComponent,
    ManageProductComponent,
    ManageAccountComponent,
    ManufacturerNavbarComponent,
    ManufacturerChartComponent,
    AccountComponent,
    TableSupplierComponent,
    ViewOrderComponent,
    // jqxDateTimeInputCompon ent,
    DropDownComponent,
    LoadingTableComponent,
    LoadingImageComponent,
    LoadingDetailComponent,
    DotSeparatorPipe,
    QrCodeComponent,
    HistoryTransactionComponent,
    HistoryManufacturerComponent,
  ],
  imports: [
    NgxScannerQrcodeModule,
    MatPaginatorModule,
    MatTableModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(
      {
        timeOut: 1800,
        preventDuplicates: true,
        easeTime: 300,
      }
    ),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    HighchartsChartModule,
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({}),
    MatPaginatorModule,
    MatInputModule,
    MatDatepickerModule,
    MatTableModule,
    DateFnsModule.forRoot(),
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {
}
