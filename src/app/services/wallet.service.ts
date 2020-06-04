import { Injectable } from '@angular/core';
import { ec } from 'elliptic';
import * as _ from 'lodash';
import { sha256 } from 'js-sha256';

import * as bip39 from 'bip39';
import * as bip32 from 'bip32';

import { Signature } from '../model/signature';
import { WalletCreationComponent } from '../components/wallet/wallet-creation/wallet-creation.component';
//import { TransactionService } from './transaction.service';
import { UnspentTxOut } from '../model/unspent-tx-out';
import { TxOut } from '../model/tx-out';
import { Transaction } from '../model/transaction';
import { TxIn } from '../model/tx-in';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { IHDWallet, IAccount } from '../model/wallet';
import { BlockchainService } from './blockchain.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

(window as any).global = window;

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  public EC = new ec('secp256k1');
  private privateKeyLocation = 'node/wallet/private_key';
  private baseUrl = 'http://localhost:3001/';
  private walletUrl = 'http://localhost:4001/';
  public allWallets: string[] = [];
  public walletCreationComp: WalletCreationComponent;
  private hdWallet: BehaviorSubject<IHDWallet>;
  public hdWallet$: Observable<IHDWallet>;
  private isMnemonicInStorage: BehaviorSubject<boolean>;
  public isMnemonicInStorage$: Observable<boolean>;
  public passwords: string[] = [];

  public wallet: any;

  /**
   * @description - the wallet directory
   */
  private walletDirectory = 'node/wallet/';


  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {
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
      console.log(hdWallet);
      //this.passwords.push(password);
      this.notificationService.sendSuccess(`New wallet successfully created,
      don't forget to save your mnemonic on a safe place!`);
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
      // for (let i = 0; i < this.passwords.length; i++) {
      //   if (this.passwords[i] === password) { 
      //     this.passwords.splice(i, 1);
      //     this.passwords.push(password);
      //   } else {
      //     this.passwords.push(password);
      //   }
      // }
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
      // for (let i = 0; i < this.passwords.length; i++) {
      //   if (this.passwords[i] === password) { 
      //     this.passwords.splice(i, 1);
      //     this.passwords.push(password);
      //   } else {
      //     this.passwords.push(password);
      //   }
      // }
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

  public sendTransaction(transaction: any): Observable<any> {
    const url = this.baseUrl + '/transactions/send';
    // const transaction
    return this.httpClient.post(url, transaction);
  }

  public createTransaction(senderAddress: IAccount, recipientAddress: string, value: number,
    message: string): Transaction {
    const tx: Transaction = new Transaction();
    const sig: Signature = new Signature();
    const sigArr: string[] = [];
    let today = new Date().toISOString();
    tx.from = senderAddress.address;
    tx.to = recipientAddress;
    tx.value = value;
    tx.fee = 10;
    tx.data = message;
    tx.dateCreated = today;
    tx.senderPubKey = senderAddress.publicKey;
    let sigKey = this.EC.keyFromPrivate(senderAddress.privateKey);
    let transactionHash = sha256(JSON.stringify(tx.from + tx.to + tx.value + tx.fee + tx.data + tx.senderPubKey));
    let signature = sigKey.sign(transactionHash);
    sig.rVal = signature.r.toString("hex");
    sig.sVal = signature.s.toString("hex");
    sigArr.push(sig.rVal, sig.sVal);
    tx.senderSignature = sigArr;
    console.log(tx);
    return tx;
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

  // private removeMnemonicFromStorage(): void {
  //   localStorage.removeItem('encryptedMnemonic');
  //   this.isMnemonicInStorage.next(false);
  // }

}
