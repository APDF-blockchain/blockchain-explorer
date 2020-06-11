import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-peers',
  templateUrl: './peers.component.html',
  styleUrls: ['./peers.component.scss']
})
export class PeersComponent implements OnInit {

  constructor(private blockchainService: BlockchainService) {
  }

  ngOnInit(): void {
    // this.blockchainService.getPeers().subscribe(peers => console.log(peers));
  }

}
