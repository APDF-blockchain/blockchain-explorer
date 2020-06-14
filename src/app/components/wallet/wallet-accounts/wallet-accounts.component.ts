import { Component, OnDestroy } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { Observable, Subscription } from 'rxjs';
import { IHDWallet } from 'src/app/model/wallet';

@Component({
  selector: 'app-wallet-accounts',
  templateUrl: './wallet-accounts.component.html',
  styleUrls: ['./wallet-accounts.component.scss']
})
export class WalletAccountsComponent implements OnDestroy {
  public hdWallet: IHDWallet;
  private subscritpion = new Subscription();

  constructor(private walletService: WalletService) {
    const subscritpion = this.walletService.hdWallet$.subscribe(hdWallet => this.hdWallet = hdWallet);
    this.subscritpion.add(subscritpion);
  }

  public ngOnDestroy(): void {
    this.subscritpion.unsubscribe();
  }

}
