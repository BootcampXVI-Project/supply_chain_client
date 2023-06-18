import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading-detail',
  templateUrl: './loading-detail.component.html',
  styleUrls: ['./loading-detail.component.scss']
})
export class LoadingDetailComponent {
  @Input() isDetailLoading = false
}
