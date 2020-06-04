import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  public displayedColumns = ['creationDate', 'hash', 'from', 'to'];
  public secondHeaderColumns = ['creationDate-description', 'hashDateCreated-description', 'from-description', 'to-description'];
  private confirmedTx: any[] = [];
  public areDataLoaded = false;
  public dataSource: MatTableDataSource<any>;
  private subscription: Subscription = new Subscription();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private blockchainService: BlockchainService, public dialog: MatDialog) {
    this.loadConfirmedTx();
    this.listenToTransactionStream();
  }

  private loadConfirmedTx(): void {
    const subscription1 = this.blockchainService.getConfirmedTx().subscribe(txs => {
      this.confirmedTx = txs.reverse();
      this.dataSource = new MatTableDataSource(this.confirmedTx);
      this.dataSource.paginator = this.paginator;
    });
    this.subscription.add(subscription1);
  }

  private listenToTransactionStream(): void {
    const subscription = this.blockchainService.myWebSocket$.subscribe(stream => {
      if (stream.type === 4 && stream.data) {
        const txs = JSON.parse(stream.data);
        this.confirmedTx.unshift(...txs);
        this.dataSource.data = this.confirmedTx;
      }
    });
    this.subscription.add(subscription);
  }
}
