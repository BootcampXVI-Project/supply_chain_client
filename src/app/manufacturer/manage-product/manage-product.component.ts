import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UserToken} from "../../models/user-model";
import {Actor, Product, ProductImport, ProductManufacture, ProductObj} from "../../models/product-model";
import {StatusColor, Time, Unit} from "../../../assets/ENUM";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {ViewProductService} from "../../supplier/components/view-product/view-product.service";
import {UserService} from "../../_services/user.service";
import {AuthService} from "../../_services/auth.service";
import {ManufacturerService} from "../manufacturer.service";
import {ShareDataService} from "../../_services/share-data.service";
import {FileUpLoadService} from "../../_services/file-up-load.service";
import {DatePipe} from "@angular/common";
import {TimeModel} from "../../models/time-model";

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


  statusColor: StatusColor = StatusColor.CULTIVATED
  // dataSource = new MatTableDataSource<any>()
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
  productModel: ProductObj [] = []
  dataSourceProduct = new MatTableDataSource<any>;
  displayedColumns: string[] = ['Index', 'ProductName', 'Price', 'Status', 'Action']
  // displayedColumns: string[] = ['Index', 'ProductName', 'CultivatedDate', 'HarvestedDate', 'Price', 'Status', 'Action']


  constructor(
    private storage: AngularFireStorage,
    private viewProductService: ViewProductService,
    private userService: UserService,
    private authService: AuthService,
    private manufacturerService: ManufacturerService,
    private datePipe: DatePipe,
    //--------------Image-------------//

    public shareInfor: ShareDataService,
    private _elementRef: ElementRef,
    private uploadFile: FileUpLoadService
  ) {
    this.authService.currentUser?.subscribe(x => {
      this.currentUser = x
      this.currentUser.username = authService.getTokenName()
      this.item.userId = this.user.userId
    });
  }

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct() {
    this.viewProductService.getAllProduct().subscribe(
      response => {
        let data: any = response
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
      this.close({isClose: true, isReload: true});
    }
  }

  open(product: any) {
    this.product = product
    console.log("DETAIL", product)
    this.openDialog = true
    //---------manufacturer--------//

    if (this.product.status.toLowerCase() == 'imported') {
      const currentDate = new Date();
      const futureDate = new Date();
      futureDate.setMonth(currentDate.getMonth() + 1);

      this.expireTime.setMonth(currentDate.getMonth() + 1);
    }

    //---------image-------//
    this.shareInfor.setImageSlideValue([]);
    this.imageList = product.image

  }

  close(data: any = {isClose: true, isReload: false}) {
    console.log("du lieu truyen ve", data)
    this.openDialog = !data.isClose
    this.manufacturerDetailDialog?.nativeElement.close();
    if (data.isReload) {
      location.reload()
    }
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


  //-------------------- detail ----------------------------//
  times = Object.values(Time)
  loading: boolean = false
  units = Object.values(Unit);
  isCreateForm: boolean = false;

  onSubmit() {
    this.loading = true
    if (this.product?.productId) {
      this.item.productObj = JSON.parse(JSON.stringify(this.product))
      this.closeCertificate(false)
      this.viewProductService.updateProduct(this.item).subscribe({
        next: (response) => {
          console.log(response);
          console.log("successful", response)
          this.loading = false
          this.close({isClose: true, isReload: false})
        }
      });
    }
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

  //--------------------------manufacturer--------------------//

  time: TimeModel = {
    numbOfTime: 1,
    unitOfTime: Time.Month
  }
  expireTime: Date = new Date();

  productImport: ProductImport = {
    productId: '',
    price: ''
  }

  productExport: ProductImport = {
    productId: '',
    price: ''
  }

  productManufacture: ProductManufacture = {
    productId: '',
    imageUrl: [],
    expireTime: ''
  }


  importProduct() {
    this.productImport.productId = this.product.productId
    this.productImport.price = this.product.price
    console.log("IMPORT", this.productImport)

    this.manufacturerService.importProduct(this.productImport)
      .subscribe({
        next: (response) => {
          console.log("successful", response)
          this.close({isClose: true, isReload: true});
        }
      })
  }

  manufactureProduct() {
    this.productManufacture.productId = this.product.productId
    this.productManufacture.imageUrl = this.imageList

    switch (this.time.unitOfTime) {
      case Time.Day:
        this.expireTime.setDate(this.expireTime.getDate() + this.time.numbOfTime);
        break;
      case Time.Week:
        this.expireTime.setDate(this.expireTime.getDate() + (7 * this.time.numbOfTime));
        break;
      case Time.Month:
        this.expireTime.setMonth(this.expireTime.getMonth() + this.time.numbOfTime);
        break;
      case Time.Year:
        this.expireTime.setFullYear(this.expireTime.getFullYear() + this.time.numbOfTime);
        break;
    }
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    this.productManufacture.expireTime = this.expireTime.toLocaleString('en-US', options);


    console.log(this.time)
    console.log("MANUFACTURE", this.productManufacture)

    this.manufacturerService.manufacture(this.productManufacture)
      .subscribe({
        next: (response) => {
          console.log("successful", response)
          this.close({isClose: true, isReload: true});
        }
      })
  }

  //---------------------------Image-------------------------//
  imageList: string[] = []
  isImageLoading: boolean = false;
  currentImagePos: number = 0;
  currentDragImage: number = 0;
  startDragPos: number = 0;
  distanNumber: number = 0;
  distanceString: string = '0px';
  limitDrag: number = 0;

  widthListImage: number = 0;
  widthContain: number = 0;

  ngAfterViewInit(): void {
    console.log("carousel", this.imageList);

    this.setLimitDrag();

  }

  setLimitDrag() {
    this.shareInfor.getImageSlideValueAsTracking()
      .subscribe(
        respone => {
          this.widthContain = this._elementRef.nativeElement.querySelector('#imageThumnailContain').offsetWidth;
          this.widthListImage = respone.length * 120 + 10;
          if (this.widthListImage > this.widthContain) {
            this.limitDrag = this.widthListImage - this.widthContain;
            return;
          }
          this.limitDrag = 0;
        }
      )
  }

  addImage1(e: any) {
    console.log("POS-A", this.currentImagePos)
    this.isImageLoading = true;
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageList?.push(url);
      this.isImageLoading = false
      console.log(this.imageList)

    });
  }

  changeImage(e: any) {
    this.isImageLoading = true;
    console.log("POS-C", this.currentImagePos)
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageList![this.currentImagePos] = url;
      this.isImageLoading = false
      console.log(this.imageList)

    });
  }

  previousImage() {
    this.setLimitDrag();
    if (this.currentImagePos - 1 < 0) {
      this.currentImagePos = this.imageList!.length - 1;
      this.distanNumber = -(this.limitDrag + 110)
      this.distanceString = (this.distanNumber).toString() + 'px';
    } else {
      this.currentImagePos -= 1;
    }
    const widthOfCurrentImagePos = (this.currentImagePos + 1) * 120;
    if (widthOfCurrentImagePos + this.distanNumber < this.widthContain) {
      if (this.distanNumber + 110 >= 0) {
        this.distanNumber = 0
        this.distanceString = (this.distanNumber).toString() + 'px';
        return
      }
      this.distanceString = (this.distanNumber + 110).toString() + 'px';
      this.distanNumber += 110;
    }
  }

  deleteImage(i: number) {
    this.currentImagePos = 0;
    this.imageList?.splice(i, 1);
    this.distanNumber = 0;
    this.distanceString = (this.distanNumber).toString() + 'px';
    this.setLimitDrag();
  }

  forwardImage() {
    this.setLimitDrag();
    if (this.currentImagePos + 1 > this.imageList!.length - 1) {
      this.currentImagePos = 0;
      this.distanNumber = 0
      this.distanceString = (this.distanNumber).toString() + 'px';
      return;
    } else {
      this.currentImagePos += 1;
    }

    const widthOfCurrentImagePos = (this.currentImagePos + 1) * 120;
    if (widthOfCurrentImagePos + this.distanNumber > this.widthContain) {
      if (this.distanNumber - 110 <= -this.limitDrag) {
        this.distanNumber = -this.limitDrag
        this.distanceString = (this.distanNumber).toString() + 'px';
        return
      }
      this.distanceString = (this.distanNumber - 110).toString() + 'px';
      this.distanNumber -= 110;
    }
  }


  moveImages(e: any) {

    const movedDistance = this.startDragPos - Number(e.clientX);
    const leftPos = this.distanNumber - movedDistance;
    if (leftPos <= -this.limitDrag || leftPos > 0) {
      return;
    }
    this.distanceString = leftPos.toString() + 'px';
  }

  endDrag(e: any) {
    this.distanNumber = Number(this.distanceString.replace('px', ''));

  }

  getFirstPos(e: any) {
    this.startDragPos = Number(e.clientX);

  }

  chooseImage(pos: number) {

    this.currentImagePos = pos;

  }

  protected readonly StatusColor = StatusColor;
}
