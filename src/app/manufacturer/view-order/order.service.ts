import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../../_services/notification.service";
import {UserService} from "../../_services/user.service";
import {AuthService} from "../../_services/auth.service";
import {ProductService} from "../../_services/product.service";
import {API_ORDER} from "../../../assets/API_URL";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  headers = this.authService.setHeader()

  constructor(
    private http: HttpClient,
    private notification: NotificationService,
    private userService: UserService,
    private authService: AuthService,
    private productService: ProductService
  ) {

  }

  getAllOrder() {
    const user = this.userService.getUser()
    // return this.http.get("http://localhost:4000/product/all?userId=" + user.userId)
    return this.http.get(API_ORDER.GETALLORDERS(), {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      );
  }

  getOrder(orderId: string) {
    return this.http.get(API_ORDER.GETORDER(orderId), {headers: this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      );
  }

  getAllOrderOfManufacturer() {
    const user = this.userService.getUser()
    // return this.http.get("http://localhost:4000/product/all?userId=" + user.userId)
    return this.http.get(API_ORDER.GETALLORDERSMANUFACTURER(), {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      );
  }

  approveOrder(orderId : string) {
    const user = this.userService.getUser()
    // return this.http.get(API_ORDER.GETORDER(orderId), {headers: this.headers})
    //   .pipe(
    //     catchError((error) => {
    //       this.notification.showError("An error has occurred on the server, please try again later.", "Error");
    //       return throwError(error.message);
    //     })
    //   );
    return this.http.patch(API_ORDER.APPROVEORDER(), {orderId: orderId }, {headers: this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }
  rejectOrder(orderId : string) {
    const user = this.userService.getUser()
    return this.http.patch(API_ORDER.REJECTORDER(), {orderId: orderId }, {headers: this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }

}
