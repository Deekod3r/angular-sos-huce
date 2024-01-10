import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CONFIG } from 'src/app/common/config';
import { getAllRoutes, ROUTES_USER } from 'src/app/common/router';

@NgModule({
  imports: [RouterModule.forChild(getAllRoutes(CONFIG.ROUTES.USER_ROUTES, ROUTES_USER, CONFIG.GUARD.PUBLIC))],
  exports: [RouterModule]
})
export class UserRoutingModule { }
