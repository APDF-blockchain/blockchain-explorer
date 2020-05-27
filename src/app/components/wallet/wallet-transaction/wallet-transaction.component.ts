import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnspentTxOut } from 'src/app/model/unspent-tx-out';
import * as _ from 'lodash';

@Component({
  selector: 'app-wallet-transaction',
  templateUrl: './wallet-transaction.component.html',
  styleUrls: ['./wallet-transaction.component.scss', '../wallet.component.scss']
})
export class WalletTransactionComponent implements OnInit {
  public transactionForm: FormGroup;
  // public message: string;

  constructor(private walletService: WalletService, private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.initTransactionForm();
  }

  public onSubmitTransaction(): void {
    // let blockchain: Block[] = [genesisBlock];
    // let unspentTxOuts: UnspentTxOut[] = processTransactions(blockchain[0].data, [], 0);
    // const getUnspentTxOuts = (): UnspentTxOut[] => _.cloneDeep(unspentTxOuts);
    const transaction = this.transactionForm.value;
    console.log(this.walletService.wallet);
    // this.walletService.createTransaction(transaction);
    // TODO: After transaction, post to node
  }

  private initTransactionForm(): void {
    this.transactionForm = this.formBuilder.group({
      sender: ['', Validators.required],
      recipient: ['', Validators.required],
      value: ['', Validators.required],
      blockchainNode: ['', Validators.required]
    });
  }
}
