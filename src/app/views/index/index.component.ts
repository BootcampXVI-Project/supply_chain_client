import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {AuthService} from "../../_services/auth.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  @ViewChild('introduceDialog') introduceDialog: ElementRef | undefined

  openIntroduceDialog: boolean = false
  constructor(
    private authService: AuthService
  ) {

    // console.log("Auth",this.authService.getTokenRole())
  }
  _openTab = 0;

  set stateOpenTab($tabNumber: number) {
    this._openTab = $tabNumber;
  }
  openIntroduce() {
    this.openIntroduceDialog = true
  }
  closeIntroduce() {
    this.openIntroduceDialog = false
    this.introduceDialog?.nativeElement.close()
  }
  ngOnInit(): void {}
}
