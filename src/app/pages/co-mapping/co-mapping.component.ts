import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PO_CODE, PSO_CODE } from 'src/app/models/constants';
import { Course } from 'src/app/models/course';
import { CourseOutcomes } from 'src/app/models/course-outcomes';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-co-mapping',
  templateUrl: './co-mapping.component.html',
  styleUrls: ['./co-mapping.component.css']
})
export class CoMappingComponent implements OnInit {

  coMappingForm: FormGroup;

  selectedCourse: Course;
  selectedCourseCOS: CourseOutcomes[] = [];
  selectedCourseCOCodes: string[] = [];

  poCodes: string[] = [];
  psoCodes: string[] = [];

  selectedPO: any;
  enableSelects: boolean = false;

  selectOptions: any[] = [
    { name: '-', selectedValue: -1 },
    { name: '1', selectedValue: -1 },
    { name: '2', selectedValue: -1 },
    { name: '3', selectedValue: -1 }
  ];

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private dataService: DataService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.poCodes = [...PO_CODE];
    this.psoCodes = [...PSO_CODE];
  }

  getCourses(course: Course) {
    this.selectedCourse = course;
    this.httpClient.get<{ coursesCO: CourseOutcomes[] }>(
      `${environment.serverUrl}/course-outcomes/${this.selectedCourse._id}/theory-cos`,
      { headers: this.dataService.httpHeaders }
    ).toPromise()
    .then((res) => {
      this.selectedCourseCOS = res.coursesCO.map(e => e);
      this.selectedCourseCOCodes = res.coursesCO.map(e => e.coCode?.toUpperCase() || "");
      this.initialiseFormGroup();      
      this.getPOMap();
    }, (error) => { });
  }
  
  getPOMap() {
    if(this.selectedCourse.poMapId === null) return;
    this.httpClient.get<{ poMap: any }>(
      `${environment.serverUrl}/co_po_mapping/${this.selectedCourse._id}/get-po-map/${this.selectedCourse.poMapId}`,
      { headers: this.dataService.httpHeaders }
    ).toPromise()
    .then((res) => {
      this.selectedPO = res.poMap;
      this.reInitialiseForm();
    }, (error) => { });
  }

  reInitialiseForm() {
    let poKeys = Object.keys(this.selectedPO).filter(x => RegExp(/[PO]/g).test(x));
    poKeys.forEach((poKey, idx) => {
      Object.entries(this.selectedPO[poKey]).forEach(([code, mappingStrength], idx: number) => {
        this.addPOFormGroup(code, poKey, mappingStrength);
      })
    });
  }
  
  initialiseFormGroup(){
    this.coMappingForm = this.fb.group({
      _id: [this.selectedCourse.poMapId || ""],
      curriculumId: [this.selectedCourse.curriculumId],
      curriculumName: [this.selectedCourse.curriculumName],
      termId: [this.selectedCourse.termId],
      termName: [this.selectedCourse.termName],
      termNo: [this.selectedCourse.termNo],
      courseTitle: [this.selectedCourse.courseTitle],
      courseCode: [this.selectedCourse.courseCode],
      courseId: [this.selectedCourse._id],
    });   
  }

  addPOFormGroup(coCode: string, poCode: string, event: any) {
    let strengthValue = Number(event || event.target.value)
    if(this.coMappingForm.contains(poCode)) {
      let coFormGroup: FormGroup = this.coMappingForm.get(poCode) as FormGroup;
      if(coFormGroup.get(coCode) === null) {
        coFormGroup.addControl(coCode, this.fb.control(strengthValue));
      } else {
        if(strengthValue === 0) {
          coFormGroup.removeControl(coCode);
          if(Object.keys(coFormGroup.controls).length === 0) this.coMappingForm.removeControl(poCode);
        } else {
          coFormGroup.patchValue({ [coCode]: strengthValue });
        }
      }     
    } else {
      this.coMappingForm.addControl(poCode, this.fb.group({
        [coCode]: [strengthValue]
      }));
    }
  }

  onOptionSelected(coCode: string, poCode: string) {
    let coFormGroup: FormGroup = this.coMappingForm.get(poCode) as FormGroup;
    return coFormGroup?.get(coCode) === null || coFormGroup === null ? 0 : coFormGroup.get(coCode)?.value || 0;
  }

  saveCOPOMapping() {
    let values = { ...this.coMappingForm.value };
    this.httpClient.post(
      `${environment.serverUrl}/co_po_mapping/add`,
      { ...values },
      { headers: this.dataService.httpHeaders }
    ).toPromise()
    .then((value) => {
      this.enableSelects = false;
      this.toast.success("Co PO Mapping Save Successfully", "Success");
    }, (error) => {
      console.log(error);
      this.toast.warning("Something Went Wrong!! Please Try Again", "Error");
    })
  }

}
