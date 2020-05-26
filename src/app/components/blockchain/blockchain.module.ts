import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockchainComponent } from './blockchain.component';
import { SharedModule } from '../shared/shared.module';
import { BlockchainRoutingModule } from './blockchain-routing.module';
import { BlocksComponent } from './blocks/blocks.component';
import { InfoComponent } from './info/info.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BlockDetailsDialogComponent } from './blocks/block-details-dialog/block-details-dialog.component';
import { TransactionDetailsDialogComponent } from './blocks/transaction-details-dialog/transaction-details-dialog.component';


@NgModule({
  declarations: [
    BlockchainComponent,
    BlocksComponent,
    InfoComponent,
    TransactionsComponent,
    BlockDetailsDialogComponent,
    TransactionDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    BlockchainRoutingModule,
    SharedModule
  ]
})
export class BlockchainModule { }
