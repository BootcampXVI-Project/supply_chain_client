import {Component, ElementRef, ViewChild} from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {Order} from "../../models/order-model";
import {OrderService} from "../view-order/order.service";
import {Actor} from "../../models/product-model";

@Component({
  selector: 'app-manufacturer-navbar',
  templateUrl: './manufacturer-navbar.component.html',
  styleUrls: ['./manufacturer-navbar.component.scss']
})
export class ManufacturerNavbarComponent {
  navbarOpen = false;
  @ViewChild('dialog') myDialog: ElementRef | undefined;
  @ViewChild('listRequestDialog') detailRequestDialog: ElementRef | undefined;
  openDialog: boolean = false
  isOpenDetailRequestDialog: boolean = false
  reloadDetailProduct = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

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
    this.openDialog = true
  }

  close(data: any) {
    console.log("du lieu truyen ve", data)
    this.openDialog = !data.isClose
    this.myDialog?.nativeElement.close();
    if (data.isReload) {
      location.reload()
    }
  }

  //---------------------------request----------------------------//

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

  getAllOrder() {
    this.orderService.getAllOrder().subscribe(
      response => {
        let data: any = response
        this.orders = data.data
        console.log("REQUESTLIST",this.orders)
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
    this.isOpenDetailRequestDialog = true
    console.log("DETAILORDER", e)
  }

  closeDetailRequestDialog(isReload = false) {
    this.isOpenDetailRequestDialog = false
    this.detailRequestDialog?.nativeElement.close();
    if (isReload) {
      location.reload()
    }
  }



}
