import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ROUTES_AUTH} from 'src/app/common/router';


@NgModule({
    imports: [RouterModule.forChild(ROUTES_AUTH)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}
