import { Component, ViewChild } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent {
  public displayedColumns = ['index', 'hash', 'dateCreated', 'transactionCount'];
  public secondHeaderColumns = ['index-description', 'hash-description', 'dateCreated-description', 'transactionCount-description'];
  private blocks: any[] = [];
  public areDataLoaded = false;
  public dataSource: MatTableDataSource<any>;
  private subscription: Subscription = new Subscription();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private blockchainService: BlockchainService, public dialog: MatDialog) {
    this.listenToBlockchain();
  }

  private listenToBlockchain(): void {
    const subscription1 = this.blockchainService.getBlocks().subscribe(blocks => {
      this.blocks = blocks.reverse();
      this.dataSource = new MatTableDataSource(this.blocks);
      this.dataSource.paginator = this.paginator;
    });
    const subscription2 = this.blockchainService.myWebSocket$.subscribe(stream => {
      console.log(stream.type);
      if (stream.type === 2 && stream.data) {
        const newBlock = JSON.parse(stream.data)[0];
        this.blocks.unshift(newBlock);
        this.dataSource.data = this.blocks;
      }
    });
    this.subscription.add(subscription1);
    this.subscription.add(subscription2);
  }

}
