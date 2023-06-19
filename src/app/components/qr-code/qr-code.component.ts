import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActorModel } from 'src/app/models/actor-model';
import { ScannerQRCodeSelectedFiles, NgxScannerQrcodeComponent } from 'src/app/module/ngx-scanner-qrcode';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent {

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];
  @Input() openTab: number =0;
  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  constructor( private router:Router) {
  }

  ngAfterViewInit(): void {
    this.action.data.subscribe(respone =>{
      if(respone[0].data != null){

        const arrayString = respone[0].value.toString().split("/");
        this.router.navigate(['product-commercial/'+ arrayString[arrayString.length-1]])
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['openTab'].currentValue === 3){
      this.action.start();
    }
    else{
      this.action.stop();
    }

    // Xử lý khi giá trị input thay đổi
  }
}
