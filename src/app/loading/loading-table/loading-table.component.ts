import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading-table',
  templateUrl: './loading-table.component.html',
  styleUrls: ['./loading-table.component.scss']
})
export class LoadingTableComponent {
  @Input() isTableloading = false
  @Input() width: string = '1.3rem';
  @Input() height: string = '1.3rem';
}
