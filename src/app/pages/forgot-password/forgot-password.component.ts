import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  loader: boolean = false;
  showResetPasswordCard: boolean = false;

  emailFormGroup!: FormGroup;
  foundUserId: string;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialiseFormGroup();
  }

  initialiseFormGroup() {
    this.emailFormGroup = this.fb.group({
      email: [null, Validators.required]
    })
  }

  verifyEmail() {
    if(this.emailFormGroup.invalid) {
      this.toast.warning("Please enter email address");
      return;
    }

    this.loader = true;
    let values = Object.assign({}, this.emailFormGroup.value);
    this.httpClient.post<any>(`${environment.serverUrl}/auth/verify-email`, values)
      .toPromise()
      .then((value) => {
        this.foundUserId = value['_id'];
        this.loader = false;
        this.showResetPasswordCard = true;
        this.toast.success("Email Verified Succuessfully");
      }, (error) => {
        console.log(error);
        
        this.loader = false
        this.toast.warning(error.error.message, "Failed", { tapToDismiss: true, timeOut: 3000 });
      })
  }

}
