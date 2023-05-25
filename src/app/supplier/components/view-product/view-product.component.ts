import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ViewProductService} from './view-product.service'
import {AngularFireStorage} from "@angular/fire/compat/storage";

class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit{
  @ViewChild('dialog') myDialog: ElementRef | undefined;
  products: any
  product: any
  productId: string = ""
  data: any
  showEditModal: boolean = false
  selectedImageFile?: ImageSnippet

  openDialog: boolean = false

  open(productId: string) {
    this.productId = productId
    this.openDialog = true
  }
  close() {

    this.openDialog = false
    this.myDialog?.nativeElement.close();
  }
  constructor(private storage: AngularFireStorage,private viewProductService: ViewProductService) {
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(){
    this.viewProductService.getAllProduct().subscribe({
      next: (response) => {
        this.data = response;
        this.products = this.data.data;
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  processImageFile(avatar: any) {
    const file: File = avatar.files[0]
    const reader = new FileReader()
    reader.addEventListener('load', (evt: any) => {
      this.selectedImageFile = new ImageSnippet(evt.target.result, file)
      this.product.image = this.selectedImageFile.src

      console.log(this.product.image)
    })
    reader.readAsDataURL(file)
    // this.imageChange = true
  }
  onEditExercise(productId: any) {
    console.log("Edit",productId)
    // if (!this.accessToken) return;
    this.showEditModal = true;
    this.viewProductService.getProduct(productId).subscribe({
      next: (response) => {
        this.data = response;
        this.product = this.data.data;
    }
    });



    // this.exerciseService.getExercise(productId).subscribe({
    //   next: (response) => {
    //     this.updateExercise = response
    //   },
    //   error: (err) => {
    //     console.error(err)
    //   },
    // })
  }
}
