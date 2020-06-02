import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletCreationComponent } from './wallet-creation/wallet-creation.component';
import { WalletTransactionComponent } from './wallet-transaction/wallet-transaction.component';
import { WalletComponent } from './wallet.component';
import { WalletOpenComponent } from './wallet-open/wallet-open.component';
import { WalletBalanceComponent } from './wallet-balance/wallet-balance.component';
import { WalletLogoutComponent } from './wallet-logout/wallet-logout.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { WalletLoginComponent } from './wallet-login/wallet-login.component';
import { MnemonicStoredGuard } from 'src/app/guards/mnemonic-stored.guard';

const walletRoutes: Routes = [
    { path: '', component: WalletComponent, children: [
        { path: 'create', component: WalletCreationComponent },
        { path: 'open', component: WalletOpenComponent },
        { path: 'login', component: WalletLoginComponent, canActivate: [MnemonicStoredGuard] },
        { path: 'balance', component: WalletBalanceComponent, canActivate: [AuthGuard] },
        { path: 'transaction', component: WalletTransactionComponent, canActivate: [AuthGuard] },
        { path: 'logout', component: WalletLogoutComponent, canActivate: [AuthGuard] }
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(walletRoutes)
    ],
    exports: [RouterModule]
})
export class WalletRoutingModule { }
