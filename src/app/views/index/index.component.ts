import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AuthService} from "../../_services/auth.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  constructor(
    private authService: AuthService
  ) {

    // console.log("Auth",this.authService.getTokenRole())
  }
  _openTab = 0;

  set stateOpenTab($tabNumber: number) {
    this._openTab = $tabNumber;
  }
  ngOnInit(): void {}
}
