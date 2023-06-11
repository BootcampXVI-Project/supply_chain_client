import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../../_services/notification.service";
import {UserService} from "../../_services/user.service";
import {AuthService} from "../../_services/auth.service";
import {ProductService} from "../../_services/product.service";
import {Actor, Product, ProductImport, ProductItem, ProductManufacture} from "../../models/product-model";
import {API_ORDER, API_PRODUCT} from "../../../assets/API_URL";
import {catchError, throwError} from "rxjs";
import {OrderService} from "./order.service";
import {DeliveryStatus, Order} from "../../models/order-model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit{
  @Input() retailer: Actor | undefined
  constructor(
    private orderService: OrderService
  ) {
  }
  ngOnInit(): void {
    // this.getAllOrder()
    console.log("VIEW RETAILER",this.retailer)
  }


  // getAllOrder() {
  //   this.orderService.getAllOrder().subscribe(
  //     response => {
  //       let data: any = response
  //       this.order = data.data
  //       console.log("REQUESTLIST",this.order)
  //       // this.dataSourceProduct = new MatTableDataSource(this.productModel)
  //       // this.dataSourceProduct.paginator = this.manufacturerPaginator
  //     }
  //   )
  // }

}
