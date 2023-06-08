import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any; // Đối tượng người dùng

  constructor(
    private authService: AuthService
  ) {
    this.user = this.authService.getTokenInformation()
    console.log("USERSERVICE", this.user)
  }

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.authService.getTokenInformation()
  }
}
