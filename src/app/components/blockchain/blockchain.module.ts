import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockchainComponent } from './blockchain.component';
import { SharedModule } from '../shared/shared.module';
import { BlockchainRoutingModule } from './blockchain-routing.module';
import { BlocksComponent } from './blocks/blocks.component';
import { InfoComponent } from './info/info.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BlockComponent } from './block/block.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AddressComponent } from './address/address.component';
import { SearchComponent } from './search/search.component';
import { PeersComponent } from './peers/peers.component';
import { MapComponent } from './peers/map/map.component';


@NgModule({
  declarations: [
    BlockchainComponent,
    BlocksComponent,
    InfoComponent,
    TransactionsComponent,
    BlockComponent,
    TransactionComponent,
    AddressComponent,
    SearchComponent,
    PeersComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    BlockchainRoutingModule,
    SharedModule
  ]
})
export class BlockchainModule { }
