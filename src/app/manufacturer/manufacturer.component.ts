import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../_services/user.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {MatSort} from "@angular/material/sort";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {PagingModel} from "../models/paging-model";
import {Product, ProductObj} from "../models/product-model";
import {UserToken} from "../models/user-model";
import {Unit} from "../../assets/ENUM";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {ViewProductService} from "../supplier/components/view-product/view-product.service";
import {AuthService} from "../_services/auth.service";


@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrls: ['./manufacturer.component.scss']
})


export class ManufacturerComponent implements OnInit{
  displayedColumns: string[] = ['Index', 'ProductName', 'CultivatedDate', 'HarvestedDate', 'Price', 'Status', 'Action'];
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // ELEMENT_DATA: any[] = [
  //   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  //   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  //   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  //   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  //   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  //   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  //   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  //   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  //   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  //   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  // ];
  //
  // dataSource = new MatTableDataSource();
  //
  // @ViewChild('dialog') myDialog: ElementRef | undefined;
  // @ViewChild('dialogCert') certDialog: ElementRef | undefined;
  // @ViewChild('manufacturerPaginator', {static: true}) manufacturerPaginator!: MatPaginator
  //
  // products: any[] = []
  // productId: string = ""
  // data: any
  // reloadDetailProduct = false;
  // currentUser?: UserToken;
  //
  // openDialog: boolean = false
  // openCertification: boolean = false
  // hasCertificate: boolean = false
  //
  // // dataSource = new MatTableDataSource<any>()
  // user: any = this.userService.getUser();
  // product: Product = {
  //   userId: '',
  //   productObj: {
  //     productId: '',
  //     productName: '',
  //     dates: {
  //       cultivated: '',
  //       harvested: '',
  //       imported: '',
  //       manufacturered: '',
  //       exported: '',
  //       distributed: '',
  //       selling: '',
  //       sold: ''
  //     },
  //     actors: {
  //       supplierId: '',
  //       manufacturerId: '',
  //       distributorId: '',
  //       retailerId: ''
  //     },
  //     expireTime: '',
  //     price: '',
  //     amount: '',
  //     unit: Unit.Kilogram,
  //     status: '',
  //     description: '',
  //     certificateUrl: '',
  //     supplierId: '',
  //     qrCode: '',
  //     image: []
  //   }
  // };
  //
  // onBackdropClick(event: MouseEvent) {
  //   console.log("click");
  //
  //   const backdrop = event.target as HTMLElement;
  //   const dialogContent = this.myDialog?.nativeElement.querySelector('.backdrop');
  //
  //   if (backdrop === dialogContent) {
  //     this.close(false);
  //   }
  // }
  //
  // open(product: any) {
  //   this.product = product
  //   this.openDialog = true
  // }
  //
  // close(data: any) {
  //   console.log("du lieu truyen ve", data)
  //   this.openDialog = data
  //   this.myDialog?.nativeElement.close();
  //   location.reload()
  // }
  //
  // constructor(
  //   private storage: AngularFireStorage,
  //   private viewProductService: ViewProductService,
  //   private userService: UserService,
  //   private authService: AuthService
  // ) {
  //   this.authService.currentUser?.subscribe(x => {
  //     this.currentUser = x
  //     this.currentUser.username = authService.getTokenName()
  //     if (this.currentUser.userId != null) {
  //       this.product.userId = this.currentUser.userId
  //       this.product.productObj.supplierId = this.currentUser.userId
  //     }
  //   });
  // }

  ngOnInit(): void {
    // this.loadData()
  }
  //
  // loadData() {
  //   this.viewProductService.getAllProduct().subscribe({
  //     next: (response) => {
  //       this.data = response;
  //       this.products = this.data.data
  //       this.dataSource = new MatTableDataSource(this.products)
  //       this.dataSource.paginator = this.manufacturerPaginator;
  //     },
  //     error: (err) => {
  //       console.error(err)
  //     }
  //   })
  // }
  //
  // harvestProduct(productId: any) {
  //   console.log("HARVEST",productId)
  //   this.viewProductService.harvestProduct(productId)
  //     .subscribe({
  //       next: (response) => {
  //         this.data.data.map(response);
  //         this.product = this.data.data;
  //         location.reload();
  //       }
  //     })
  // }
}
