import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-index-navbar',
  templateUrl: './index-navbar.component.html',
  styleUrls: ['./index-navbar.component.scss'],
})
export class IndexNavbarComponent implements OnInit {
  @ViewChild('dialog') myDialog: ElementRef | undefined;

  @Output() newOpenTab = new EventEmitter<number>();
  stateOpenTab(value: number) {
    this.newOpenTab.emit(value);
  }

  openDialogLogin: boolean = true;
  openLogin() {
    this.openDialogLogin = false;
  }
  close() {
    this.openDialogLogin = true;
    this.myDialog?.nativeElement.close();
  }
  save() {
    this.openDialogLogin = true;
    this.myDialog?.nativeElement.close();
  }
  constructor() {}

  ngOnInit(): void {}
}
