import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnspentTxOut } from 'src/app/model/unspent-tx-out';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { IHDWallet } from 'src/app/model/wallet';

@Component({
  selector: 'app-wallet-transaction',
  templateUrl: './wallet-transaction.component.html',
  styleUrls: ['./wallet-transaction.component.scss', '../wallet.component.scss']
})
export class WalletTransactionComponent implements OnInit {
  public transactionForm: FormGroup;
  // public message: string;
  private subscription = new Subscription();
  public hdWallet: IHDWallet;

  constructor(private walletService: WalletService, private formBuilder: FormBuilder) { 
    const subscription = this.walletService.hdWallet$.subscribe(hdWallet => this.hdWallet = hdWallet);
    this.subscription.add(subscription);
  }

  public ngOnInit(): void {
    this.initTransactionForm();
  }

  public onSubmitTransaction(): void {
    
    const sender = this.transactionForm.value.sender;

    console.log(sender);
    const recipient = this.transactionForm.value.recipient;
    const value = this.transactionForm.value.value;
    const message = this.transactionForm.value.message;
    //console.log(this.walletService.wallet);
    // this.walletService.createTransaction(sender, recipient, value, message);
    // TODO: After transaction, post to node
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
