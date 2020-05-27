import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { TransactionDetailsDialogComponent } from '../transaction-details-dialog/transaction-details-dialog.component';

@Component({
  selector: 'app-block-details-dialog',
  templateUrl: './block-details-dialog.component.html',
  styleUrls: ['./block-details-dialog.component.scss']
})
export class BlockDetailsDialogComponent {
  public dialogOpen = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public blockDetails: any,
    private blockchainService: BlockchainService,
    public dialog: MatDialog
  ) { }

  public openTxDetailsDialog(txHash: string) {
    this.dialogOpen = !this.dialogOpen;
    if (this.dialogOpen) {
      this.blockchainService.getTx(txHash).subscribe(txDetails => {
        this.dialog.open(TransactionDetailsDialogComponent, {
          data: txDetails
        });
      });
    }
  }

}
