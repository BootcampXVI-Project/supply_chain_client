import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {NotificationService} from "../../../_services/notification.service";
import {UserService} from "../../../_services/user.service";
import {API_PRODUCT, API_URL} from "../../../../assets/API_URL";
import {Product, ProductObj} from "../../../models/product-model";
import {Unit} from "../../../../assets/ENUM";
import {AuthService} from "../../../_services/auth.service";
import {ProductService} from "../../../_services/product.service";

@Injectable({
  providedIn: 'root'
})
export class ViewProductService {
  headers = this.authService.setHeader()


  constructor(
    private http: HttpClient,
    private notification: NotificationService,
    private userService: UserService,
    private authService: AuthService,
    private productService: ProductService
  ) { }

  getAllProduct() {
    // const user = this.userService.getUser()
    // // return this.http.get("http://localhost:4000/product/all?userId=" + user.userId)
    // return this.http.get(API_PRODUCT.GETALLPRODUCTS(), {headers:this.headers})
    //   .pipe(
    //     catchError((error) => {
    //       this.notification.showError("An error has occurred on the server, please try again later.", "Error");
    //       return throwError(error.message);
    //     })
    //   );
    return this.productService.getAllProduct()
  }

  getPaginationProduct(pageNumber: string) {
    return this.productService.getPaginationProduct(pageNumber)
  }

  getProduct(productId: string) {
    // const user = this.userService.getUser()
    // return this.http.get("http://localhost:4000/product/all?userId=" + user.userId)
    // return this.http.get(API_PRODUCT.GETPRODUCT(productId), {headers:this.headers})
    //   .pipe(
    //   catchError((error) => {
    //     this.notification.showError("An error has occurred on the server, please try again later.", "Error");
    //     return throwError(error.message);
    //   })
    // );
    return this.productService.getProductById(productId)
  }

  updateProduct(producObj: Product) {
    // const user = this.userService.getUser()
    // return this.http.patch(API_PRODUCT.UPDATEPRODUCT(user.userId),producObj, {headers:this.headers})
    //   .pipe(
    //     catchError((error) => {
    //       this.notification.showError("An error has occurred on the server, please try again later.", "Error");
    //       return throwError(error.message);
    //     })
    //   )
    return this.productService.updateProduct(producObj)
  }

  createProduct(productObj: Product) {
    const user = this.userService.getUser()
    return this.http.post(API_PRODUCT.CREATEPRODUCT(),productObj, {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }
  harvestProduct(productId: any) {
    const user = this.userService.getUser()
    return this.http.post(API_PRODUCT.HARVESTPRODUCT(),{userId: user.userId, productId: productId}, {headers:this.headers})
      .pipe(
        catchError((error) => {
          this.notification.showError("An error has occurred on the server, please try again later.", "Error");
          return throwError(error.message);
        })
      )
  }

  mapProductobjToproduct(productObj: ProductObj) {
    const user = this.userService.getUser()
    const product: Product = {
      userId: user.userId,
      productObj: {
        productId: productObj.productId,
        productName: productObj.productName,
        dates: productObj.dates,
        expireTime: productObj.expireTime,
        price: productObj.price,
        amount: productObj.amount,
        unit: productObj.unit,
        status: productObj.status,
        description: productObj.description,
        certificateUrl: productObj.certificateUrl,
        supplier: productObj.supplier,
        qrCode: productObj.qrCode,
        image: productObj.image
      }
    };

    return product

  }
}
