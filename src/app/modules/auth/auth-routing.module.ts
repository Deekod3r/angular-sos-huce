import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CONFIG } from 'src/app/common/config';
import { ROUTES_AUTH, getAllRoutes } from 'src/app/common/router';


@NgModule({
  imports: [RouterModule.forChild(getAllRoutes(CONFIG.ROUTES.AUTHENTICATION_ROUTES, ROUTES_AUTH, CONFIG.GUARD.PUBLIC))],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
