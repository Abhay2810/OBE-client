import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DEPARTMENTS, ROLES, TITLES } from 'src/app/models/constants';
import { Curriculum } from 'src/app/models/curriculum';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userForm: FormGroup | undefined;
  userList: User[] = [];

  titles: any[] = [];
  departments: any[] = [];
  designations: any[] = [];

  fetchingLoader: boolean = false;
  loader: boolean = false;
  updation: boolean = false;
  showPassword: boolean = false;

  datePipe: DatePipe = new DatePipe('en');
  batchesSub: Subscription;
  batches: Curriculum[] = [];

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.titles = TITLES;
    this.departments = DEPARTMENTS;
    this.designations = ROLES

    this.fetchingLoader = true;
    this.httpClient.post<{ response: User[], date: Date }>(`${environment.serverUrl}/users`, {
      superAdmin: this.dataService.userModel.superAdmin,
      deptName: this.dataService.userModel.department,
      userId: this.dataService.userModel._id
    })
      .toPromise()
      .then((value) => {
        // console.log(">>> Users: ", value.response);
        this.fetchingLoader = false;
        this.userList = [...value.response];
      }, (error) => {
        // console.log(">>> error: ", error);        
        this.fetchingLoader = false;
        this.toast.warning("Something went wrong while fetching data from server...")
      })

    this.getCurriculumns();
  }

  getCurriculumns() {
    this.dataService.getCurriculums();
    this.batchesSub = this.dataService.curriculumsSub.subscribe((list) => {
      if(list.length !== 0) {
        this.batches = list;
      }
    });
  }

  initialisedForm(userObj?: User | undefined): void {
    if (userObj === undefined) this.updation = false; else this.updation = true;
    this.userForm = this.fb.group({
      _id: [userObj?._id || null],
      title: [userObj?.title || null],
      firstName: [userObj?.firstName || null],
      lastName: [userObj?.lastName || null],
      email: [userObj?.email || null],
      password: [userObj?.password || Math.random().toString(20).substr(2, 12)],
      department: [userObj?.department || this.dataService.userModel.department],
      designation: [userObj?.designation || null],
      mobile: [userObj?.mobile || null],
      dateOfJoining: [this.datePipe.transform(userObj?.dateOfJoining, 'yyyy-MM-dd') || null],
      dob: [this.datePipe.transform(userObj?.dob, 'yyyy-MM-dd') || null],
      curriculums: this.fb.array(userObj?.curriculums.map(e => this.fb.control(e)) || []),
      gender: [userObj?.gender || null],
      createdAt: [userObj?.createdAt || null],
      updatedAt: [userObj?.updatedAt || null],
    });
  }

  getControls() {
    return this.userForm?.get("curriculums") as FormArray;
  }

  selectCurriculum(checked: boolean, curriculumId: string) {
    if(checked) {
      // Added to Curriculum Array
      this.getControls().push(this.fb.control(curriculumId));
    } else {
      // Remove From the Array
      let idx = this.getControls().controls.findIndex(e => e.value === curriculumId);
      this.getControls().removeAt(idx);
    }
  }

  openUserModal(modalRef: any, assessmentObj?: User | undefined) {
    this.initialisedForm(assessmentObj);
    this.modalService.open(modalRef, {
      // size: 'sm',
      keyboard: false,
      backdrop: 'static'
    });
  }

  openAssignModal(modalRef: any, userObj: any) {
    this.initialisedForm(userObj);
    this.updation = true;
    this.modalService.open(modalRef);
  }

  onChecked(curriculumId: string) {
    return this.getControls().controls.some(x => x.value === curriculumId);
  }

  changePasswordFieldMode = () => this.showPassword = !this.showPassword;
  geneateNewPassword = () => this.userForm?.patchValue({ password: Math.random().toString(20).substr(2, 12) });

  submitForm(form: FormGroup) {
    this.loader = true;
    let userObj: User = { ...form.value };
  
    if (!this.updation) {
      this.httpClient.post<{ res: User, error: any }>(`${environment.serverUrl}/users/add-user`, { ...userObj })
        .toPromise()
        .then((value) => {
          // console.log(":>>> Value: ", value);
          this.loader = false;
          this.modalService.dismissAll();
          this.toast.success("Faculty Added Successfully")

          this.userList.push({ ...value.res });
        }, (err) => {
          // console.log(">>> err: ", err);
          this.loader = false;
          this.toast.error(err.error.message);
        });
    } else {
      this.httpClient.put<{ response: User }>(`${environment.serverUrl}/users/update-user/${userObj._id}`, { ...userObj })
        .toPromise()
        .then((value) => {
          // console.log(":>>> Value: ", value);
          this.loader = false;
          this.modalService.dismissAll();
          this.toast.success("Faculty Updated Successfully")

          let idx = this.userList.findIndex(x => x._id === userObj._id);
          this.userList[idx] = { ...value.response };
        }, (err) => {
          // console.log(">>> err: ", err);
          this.loader = false;
          this.toast.error(err.error.message);
        });
    }
  }

  deleteUser(modalRef: any, id: any) {
    this.modalService.open(modalRef).result.then((value) => {
      this.httpClient.delete(`${environment.serverUrl}/users/delete-user/${id}`)
      .toPromise()
      .then((value) => {
        this.toast.success("Course Outcome Deleted");
        let idx = this.userList.findIndex(x => x._id === id);
        this.userList.splice(idx, 1);
      }, (err) => {
        // console.log(">>> error", err);
      });
      
    }, (err) => {
      console.log(">>> error: ", err);
      
    })
  }

}
