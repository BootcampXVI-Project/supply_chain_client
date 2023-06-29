import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UserToken} from "../../models/user-model";
import {Actor, Product, ProductImport, ProductManufacture, ProductObj} from "../../models/product-model";
import {StatusColor, Time, Unit} from "../../../assets/ENUM";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {ViewProductService} from "../../supplier/table-supplier/view-product.service";
import {UserService} from "../../_services/user.service";
import {AuthService} from "../../_services/auth.service";
import {ManufacturerService} from "../manufacturer.service";
import {ShareDataService} from "../../_services/share-data.service";
import {FileUpLoadService} from "../../_services/file-up-load.service";
import {DatePipe} from "@angular/common";
import {TimeModel} from "../../models/time-model";
import {ProductService} from "../../_services/product.service";
import {ngxLoadingAnimationTypes} from "ngx-loading";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

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
  selectedStatus!: string;

  openDialog: boolean = false
  openCertification: boolean = false
  hasCertificate: boolean = false
  isLoading: boolean = false
  isTableLoading: boolean = false
  isSupplier = true
  isManufacturer = false
  isDistributor = false

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
  displayedColumns: string[] = ['Index', 'ProductName', 'cultivatedDate', 'harvestedDate', 'Price', 'Status', 'Action']

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
    this.isTableLoading = true
    console.log(this.isTableLoading)
    this.manufacturerService.getAllProduct().subscribe(
      response => {
        let data: any = response
        this.productModel = data.data.filter((i: any) => i.dates[0].time != '')
        this.dataSourceProduct = new MatTableDataSource(this.productModel)
        this.dataSourceProduct.paginator = this.manufacturerPaginator
        this.isTableLoading = false
      },
      err => {
        this.isTableLoading = false
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
    this.currentAmount = parseFloat(this.product.amount)

  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscKey(event: KeyboardEvent) {
    this.close();
    this.closeCertificate()
    this.closeQrCode()
  }

  close(data: any = {isClose: true, isReload: false}) {
    this.openDialog = !data.isClose
    this.manufacturerDetailDialog?.nativeElement.close();
    if (data.isReload) {
      location.reload()
    }
  }

  loadData() {
    let showProducts
    switch (this.selectedStatus) {
      case 'supplier':
        this.displayedColumns = ['Index', 'ProductName', 'cultivatedDate', 'harvestedDate', 'Price', 'Status', 'Action']
        this.isSupplier = true
        this.isManufacturer = false
        this.isDistributor = false
        showProducts = this.productModel.filter((i: any) => i.status.toLowerCase() == 'cultivated' || i.status.toLowerCase() == 'harvested')
        this.dataSourceProduct = new MatTableDataSource(showProducts)
        this.dataSourceProduct.paginator = this.manufacturerPaginator
        break;

      case 'manufacturer':
        this.displayedColumns = ['Index', 'ProductName', 'importedDate', 'manufacturedDate', 'Price', 'Status', 'Action']
        this.isSupplier = false
        this.isManufacturer = true
        this.isDistributor = false
        showProducts = this.productModel.filter((i: any) => i.status.toLowerCase() == 'imported' || i.status.toLowerCase() == 'manufactured')
        this.dataSourceProduct = new MatTableDataSource(showProducts)
        this.dataSourceProduct.paginator = this.manufacturerPaginator
        break;

      case 'distributor':
        this.displayedColumns = ['Index', 'ProductName', 'exportedDate', 'distributingDate', 'Price', 'Status', 'Action']
        this.isSupplier = false
        this.isManufacturer = false
        this.isDistributor = true
        showProducts = this.productModel.filter((i: any) => i.status.toLowerCase() == 'exported' || i.status.toLowerCase() == 'distributing')
        this.dataSourceProduct = new MatTableDataSource(showProducts)
        this.dataSourceProduct.paginator = this.manufacturerPaginator
        break;

    }
    // this.viewProductService.getAllProduct().subscribe({
    //   next: (response) => {
    //     let data: any = response
    //     this.productModel = data.data.filter((i:any) => i.dates[0].time != '' )
    //     this.dataSource = new MatTableDataSource(this.products)
    //     this.dataSource.paginator = this.manufacturerPaginator;
    //   },
    //   error: (err) => {
    //     console.error(err)
    //   }
    // })
  }


  //-------------------- detail ----------------------------//
  times = Object.values(Time)
  loading: boolean = false
  units = Object.values(Unit);
  isCreateForm: boolean = false;
  currentAmount = 0

  onSubmit() {
    this.loading = true
    if (this.product?.productId) {
      this.product.amount = this.currentAmount.toString()
      this.item.productObj = JSON.parse(JSON.stringify(this.product))
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

  validateAmount(event: any) {
    const enteredValue = event.target.value;
    const currentValue = this.currentAmount;
    // if (enteredValue > currentValue) {
    //   this.product.amount = currentValue.toString();
    //   this.currentAmount = parseFloat(this.product.amount)
    // } else {
    //   this.currentAmount = enteredValue
    //
    // }
    this.product.amount = currentValue.toString()
    this.currentAmount = enteredValue
    // this.currentAmount = parseFloat(this.product.amount)
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
    this.loading = true
    this.productImport.productId = this.product.productId
    this.productImport.price = this.product.price
    console.log("IMPORT", this.productImport)

    this.manufacturerService.importProduct(this.productImport)
      .subscribe({
        next: (response) => {
          console.log("successful", response)
          this.loading = false
          this.close({isClose: true, isReload: true});
        }
      })
  }

  manufactureProduct() {
    this.loading = true
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
          this.loading = false
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

  addImage(e: any) {
    console.log("POS-A", this.currentImagePos)
    this.isImageLoading = true;
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageList = [...this.imageList];
      this.imageList?.push(url);
      this.isImageLoading = false
      console.log("afterAdd", this.product)

    });
  }


  changeImage(e: any) {
    this.isImageLoading = true;
    console.log("POS-C", this.currentImagePos)
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageList = [...this.imageList];
      this.imageList![this.currentImagePos] = url;
      this.isImageLoading = false
      console.log("afterChange", this.product)


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
    this.imageList = [...this.imageList];
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProduct.filter = filterValue.trim().toLowerCase();
  }

//---------------------------------------------Certificate-----------------------------------//
  @ViewChild('dialogCertManufacturer') dialogCertManufacturer: ElementRef | undefined;
  imageUrl = ''

  openCertificate() {
    if (this.product.certificateUrl != '') {
      this.imageUrl = this.product.certificateUrl
    } else {
      this.imageUrl = ''
    }
    this.openCertification = true
  }

  closeCertificate() {
    this.openCertification = false
    this.dialogCertManufacturer?.nativeElement.close()
  }

  @ViewChild('dialogQrCode') dialogQrCode : ElementRef | undefined
  openQrCodeDialog: boolean =false

  openQrCode() {
    this.openQrCodeDialog = true
  }

  closeQrCode() {
    this.openQrCodeDialog = false;
    this.dialogQrCode?.nativeElement.close()
  }

  @ViewChild('qrCodeDiv') qrCodeDiv!: ElementRef;
  exportQrCode() {
    // Chụp ảnh của phần tử qrCodeDiv bằng html2canvas
    html2canvas(this.qrCodeDiv.nativeElement).then((canvas: HTMLCanvasElement) => {
      // Chuyển đổi canvas thành đối tượng Blob
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          // Lưu file bằng saveAs từ file-saver
          saveAs(blob, 'qr-code.png');
        }
      }, 'image/png');
    });
  }


  protected readonly StatusColor = StatusColor;
  protected readonly ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;


  //---------------------------------History-------------------------------------//
  isOpenHistoryDialog: boolean = false
  @ViewChild('historyDialog') historyDialog : ElementRef | undefined;

  openHistoryDialog() {
    this.isOpenHistoryDialog = true
  }

  closeHistoryDialog() {
    this.isOpenHistoryDialog = false
    this.historyDialog?.nativeElement.close()
  }

}
