import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription, forkJoin, of } from 'rxjs';
import { map, catchError, first } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public searchForm: FormGroup;
  private subscription = new Subscription();

  constructor(
    private blockchainService: BlockchainService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
    ) {
  }

  public ngOnInit(): void {
    this.initSearchForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onSearch(): void {
    if (this.searchForm.valid) {
      const hash = this.searchForm.value.hash;
      console.log(hash);
      this.searchFromHash(hash);
    }
  }

  private initSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      hash: ['', Validators.required]
    });
  }

  private searchFromHash(hash: string): void {
    const blockObs = this.blockchainService.getBlocks().pipe(
      first(),
      map(blocks => {
        const index = blocks.findIndex(block => block.blockHash === hash);
        if (index >= 0) {
          return ['blocks', index];
        }
        return null;
      }),
      catchError(err => of(null))
    );

    const txObs = this.blockchainService.getTx(hash).pipe(
      first(),
      map(tx => {
        if (tx[0]) {
          return ['transactions', tx[0].transactionDataHash];
        }
        return null;
      }),
      catchError(err => of(null))
    );

    const addressObs = this.blockchainService.getAddressBalance(hash).pipe(
      first(),
      map(address => {
        if (address) {
          return ['address', address.accountAddress];
        }
        return null;
      }),
      catchError(err => of(null))
    );

    const searchObs = forkJoin([blockObs, txObs, addressObs]).pipe(first());

    searchObs.subscribe(
        result => {
          const nothingFound = result.every(item => !!!item);
          if (nothingFound) {
           return this.notificationService.sendError('The provided hash is not valid');
          }
          const url = result.find(e => !!e);
          void this.router.navigate(['/', url[0], url[1]]);
        },
        err => this.notificationService.sendError('The hash provided is not valid')
      );
  }

}
