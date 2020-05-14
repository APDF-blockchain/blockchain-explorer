import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.scss']
})
export class BlockchainComponent implements OnDestroy {
  private subscription: Subscription = new Subscription();
  public blocks: any[] = [];

  constructor(private blockchainService: BlockchainService) {
    this.listenToBlockchain();
  }

  private listenToBlockchain(): void {
    const subscription1 = this.blockchainService.getBlocks().subscribe(blocks => {
      this.blocks = blocks.reverse();
    });
    const subscription2 = this.blockchainService.myWebSocket$.subscribe(stream => {
      console.log(stream);
      if (stream.data) {
        const newBlock = JSON.parse(stream.data)[0];
        this.blocks.unshift(newBlock);
        console.log(newBlock);
      }
    });
    this.subscription.add(subscription1);
    this.subscription.add(subscription2);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
