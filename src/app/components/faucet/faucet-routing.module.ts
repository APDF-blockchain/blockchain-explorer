import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaucetComponent } from './faucet.component';

const faucetRoutes: Routes = [
    { path: '', component: FaucetComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(faucetRoutes)
    ],
    exports: [RouterModule]
})
export class FaucetRoutingModule { }
