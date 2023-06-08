import {Component, ElementRef, Input, OnInit, SimpleChanges} from '@angular/core';
import {ShareDataService} from "../../../_services/share-data.service";
import {Product} from "../../../models/product-model";

@Component({
  selector: 'app-view-certificate',
  templateUrl: './view-certificate.component.html',
  styleUrls: ['./view-certificate.component.scss']
})
export class ViewCertificateComponent implements OnInit{
  @Input() product: Product | undefined;
  @Input() isPost: boolean = false;
  @Input() reload = false;

  imageCert: string = "";
  constructor(public shareInfor: ShareDataService, private _elementRef : ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("VIEW",this.product)

    if(this.product) {
      this.imageCert = JSON.parse(JSON.stringify(this.product)).productObj.certificateUrl
      console.log("cert", this.imageCert)
    }
  }
  loadData() {
    console.log(JSON.parse(JSON.stringify(this.product)))
  }
  ngOnInit(): void {
  }
}
