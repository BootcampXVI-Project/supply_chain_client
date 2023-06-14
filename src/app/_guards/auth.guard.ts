import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from "../_services/auth.service";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {



    const requiredRoles = route.data['requiredRole'];
    return this.authService.currentUser.pipe(
      map(user => {
        const token: any = user
        if (token.data.token) {
          const payloadBase64 = token.data.token.split('.')[1];
          const payloadJson = atob(payloadBase64);
          const payloadObject = JSON.parse(payloadJson);
          const role = payloadObject['role']
          if (requiredRoles) {
            const requiredRoleList = requiredRoles.split(",")

            if (requiredRoleList.includes(role)) {
              return true;
            }
            else {
              if (role == "supplier")
                this.router.navigate(['/supplier'])
              // if (role == "user")
              //   this.router.navigate(['/dashboard-user'])
              return false;
            }
          }
          return true
          // logged in so return true
        }
        else {
          this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
          location.reload()
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
        return of(false);
      })
    );
  }
}
