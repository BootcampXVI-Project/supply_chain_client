import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "./notification.service";
import {UserService} from "./user.service";
import { API_HISTORY, API_PRODUCT } from '../../assets/API_URL';
import {catchError, throwError} from "rxjs";
import {Product, ProductModel, ProductObj} from "../models/product-model";
import {Unit} from "../../assets/ENUM";
import { Observable } from 'rxjs';
import { ProductCommercialModel } from '../models/product-commercial-model';
import { ResponeModel } from '../models/respone-model';

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

  getHistoryProduct(productId: string) {
    return this.http.get(API_HISTORY.GETHISTORYPRODUCT(productId), {headers: this.headers})
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
    console.log("GETPRODUCTBYID",productId)
    return this.http.get(API_PRODUCT.GETPRODUCT(productId), {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      );
  }

  updateProduct(producObj: ProductModel) {
    const user = this.userService.getUser()
    return this.http.patch(API_PRODUCT.UPDATEPRODUCT(user.userId),producObj, {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }

  getCommercialProductByProductId(productId: string): Observable<ResponeModel<ProductCommercialModel>>{
    return this.http.get<ResponeModel<ProductCommercialModel>>(API_PRODUCT.GET_COMMERCIAL_PRODUCT_BY_PRODUCT_ID(productId))
  }
  mapProductObjtoProductModel(productObj: ProductObj): ProductModel {
    return {
      productObj: {
        productId: productObj.productId,
        productName: productObj.productName,
        image: productObj.image,
        price: productObj.price.toString(),
        amount: productObj.amount.toString(),
        unit: productObj.unit,
        description: productObj.description,
        certificateUrl: productObj.certificateUrl
      }
    };
  }


}

