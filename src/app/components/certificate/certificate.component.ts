import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Product, ProductObj} from "../../models/product-model";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {UploadImageService} from "../../_services/upload-image.service";
import {FileUpLoadService} from "../../_services/file-up-load.service";
import {ProductService} from "../../_services/product.service";
import {ViewProductService} from "../../supplier/components/view-product/view-product.service";

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent {
  @Output() dataEvent = new EventEmitter<any>();

  @Input() product: ProductObj | undefined
  @Input() isCreateForm: boolean = false

  imageUrl: string = '';
  isImageLoading: boolean = false;

  constructor(
    private _elementRef : ElementRef,
    private storage: AngularFireStorage,
    private uploadImageService: UploadImageService,
    private uploadFile: FileUpLoadService,
    private productService: ProductService,
    private viewProductService: ViewProductService
  ) {
  }

  ngOnInit(): void {
  }
  ngOnChanges(){
    console.log("ADDCERT",this.product)
    if (this.product){
      this.productService.setProduct(this.product)
    }

  }

  addImage(e: any) {
    this.product = this.productService.getProduct()
    this.isImageLoading = true;
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageUrl = url
      this.isImageLoading = false
    });
  }

  close() {
    this.dataEvent.emit({event: "close", data: false})
  }
  onSubmit() {
    this.product!.certificateUrl = this.imageUrl
    this.dataEvent.emit({event: "addcert", data: this.product?.certificateUrl})
    this.close()
  }
}
