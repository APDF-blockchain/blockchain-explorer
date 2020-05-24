import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  public navLinks = ['create', 'open', 'balance', 'transaction', 'logout'];
  public activeLinkIndex = 1;

  constructor(private router: Router) {
    const activeLink = this.router.url.split('/')[2];
    this.activeLinkIndex = this.navLinks.indexOf(activeLink);
  }

  public ngOnInit(): void {
    //
  }

  public onNavigate($event: any): void {
    this.router.navigate(['./', 'wallet', this.navLinks[$event.index]]);
  }

}
