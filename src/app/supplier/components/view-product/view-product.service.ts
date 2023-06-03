import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {NotificationService} from "../../../_services/notification.service";
import {UserService} from "../../../_services/user.service";
import {API_PRODUCT, API_URL} from "../../../../assets/API_URL";

@Injectable({
  providedIn: 'root'
})
export class ViewProductService {



  constructor(private http: HttpClient, private notification: NotificationService, private userService: UserService) { }

  getAllProduct() {
    const user = this.userService.getUser()
    // return this.http.get("http://localhost:4000/product/all?userId=" + user.userId)
    return this.http.get(API_PRODUCT.GETALLPRODUCTS())
      .pipe(
      catchError((error) => {
        this.notification.showError("An error has occurred on the server, please try again later.", "Error");
        return throwError(error.message);
      })
    );
  }
  getProduct(productId: string) {
    // const user = this.userService.getUser()
    // return this.http.get("http://localhost:4000/product/all?userId=" + user.userId)
    return this.http.get(API_PRODUCT.GETPRODUCT(productId))
      .pipe(
      catchError((error) => {
        this.notification.showError("An error has occurred on the server, please try again later.", "Error");
        return throwError(error.message);
      })
    );
  }

  updateProduct(producObj: any) {
    const user = this.userService.getUser()
    return this.http.put(API_PRODUCT.UPDATEPRODUCT(user.userId),producObj)
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }

  createProduct(productObj: any) {
    const user = this.userService.getUser()
    return this.http.post(API_PRODUCT.CREATEPRODUCT(),productObj)
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }
  harvestProduct(productId: any) {
    const user = this.userService.getUser()
    return this.http.post(API_PRODUCT.HARVESTPRODUCT(),{userId: user.userId, productId: productId})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }
}
