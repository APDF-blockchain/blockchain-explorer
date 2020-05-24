import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  styleUrls: ['./wallet-balance.component.scss', '../wallet.component.scss']
})
export class WalletBalanceComponent implements OnInit {
  public balanceForm: FormGroup;

  constructor(private walletService: WalletService, private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.initBalanceForm();
  }

  public onDisplayBalance(): void {
    // this.walletService. .....
  }

  private initBalanceForm(): void {
    this.balanceForm = this.formBuilder.group({
      address: ['', Validators.required],
      blockchainNode: ['', Validators.required]
    });
  }

}
