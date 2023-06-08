import {Injectable, OnInit} from '@angular/core';
import {API_PRODUCT, API_USER} from "../../../assets/API_URL";
import {catchError, throwError} from "rxjs";
import {UserService} from "../../_services/user.service";
import {AuthService} from "../../_services/auth.service";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../../_services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class ManageAccountService implements OnInit{
  headers = this.authService.setHeader()
  constructor(
    private http: HttpClient,
    private notification: NotificationService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  getAllUsers() {
    const user = this.userService.getUser()
    return this.http.get(API_USER.GETALLUSERS(), {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      );
  }
  getUser(userId: string) {
    return this.http.get(API_USER.GETUSER(userId), {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      );
  }
  getCurrentUser() {
    const user = this.userService.getUser()
    return this.http.get(API_USER.GETUSER(user.userId), {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      );
  }
}
