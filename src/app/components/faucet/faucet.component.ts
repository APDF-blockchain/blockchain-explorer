import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TransactionService } from 'src/app/services/transaction.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.scss']
})
export class FaucetComponent  implements OnInit, OnDestroy {
  public fundRequestForm: FormGroup;
  public txDataHash: string;
  private subscription = new Subscription();

  constructor(
    private transactionService: TransactionService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
    ) {
  }

  public ngOnInit(): void {
    this.initFaucetForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onSubmitfundRequestForm(): void {
    const sender = environment.faucet.faucetAccount;
    const recipient = this.fundRequestForm.value.recipient;
    const value = environment.faucet.faucetTxValue;
    const message = 'Fund request';
    this.transactionService.sendTransaction(sender, recipient, value, message).subscribe(
      res => {
        this.notificationService.sendSuccess('Fund successfully sent!');
        this.txDataHash = res.transactionDataHash;
      },
      err => this.notificationService.sendError(err.error.error)
    );
  }

  private initFaucetForm(): void {
    this.fundRequestForm = this.formBuilder.group({
      recipient: ['', Validators.required]
    });
  }
}
