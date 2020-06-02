import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WalletService } from '../services/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class MnemonicStoredGuard implements CanActivate {
  private isMnemonicInStorage = false;

  constructor(private walletService: WalletService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.walletService.isMnemonicInStorage$.subscribe(isMnemonicInStorage => this.isMnemonicInStorage = isMnemonicInStorage);
      if (!this.isMnemonicInStorage) {
        this.router.navigate(['/', 'wallet', 'open']);
        return false;
      }
      return true;
  }
}
