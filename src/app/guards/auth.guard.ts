import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private toast: ToastrService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {    
    if(this.cookieService.check("accessToken")) {
      return true;
    }

    if(JSON.parse(localStorage.getItem('user') || '{}')._id !== undefined) {
      this.toast.warning("Session Timeout", "", { timeOut: 6000, tapToDismiss: true })
      this.cookieService.deleteAll();
      localStorage.clear();
    } 
    
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

}
