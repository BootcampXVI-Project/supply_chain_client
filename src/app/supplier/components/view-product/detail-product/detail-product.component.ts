import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit{
  @Input() product: string | undefined;
  @Input() reload = false;

  item: any = {
    productName: "",
    image:"",
    price: "",
    amount: "",
    dates: "",
    status:"",
    description:"",
    certificateUrl:"",
  };

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.product)

    this.item.productName = JSON.parse(JSON.stringify(this.product)).productName
    this.item.price = JSON.parse(JSON.stringify(this.product)).price
    this.item.amount = JSON.parse(JSON.stringify(this.product)).amount
    this.item.image = JSON.parse(JSON.stringify(this.product)).image
    this.item.dates = JSON.parse(JSON.stringify(this.product)).dates
    this.item.status = JSON.parse(JSON.stringify(this.product)).status
    this.item.description = JSON.parse(JSON.stringify(this.product)).description
    this.item.certificateUrl = JSON.parse(JSON.stringify(this.product)).certificateUrl
    if (changes['reload'] && changes['reload'].currentValue) {
      // Thực hiện các hành động cần thiết khi reload được kích hoạt
      // Ví dụ: Gọi API để tải lại dữ liệu
      this.loadData();
      this.reload = false; // Đặt lại giá trị reload
    }
  }
  ngOnInit(): void {
  }

  getProduct(){
    // console.log(this.productId)
  }
  constructor() {
    console.log("Detail")
  }

  loadData() {
    console.log(this.product)
  }
}
