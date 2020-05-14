import { Component } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {
  public name = 'Olivier';

  constructor(private walletService: WalletService) { }

}
