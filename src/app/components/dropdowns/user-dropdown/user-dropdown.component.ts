import {Component, AfterViewInit, ViewChild, ElementRef, OnInit} from "@angular/core";
import { createPopper } from "@popperjs/core";
import {AuthService} from "../../../_services/auth.service";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
})
export class UserDropdownComponent implements OnInit {
  // dropdownPopoverShow = false;
  // @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef!: ElementRef;
  // @ViewChild("popoverDropdownRef", { static: false })
  // popoverDropdownRef!: ElementRef;
  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
  // ngAfterViewInit() {
  //   createPopper(
  //     this.btnDropdownRef.nativeElement,
  //     this.popoverDropdownRef.nativeElement,
  //     {
  //       placement: "bottom-start",
  //     }
  //   );
  // }
  // toggleDropdown(event:any) {
  //   event.preventDefault();
  //   if (this.dropdownPopoverShow) {
  //     this.dropdownPopoverShow = false;
  //   } else {
  //     this.dropdownPopoverShow = true;
  //   }
  // }

  logout() {
    console.log("LOGOUT")
    this.authService.logout()
  }

}
