import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaucetComponent } from './faucet.component';
import { SharedModule } from '../shared/shared.module';
import { FaucetRoutingModule } from './faucet-routing.module';

@NgModule({
  declarations: [FaucetComponent],
  imports: [
    CommonModule,
    FaucetRoutingModule,
    SharedModule
  ]
})
export class FaucetModule { }
