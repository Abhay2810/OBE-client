import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators'; 

@Injectable()
export class HttpRequestsInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private toast: ToastrService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest: HttpRequest<any> = request.clone({
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Credentials': 'true'
      }),
      withCredentials: true
    });
    return next.handle(newRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.router.navigate(['/login'], { replaceUrl: true });
          this.toast.warning("Session Expired", "", { timeOut: 6000, tapToDismiss: true })
          return throwError('Unauthorized');
        }
        return throwError(error);
      }) 
    );
  }
}
