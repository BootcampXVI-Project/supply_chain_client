import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../../_services/notification.service";
import {UserService} from "../../_services/user.service";
import {AuthService} from "../../_services/auth.service";
import {ProductService} from "../../_services/product.service";
import {Actor, Product, ProductImport, ProductItem, ProductManufacture} from "../../models/product-model";
import {API_ORDER, API_PRODUCT} from "../../../assets/API_URL";
import {catchError, forkJoin, map, throwError} from "rxjs";
import {OrderService} from "./order.service";
import {Bill, DeliveryStatus, Order} from "../../models/order-model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit{
  @Input() retailer: Actor | undefined
  @ViewChild('detailRequestDialog') detailRequestDialog: ElementRef | undefined;

  isOpenDetailRequestDialog: boolean = false
  isTableLoading: boolean = false
  isDetailLoading: boolean = false

  bills: Bill[] = []
  bill: Bill = {
    productName: "",
    quantityAvailable: "",
    quantityRequest: "",
    unitPrice: "",
    totalPrice: ""
  }
  orders : Order[] = []
  retailerList: Actor[] = []
  order: Order = {
    orderId: "",
    productItemList: [],
    deliveryStatuses: [],
    signatures: [],
    status: "",
    createDate: "",
    updateDate: "",
    finishDate: "",
    qrCode: "",
    retailer: {
      address: "",
      avatar: "",
      fullName: "",
      phoneNumber: "",
      role: "",
      userId: "",
    },
    manufacturer: {
      address: "",
      avatar: "",
      fullName: "",
      phoneNumber: "",
      role: "",
      userId: "",
    },
    distributor: {
      address: "",
      avatar: "",
      fullName: "",
      phoneNumber: "",
      role: "",
      userId: "",
    },
  };

  canApprove: boolean = false
  isPending: boolean = false

  totalCost = 0

  dataSourceBill = new MatTableDataSource<any>;
  displayedBilColumns: string[] = ['Index','ProductName' , 'QuantityAvailable', 'QuantityRequest', 'UnitPrice', 'TotalPrice']
  @ViewChild('billPaginator', {static: true}) billPaginator!: MatPaginator
  dataSourceOreder = new MatTableDataSource<any>;
  displayedOrderColumns: string[] = ['Index','qrCode' , 'retailer', 'phoneNumber', 'address', 'status', 'createDate', 'action']
  @ViewChild('orderPaginator', {static: true}) orderPaginator!: MatPaginator

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.getAllOrder()
    console.log("VIEW RETAILER",this.retailer)
  }

  getAllOrder() {
    this.isTableLoading = true
    this.orderService.getAllOrder().subscribe(
      response => {
        let data: any = response
        this.orders = data.data.sort(
          (a: any, b: any) => {
            if (a.status.toLowerCase() === b.status.toLowerCase()) {
              const timeA = new Date(a.createDate).getTime();
              const timeB = new Date(b.createDate).getTime();
              return timeB - timeA;
            }
            return 0
          }
        ).sort(
          (a: any, b: any) => {
            if (a.status.toLowerCase() === 'pending' && b.status.toLowerCase() !== 'pending') {
              return -1; // a trước b
            }
            if (a.status.toLowerCase() !== 'pending' && b.status.toLowerCase() === 'pending') {
              return 1; // b trước a
            }
            return 0;
          }
        )
        for (let od of this.orders) {
          this.retailerList.push(od.retailer)
        }
        this.dataSourceOreder = new MatTableDataSource(this.orders)
        this.dataSourceOreder.paginator = this.orderPaginator
        this.isTableLoading = false
      }
    )
  }

  @ViewChild('qrDialog') qrDialog: ElementRef | undefined;
  isOpenQRDialog: boolean = false;

  openQRDialog(e: any) {
    this.isOpenQRDialog = true;
    this.isDetailLoading = true

    this.order = e;
    console.log("ORDER",this.order)
    this.isPending = (this.order.status.toLowerCase() == 'pending');
    let billList: Bill[] = [];
    let total = 0;

    const getProductObservables = this.order.productItemList.map((productItem) =>
      this.productService.getProductById(productItem.product.productId)
    );

    forkJoin(getProductObservables).pipe(
      map((responses: any[]) =>
        responses.map((response, index) => {
          const product = response.data;
          console.log("FORK", product)
          const productItem = this.order.productItemList[index];
          const billDetail: Bill = {
            productName: product.productName,
            quantityAvailable: product.amount,
            quantityRequest: productItem.quantity,
            unitPrice: product.price,
            totalPrice: (parseFloat(product.price) * parseFloat(productItem.quantity)).toString(),
          };
          if (billDetail.quantityAvailable >= billDetail.quantityRequest) {
            this.canApprove = true
          }
          this.isDetailLoading = false
          total += parseFloat(billDetail.totalPrice);
          return billDetail;
        })
      )
    ).subscribe(response => {
      let bills: any = response
      this.totalCost = total;
      this.bills = bills;
      this.dataSourceBill = new MatTableDataSource(this.bills);
      this.dataSourceBill.paginator = this.billPaginator;
    });
  }
  closeQRDialog(isReload = false) {
    this.isOpenQRDialog = false
    this.qrDialog?.nativeElement.close();
    // this.handleEscKey(new KeyboardEvent())
    if (isReload) {
      location.reload()
    }
  }


  openDetailRequestDialog(e: any) {
    this.isOpenDetailRequestDialog = true;
    this.isDetailLoading = true

    this.order = e;
    console.log("ORDER",this.order)
    this.isPending = (this.order.status.toLowerCase() == 'pending');
    let billList: Bill[] = [];
    let total = 0;

    const getProductObservables = this.order.productItemList.map((productItem) =>
      this.productService.getProductById(productItem.product.productId)
    );

    forkJoin(getProductObservables).pipe(
      map((responses: any[]) =>
        responses.map((response, index) => {
          const product = response.data;
          console.log("FORK", product)
          const productItem = this.order.productItemList[index];
          const billDetail: Bill = {
            productName: product.productName,
            quantityAvailable: product.amount,
            quantityRequest: productItem.quantity,
            unitPrice: product.price,
            totalPrice: (parseFloat(product.price) * parseFloat(productItem.quantity)).toString(),
          };
          if (billDetail.quantityAvailable >= billDetail.quantityRequest) {
            this.canApprove = true
          }
          this.isDetailLoading = false
          total += parseFloat(billDetail.totalPrice);
          return billDetail;
        })
      )
    ).subscribe(response => {
      let bills: any = response
      this.totalCost = total;
      this.bills = bills;
      this.dataSourceBill = new MatTableDataSource(this.bills);
      this.dataSourceBill.paginator = this.billPaginator;
    });
  }
  closeDetailRequestDialog(isReload = false) {
    this.isOpenDetailRequestDialog = false
    this.detailRequestDialog?.nativeElement.close();
    // this.handleEscKey(new KeyboardEvent())
    if (isReload) {
      location.reload()
    }
  }
  @HostListener('document:keydown.escape', ['$event'])
  handleEscKey(event: KeyboardEvent) {
    this.closeDetailRequestDialog();
    this.closeQRDialog()
  }

  approveOrder(orderId: string) {
    this.isDetailLoading = true
    this.orderService.approveOrder(orderId).subscribe(
      response => {
        console.log("APPROVE",response)
        for (let productOrders of this.orders) {
          for (let productOrder of productOrders.productItemList) {
            console.log("ISPRODUCT",productOrder.product.productId)
            this.productService.getProductById(productOrder.product.productId).subscribe(
              response => {
                let product: any = response
                console.log("ISORDER", product)
                product.data.amount = (parseFloat(product.data.amount) - parseFloat(productOrder.quantity)).toString()

                this.productService.updateProduct(
                  this.productService.mapProductObjtoProductModel(product.data)
                ).subscribe(
                  response => {
                    this.isDetailLoading = false
                    this.closeDetailRequestDialog(true)
                    console.log("Is Available", response)
                  }
                )
              }
            )

          }
        }
      }
    )
  }

  rejectOrder(orderId: string) {
    this.isDetailLoading = true
    this.orderService.rejectOrder(orderId).subscribe(
      response => {
        console.log("REJECT", response)
        this.isDetailLoading = false
        this.closeDetailRequestDialog(true)
      }
    )
  }

  protected readonly Math = Math;
}
