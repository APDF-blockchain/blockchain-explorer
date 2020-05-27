import { Component, OnDestroy } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { ActivatedRoute } from '@angular/router';
import { concatMap, first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnDestroy {
  public block: any;
  private subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute, private blockchainService: BlockchainService) {
    this.loadBlock();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadBlock(): void {
    const subscription = this.activatedRoute.params.pipe(
      concatMap(params => {
        const paramsName = 'index';
        const blockIndex = params[paramsName];
        return this.blockchainService.getBlock(blockIndex);
      })
    ).subscribe(blockDetails => this.block = blockDetails);
    this.subscription.add(subscription);
  }


}
