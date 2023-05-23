import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/assets/API_URL';
import { catchError, map, of, tap } from 'rxjs';
import { AlertService } from './alert.service';

HttpClient;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(phoneNumber: any, password: any) {
    const body = {
      phoneNumber: phoneNumber,
      password: password,
    };
    console.log(body);

    return this.http
      .post(API_URL.LOGIN(), body, {
        responseType: 'text',
        // withCredentials: true,
      })
      .pipe(
        tap((response) => {
          // this.storage.setToken(response);
          // this.setUserProfileByToken(response);
          console.log('ok');

          return true;
        }),
        catchError((error) => {
          console.log(error);
          const errorObject = JSON.parse(error.error);
          const errorMessage = errorObject.detail;
          AlertService.setAlertModel('danger', errorMessage);
          // error.this.toast.error({
          //   detail: 'Error Message',
          //   summary: ' Please check your phoneNumber or password again!',
          //   duration: 5000,
          // });

          return of(false);
        })
      );
  }
}
