import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "./notification.service";
import {UserService} from "./user.service";
import {API_PRODUCT} from "../../assets/API_URL";
import {catchError, throwError} from "rxjs";
import {Product} from "../models/product-model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  headers = this.authService.setHeader()

  private product: any; // Đối tượng người dùng

  constructor(
    private http: HttpClient,
    private notification: NotificationService,
    private userService: UserService,
    private authService: AuthService
  ) {
  }

  setProduct(product: any) {
    this.product = product;
  }

  getProduct() {
    return this.product;
  }

  getAllProduct() {
    const user = this.userService.getUser()
    // return this.http.get("http://localhost:4000/product/all?userId=" + user.userId)
    return this.http.get(API_PRODUCT.GETALLPRODUCTS(), {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      );
  }

  getPaginationProduct(pageNumber: string) {
    return this.http.get(API_PRODUCT.GETPAGINATIONPRODUCTS(pageNumber), {headers: this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }

  getProductById(productId: string) {
    // const user = this.userService.getUser()
    // return this.http.get("http://localhost:4000/product/all?userId=" + user.userId)
    return this.http.get(API_PRODUCT.GETPRODUCT(productId), {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      );
  }

  updateProduct(producObj: Product) {
    const user = this.userService.getUser()
    return this.http.patch(API_PRODUCT.UPDATEPRODUCT(user.userId),producObj, {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }

}
