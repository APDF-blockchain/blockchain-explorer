import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./components/blockchain/blockchain.module').then(m => m.BlockchainModule) },
  { path: 'wallet', redirectTo: 'wallet/login'},
  { path: 'wallet', loadChildren: () => import('./components/wallet/wallet.module').then(m => m.WalletModule) },
  { path: 'faucet', loadChildren: () => import('./components/faucet/faucet.module').then(m => m.FaucetModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
