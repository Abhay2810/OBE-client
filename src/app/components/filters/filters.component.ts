import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Course } from 'src/app/models/course';
import { Curriculum } from 'src/app/models/curriculum';
import { Term } from 'src/app/models/term';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  curriculums: Curriculum[] | undefined = [];
  terms: Term[] | undefined = [];
  courses: Course[] = [];
  tempCourses: Course[] = [];

  selectedCurriculum: Curriculum | null = null;
  selectedTerm: Term | null = null;
  selectedCourse: Course | null = null;

  listSub: Subscription | undefined;

  @Output() courseSelections: EventEmitter<Course> = new EventEmitter<Course>();
  
  constructor(
    private dataService: DataService,
    private httpClient : HttpClient
  ) { }

  async ngOnInit() { 

    // this.dataService.getCourses();
    this.dataService.getCurriculums();
    this.listSub = await combineLatest([this.dataService.curriculumsSub, this.dataService.coursessSub])
      .subscribe(([curriculums, courses]) => {
        if (curriculums.length !== 0) this.curriculums = curriculums;
        if (courses.length !== 0) this.tempCourses = courses;
      });
  }

  curriculumSelection(value: Curriculum) {
    this.selectedCurriculum = value;
    this.terms = value?.terms || [];
  }

  termselection(value: Term) {
    this.selectedTerm = value;
    this.httpClient.get<{ courses: Course[] }>(`${environment.serverUrl}/courses/${this.selectedCurriculum?._id}/${value._id}`)
    .toPromise()
    .then((res) => {
      this.courses = [...res.courses];
      console.log(this.courses);
      
    }, (err) => {
      console.log(err);
      
    })
    // this.courses = this.tempCourses.filter(x => x.curriculumId === this.selectedCurriculum?._id && x.termId === value._id) || [];
  }

  courseSelection(value: Course) {
    this.courseSelections.emit(value);
  }

}
