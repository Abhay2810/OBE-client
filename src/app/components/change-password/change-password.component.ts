import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @Input() public oldPasswordBool: boolean;
  @Input() public foundedUserId: string;

  user: User;

  changePasswordForm!: FormGroup;
  loader: boolean = false;

  urls: any = {
    0: `${environment.serverUrl}/auth/forgot-password`,
    1: `${environment.serverUrl}/users/change-password`
  }

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private toast: ToastrService,
    private cookieService: CookieService,
    private router: Router
  ) { 
    this.user = JSON.parse(localStorage.getItem('user') || "{}") as User;
  }

  ngOnInit(): void {
    console.log(this.foundedUserId);
    
    this.initialisedFormGroup();
  }

  initialisedFormGroup() {
    this.changePasswordForm = this.fb.group({
      oldPassword: [this.oldPasswordBool ? null : '\0', Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      _id: [this.oldPasswordBool ? this.user._id : this.foundedUserId]
    })
  }

  userChangePassword() {
    this.loader = true;
    let values = Object.assign({}, this.changePasswordForm?.value);

    if(this.changePasswordForm.invalid) {
      this.loader = false;
      this.toast.warning("All fields are required");
      return;
    }

    if(values.newPassword !== values.confirmPassword) {
      this.loader = false;
      this.toast.warning("New Password and Confirm Password doesn't matched");
      return;
    }
    
    this.httpClient.put(this.urls[Number(this.oldPasswordBool)], values)
      .toPromise()
      .then((value) => {
        this.loader = false;
        this.toast.success(`Password ${this.oldPasswordBool ? 'Changed' : 'Reset'} Successfully`, "");
        this.cookieService.deleteAll();
        localStorage.clear();
        this.router.navigate(['/login'], { replaceUrl: true });
      }, (error) => {
        this.loader = false;
        this.toast.error(error.error.error, "Error");
      });
  }
}
