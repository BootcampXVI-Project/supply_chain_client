import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ViewProductService } from '../view-product/view-product.service';
import { Product, ProductObj } from 'src/app/models/product-model';
import { Unit } from 'src/assets/ENUM';
import { UserToken } from 'src/app/models/user-model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-table-supplier',
  templateUrl: './table-supplier.component.html',
  styleUrls: ['./table-supplier.component.scss']
})
export class TableSupplierComponent implements OnInit{
  @ViewChild('dialog') myDialog: ElementRef | undefined;
  @ViewChild('dialogCert') certDialog: ElementRef | undefined;
  @ViewChild('productPaginator', { static: true }) productPaginator!: MatPaginator;

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

  product: ProductObj = this.item.productObj
  ngOnInit(): void {
    this.getAllProduct();
  }
  displayProductColumns: string[] = ['index','productName','cultivatedDate','harvestedDate','price','status','action']
  dataSourceProduct = new MatTableDataSource<any>;
  productModel : ProductObj []=[]
  getAllProduct(){
    this.viewProductService.getAllProduct().subscribe(
      response =>{
        let data:any = response
        this.productModel = data.data
        this.dataSourceProduct = new MatTableDataSource(this.productModel)
        this.dataSourceProduct.paginator = this.productPaginator
      }
    )
  }
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
        this.item.productObj.supplierId = this.currentUser.userId
      }
    });
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
}
