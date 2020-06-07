import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockchainComponent } from './blockchain.component';
import { BlockComponent } from './block/block.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AddressComponent } from './address/address.component';

const blockchainRoutes: Routes = [
    { path: '', component: BlockchainComponent },
    { path: 'blocks/:index', component: BlockComponent },
    { path: 'transactions/:hash', component: TransactionComponent },
    { path: 'address/:address', component: AddressComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(blockchainRoutes)
    ],
    exports: [RouterModule]
})
export class BlockchainRoutingModule { }
