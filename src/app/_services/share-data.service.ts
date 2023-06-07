import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  imageSlides: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  getImageSlideValue(): string[]{
    return this.imageSlides.getValue();
  }

  getImageSlideValueAsTracking(): Observable<string[]>{
    return this.imageSlides.asObservable();
  }

  setImageSlideValue(value: string[]){
    this.imageSlides.next(value);
  }

  deleteImageByPos(pos: number){
    const currentImages = this.getImageSlideValue();
    console.log(currentImages)
    currentImages.splice(pos,1);
    this.setImageSlideValue(currentImages);
  }


  addImageToSlide(value: string){
    const currentImages = this.getImageSlideValue();
    currentImages.unshift(value);
    this.setImageSlideValue(currentImages);
  }


  constructor() { }
}
