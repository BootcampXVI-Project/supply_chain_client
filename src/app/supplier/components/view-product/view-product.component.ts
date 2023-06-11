import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ViewProductService} from './view-product.service'
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Product, ProductObj} from "../../../models/product-model";
import {Unit} from "../../../../assets/ENUM";
import {UserService} from "../../../_services/user.service";
import {UserToken} from "../../../models/user-model";
import {AuthService} from "../../../_services/auth.service";

class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  @ViewChild('dialog') myDialog: ElementRef | undefined;
  @ViewChild('dialogCert') certDialog: ElementRef | undefined;
  products: any[] = []
  productId: string = ""
  data: any
  reloadDetailProduct = false;
  currentUser?: UserToken;

  openDialog: boolean = false
  openCertification: boolean = false
  hasCertificate: boolean = false

  user: any = this.userService.getUser();
  item: Product = {
    userId: '',
    productObj: {
      productId: '',
      productName: '',
      dates: [
        {
          actor: {
            address: "",
            avatar: "",
            fullName: "",
            phoneNumber: "",
            role: "",
            userId: "",
          },
          status: '',
          time: '',
        }
      ],
      expireTime: '',
      price: '',
      amount: '',
      unit: Unit.Kilogram,
      status: '',
      description: '',
      certificateUrl: '',
      supplier: {
        address: "",
        avatar: "",
        fullName: "",
        phoneNumber: "",
        role: "",
        userId: "",
      },
      qrCode: '',
      image: []
    }
  };

  product : ProductObj = this.item.productObj

  onBackdropClick(event: MouseEvent) {
    console.log("click");

    const backdrop = event.target as HTMLElement;
    const dialogContent = this.myDialog?.nativeElement.querySelector('.backdrop');

    if (backdrop === dialogContent) {
      this.close(false);
    }
  }

  open(product: any) {
    this.product = product
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

  constructor(
    private storage: AngularFireStorage,
    private viewProductService: ViewProductService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.authService.currentUser?.subscribe(x => {
      this.currentUser = x
      this.currentUser.username = authService.getTokenName()
      if (this.currentUser.userId != null) {
        this.item.userId = this.currentUser.userId
      }
    });
  }

  ngOnInit(): void {
    console.log("INIT")
    this.loadData()
  }

  loadData() {
    this.viewProductService.getAllProduct().subscribe({
      next: (response) => {
        this.data = response;
        for (let i of this.data.data) {
          this.products.push(this.viewProductService.mapProductobjToproduct(i))
        }
        console.log("HARVEST",this.products)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  harvestProduct(productId: any) {
    console.log("HARVEST",productId)
    this.viewProductService.harvestProduct(productId)
      .subscribe({
        next: (response) => {
          this.data.data.map(response);
          this.product = this.data.data;
          location.reload();
        }
      })
  }

  // openCertificate(product: any) {
  //   this.product = product
  //   console.log("OPEN", product)
  //   this.hasCertificate = !!product.productObj.certificateUrl;
  //   this.openCertification = true
  // }

  // closeCertificate(data: any) {
  //   console.log("du lieu truyen ve", data)
  //   this.openCertification = data
  //   this.openDialog = data
  //   this.certDialog?.nativeElement.close();
  // }
}
