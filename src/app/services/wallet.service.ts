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
import { Observable, BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { IHDWallet, IAccount } from '../model/wallet';

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

  public wallet: any;

  /**
   * @description - the wallet directory
   */
  private walletDirectory = 'node/wallet/';


  constructor(/*private transactionService: TransactionService,*/ private httpClient: HttpClient, /*private walletCreationComp: WalletCreationComponent*/) {
    console.log('Hello');
    this.hdWallet = new BehaviorSubject(null);
    this.hdWallet$ = this.hdWallet.asObservable();
  }

  public async createWallet(password: string): Promise<string> {
    const mnemonic = bip39.generateMnemonic();
    this.storeMnemonic(password, mnemonic);
    const hdWallet = this.loadHDWallet(password, mnemonic);
    this.hdWallet.next(hdWallet);
    console.log(hdWallet);
    return hdWallet.mnemonic;
  }

  public restoreWallet(password: string, mnemonic: string): void {
    this.storeMnemonic(password, mnemonic);
    const hdWallet = this.loadHDWallet(password, mnemonic);
    this.hdWallet.next(hdWallet);
  }

  public logout(): void {
    this.removeMnemonicFromStorage();
    this.hdWallet.next(null);
  }

  public getStoredMnemonic(password: string): string{
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

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('encryptedMnemonic');
  }

  // private jsonFile(password: string) : {'mnemonic': string, 'filename': string} {
  //   const randomEntropyBytes = ethers.utils.randomBytes(16);
  //   const mnemonic = ethers.utils.HDNode.entropyToMnemonic(randomEntropyBytes);
  //   const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  //   const filename = "UTC_JSON_WALLET_" + Math.round(+ new Date() / 1000) + "_" + +(Math.floor(Math.random() * 200001) - 10000) + ".json";

  //   wallet.encrypt(password).then((jsonWallet) => {
  //     writeFileSync(this.walletDirectory + filename, jsonWallet, 'utf-8');
  //   });
  //   let rVal = { 'mnemonic': mnemonic, 'filename': filename };
  //   return rVal;
  // }

  public getBalance(address: string, unspentTxOuts: UnspentTxOut[]): number {
    return _(unspentTxOuts)
      .filter((uTxO: UnspentTxOut) => uTxO.address === address)
      .map((uTxO: UnspentTxOut) => uTxO.amount)
      .sum();
    // let rVal: number = 0;
    // for (let i = 0; i < unspentTxOuts.length; i++) {
    //   if (unspentTxOuts[i].address === address) {
    //     rVal += unspentTxOuts[i].amount;
    //   }
    // }
    // return rVal;
  }

  // public findTxOutsForAmount(amount: number, myUnspentTxOuts: UnspentTxOut[]) {
  //   let currentAmount = 0;
  //   const includedUnspentTxOuts = [];
  //   for (const myUnspentTxOut of myUnspentTxOuts) {
  //     includedUnspentTxOuts.push(myUnspentTxOut);
  //     currentAmount = currentAmount + myUnspentTxOut.amount;
  //     if (currentAmount >= amount) {
  //       const leftOverAmount = currentAmount - amount;
  //       return { includedUnspentTxOuts, leftOverAmount };
  //     }
  //   }
  //   throw Error('not enough coins to send transaction');
  // }

  // public createTxOuts(receiverAddress: string, myAddress: string, amount: number, leftOverAmount: number) {
  //   const txOut1: TxOut = new TxOut(receiverAddress, amount);
  //   if (leftOverAmount === 0) {
  //     return [txOut1];
  //   } else {
  //     const leftOverTx = new TxOut(myAddress, leftOverAmount);
  //     return [txOut1, leftOverTx];
  //   }
  // }

  public convertDateToUTC(date) { return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); }

  public createTransaction(senderAddress: string, recipientAddress: string, value: number,
    message: string): Transaction {
    const tx: Transaction = new Transaction();
    const sig: Signature = new Signature();
    //const s : WalletCreationComponent;
    let today = new Date();
    //let sigArr: string[] = [];
    let _wallets: any[] = this.walletCreationComp.allWallets;
    for (let i = 0; i < _wallets.length; i++) {
      if (_wallets[i].address === senderAddress) {
        tx.from === _wallets[i].address;
        tx.to === recipientAddress;
        tx.value === value;
        tx.fee === 10;
        tx.data === message;
        tx.dateCreated === this.convertDateToUTC(today);
        tx.senderPubKey === _wallets[i].publicKey;
        let transactionHash = sha256(JSON.stringify(tx.from + tx.to + tx.value + tx.fee + tx.data + tx.senderPubKey));
        let signature = this.EC.sign(transactionHash, _wallets[i].privateKey, "hex", { canonical: true });
        sig.rVal === signature.r.toString("hex");
        sig.sVal === signature.s.toString("hex");
        //sigArr.push(sig.rVal, sig.sVal);
        tx.senderSignature === [sig.rVal, sig.sVal];
        console.log("Transaction : " + tx);
        console.log("Transaction Date : " + tx.dateCreated);
        console.log("Transaction Sig : " + tx.senderSignature);
      }
    }
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
  }

  private removeMnemonicFromStorage(): void {
    localStorage.removeItem('encryptedMnemonic');
  }

}
