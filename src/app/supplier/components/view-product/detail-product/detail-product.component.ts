import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {UserService} from "../../../../_services/user.service";
import {common} from "../../../../../../common";
import {ViewProductService} from "../view-product.service";
import { Unit } from "../../../../../assets/ENUM";
import { Product } from "../../../../models/product-model";

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit{
  @Output() dataEvent = new EventEmitter<any>();

  @ViewChild('dialog') myDialog: ElementRef | undefined;
  @ViewChild('dialogCert') certDialog: ElementRef | undefined;


  @Input() product: Product | undefined;
  @Input() reload = false;

  openDialog: boolean = false
  openCertification: boolean = false

  status = common.status
  statusSelected = 0
  units = Object.values(Unit);
  isCreateForm: boolean = false;
  user: any = '';
  reloadDetailProduct = false;
  data: any

  // item: any = {
  //   productName: "",
  //   image: [],
  //   price: "",
  //   amount: "",
  //   unit: "",
  //   dates: "",
  //   status:"",
  //   description:"",
  //   certificateUrl:"",
  // };

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
    this.openCertification = true
  }

  closeCertificate() {
    this.openCertification = false
    this.openDialog = false
    this.certDialog?.nativeElement.close();
  }

  open(product: any) {
    this.product = product
    this.openDialog = true
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.product)
    console.log(this.user)
    this.item.productObj.supplierId = this.item.userId = this.user.userId
    if(this.product) {
      this.isCreateForm = false;
      this.data = this.product
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

  }

  onSubmit() {
    console.log("this is submit");
    console.log("item", this.product)
    if (this.product) {
      console.log("update")
      this.item.productObj.productId = JSON.parse(JSON.stringify(this.product)).productId
      this.productService.updateProduct(this.item).subscribe({
        next: (response) => {
          console.log(response);
          close()
        }
      });
    } else {
      console.log("create")
      this.productService.createProduct(this.item).subscribe({
        next: (response) => {
          console.log(response);
          close()
        }
      });
    }

    // this.productService.createProduct(item)
  }

  close() {
    this.dataEvent.emit(false)
  }

  handleDataEvent(data: any) {
    this.addImage(data);
    this.changeImage(data);
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


  getProduct(){
    // console.log(this.productId)
  }
  constructor(private userService: UserService, private productService: ViewProductService) {
    this.user = this.userService.getUser()
    console.log("Detail")
  }

  loadData() {
    console.log(JSON.parse(JSON.stringify(this.product)))
  }
}
