import { Component } from '@angular/core';

@Component({
  selector: 'app-supplier-sidebar',
  templateUrl: './supplier-sidebar.component.html',
  styleUrls: ['./supplier-sidebar.component.scss'],
})
export class SupplierSidebarComponent {
  collapseShow = 'hidden';
  constructor() {}

  ngOnInit() {}
  toggleCollapseShow(classes: any) {
    this.collapseShow = classes;
  }
}
