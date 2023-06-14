import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ViewProductService} from '../view-product/view-product.service';
import {Actor, Dates, Product, ProductObj} from 'src/app/models/product-model';
import {Unit} from 'src/assets/ENUM';
import {UserToken} from 'src/app/models/user-model';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {UserService} from 'src/app/_services/user.service';
import {AuthService} from 'src/app/_services/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {FileUpLoadService} from "../../../_services/file-up-load.service";


@Component({
  selector: 'app-table-supplier',
  templateUrl: './table-supplier.component.html',
  styleUrls: ['./table-supplier.component.scss']
})
export class TableSupplierComponent implements OnInit {
  @ViewChild('dialog') myDialog: ElementRef | undefined;
  @ViewChild('dialogCert') certDialog: ElementRef | undefined;
  @ViewChild('productPaginator', {static: true}) productPaginator!: MatPaginator;

  products: any[] = []
  productId: string = ""
  data: any
  reloadDetailProduct = false;
  currentUser?: UserToken;

  openDialog: boolean = false
  openCertification: boolean = false
  hasCertificate: boolean = false
  currentDate: Date = new Date()

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

  product: ProductObj = this.item.productObj

  constructor(
    private storage: AngularFireStorage,
    private viewProductService: ViewProductService,
    private userService: UserService,
    private authService: AuthService,
    private uploadFile: FileUpLoadService

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
    this.getAllProduct();
  }

  displayProductColumns: string[] = ['index', 'productName', 'cultivatedDate', 'harvestedDate', 'price', 'status', 'action']
  dataSourceProduct = new MatTableDataSource<any>;
  productModel: ProductObj [] = []

  getAllProduct() {
    this.viewProductService.getAllProduct().subscribe(
      response => {
        let data: any = response
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
    this.isCreate = false
    this.product = product
    this.imageList = product.image
    this.openDialog = true
  }

  openToAdd() {
    this.isCreate = true
    let that = this
    this.product = new class implements ProductObj {
      amount: string = "";
      certificateUrl: string = "";
      dates: Dates[] = [];
      description: string = "";
      expireTime: string = "";
      image: string[] = [];
      price: string = "";
      productId: string = "";
      productName: string = "";
      qrCode: string = "";
      status: string = "";
      supplier: Actor = that.userService.getUser();
      unit: Unit = Unit.Kilogram;
    }
    this.imageList = []
    this.openDialog = true
  }

  // close(data: any) {
  //   console.log("du lieu truyen ve", data)
  //   this.openDialog = !data.isClose
  //   this.myDialog?.nativeElement.close();
  //   if (data.isReload) {
  //     location.reload()
  //   }
  // }

  close(isClose= true, isReload= false ) {
    this.openDialog = !isClose
      this.myDialog?.nativeElement.close();
      if (isReload) {
        location.reload()
      }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscKey(event: KeyboardEvent) {
    this.close();
  }


  harvestProduct(productId: any) {
    console.log("HARVEST", productId)
    this.viewProductService.harvestProduct(productId)
      .subscribe({
        next: (response) => {
          this.data.data.map(response);
          this.product = this.data.data;
          location.reload();
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProduct.filter = filterValue.trim().toLowerCase();
  }


  //--------------------------------Detail Product------------------------------//
  units = Object.values(Unit);

  isCreate: boolean = false
  loading: boolean = false


  onSubmit() {
    this.loading = true
    console.log("this is submit");
    console.log("item", this.product)
    if (this.product?.productId) {
      console.log("update",this.product.productId)
      this.item.productObj.productId = JSON.parse(JSON.stringify(this.product)).productId
      this.viewProductService.updateProduct(this.item).subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false
          this.close(true, true)
        }
      });
    } else {
      console.log("create")
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


  //-------------------------------Image--------------------------------//
  imageList: string[] = []
  distanNumber: number = 0;
  distanceString: string = '0px';
  currentImagePos: number = 0;
  widthContain: number = 0;
  startDragPos: number = 0;
  limitDrag: number = 0;

  isImageLoading: boolean = false;


  addImage(e: any) {
    console.log("POS-P", this.currentImagePos)
    this.isImageLoading = true;
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageList.push(url);
      this.isImageLoading = false
      console.log(this.imageList)

    });
    // this.uploadImageService.upload(e.target.files[0]).subscribe((url: string) => {
    //   this.imageList.push(url);
    //   console.log(this.imageList)
    //
    // });

  }


  previousImage(){
    if(this.currentImagePos - 1 < 0){
      this.currentImagePos = this.imageList.length - 1;
      this.distanNumber = -(this.limitDrag+110)
      this.distanceString = (this.distanNumber).toString() + 'px';
    }
    else{
      this.currentImagePos -= 1;
    }
    const widthOfCurrentImagePos = (this.currentImagePos+1) * 120;
    if(widthOfCurrentImagePos + this.distanNumber  < this.widthContain ){
      if(this.distanNumber + 110 >= 0){
        this.distanNumber = 0
        this.distanceString = (this.distanNumber).toString() + 'px';
        return
      }
      this.distanceString = (this.distanNumber +110).toString() + 'px';
      this.distanNumber += 110;
    }
  }

  afterImage(){
    if(this.currentImagePos+1 > this.imageList.length-1){
      this.currentImagePos = 0;
      this.distanNumber = 0
      this.distanceString = (this.distanNumber).toString() + 'px';
      return;
    }
    else {
      this.currentImagePos += 1;
    }

    const widthOfCurrentImagePos = (this.currentImagePos+1) * 120;
    if(widthOfCurrentImagePos + this.distanNumber  > this.widthContain ){
      if(this.distanNumber - 110 <= -this.limitDrag){
        this.distanNumber = -this.limitDrag
        this.distanceString = (this.distanNumber).toString() + 'px';
        return
      }
      this.distanceString = (this.distanNumber -110).toString() + 'px';
      this.distanNumber -= 110;
    }
  }

  moveImages(e: any){

    const movedDistance = this.startDragPos - Number(e.clientX);
    const leftPos =  this.distanNumber - movedDistance;
    if(leftPos <= -this.limitDrag ||  leftPos > 0){
      return;
    }
    this.distanceString = leftPos.toString() + 'px';
  }

  endDrag(e:any){
    this.distanNumber =Number(this.distanceString.replace('px',''));

  }
  getFirstPos(e:any){
    this.startDragPos = Number(e.clientX);

  }
  chooseImage(pos: number){

    this.currentImagePos = pos;

  }

  deleteImage(i: number){
    console.log(this.imageList[i])
    this.currentImagePos = 0;
    this.imageList.splice(i, 1);
    this.distanNumber = 0;
    this.distanceString = (this.distanNumber).toString() + 'px';
  }

  //--------------------------------Certificate-----------------------------//
  imageUrl: string = '';
  onSubmitCertificate() {
    this.product!.certificateUrl = this.imageUrl
    this.closeCertificate()
  }

  openCertificate() {
    if (this.product.certificateUrl!='') {
      this.imageUrl = this.product.certificateUrl
    } else {
      this.imageUrl = ''
    }
    this.openCertification = true
  }

  closeCertificate() {
    this.openCertification = false
    this.certDialog?.nativeElement.close()
  }

  addCert(e: any) {
    console.log("POS-P", this.currentImagePos)
    this.isImageLoading = true;
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageUrl = url;
      this.isImageLoading = false
    });

  }
}
