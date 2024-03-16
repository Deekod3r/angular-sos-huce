import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES_USER } from 'src/app/common/router';

@NgModule({
    imports: [RouterModule.forChild(ROUTES_USER)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
