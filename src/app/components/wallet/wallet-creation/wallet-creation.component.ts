import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/validators/must-match.validators';

@Component({
  selector: 'app-wallet-creation',
  templateUrl: './wallet-creation.component.html',
  styleUrls: ['./wallet-creation.component.scss', '../wallet.component.scss']
})
export class WalletCreationComponent implements OnInit {
  public createWalletForm: FormGroup;
  public hidePassword = true;
  public hideConfirmPassword = true;
  public mnemonic: string;

  public wallet: any;
  public allWallets: string[] = [];

  constructor(private walletService: WalletService, private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.initCreateWalletForm();
  }

  public onCreateWallet(): void {
    if (this.createWalletForm.valid) {
      const password = this.createWalletForm.value.password;
      this.walletService.createWallet(password).then(mnemonic => this.mnemonic = mnemonic);
    }
  }

  private initCreateWalletForm(): void {
    this.createWalletForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
      }, { validator: MustMatch('password', 'confirmPassword')
    });
  }

}
