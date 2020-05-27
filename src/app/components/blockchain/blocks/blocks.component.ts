import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BlockDetailsDialogComponent } from './block-details-dialog/block-details-dialog.component';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {
  public displayedColumns: string[] = ['index', 'dateCreated', 'detailsBtn'];
  private blocks: any[] = [];
  public areDataLoaded = false;
  public dataSource: MatTableDataSource<any>;
  private subscription: Subscription = new Subscription();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private blockchainService: BlockchainService, public dialog: MatDialog) {
    this.listenToBlockchain();
  }

  ngOnInit(): void {
  }

  public openDialog(index: number) {
    this.blockchainService.getBlock(index).subscribe(blockDetails => {
      this.dialog.open(BlockDetailsDialogComponent, {
        data: blockDetails[0]
      });
    });
  }


  private listenToBlockchain(): void {
    const subscription1 = this.blockchainService.getBlocks().subscribe(blocks => {
      this.blocks = blocks.reverse();
      this.dataSource = new MatTableDataSource(this.blocks);
      this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    });
    const subscription2 = this.blockchainService.myWebSocket$.subscribe(stream => {
      if (stream.data) {
        const newBlock = JSON.parse(stream.data)[0];
        this.blocks.unshift(newBlock);
        this.dataSource.data = this.blocks;
      }
    });
    this.subscription.add(subscription1);
    this.subscription.add(subscription2);
  }

}
