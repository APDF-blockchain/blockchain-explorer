import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { sha256 } from 'js-sha256';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { Observable, BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { IHDWallet, IAccount } from '../model/wallet';
import { NotificationService } from './notification.service';

(window as any).global = window;

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private hdWallet: BehaviorSubject<IHDWallet>;
  public hdWallet$: Observable<IHDWallet>;
  private isMnemonicInStorage: BehaviorSubject<boolean>;
  public isMnemonicInStorage$: Observable<boolean>;

  constructor(private notificationService: NotificationService) {
    this.hdWallet = new BehaviorSubject(null);
    this.hdWallet$ = this.hdWallet.asObservable();
    const isMnemonicInStorage = !!localStorage.getItem('encryptedMnemonic');
    this.isMnemonicInStorage = new BehaviorSubject(isMnemonicInStorage);
    this.isMnemonicInStorage$ = this.isMnemonicInStorage.asObservable();
  }

  public async createWallet(password: string): Promise<string> {
    try {
      const mnemonic = bip39.generateMnemonic();
      this.storeMnemonic(password, mnemonic);
      const hdWallet = this.loadHDWallet(password, mnemonic);
      this.hdWallet.next(hdWallet);
      this.notificationService.sendSuccess(`New wallet successfully created,
      don't forget to save your mnemonic on a safe place!`);
      console.log(hdWallet);
      return hdWallet.mnemonic;
    } catch (err) {
      this.notificationService.sendError('Sorry, something went wrong while creating the new wallet');
    }
  }

  public loginCurrentWallet(password: string): void {
    try {
      const mnemonic = this.getStoredMnemonic(password);
      const hdWallet = this.loadHDWallet(password, mnemonic);
      this.hdWallet.next(hdWallet);
      this.notificationService.sendSuccess(`Successfully logged in!`);
    } catch (err) {
      this.notificationService.sendError(`Wrong password. Maybe you should try to restore it from mnemonic...`);
    }
  }

  public restoreWallet(password: string, mnemonic: string): void {
    try {
      this.storeMnemonic(password, mnemonic);
      const hdWallet = this.loadHDWallet(password, mnemonic);
      this.hdWallet.next(hdWallet);
      this.notificationService.sendSuccess(`We were able to restore a wallet from the info you provided!`);
    } catch (err) {
      this.notificationService.sendError(`Sorry, something went wrong while retrieving the wallet. `);
    }
  }

  public logout(): void {
    this.hdWallet.next(null);
    this.notificationService.sendSuccess(`Successfully logged out!`);
  }

  public getStoredMnemonic(password: string): string {
    const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
    const decryptedMnemonic = CryptoJS.AES.decrypt(encryptedMnemonic, password).toString(CryptoJS.enc.Utf8);
    return decryptedMnemonic;
  }

  public loadHDWallet(password: string, mnemonic: string): IHDWallet {
    const isMnemonicValid = bip39.validateMnemonic(mnemonic);
    if (!isMnemonicValid) {
      throw new Error('Mnemonic is not valid');
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic, password);

    const hdNode = bip32.fromSeed(seed);
    const accounts = this.derive5accountsFromHDNode(hdNode);
    return { mnemonic, accounts };
  }

  private derive5accountsFromHDNode(hdNode: bip32.BIP32Interface): IAccount[] {
    const accounts: IAccount[] = [];
    for (let i = 0; i < 5; i++) {
      const wallet = hdNode.derivePath('m/0/' + i);
      accounts.push({
        publicKey: wallet.publicKey.toString('hex'),
        privateKey: wallet.privateKey.toString('hex'),
        address: sha256(wallet.publicKey)
      });
    }
    return accounts;
  }

  private storeMnemonic(password: string, mnemonic: string): void {
    const encryptedMnemonic = CryptoJS.AES.encrypt(mnemonic, password).toString();
    localStorage.setItem('encryptedMnemonic', encryptedMnemonic);
    this.isMnemonicInStorage.next(true);
  }

}
