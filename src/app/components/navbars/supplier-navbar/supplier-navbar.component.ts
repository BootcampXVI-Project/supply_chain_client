import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../_services/auth.service";

@Component({
  selector: 'app-supplier-navbar',
  templateUrl: './supplier-navbar.component.html',
  styleUrls: ['./supplier-navbar.component.scss'],
})
export class SupplierNavbarComponent implements OnInit{
  navbarOpen = false;
  @ViewChild('dialog') myDialog: ElementRef | undefined;
  openDialog: boolean = false
  reloadDetailProduct = false;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    console.log("LOGOUT")
    this.authService.logout()
  }

  open() {
    this.openDialog = true
  }
  close(data: any) {
    console.log("du lieu truyen ve", data)
    this.openDialog = data
    this.myDialog?.nativeElement.close();
    location.reload()
  }
}
