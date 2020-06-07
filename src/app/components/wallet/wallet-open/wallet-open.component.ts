import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-wallet-open',
  templateUrl: './wallet-open.component.html',
  styleUrls: ['./wallet-open.component.scss', '../wallet.component.scss']
})
export class WalletOpenComponent implements OnInit {
  public restoreWalletForm: FormGroup;
  public hidePassword = true;

  constructor(private walletService: WalletService, private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.initRestoreWalletForm();
  }

  public onRestoreWallet(): void {
    if (this.restoreWalletForm.valid) {
      const password = this.restoreWalletForm.value.password;
      const mnemonic = this.restoreWalletForm.value.mnemonic;
      this.walletService.restoreWallet(password, mnemonic);
    }
  }

  private initRestoreWalletForm(): void {
    this.restoreWalletForm = this.formBuilder.group({
      password: ['', Validators.required],
      mnemonic: ['', Validators.required]
    });
  }

}
