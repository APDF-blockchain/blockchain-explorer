import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from 'src/app/services/wallet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  public navLinks = ['create', 'open', 'balance', 'transaction', 'logout'];
  public activeLinkIndex = 1;
  public isHdWalletLoaded = false;
  private subscription = new Subscription();

  constructor(private router: Router, private walletService: WalletService) {
    const activeLink = this.router.url.split('/')[2];
    this.activeLinkIndex = this.navLinks.indexOf(activeLink);
    const subscription = this.walletService.hdWallet$.subscribe(hdWallet => {
      this.isHdWalletLoaded = !!hdWallet;
    });
    this.subscription.add(subscription);
  }

  public ngOnInit(): void {
    // this.isLoggedIn = this.walletService.isLoggedIn();
    // console.log(this.isLoggedIn);
  }

  public onNavigate($event: any): void {
    void this.router.navigate(['./', 'wallet', this.navLinks[$event.index]]);
  }

}
