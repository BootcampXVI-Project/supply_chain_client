import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UserToken} from "../../models/user-model";
import {Product, ProductObj} from "../../models/product-model";
import {Unit} from "../../../assets/ENUM";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {ViewProductService} from "../../supplier/components/view-product/view-product.service";
import {UserService} from "../../_services/user.service";
import {AuthService} from "../../_services/auth.service";

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent {
  dataSource = new MatTableDataSource();

  @ViewChild('manufacturerDetailDialog') manufacturerDetailDialog: ElementRef | undefined;
  @ViewChild('dialogCert') certDialog: ElementRef | undefined;
  @ViewChild('manufacturerPaginator', {static: true}) manufacturerPaginator!: MatPaginator

  products: any[] = []
  productId: string = ""
  data: any
  reloadDetailProduct = false;
  currentUser?: UserToken;

  openDialog: boolean = false
  openCertification: boolean = false
  hasCertificate: boolean = false

  // dataSource = new MatTableDataSource<any>()
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
  productModel : ProductObj []=[]
  dataSourceProduct = new MatTableDataSource<any>;
  displayedColumns: string[] = ['Index','ProductName','CultivatedDate','HarvestedDate','Price','Status','Action']

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct(){
    this.viewProductService.getAllProduct().subscribe(
      response =>{
        let data:any = response
        this.productModel = data.data
        this.dataSourceProduct = new MatTableDataSource(this.productModel)
        this.dataSourceProduct.paginator = this.manufacturerPaginator
      }
    )
  }

  onBackdropClick(event: MouseEvent) {
    console.log("click");

    const backdrop = event.target as HTMLElement;
    const dialogContent = this.manufacturerDetailDialog?.nativeElement.querySelector('.backdrop');

    if (backdrop === dialogContent) {
      this.close({isClose:true, isReload:true});
    }
  }

  open(product: any) {
    this.product = product
    this.openDialog = true
  }

  close(data: any) {
    console.log("du lieu truyen ve", data)
    this.openDialog = !data.isClose
    this.manufacturerDetailDialog?.nativeElement.close();
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

  loadData() {
    this.viewProductService.getAllProduct().subscribe({
      next: (response) => {
        this.data = response;
        this.products = this.data.data
        this.dataSource = new MatTableDataSource(this.products)
        this.dataSource.paginator = this.manufacturerPaginator;
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


  //-------------------- detail ----------------------------//
  loading: boolean = false
  units = Object.values(Unit);
  isCreateForm: boolean = false;

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
          this.close({isClose:true, isReload:true})
        }
      });
    } else {
      console.log("create")
      this.closeCertificate(false)
      this.viewProductService.createProduct(this.item).subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false
          this.close({isClose:true, isReload:true})
        }
      });
    }

    // this.productService.createProduct(item)
  }


  closeCertificate(data: any) {
    console.log("du lieu truyen ve", data)
    this.openCertification = data
    // this.openDialog = data
    this.certDialog?.nativeElement.close();
  }

  addImage(data: any) {
    console.log("add")
    if (this.item.productObj?.image) {
      this.item.productObj.image.push(data);
    } else {
      this.item.productObj.image = [data];
    }
  }
}
