import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CONFIG } from './common/config';
import { ROUTES_ROOT, getAllRoutes } from './common/router';

@NgModule({
  imports: [RouterModule.forRoot(getAllRoutes(CONFIG.ROUTES.ROOT_ROUTES, ROUTES_ROOT, CONFIG.GUARD.PRIVATE),{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
