import { Injectable } from '@angular/core';
import { ec } from 'elliptic';
import * as _ from 'lodash';

// import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
// import { ethers } from 'ethers';

import { TransactionService } from './transaction.service';
import { UnspentTxOut } from '../model/unspent-tx-out';
import { TxOut } from '../model/tx-out';
import { Transaction } from '../model/transaction';
import { TxIn } from '../model/tx-in';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  public EC = new ec('secp256k1');
  private privateKeyLocation = 'node/wallet/private_key';
  private baseUrl = 'http://localhost:3001/';
  private walletUrl = 'http://localhost:4001/';

  public wallet: any;

  /**
   * @description - the wallet directory
   */
  private walletDirectory = 'node/wallet/';


  constructor(private transactionService: TransactionService, private httpClient: HttpClient) {
    console.log('Hello');
  }

  public createWallet(password: string): Observable<any> {
    const url = this.walletUrl + `wallet/create/${password}`;
    //const options = { params: new HttpParams().set('password', password) };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.post(url, httpOptions);
  }

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

  public findTxOutsForAmount(amount: number, myUnspentTxOuts: UnspentTxOut[]) {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
      includedUnspentTxOuts.push(myUnspentTxOut);
      currentAmount = currentAmount + myUnspentTxOut.amount;
      if (currentAmount >= amount) {
        const leftOverAmount = currentAmount - amount;
        return { includedUnspentTxOuts, leftOverAmount };
      }
    }
    throw Error('not enough coins to send transaction');
  }

  public createTxOuts(receiverAddress: string, myAddress: string, amount: number, leftOverAmount: number) {
    const txOut1: TxOut = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
      return [txOut1];
    } else {
      const leftOverTx = new TxOut(myAddress, leftOverAmount);
      return [txOut1, leftOverTx];
    }
  }

  public createTransaction(receiverAddress: string, amount: number,
    privateKey: string, unspentTxOuts: UnspentTxOut[]): Transaction {

    const myAddress: string = this.transactionService.getPublicKey(privateKey);
    const myUnspentTxOuts = unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === myAddress);

    const { includedUnspentTxOuts, leftOverAmount } = this.findTxOutsForAmount(amount, myUnspentTxOuts);

    const toUnsignedTxIn = (unspentTxOut: UnspentTxOut) => {
      const txIn: TxIn = new TxIn();
      txIn.txOutId = unspentTxOut.txOutId;
      txIn.txOutIndex = unspentTxOut.txOutIndex;
      return txIn;
    }

    const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(toUnsignedTxIn);

    const tx: Transaction = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = this.createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = this.transactionService.getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn: TxIn, index: number) => {
      txIn.signature = this.transactionService.signTxIn(tx, index, privateKey, unspentTxOuts);
      return txIn;
    });

    return tx;
  }
}
