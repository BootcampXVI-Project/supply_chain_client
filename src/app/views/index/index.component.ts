import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  constructor() {}
  _openTab = 0;

  set stateOpenTab($tabNumber: number) {
    this._openTab = $tabNumber;
  }
  ngOnInit(): void {}
}
