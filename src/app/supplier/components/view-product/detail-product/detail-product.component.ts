import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit{
  @Input() productId: string | undefined;
  ngOnInit(): void {
  }

  getProduct(){
    console.log(this.productId)
  }
  constructor() {
    console.log("Detail")
  }
}
