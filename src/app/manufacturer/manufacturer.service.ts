import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../_services/notification.service";
import {UserService} from "../_services/user.service";
import {AuthService} from "../_services/auth.service";
import {API_PRODUCT} from "../../assets/API_URL";
import {catchError, throwError} from "rxjs";
import {Product, ProductImport, ProductManufacture} from "../models/product-model";
import {ProductService} from "../_services/product.service";

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  headers = this.authService.setHeader()

  constructor(
    private http: HttpClient,
    private notification: NotificationService,
    private userService: UserService,
    private authService: AuthService,
    private productService: ProductService
  ) {

  }

  getAllProduct() {
    return this.productService.getAllProduct()
  }

  getPaginationProduct(pageNumber: string) {
    return this.productService.getPaginationProduct(pageNumber)
  }

  getProduct(productId: string) {
    return this.productService.getProductById(productId)
  }

  updateProduct(producObj: Product) {
    return this.productService.updateProduct(producObj)
  }

  importProduct(productImport: ProductImport)  {
    const user = this.userService.getUser()
    return this.http.post(API_PRODUCT.IMPORTPRODUCT(), productImport, {headers: this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }

  manufacture(productManufacture: ProductManufacture) {
    const user = this.userService.getUser()
    return this.http.post(API_PRODUCT.MANUFACTUREPRODUCT(), productManufacture, {headers: this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }

  exportProduct(productExport: ProductImport)  {
    const user = this.userService.getUser()
    return this.http.post(API_PRODUCT.EXPORTPRODUCT(), productExport, {headers: this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }

}
