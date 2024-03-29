import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() isLoading: boolean = false;
  @Input() text: string = '';
  @Input() width: string = '1.3rem';
  @Input() height: string = '1.3rem';
}
