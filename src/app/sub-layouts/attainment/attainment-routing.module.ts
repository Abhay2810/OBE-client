import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AttainmentGapComponent } from 'src/app/pages/attainment-gap/attainment-gap.component';
import { CoAttainmentComponent } from 'src/app/pages/co-attainment/co-attainment.component';
import { ImportSurveyResponseComponent } from 'src/app/pages/import-survey-response/import-survey-response.component';
import { ImportsMarksComponent } from 'src/app/pages/imports-marks/imports-marks.component';
import { PoAttainmentComponent } from 'src/app/pages/po-attainment/po-attainment.component';

const routes: Routes = [
  { path: '', redirectTo: 'import-cia-marks' },  // For Internal Assessment
  { path: 'import-cia-marks', component: ImportsMarksComponent, pathMatch: 'full', canActivate: [AuthGuard] },  // For Internal Assessment
  { path: 'import-tee-marks', component: ImportsMarksComponent, pathMatch: 'full', canActivate: [AuthGuard] },  // For External Assessment
  { path: 'import-survey-response', component: ImportSurveyResponseComponent, pathMatch: 'full', canActivate: [AuthGuard] },  // For External Assessment
  { path: 'co-attainment', component: CoAttainmentComponent, pathMatch: 'full', canActivate: [AuthGuard] },     // For CO Attainemt [Direct + Indirect]
  { path: 'po-attainment', component: PoAttainmentComponent, pathMatch: 'full', canActivate: [AuthGuard] },     // For PO Attainemt <=> CO Attainment
  { path: 'attainment-gap', component: AttainmentGapComponent, pathMatch: 'full', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AttainmentRoutingModule { }
