import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockchainComponent } from './blockchain.component';
import { SharedModule } from '../shared/shared.module';
import { BlockchainRoutingModule } from './blockchain-routing.module';


@NgModule({
  declarations: [
    BlockchainComponent
  ],
  imports: [
    CommonModule,
    BlockchainRoutingModule,
    SharedModule
  ]
})
export class BlockchainModule { }
