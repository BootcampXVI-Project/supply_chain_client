import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit{
  @Input() product: string | undefined;
  @Input() reload = false;

  ngOnChanges(changes: SimpleChanges) {
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
