import { Component, NgModule, OnInit } from '@angular/core';
import { ApiService } from './products.services';
// import { JsonPipe } from './json.pipe';

// @NgModule({
//   declarations: [JsonPipe],
// })
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  responseData: any;

  constructor(private apiService: ApiService) {}

  logData(data: any): any {
    console.log(data);
    return data;
  }

  ngOnInit() {
    this.apiService.getData().subscribe((response) => {
      this.responseData = response;
    });
  }
}
