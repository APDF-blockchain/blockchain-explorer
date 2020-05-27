import { Component, OnInit } from '@angular/core';
import { concatMap, first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {
  public address: any;
  public balance$: any;
  public txs$: any;

  constructor(private activatedRoute: ActivatedRoute, private blockchainService: BlockchainService) {
    this.loadAddressInfo();
  }

  // private loadAddressInfo(): void {
  //   this.activatedRoute.params.pipe(
  //     concatMap(params => {
  //       const paramsName = 'address';
  //       const address = params[paramsName];
  //       this.address = address;
  //       this.
  //       return this.blockchainService.getAddressBalance(address);
  //     }),
  //     first()
  //   ).subscribe(tx => this.tx = tx);
  // }

  private loadAddressInfo(): void {
    this.activatedRoute.params.subscribe(params => {
      const paramsName = 'address';
      const address = params[paramsName];
      this.address = address;
      this.balance$ = this.blockchainService.getAddressBalance(address);
      this.txs$ = this.blockchainService.getAddressTxs(address);
    });
  }

}
