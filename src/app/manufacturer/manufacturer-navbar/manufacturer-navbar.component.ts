import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {Bill, Order} from "../../models/order-model";
import {OrderService} from "../view-order/order.service";
import {Actor, ProductObj} from "../../models/product-model";
import {HostListener} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ProductService} from "../../_services/product.service";
import {UserService} from "../../_services/user.service";
import {forkJoin, map} from 'rxjs';

@Component({
  selector: 'app-manufacturer-navbar',
  templateUrl: './manufacturer-navbar.component.html',
  styleUrls: ['./manufacturer-navbar.component.scss']
})
export class ManufacturerNavbarComponent {
  navbarOpen = false;
  @ViewChild('detailRequestDialog') detailRequestDialog: ElementRef | undefined;
  isOpenDetailRequestDialog: boolean = false
  reloadDetailProduct = false;
  @Input() products: ProductObj[] = []


  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.getAllOrder()
  }

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    console.log("LOGOUT")
    this.authService.logout()
  }

  open() {
  }

  close(data: any) {
    // console.log("du lieu truyen ve", data)
    // this.openDialog = !data.isClose
    // this.myDialog?.nativeElement.close();
    // if (data.isReload) {
    //   location.reload()
    // }
  }

  //---------------------------request----------------------------//

  bills: Bill[] = []
  bill: Bill = {
    productName: "",
    quantityAvailable: "",
    quantityRequest: "",
    unitPrice: "",
    totalPrice: ""
  }
  orders: Order[] = []
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

  totalCost = 0

  dataSourceBill = new MatTableDataSource<any>;
  displayedBilColumns: string[] = ['Index', 'ProductName', 'QuantityAvailable', 'QuantityRequest', 'UnitPrice', 'TotalPrice']
  @ViewChild('billPaginator', {static: true}) billPaginator!: MatPaginator

  getAllOrder() {
    this.orderService.getAllOrder().subscribe(
      response => {
        let data: any = response
        this.orders = data.data
        console.log("REQUESTLIST", this.orders)
        for (let od of this.orders) {
          this.retailerList.push(od.retailer)
        }
        console.log("RETAILERLIST", this.retailerList)
        // this.dataSourceProduct = new MatTableDataSource(this.productModel)
        // this.dataSourceProduct.paginator = this.manufacturerPaginator
      }
    )
  }

  openDetailRequestDialog(e: any) {
    this.isOpenDetailRequestDialog = true;

    this.order = e;
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
  }

  approveOrder(orderId: string) {
    this.orderService.approveOrder(orderId).subscribe(
      response => {
        console.log("APPROVE", response)
        for (let productOrders of this.orders) {
          for (let productOrder of productOrders.productItemList) {
            console.log("ISPRODUCT", productOrder.product.productId)
            this.productService.getProductById(productOrder.product.productId).subscribe(
              response => {
                let product: any = response
                console.log("ISORDER", product)
                product.data.amount = (parseFloat(product.data.amount) - parseFloat(productOrder.quantity)).toString()

                this.productService.updateProduct(this.productService.mapProductObjtoProductModel(product.data)
                ).subscribe(
                  response => {
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
    this.orderService.rejectOrder(orderId).subscribe(
      response => {
        console.log("REJECT", response)
      }
    )
  }
}
