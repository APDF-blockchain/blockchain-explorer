import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WalletService } from '../services/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private isWalledLoaded = false;

  constructor(private walletService: WalletService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.walletService.hdWallet$.subscribe(hdWallet => this.isWalledLoaded = !!hdWallet);
      if (!this.isWalledLoaded) {
        this.router.navigate(['/', 'wallet', 'open']);
        return false;
      }
      return true;
  }
}
