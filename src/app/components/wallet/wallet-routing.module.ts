import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletCreationComponent } from './wallet-creation/wallet-creation.component';
import { WalletTransactionComponent } from './wallet-transaction/wallet-transaction.component';
import { WalletComponent } from './wallet.component';
import { WalletOpenComponent } from './wallet-open/wallet-open.component';
import { WalletBalanceComponent } from './wallet-balance/wallet-balance.component';
import { WalletLogoutComponent } from './wallet-logout/wallet-logout.component';

const walletRoutes: Routes = [
    { path: '', component: WalletComponent, children: [
        { path: 'create', component: WalletCreationComponent },
        { path: 'open', component: WalletOpenComponent },
        { path: 'balance', component: WalletBalanceComponent },
        { path: 'transaction', component: WalletTransactionComponent },
        { path: 'logout', component: WalletLogoutComponent }
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(walletRoutes)
    ],
    exports: [RouterModule]
})
export class WalletRoutingModule { }
