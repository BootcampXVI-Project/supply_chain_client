import { HttpRequest } from '@angular/common/http';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';
import {UserService} from "../../../_services/user.service";

@Component({
  selector: 'app-index-navbar',
  templateUrl: './index-navbar.component.html',
  styleUrls: ['./index-navbar.component.scss'],
})
export class IndexNavbarComponent implements OnInit {
  rememberMe: boolean = false;
  req: HttpRequest<any> | undefined;
  phoneNumber: any;
  password: any;
  loginForm!: FormGroup;
  submitted = false;
  show = false;
  user: any;
  loggedIn: any;
  loading: boolean = false;
  get f() {
    return this.loginForm.controls;
  }

  @ViewChild('dialog') myDialog: ElementRef | undefined;

  @Output() newOpenTab = new EventEmitter<number>();
  stateOpenTab(value: number) {
    this.newOpenTab.emit(value);
  }

  openDialogLogin: boolean = true;
  openLogin() {
    this.openDialogLogin = false;
  }
  close() {
    this.openDialogLogin = true;
    this.myDialog?.nativeElement.close();
  }
  save() {
    this.openDialogLogin = true;
    this.myDialog?.nativeElement.close();
  }
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: Router,
    private userService: UserService
  ) {
    if (this.auth.getToken()) {
      if (this.auth.getTokenRole().toLowerCase() == 'supplier') {
        this.route.navigate(['/supplier']);
      }
      if (this.auth.getTokenRole().toLowerCase() == 'manufacturer') {
        this.route.navigate(['/manufacturer']);
      }
    }
  }

  ngOnInit(): void {
    this.password = 'password';

    this.loginForm = this.fb.group({
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15),
          Validators.pattern(/^\+?\d+$/), // Chỉ chấp nhận các chữ số và ký tự '+'
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
    });
  }

  login() {
    this.loading = true;
    let phoneNumber = this.loginForm?.get('phoneNumber')?.value;
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "+84" + phoneNumber.substring(1)
    }
    const password = this.loginForm?.get('password')?.value;
    // console.log(phoneNumber, password);

    this.auth.login({phoneNumber, password}).subscribe(
      (response: any) => {
        // console.log(response);
        // let routeGo = response?.userType
        // console.log(JSON.parse(response).data.userType);
        this.loading = false;
        console.log("login",response)
        const user = response
        this.auth.getTokenInformation()
        console.log("LOGIN",{
          id: this.auth.getTokenId(),
          name: this.auth.getTokenName(),
          phone: this.auth.getTokenPhoneNumber(),
          role: this.auth.getTokenRole(),
        })
        AlertService.setAlertModel('success', 'Login successfully');
        if (user.role.toLowerCase() === "supplier"){
          this.route.navigate(['/supplier']);
        } else if (user.role.toLowerCase()=== "manufacturer") {
          this.route.navigate(['/manufacturer'])
        } else if (user.role.toLowerCase()=== "consumer") {
          this.route.navigate(['/consumer'])
        }
        else {
          this.route.navigate([JSON.parse(response).role]);

        }

        // this.toast.success({detail: "Welcome you !", summary:response.message, duration: 5000})
      },
      (err) => {
        console.log(err);

        this.loading = false;

        // AlertService.setAlertModel('error',err.error.message)
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log('error');
      return;
    }

    this.login();
  }
}
