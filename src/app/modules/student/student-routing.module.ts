import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CONFIG } from 'src/app/common/config';
import { getAllRoutes, ROUTES_STUDENT } from 'src/app/common/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(getAllRoutes(CONFIG.ROUTES.STUDENT_ROUTES, ROUTES_STUDENT, CONFIG.GUARD.PUBLIC))],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
