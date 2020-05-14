import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletComponent } from './components/wallet/wallet.component';
import { BlockchainComponent } from './components/blockchain/blockchain.component';


const routes: Routes = [
  { path: '', component: BlockchainComponent },
  { path: 'wallet', component: WalletComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
