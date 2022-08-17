import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { AssessmentsComponent } from 'src/app/pages/assessments/assessments.component';
import { AttainmentComponent } from 'src/app/sub-layouts/attainment/attainment.component';
import { CurriculumComponent } from 'src/app/sub-layouts/curriculum/curriculum.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'faculty', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'assessments', component: AssessmentsComponent, canActivate: [AuthGuard] },
  {
    path: 'curriculum',
    component: CurriculumComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./../../sub-layouts/curriculum/curriculum.module').then(e => e.CurriculumModule)
      }
    ]
  },
  {
    path: 'attainment',
    component: AttainmentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./../../sub-layouts/attainment/attainment.module').then(e => e.AttainmentModule)
      }
    ]
  },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: UserProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
