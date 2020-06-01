import { Component } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-wallet-logout',
  templateUrl: './wallet-logout.component.html',
  styleUrls: ['./wallet-logout.component.scss']
})
export class WalletLogoutComponent {

  constructor(private walletService: WalletService) { }

  public onLogout(): void {
    this.walletService.logout();
  }

}
