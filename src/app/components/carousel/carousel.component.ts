import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  style,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  Directive,
  ElementRef, EventEmitter,
  HostListener,
  Input, Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import {CarouselItemDirective} from './carousel-item.directive';
import {CarouselItemElementDirective} from './carousel-item-element.directive';
import {ShareDataService} from 'src/app/_services/share-data.service';
import {FileUpLoadService} from "../../_services/file-up-load.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'carousel',
  exportAs: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})

export class CarouselComponent implements AfterViewInit {
  @Output() dataEvent = new EventEmitter<any>();

  @Input() imageList: string[] | undefined;
  @Input() isPost: boolean = false;
  isImageLoading: boolean = false;
  currentImagePos: number = 0;
  currentDragImage: number = 0;
  startDragPos: number = 0;
  distanNumber: number = 0;
  distanceString: string = '0px';
  limitDrag: number = 0;

  widthListImage: number = 0;
  widthContain: number = 0;

  constructor(
    public shareInfor: ShareDataService,
    private _elementRef: ElementRef,
    private uploadFile: FileUpLoadService
  ) {
  }

  ngOnInit(): void {
    this.shareInfor.setImageSlideValue([]);

  }

  ngAfterViewInit(): void {
    console.log("carousel",this.imageList);

    this.setLimitDrag();

  }

  setLimitDrag() {
    this.shareInfor.getImageSlideValueAsTracking()
      .subscribe(
        respone => {
          this.widthContain = this._elementRef.nativeElement.querySelector('#imageThumnailContain').offsetWidth;
          this.widthListImage = respone.length * 120 + 10;
          if (this.widthListImage > this.widthContain) {
            this.limitDrag = this.widthListImage - this.widthContain;
            return;
          }
          this.limitDrag = 0;
        }
      )
  }

  addImage1(e: any) {
    console.log("POS-A", this.currentImagePos)
    this.isImageLoading = true;
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageList?.push(url);

      this.dataEvent.emit(url);
      this.isImageLoading = false
      console.log(this.imageList)

    });
  }

  changeImage(e: any) {
    this.isImageLoading = true;
    console.log("POS-C",this.currentImagePos)
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageList![this.currentImagePos] = url;
      this.dataEvent.emit(url);
      this.isImageLoading = false
      console.log(this.imageList)

    });
  }

  previousImage() {
    this.setLimitDrag();
    if (this.currentImagePos - 1 < 0) {
      this.currentImagePos = this.imageList!.length - 1;
      this.distanNumber = -(this.limitDrag + 110)
      this.distanceString = (this.distanNumber).toString() + 'px';
    } else {
      this.currentImagePos -= 1;
    }
    const widthOfCurrentImagePos = (this.currentImagePos + 1) * 120;
    if (widthOfCurrentImagePos + this.distanNumber < this.widthContain) {
      if (this.distanNumber + 110 >= 0) {
        this.distanNumber = 0
        this.distanceString = (this.distanNumber).toString() + 'px';
        return
      }
      this.distanceString = (this.distanNumber + 110).toString() + 'px';
      this.distanNumber += 110;
    }
  }

  deleteImage(i: number) {
    this.currentImagePos = 0;
    this.imageList?.splice(i, 1);
    this.distanNumber = 0;
    this.distanceString = (this.distanNumber).toString() + 'px';
    this.setLimitDrag();
  }

  forwardImage() {
    this.setLimitDrag();
    if (this.currentImagePos + 1 > this.imageList!.length - 1) {
      this.currentImagePos = 0;
      this.distanNumber = 0
      this.distanceString = (this.distanNumber).toString() + 'px';
      return;
    } else {
      this.currentImagePos += 1;
    }

    const widthOfCurrentImagePos = (this.currentImagePos + 1) * 120;
    if (widthOfCurrentImagePos + this.distanNumber > this.widthContain) {
      if (this.distanNumber - 110 <= -this.limitDrag) {
        this.distanNumber = -this.limitDrag
        this.distanceString = (this.distanNumber).toString() + 'px';
        return
      }
      this.distanceString = (this.distanNumber - 110).toString() + 'px';
      this.distanNumber -= 110;
    }
  }


  moveImages(e: any) {

    const movedDistance = this.startDragPos - Number(e.clientX);
    const leftPos = this.distanNumber - movedDistance;
    if (leftPos <= -this.limitDrag || leftPos > 0) {
      return;
    }
    this.distanceString = leftPos.toString() + 'px';
  }

  endDrag(e: any) {
    this.distanNumber = Number(this.distanceString.replace('px', ''));

  }

  getFirstPos(e: any) {
    this.startDragPos = Number(e.clientX);

  }

  chooseImage(pos: number) {

    this.currentImagePos = pos;

  }

}
