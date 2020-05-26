import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    const transaction = this.transactionForm.value;
    this.walletService.sendTransaction(transaction).subscribe(res => {
      // this.message = res.message;
    });
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
