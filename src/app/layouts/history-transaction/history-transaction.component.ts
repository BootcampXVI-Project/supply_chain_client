import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { common } from 'common';
import { ProductService } from 'src/app/_services/product.service';
import { ProductCommercialModel } from 'src/app/models/product-commercial-model';

@Component({
  selector: 'app-history-transaction',
  templateUrl: './history-transaction.component.html',
  styleUrls: ['./history-transaction.component.scss']
})
export class HistoryTransactionComponent {
    productId: string = '';
    productCommercial: ProductCommercialModel = new ProductCommercialModel();
    common = common;

    constructor(
      private route:ActivatedRoute,
      private productService: ProductService,
      private router: Router) {}

    ngOnInit(){
      this.productId = this.route.snapshot.params['productId'];
      this.getHistoryTransaction(this.productId);
    }

    getHistoryTransaction(productId: string){
      this.productService.getCommercialProductByProductId(productId)
      .subscribe(
        respone => {
          this.productCommercial = respone.data!;
        },
        error => {
          this.router.navigate(["supplier"]);
        }
      )
    }
}
