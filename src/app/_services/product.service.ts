import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private product: any; // Đối tượng người dùng

  constructor(
    private authService: AuthService
  ) {
  }

  setProduct(product: any) {
    this.product = product;
  }

  getProduct() {
    return this.product;
  }
}
