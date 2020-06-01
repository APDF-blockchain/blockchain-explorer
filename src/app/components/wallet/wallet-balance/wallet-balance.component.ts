import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IHDWallet } from 'src/app/model/wallet';

@Component({
  selector: 'app-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  styleUrls: ['./wallet-balance.component.scss', '../wallet.component.scss']
})
export class WalletBalanceComponent implements OnInit, OnDestroy {
  public balanceForm: FormGroup;
  private subscription = new Subscription();
  public hdWallet: IHDWallet;

  constructor(private walletService: WalletService, private formBuilder: FormBuilder) {
    const subscription = this.walletService.hdWallet$.subscribe(hdWallet => this.hdWallet = hdWallet);
    this.subscription.add(subscription);
  }

  public ngOnInit(): void {
    this.initBalanceForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onDisplayBalance(): void {
    // this.walletService. .....
  }

  private initBalanceForm(): void {
    this.balanceForm = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

}
