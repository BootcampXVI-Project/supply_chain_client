import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any; // Đối tượng người dùng

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
