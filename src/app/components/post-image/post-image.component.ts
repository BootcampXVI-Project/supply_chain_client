import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ShareDataService} from "../../_services/share-data.service";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {finalize} from "rxjs";
import {UploadImageService} from "../../_services/upload-image.service";
import {FileUpLoadService} from "../../_services/file-up-load.service";

@Component({
  selector: 'app-post-image',
  templateUrl: './post-image.component.html',
  styleUrls: ['./post-image.component.scss']
})
export class PostImageComponent implements  OnInit {
  @Output() dataEvent = new EventEmitter<any>();

  @Input() isPost: boolean = true;
  isImageLoading: boolean = false;
  currentImagePos: number = 0;
  currentDragImage: number = 0;
  startDragPos: number = 0;
  distanNumber: number = 0;
  distanceString: string = '0px';
  limitDrag: number = 0;
  imageList: string[] = []

  widthListImage: number = 0;
  widthContain: number = 0;


  constructor(
    private _elementRef : ElementRef,
    private storage: AngularFireStorage,
    private uploadImageService: UploadImageService,
    private uploadFile: FileUpLoadService
    /*private fileService: FileUploadService*/) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.setLimitDrag();

  }

  setLimitDrag(){

  }

  ngOnChange() {

  }

  addImage(e: any) {
    console.log("POS-P", this.currentImagePos)
    this.isImageLoading = true;
    this.uploadFile.convertFileToUrl(e.target.files[0]).subscribe((url: string) => {
      this.imageList.push(url);

      this.dataEvent.emit(url);
      this.isImageLoading = false
      console.log(this.imageList)

    });
    // this.uploadImageService.upload(e.target.files[0]).subscribe((url: string) => {
    //   this.imageList.push(url);
    //   console.log(this.imageList)
    //
    // });

  }



  previousImage(){
    this.setLimitDrag();
    if(this.currentImagePos - 1 < 0){
      this.currentImagePos = this.imageList.length - 1;
      this.distanNumber = -(this.limitDrag+110)
      this.distanceString = (this.distanNumber).toString() + 'px';
    }
    else{
      this.currentImagePos -= 1;
    }
    const widthOfCurrentImagePos = (this.currentImagePos+1) * 120;
    if(widthOfCurrentImagePos + this.distanNumber  < this.widthContain ){
      if(this.distanNumber + 110 >= 0){
        this.distanNumber = 0
        this.distanceString = (this.distanNumber).toString() + 'px';
        return
      }
      this.distanceString = (this.distanNumber +110).toString() + 'px';
      this.distanNumber += 110;
    }
  }

  deleteImage(i: number){
    console.log(this.imageList[i])
    this.currentImagePos = 0;
    this.imageList.splice(i, 1);
    this.distanNumber = 0;
    this.distanceString = (this.distanNumber).toString() + 'px';
    this.setLimitDrag();
  }

  afterImage(){
    this.setLimitDrag();
    if(this.currentImagePos+1 > this.imageList.length-1){
      this.currentImagePos = 0;
      this.distanNumber = 0
      this.distanceString = (this.distanNumber).toString() + 'px';
      return;
    }
    else {
      this.currentImagePos += 1;
    }

    const widthOfCurrentImagePos = (this.currentImagePos+1) * 120;
    if(widthOfCurrentImagePos + this.distanNumber  > this.widthContain ){
      if(this.distanNumber - 110 <= -this.limitDrag){
        this.distanNumber = -this.limitDrag
        this.distanceString = (this.distanNumber).toString() + 'px';
        return
      }
      this.distanceString = (this.distanNumber -110).toString() + 'px';
      this.distanNumber -= 110;
    }
  }


  moveImages(e: any){

    const movedDistance = this.startDragPos - Number(e.clientX);
    const leftPos =  this.distanNumber - movedDistance;
    if(leftPos <= -this.limitDrag ||  leftPos > 0){
      return;
    }
    this.distanceString = leftPos.toString() + 'px';
  }

  endDrag(e:any){
    this.distanNumber =Number(this.distanceString.replace('px',''));

  }
  getFirstPos(e:any){
    this.startDragPos = Number(e.clientX);

  }
  chooseImage(pos: number){

    this.currentImagePos = pos;

  }

}
