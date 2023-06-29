import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ViewProductService } from './view-product.service';
import { Actor, CompareObj, Dates, Product, ProductModel, ProductObj } from 'src/app/models/product-model';
import { Unit } from 'src/assets/ENUM';
import { UserToken } from 'src/app/models/user-model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { FileUpLoadService } from '../../_services/file-up-load.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { ProductService } from '../../_services/product.service';


@Component({
  selector: 'app-table-supplier',
  templateUrl: './table-supplier.component.html',
  styleUrls: ['./table-supplier.component.scss'],
})
export class TableSupplierComponent implements OnInit {
  @ViewChild('dialog') myDialog: ElementRef | undefined;
  @ViewChild('dialogCert') certDialog: ElementRef | undefined;
  @ViewChild('productPaginator', { static: true }) productPaginator!: MatPaginator;

  products: any[] = [];
  productId: string = '';
  data: any;
  reloadDetailProduct = false;
  currentUser?: UserToken;

  openDialog: boolean = false;
  openCertification: boolean = false;
  hasCertificate: boolean = false;

  isTableLoading = false;
  isDetailLoading = false;
  isImageLoading = false;

  currentDate: Date = new Date();

  user: any = this.userService.getUser();
  item: Product = {
    userId: '',
    productObj: {
      productId: '',
      productName: '',
      dates: [
        {
          actor: {
            address: '',
            avatar: '',
            fullName: '',
            phoneNumber: '',
            role: '',
            userId: '',
          },
          status: '',
          time: '',
        },
      ],
      expireTime: '',
      price: '',
      amount: '',
      unit: Unit.Kilogram,
      status: '',
      description: '',
      certificateUrl: '',
      supplier: {
        address: '',
        avatar: '',
        fullName: '',
        phoneNumber: '',
        role: '',
        userId: '',
      },
      qrCode: '',
      image: [],
    },
  };

  product: ProductObj = this.item.productObj;

  constructor(
    private storage: AngularFireStorage,
    private viewProductService: ViewProductService,
    private userService: UserService,
    private authService: AuthService,
    private uploadFile: FileUpLoadService,
    private productService: ProductService,
  ) {
    this.authService.currentUser?.subscribe(x => {
      this.currentUser = x;
      this.currentUser.username = authService.getTokenName();
      if (this.currentUser.userId != null) {
        this.item.userId = this.currentUser.userId;
      }
    });
  }

  ngOnInit(): void {
    console.log('');
    this.getAllProduct();
  }

  displayProductColumns: string[] = ['index', 'productName', 'cultivatedDate', 'harvestedDate', 'price', 'status', 'action'];
  dataSourceProduct = new MatTableDataSource<any>;
  productModel: ProductObj [] = [];

  getAllProduct() {
    this.isTableLoading = true;
    this.viewProductService.getAllProduct().subscribe(
      response => {
        let data: any = response;
        // this.productModel = data.data
        this.productModel = data.data
          .filter((i: any) => i.dates[0].time != '')
          .sort((a: any, b: any) => {
            // Sắp xếp theo thời gian ("dates[0].time") nếu cùng trạng thái
            if (a.status.toLowerCase() === b.status.toLowerCase()) {
              const timeA = new Date(a.dates[0].time).getTime();
              const timeB = new Date(b.dates[0].time).getTime();
              return timeB - timeA;
            }

            return 0; // Không thay đổi thứ tự
          }).sort((a: any, b: any) => {
            // So sánh trạng thái của hai phần tử
            if (a.status.toLowerCase() === 'cultivated' && b.status.toLowerCase() !== 'cultivated') {
              return -1; // a trước b
            }
            if (a.status.toLowerCase() !== 'cultivated' && b.status.toLowerCase() === 'cultivated') {
              return 1; // b trước a
            }
            return 0; // Không thay đổi thứ tự

            // Nếu bạn muốn sắp xếp theo thứ tự ngược lại (cultivated sau cùng), bạn có thể đổi giá trị trả về của các câu điều kiện.

          })
          .sort((a: any, b: any) => {
            // Sắp xếp theo thời gian ("dates[0].time") nếu cùng trạng thái
            if (a.status.toLowerCase() === 'harvested' && b.status.toLowerCase() === 'harvested') {
              const timeA = new Date(a.dates[1].time).getTime();
              const timeB = new Date(b.dates[1].time).getTime();
              return timeB - timeA;
            }

            return 0; // Không thay đổi thứ tự
          });

        console.log('ALL', this.productModel);
        this.dataSourceProduct = new MatTableDataSource(this.productModel);
        this.dataSourceProduct.paginator = this.productPaginator;
        this.isTableLoading = false;
      },
    );
  }

  onBackdropClick(event: MouseEvent) {
    // console.log("click");
    //
    // const backdrop = event.target as HTMLElement;
    // const dialogContent = this.myDialog?.nativeElement.querySelector('.backdrop');
    //
    // if (backdrop === dialogContent) {
    //   this.close(false);
    // }
  }

  open(product: any) {
    this.isDetailLoading = true;
    this.isCreate = false;
    this.product = product;
    console.log('OPEN', product);
    this.imageList = product.image;
    this.openDialog = true;
    this.isDetailLoading = false;
  }

  openToAdd() {
    this.isCreate = true;
    let that = this;
    this.product = new class implements ProductObj {
      amount: string = '';
      certificateUrl: string = '';
      dates: Dates[] = [];
      description: string = '';
      expireTime: string = '';
      image: string[] = [];
      price: string = '';
      productId: string = '';
      productName: string = '';
      qrCode: string = '';
      status: string = '';
      supplier: Actor = that.userService.getUser();
      unit: Unit = Unit.Kilogram;
    };
    this.imageList = [];
    this.openDialog = true;
  }

  // close(data: any) {
  //   console.log("du lieu truyen ve", data)
  //   this.openDialog = !data.isClose
  //   this.myDialog?.nativeElement.close();
  //   if (data.isReload) {
  //     location.reload()
  //   }
  // }

  close(isClose = true, isReload = false) {
    this.openDialog = !isClose;
    this.myDialog?.nativeElement.close();
    if (isReload) {
      location.reload();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscKey(event: KeyboardEvent) {
    this.close();
    this.closeCertificate();
  }


  harvestProduct(productId: any) {
    this.loading = true;
    console.log('HARVEST', productId);
    this.viewProductService.harvestProduct(productId)
      .subscribe({
        next: (response) => {
          this.data = response;
          console.log(this.data);
          this.product = this.data;
          this.loading = false;
          location.reload();
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProduct.filter = filterValue.trim().toLowerCase();
  }


  //--------------------------------Detail Product------------------------------//
  units = Object.values(Unit);

  isCreate: boolean = false;
  loading: boolean = false;
  hasName: boolean = true;
  hasPrice: boolean = true;
  hasAmount: boolean = true;
  hasImage: boolean = true;
  productSubmit: ProductModel = {
    productObj: {
      productId: '',
      productName: '',
      image: [],
      price: '',
      amount: '',
      unit: Unit.Kilogram,
      description: '',
      certificateUrl: '',
    },
  };

  onSubmit() {
    this.loading = true;
    console.log('this is submit');
    console.log('item', this.product);
    console.log('CONDITION', {
      name: !this.product.productName,
      price: !this.product.price,
      amount: !this.product.amount,
      image: this.product.image.length <= 0,
    });
    this.hasName = !!this.product.productName;
    this.hasAmount = !!this.product.amount && parseFloat(this.product.amount) > 0;
    this.hasPrice = !!this.product.price && parseFloat(this.product.price) > 0;
    this.hasImage = this.product.image.length > 0;
    if (this.hasName && this.hasAmount && this.hasPrice && this.hasImage) {
      if (this.product?.productId) {
        this.productSubmit = this.productService.mapProductObjtoProductModel(JSON.parse(JSON.stringify(this.product)));
        console.log('update', this.productSubmit);
        this.viewProductService.updateProduct(this.productSubmit).subscribe({
          next: (response) => {
            console.log(response);
            this.loading = false;
            this.close(true, true);
          },
        });
      } else {
        this.productSubmit = this.productService.mapProductObjtoProductModel(JSON.parse(JSON.stringify(this.product)));
        console.log('create', this.productSubmit);
        this.productSubmit.productObj.productId = undefined;
        this.viewProductService.createProduct(this.productSubmit).subscribe({
          next: (response) => {
            console.log(response);
            this.loading = false;
            this.close(true, true);
          },
        });
      }
    }


    // this.productService.createProduct(item)
  }


  //-------------------------------Image--------------------------------//
  imageList: string[] = [];
  distanNumber: number = 0;
  distanceString: string = '0px';
  currentImagePos: number = 0;
  widthContain: number = 0;
  startDragPos: number = 0;
  limitDrag: number = 0;


  addImage(e: any) {
    console.log('POS-P', this.currentImagePos);
    this.isImageLoading = true;
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageList.push(url);
      this.isImageLoading = false;
      console.log(this.imageList);
      this.product.image = this.imageList;
    });
    // this.uploadImageService.upload(e.target.files[0]).subscribe((url: string) => {
    //   this.imageList.push(url);
    //   console.log(this.imageList)
    //
    // });

  }


  previousImage() {
    if (this.currentImagePos - 1 < 0) {
      this.currentImagePos = this.imageList.length - 1;
      this.distanNumber = -(this.limitDrag + 110);
      this.distanceString = (this.distanNumber).toString() + 'px';
    } else {
      this.currentImagePos -= 1;
    }
    const widthOfCurrentImagePos = (this.currentImagePos + 1) * 120;
    if (widthOfCurrentImagePos + this.distanNumber < this.widthContain) {
      if (this.distanNumber + 110 >= 0) {
        this.distanNumber = 0;
        this.distanceString = (this.distanNumber).toString() + 'px';
        return;
      }
      this.distanceString = (this.distanNumber + 110).toString() + 'px';
      this.distanNumber += 110;
    }
  }

  afterImage() {
    if (this.currentImagePos + 1 > this.imageList.length - 1) {
      this.currentImagePos = 0;
      this.distanNumber = 0;
      this.distanceString = (this.distanNumber).toString() + 'px';
      return;
    } else {
      this.currentImagePos += 1;
    }

    const widthOfCurrentImagePos = (this.currentImagePos + 1) * 120;
    if (widthOfCurrentImagePos + this.distanNumber > this.widthContain) {
      if (this.distanNumber - 110 <= -this.limitDrag) {
        this.distanNumber = -this.limitDrag;
        this.distanceString = (this.distanNumber).toString() + 'px';
        return;
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

  deleteImage(i: number) {
    console.log(this.imageList[i]);
    this.currentImagePos = 0;
    this.imageList.splice(i, 1);
    this.distanNumber = 0;
    this.distanceString = (this.distanNumber).toString() + 'px';
  }

  //--------------------------------Certificate-----------------------------//
  imageUrl: string = '';

  onSubmitCertificate() {
    this.product!.certificateUrl = this.imageUrl;
    this.closeCertificate();
  }

  openCertificate() {
    if (this.product.certificateUrl != '') {
      this.imageUrl = this.product.certificateUrl;
    } else {
      this.imageUrl = '';
    }
    this.openCertification = true;
  }

  closeCertificate() {
    this.openCertification = false;
    this.certDialog?.nativeElement.close();
  }

  addCert(e: any) {
    console.log('POS-P', this.currentImagePos);
    this.isImageLoading = true;
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageUrl = url;
      this.isImageLoading = false;
    });

  }

  protected readonly ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;


  //---------------------------------History-------------------------------------//
  isOpenHistoryDialog: boolean = false;
  @ViewChild('historyDialog') historyDialog: ElementRef | undefined;
  @ViewChild('historyPaginator', {static: true}) historyPaginator!: MatPaginator
  displayHistoryColumns = ['Index', 'newTransactionId', 'newTimestamp', 'oldTransactionId', 'oldTimestamp', 'action']
  dataSourceHistory = new MatTableDataSource<any>()

  openHistoryDialog(e: any) {
    this.isOpenHistoryDialog = true;
    this.loadDataHistoryProduct(e.productId);
  }

  closeHistoryDialog() {
    this.isOpenHistoryDialog = false;
    this.historyDialog?.nativeElement.close();
  }

  loadDataHistoryProduct(productId: string) {
    this.isDetailLoading = true
    this.productService.getHistoryProduct(productId).subscribe(
      (response: any) => {
        let data = response;
        let changeEvent = [];
        for (let i = 0; i < data.data.length - 1; i++) {
          var obj = { new: data.data[i], old: data.data[i + 1] };
          changeEvent.push(obj);
        }
        this.dataSourceHistory = new MatTableDataSource(changeEvent)
        this.dataSourceHistory.paginator = this.historyPaginator
        console.log('History', changeEvent);
        this.isDetailLoading = false
      },
    );
  }

  //--------------------------------detail history------------------------//

  isOpenCompareDialog : boolean = false
  @ViewChild('compareDialog') compareDialog: ElementRef | undefined;
  compareObj: CompareObj = {
    new: {
      record: {
        productId: 'string',
        productName: 'string',
        dates: [],
        expireTime: '',
        price: '',
        amount: '',
        unit: Unit.Kilogram,
        status: '',
        description: '',
        certificateUrl: '',
        supplier: {
          address: '',
          avatar: '',
          fullName: '',
          phoneNumber: '',
          role: '',
          userId: '',
        },
        qrCode: '',
        image: [],
      },
      transactionId: '',
      timestamp: '',
      isDelete: false
    },
    old: {
      record: {
        productId: 'string',
        productName: 'string',
        dates: [],
        expireTime: '',
        price: '',
        amount: '',
        unit: Unit.Kilogram,
        status: '',
        description: '',
        certificateUrl: '',
        supplier: {
          address: '',
          avatar: '',
          fullName: '',
          phoneNumber: '',
          role: '',
          userId: '',
        },
        qrCode: '',
        image: [],
      },
      transactionId: '',
      timestamp: '',
      isDelete: false
    }
  }

  openCompareDialog(data: any) {
    this.isOpenCompareDialog = true
    this.compareObj = data
    console.log('COMPARE',this.getDifferenceObject(this.compareObj.new.record, this.compareObj.old.record));

  }

  closeCompareDialog() {
    this.isOpenCompareDialog = false
    this.compareDialog?.nativeElement.close()
  }

  getDifferenceObject(obj1: any, obj2: any) {
    var differenceObject: any = {
      old: {},
      new: {}
    };

    for (var key in obj1) {
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        if (obj1[key] !== obj2[key]) {
          differenceObject.old[key] = obj1[key];
          differenceObject.new[key] = obj2[key];
        }
      }
    }

    return differenceObject;
  }
}
