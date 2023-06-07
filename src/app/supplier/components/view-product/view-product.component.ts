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
  // product: any
  productId: string = ""
  showFullText = false;
  data: any
  showEditModal: boolean = false
  selectedImageFile?: ImageSnippet
  reloadDetailProduct = false;
  currentUser?: UserToken;

  openDialog: boolean = false
  openCertification: boolean = false
  hasCertificate: boolean = false

  user: any = this.userService.getUser()
  product: Product = {
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
      image: []
    }
  };

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
    this.openDialog = data
    this.myDialog?.nativeElement.close();
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
        this.product.userId = this.currentUser.userId
        this.product.productObj.supplierId = this.currentUser.userId
      }
    });
    // this.isLoading = true;
    // this.contentService.checkContentIsExistByPersonId()
    //   .subscribe(respone =>{
    //     this.isLoading = false;
    //     this.isExistContent = respone;
    //   })
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.viewProductService.getAllProduct().subscribe({
      next: (response) => {
        this.data = response;
        this.products = this.data.data;
        for (let i of this.products) {
          console.log(i)
        }
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  //
  // processImageFile(avatar: any) {
  //   const file: File = avatar.files[0]
  //   const reader = new FileReader()
  //   reader.addEventListener('load', (evt: any) => {
  //     this.selectedImageFile = new ImageSnippet(evt.target.result, file)
  //     this.product.productObj.image = this.selectedImageFile.src
  //
  //     console.log(this.product.image)
  //   })
  //   reader.readAsDataURL(file)
  //   // this.imageChange = true
  // }

  // onEditExercise(productId: any) {
  //   console.log("Edit", productId)
  //   // if (!this.accessToken) return;
  //   this.showEditModal = true;
  //   this.viewProductService.getProduct(productId).subscribe({
  //     next: (response) => {
  //       this.data = response;
  //       this.product = this.data.data;
  //     }
  //   });
  //
  //   // this.exerciseService.getExercise(productId).subscribe({
  //   //   next: (response) => {
  //   //     this.updateExercise = response
  //   //   },
  //   //   error: (err) => {
  //   //     console.error(err)
  //   //   },
  //   // })
  // }

  harvestProduct(productId: any) {
    // console.log(productId)
    this.viewProductService.harvestProduct(productId)
      .subscribe({
        next: (response) => {
          this.data.data.map(response);
          this.product = this.data.data;
        }
      })

  }

  openCertificate(product: any) {
    this.product = product
    this.hasCertificate = !!product.certificateUrl;
    this.openCertification = true
  }

  closeCertificate() {
    this.openCertification = false
    this.openDialog = false
    this.certDialog?.nativeElement.close();
  }
}
