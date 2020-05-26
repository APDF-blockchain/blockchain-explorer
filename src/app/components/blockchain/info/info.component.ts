import { Component } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  public info: any;
  private subscription: Subscription = new Subscription();

  constructor(private blockchainService: BlockchainService) { 
    this.loadInfo();
  }

  private loadInfo(): void {
    const subscription1 = this.blockchainService.getInfo().subscribe(info => {
      this.info = info;
    });
    this.subscription.add(subscription1);
  }

}
