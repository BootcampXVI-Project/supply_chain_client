import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading-image',
  templateUrl: './loading-image.component.html',
  styleUrls: ['./loading-image.component.scss']
})
export class LoadingImageComponent {
  @Input() isImageLoading = false
}
