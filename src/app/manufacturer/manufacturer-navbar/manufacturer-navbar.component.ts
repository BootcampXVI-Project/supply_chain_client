import {Component, ElementRef, ViewChild} from '@angular/core';
import {AuthService} from "../../_services/auth.service";

@Component({
  selector: 'app-manufacturer-navbar',
  templateUrl: './manufacturer-navbar.component.html',
  styleUrls: ['./manufacturer-navbar.component.scss']
})
export class ManufacturerNavbarComponent {
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
    this.openDialog = !data.isClose
    this.myDialog?.nativeElement.close();
    if (data.isReload) {
      location.reload()
    }
  }
}
