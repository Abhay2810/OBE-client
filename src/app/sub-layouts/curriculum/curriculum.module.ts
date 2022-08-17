import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurriculumRoutingModule } from './curriculum-routing.module';
import { CoursesComponent } from '../../pages/courses/courses.component';
import { CoMappingComponent } from '../../pages/co-mapping/co-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseOutcomeComponent } from '../../pages/course-outcome/course-outcome.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/components/components.module';
import { BatchesComponent } from '../../pages/batches/batches.component';


@NgModule({
  declarations: [
    CoursesComponent,
    CoMappingComponent,
    CourseOutcomeComponent,
    BatchesComponent
  ],
  imports: [
    CommonModule,
    CurriculumRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    NgbModule
  ]
})
export class CurriculumModule { }
