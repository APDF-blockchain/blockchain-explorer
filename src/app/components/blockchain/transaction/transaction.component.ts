import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { concatMap, first } from 'rxjs/operators';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent {
  public tx: any;

  constructor(private activatedRoute: ActivatedRoute, private blockchainService: BlockchainService) {
    this.loadTx();
  }

  private loadTx(): void {
    this.activatedRoute.params.pipe(
      concatMap(params => {
        const paramsName = 'hash';
        const blockIndex = params[paramsName];
        return this.blockchainService.getTx(blockIndex);
      }),
      first()
    ).subscribe(res => this.tx = res[0]);
  }

}
