import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {createPopper} from "@popperjs/core";
import {AuthService} from "../_services/auth.service";
import {MatTableDataSource} from "@angular/material/table";
import {ManageAccountService} from "../manufacturer/manage-account/manage-account.service";
import {User} from "../models/user-model";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements AfterViewInit{
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef | undefined;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef = new ElementRef<any>(null);

  user: User = new User()

  getCurrentUser() {
    this.accountManageService.getCurrentUser().subscribe({
      next: (response) => {
        let data: any = response
        this.user = data.data
        console.log("USER",this.user)

      },
      error: (err) => {
        console.error(err)
      }
    })
  }


  constructor(
    private authService: AuthService,
    private accountManageService: ManageAccountService
  ) {
    this.getCurrentUser()
  }


  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef?.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }
  toggleDropdown(event: any) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
  }

  logout() {
    console.log("LOGOUT")
    this.authService.logout()
  }
}
