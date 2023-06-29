import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { common } from 'common';
import { ProductService } from 'src/app/_services/product.service';
import { ProductCommercialModel } from 'src/app/models/product-commercial-model';
import { Product, ProductObj } from 'src/app/models/product-model';
import { Unit } from 'src/assets/ENUM';

@Component({
  selector: 'app-history-transaction',
  templateUrl: './history-transaction.component.html',
  styleUrls: ['./history-transaction.component.scss'],
})
export class HistoryTransactionComponent {
  productId: string = '';
  productCommercial: ProductCommercialModel = new ProductCommercialModel();
  common = common;

  @Input() product: ProductObj = {
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
  };
  @Input() reload = false;

  openDialog: boolean = false;
  openCertification: boolean = false;
  hasCertificate: boolean = false;
  loading: boolean = false;
  isCreateForm: boolean = false;
  reloadDetailProduct = false;

  status = common.status;
  statusSelected = 0;
  units = Object.values(Unit);
  user: any = '';
  data: any;

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

  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productId = this.route.snapshot.params['productId'];
    this.getHistoryTransaction(this.productId);
  }

  getHistoryTransaction(productId: string) {
    this.productService.getCommercialProductByProductId(productId).subscribe(
      (respone) => {
        this.productCommercial = respone.data!;
      },
      (error) => {
        this.router.navigate(['supplier']);
      },
    );
  }
}
