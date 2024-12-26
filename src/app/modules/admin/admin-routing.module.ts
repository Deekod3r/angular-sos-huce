import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ROUTES_ADMIN} from 'src/app/common/router';

@NgModule({
    imports: [RouterModule.forChild(ROUTES_ADMIN)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
