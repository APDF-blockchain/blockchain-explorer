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

  public wallet: any;

  constructor(private walletService: WalletService, private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.initCreateWalletForm();
  }

  public onCreateWallet(): void {
    if (this.createWalletForm.valid) {
      const password = this.createWalletForm.value.password;
      this.walletService.createWallet(password).subscribe(
        (val) => {
            console.log("POST call successful value returned in body",
                        val);
            this.wallet = val;
        },
        error => {
            console.log("POST call in error", error);
        },
        () => {
            console.log("The POST observable is now completed.");
        }); //.subscribe((res: any) => console.log(res));
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
