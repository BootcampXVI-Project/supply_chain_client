import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {API_URL} from 'src/assets/API_URL';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {LoginUser, UserToken} from "../models/user-model";

HttpClient;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });


  private currentUserSubject: BehaviorSubject<UserToken>;
  public currentUser: Observable<UserToken>;
  public user: UserToken = {

  };

  roleToken?: string;
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}


  constructor(
    private http: HttpClient,
    // private userService: UserService
  ) {
    const currentUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<UserToken>(currentUser ? JSON.parse(currentUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public  currentUserValueBehaviorSubject(): BehaviorSubject<UserToken> {
    return this.currentUserSubject;
  }
  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }

  public get currentUserValue(): UserToken {
    return this.currentUserSubject.value;
  }

  login(loginUser: LoginUser): Observable<any> {
    return this.http
      .post(API_URL.LOGIN(), loginUser, {
        responseType: 'text',
        headers: this.headers
      })
      .pipe(map((response: any) => {
        let userInfo = new UserToken();
        const user = JSON.parse(response);
        if (user.data.user && user.data.token) {
          userInfo.username = user.data.user.userName;
          userInfo.phoneNumber = user.data.user.phoneNumber;
          userInfo.role = this.parseTokenToRole(user.data.token)
          // userInfo.role = user.data.user.role
          userInfo.token = user.data.token;
          userInfo.userId = user.data.user.userId;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.loggedIn.next(true);
          return userInfo;
        } else {
          throw new Error("Login failed");
        }
      }),catchError((error: HttpErrorResponse) => {
        console.log("Debug ", error.message)
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
        }
        return throwError(() => new Error(errorMessage))
      }));
  }

  parseTokenToRole(token: string): string{
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payloadObject = JSON.parse(payloadJson);
    return payloadObject['role'];
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new UserToken());
    this.loggedIn.next(false);
  }

  getTokenInformation() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const data: any = JSON.parse(currentUser)
      const token = data?.data.token
      if (token) {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        return JSON.parse(payloadJson)
      }
    }


  }

  setHeader() {
    const token = this.getToken()
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getToken() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const data: any = JSON.parse(currentUser)
      return data?.data.token
    }
  }
  getTokenId() {
    return this.getTokenInformation()['userId']
  }

  getTokenRole() {
    return this.getTokenInformation()['role']
  }

  getTokenName() {
    return this.getTokenInformation()['userName']
  }

  getTokenPhoneNumber() {
    return this.getTokenInformation()['phoneNumber']
  }


  encode(id: string) {
    const maxNumber = 99; // Maximum number that can be generated
    const minNumber = 10; // Minimum number that can be generated

    // Split the ID string into two parts of equal length
    const halfLength = Math.ceil(id.length / 2);
    const firstHalf = id.substring(0, halfLength);
    const secondHalf = id.substring(halfLength);

    // Generate two random numbers between 10 and 99
    const randomNumber1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    const randomNumber2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

    // Calculate the sum of the two random numbers
    const sum = randomNumber1 + randomNumber2;

    // Construct the encoded string
    let encodedString = `${randomNumber1}-${firstHalf}-${randomNumber2}-${secondHalf}-${sum}`;
    encodedString = btoa(encodedString)
    return encodedString;
  }

  decode(encodedString: string) {
    encodedString = atob(encodedString)
    const randomNumber1 = Number(encodedString.split("-")[0]);
    const firstHalf = encodedString.split("-")[1];
    const randomNumber2 = Number(encodedString.split("-")[2]);
    const secondHalf = encodedString.split("-")[3];
    const sum = Number(encodedString.split("-")[4]);

    const id = `${firstHalf}${secondHalf}`;

    // Verify that the sum is equal to the sum of the two random numbers
    if (sum !== randomNumber1 + randomNumber2) {
      throw new Error("Invalid encoded string: sum mismatch");
    }

    return id;
  }

  // login(phoneNumber: any, password: any) {
  //   const body = {
  //     phoneNumber: phoneNumber,
  //     password: password,
  //   };
  //   console.log(body);
  //
  //   return this.http
  //     .post(API_URL.LOGIN(), body, {
  //       responseType: 'text',
  //       // withCredentials: true,
  //     })
  //     .pipe(
  //       tap((response) => {
  //         // this.storage.setToken(response);
  //         // this.setUserProfileByToken(response);
  //         this.userService.setUser(JSON.parse(response).data)
  //         console.log('ok');
  //
  //         return true;
  //       }),
  //       catchError((error) => {
  //         console.log(error);
  //         const errorObject = JSON.parse(error.error);
  //         const errorMessage = errorObject.detail;
  //         AlertService.setAlertModel('danger', errorMessage);
  //         // error.this.toast.error({
  //         //   detail: 'Error Message',
  //         //   summary: ' Please check your phoneNumber or password again!',
  //         //   duration: 5000,
  //         // });
  //
  //         return of(false);
  //       })
  //     );
  // }
}
