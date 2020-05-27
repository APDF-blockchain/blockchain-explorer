import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { TransactionDetailsDialogComponent } from '../blocks/transaction-details-dialog/transaction-details-dialog.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  public displayedColumns: string[] = ['hashDateCreated', 'fromTo', 'detailsBtn'];
  private confirmedTx: any[] = [];
  public areDataLoaded = false;
  public dataSource: MatTableDataSource<any>;
  private subscription: Subscription = new Subscription();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private blockchainService: BlockchainService, public dialog: MatDialog) {
    this.loadConfirmedTx();
  }

  ngOnInit(): void {
  }

  public openDialog(txHash: string) {
    this.blockchainService.getTx(txHash).subscribe(tx => {
      this.dialog.open(TransactionDetailsDialogComponent, {
        data: tx
      });
    });
  }

  private loadConfirmedTx(): void {
    const subscription1 = this.blockchainService.getConfirmedTx().subscribe(txs => {
      this.confirmedTx = txs.reverse();
      this.dataSource = new MatTableDataSource(this.confirmedTx);
      this.dataSource.paginator = this.paginator;
    });
    this.subscription.add(subscription1);
  }
}
