import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnspentTxOut } from 'src/app/model/unspent-tx-out';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { IHDWallet } from 'src/app/model/wallet';
import { NotificationService } from 'src/app/services/notification.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-wallet-transaction',
  templateUrl: './wallet-transaction.component.html',
  styleUrls: ['./wallet-transaction.component.scss', '../wallet.component.scss']
})
export class WalletTransactionComponent implements OnInit, OnDestroy {
  public transactionForm: FormGroup;
  // public message: string;
  private subscription = new Subscription();
  public hdWallet: IHDWallet;

  constructor(
    private walletService: WalletService,
    private transactionService: TransactionService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
    ) {
    const subscription = this.walletService.hdWallet$.subscribe(hdWallet => this.hdWallet = hdWallet);
    this.subscription.add(subscription);
  }

  public ngOnInit(): void {
    this.initTransactionForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onSubmitTransaction(): void {

    const sender = this.transactionForm.value.sender;
    const recipient = this.transactionForm.value.recipient;
    const value = this.transactionForm.value.value;
    const message = this.transactionForm.value.message;
    this.transactionService.sendTransaction(sender, recipient, value, message).subscribe(
      res => this.notificationService.sendSuccess('Transaction sent successfully'),
      err => this.notificationService.sendError(err.error.error)
    );
  }

  private initTransactionForm(): void {
    this.transactionForm = this.formBuilder.group({
      sender: ['', Validators.required],
      recipient: ['', Validators.required],
      value: ['', Validators.required],
      message: ['', Validators.required]
    });
  }
}
