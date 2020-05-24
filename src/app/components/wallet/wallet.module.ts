import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet.component';
import { WalletCreationComponent } from './wallet-creation/wallet-creation.component';
import { WalletTransactionComponent } from './wallet-transaction/wallet-transaction.component';
import { WalletRoutingModule } from './wallet-routing.module';
import { SharedModule } from '../shared/shared.module';
import { WalletLogoutComponent } from './wallet-logout/wallet-logout.component';
import { WalletBalanceComponent } from './wallet-balance/wallet-balance.component';
import { WalletOpenComponent } from './wallet-open/wallet-open.component';


@NgModule({
  declarations: [
    WalletComponent,
    WalletCreationComponent,
    WalletTransactionComponent,
    WalletLogoutComponent,
    WalletBalanceComponent,
    WalletOpenComponent
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    SharedModule
  ]
})
export class WalletModule { }
