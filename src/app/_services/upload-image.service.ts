import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {finalize, map, Observable, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {


  constructor(
    private storage: AngularFireStorage,
    ) { }

  upload(file: any): Observable<string> {
    const filePath = `images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    console.log(fileRef.getDownloadURL())
     return fileRef.getDownloadURL();
    //task.snapshotChanges().pipe(
    //   switchMap(() => {
    //     console.log("dwadaw",fileRef.getDownloadURL())
    //     return fileRef.getDownloadURL()
    //   }),
    //   map((url: string) => {
    //     console.log("url", url);
    //     return url;
    //   })
    // );
  }


}
