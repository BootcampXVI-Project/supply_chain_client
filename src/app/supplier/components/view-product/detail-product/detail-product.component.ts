import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {UserService} from "../../../../_services/user.service";
import {common} from "../../../../../../common";
import {ViewProductService} from "../view-product.service";
import { Unit } from "../../../../../assets/ENUM";
import { Product, ProductObj } from "../../../../models/product-model";
import {ProductService} from "../../../../_services/product.service";
import {reload} from "@angular/fire/auth";

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit{
  @Output() dataEvent = new EventEmitter<any>();

  @ViewChild('dialog') myDialog: ElementRef | undefined;
  @ViewChild('dialogCert') certDialog: ElementRef | undefined;


  @Input() product: ProductObj | undefined;
  @Input() reload = false;

  openDialog: boolean = false
  openCertification: boolean = false
  hasCertificate: boolean = false
  loading: boolean = false
  isCreateForm: boolean = false;
  reloadDetailProduct = false;

  status = common.status
  statusSelected = 0
  units = Object.values(Unit);
  user: any = '';
  data: any

  item: Product = {
    userId: '',
    productObj: {
      productId: '',
      productName: '',
      dates: {
        cultivated: '',
        harvested: '',
        imported: '',
        manufacturered: '',
        exported: '',
        distributed: '',
        selling: '',
        sold: ''
      },
      actors: {
        supplierId: '',
        manufacturerId: '',
        distributorId: '',
        retailerId: ''
      },
      expireTime: '',
      price: '',
      amount: '',
      unit: Unit.Kilogram,
      status: '',
      description: '',
      certificateUrl: '',
      supplierId: '',
      qrCode: '',
      image: [] as string[] | undefined
    }
  };

  openCertificate(product: any) {
    this.product = product
    console.log("OPEN", product)
    this.hasCertificate = !!product.productObj.certificateUrl;
    this.openCertification = true
  }

  closeCertificate(data: any) {
    console.log("du lieu truyen ve", data)
    this.openCertification = data
    // this.openDialog = data
    this.certDialog?.nativeElement.close();
  }

  open(product: any) {
    this.product = product
    this.openDialog = true
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log("DETAIL",this.product)
    console.log("DETAIL",this.user)
    if(this.product) {
      this.item.productObj.supplierId = this.item.userId = this.user.userId
      this.isCreateForm = false;
      this.productService.setProduct(this.product)
      this.data = this.productService.getProduct()
      this.item.productObj = this.data
    } else {
      console.log("false", this.product)
      this.isCreateForm = true;

    }
    if (changes['reload'] && changes['reload'].currentValue) {
      // Thực hiện các hành động cần thiết khi reload được kích hoạt
      // Ví dụ: Gọi API để tải lại dữ liệu
      console.log("reload")
      this.loadData();
      this.reload = false; // Đặt lại giá trị reload
    }
  }
  ngOnInit(): void {
    this.user = this.userService.getUser()
    console.log("INITDETAIL",this.user)
  }


  onSubmit() {
    this.loading = true
    console.log("this is submit");
    console.log("item", this.product)
    if (this.product?.productId) {
      console.log("update",this.product.productId)
      this.item.productObj.productId = JSON.parse(JSON.stringify(this.product)).productId
      this.closeCertificate(false)
      this.viewProductService.updateProduct(this.item).subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false
          this.close(true, true)
        }
      });
    } else {
      console.log("create")
      this.closeCertificate(false)
      this.viewProductService.createProduct(this.item).subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false
          this.close(true, true)
        }
      });
    }

    // this.productService.createProduct(item)
  }

  close(isClose= true, isReload= false ) {
    this.dataEvent.emit({
      isClose : isClose,
      isReload: isReload
    })
  }

  handleDataEvent(data: any) {
    if (data.event == "close") {
      this.closeCertificate(data.data)
    }
    if (data.event == 'addcert') {
      this.addCertificate(data.data);
    }
  }

  addImage(data: any) {
    console.log("add")
    if (this.item.productObj?.image) {
      this.item.productObj.image.push(data);
    } else {
      this.item.productObj.image = [data];
    }
  }

  changeImage(data: any) {
    console.log("change")
  }

  addCertificate(data: any) {
    if (this.product) {
      this.product.certificateUrl = data;
    }
  }


  getProduct(){
    // console.log(this.productId)
  }
  constructor(
    private userService: UserService,
    private viewProductService: ViewProductService,
    private productService: ProductService
  ) {
    this.user = this.userService.getUser()
    console.log("Detail")
  }

  loadData() {
    console.log(JSON.parse(JSON.stringify(this.product)))
  }

  harvestProduct(productId: any) {
    console.log("HARVEST",productId)
    this.data = this.productService.getProduct()
    this.viewProductService.harvestProduct(productId)
      .subscribe({
        next: (response) => {
          console.log(this.data.data)
          if (this.data?.data) {
            this.data.data.map(response);
            this.product = this.data.data;
          }
          this.close()
        }
      })
  }
}
