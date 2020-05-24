import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockchainComponent } from './blockchain.component';

const blockchainRoutes: Routes = [
    { path: '', component: BlockchainComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(blockchainRoutes)
    ],
    exports: [RouterModule]
})
export class BlockchainRoutingModule { }
