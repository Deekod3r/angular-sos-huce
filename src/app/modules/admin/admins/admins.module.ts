import {NgModule} from "@angular/core";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {AdminCreateComponent} from "./admin-create/admin-create.component";
import {AdminUpdateComponent} from "./admin-update/admin-update.component";
import {SharedModule} from "src/app/shared/shared.module";
import {PasswordModule} from "primeng/password";

@NgModule({
    declarations: [
        AdminCreateComponent,
        AdminUpdateComponent
    ],
    imports: [
        SharedModule,
        DialogModule,
        DropdownModule,
        PasswordModule
    ],
    exports: [
        AdminCreateComponent,
        AdminUpdateComponent,
        SharedModule,
        DialogModule,
    ]
})
export class AdminsModule {
}
