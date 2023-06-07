import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {API_URL} from "../../assets/API_URL";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUpLoadService {

  constructor(private http: HttpClient) { }
  convertFileToUrl(file: File): Observable<any>{
    const formData = new FormData();
    formData.append('formFile', file, file.name);
    return this.http.post("https://eldgmvfrnesrtwj6ichcffk2hu0ggzcq.lambda-url.ap-east-1.on.aws/api/Image/convertFileImageToUrl", formData, {responseType: 'text'});
  }
}
