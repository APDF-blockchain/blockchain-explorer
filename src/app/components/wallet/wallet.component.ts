import { Component } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {
  public name = 'Olivier';

  constructor(private transactionService: TransactionService, private walletService: WalletService) {

  }

}
