import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES_ROOT } from './common/router';

@NgModule({
  imports: [RouterModule.forRoot(ROUTES_ROOT)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
