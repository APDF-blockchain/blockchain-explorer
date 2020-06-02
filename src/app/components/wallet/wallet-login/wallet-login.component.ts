import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-wallet-login',
  templateUrl: './wallet-login.component.html',
  styleUrls: ['./wallet-login.component.scss']
})
export class WalletLoginComponent implements OnInit {
  public loginWalletForm: FormGroup;
  public hidePassword = true;

  constructor(private walletService: WalletService, private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.initLoginWalletForm();
  }

  public onLoginWallet(): void {
    if (this.loginWalletForm.valid) {
      const password = this.loginWalletForm.value.password;
      this.walletService.loginCurrentWallet(password);
    }
  }

  private initLoginWalletForm(): void {
    this.loginWalletForm = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

}
