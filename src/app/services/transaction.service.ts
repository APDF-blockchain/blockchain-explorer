import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256';
import { Transaction } from '../model/transaction';
import { ec } from 'elliptic';
import * as _ from 'lodash';
import { IAccount } from '../model/wallet';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Signature } from '../model/signature';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  public EC = new ec('secp256k1');

  constructor(private httpClient: HttpClient) { }

  public sendTransaction(senderAddress: IAccount, recipientAddress: string, value: number,
                         message: string): Observable<any> {
    const transaction = this.createTransaction(senderAddress, recipientAddress, value, message);
    const url = environment.endPoints.postTx;
    console.log(url);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    return this.httpClient.post<any>(url, transaction, httpOptions).pipe(first());
  }

  private createTransaction(senderAddress: IAccount, recipientAddress: string, value: number,
                            message: string): Transaction {
    const tx: Transaction = new Transaction();
    const sig: Signature = new Signature();
    const sigArr: string[] = [];
    const today = new Date().toISOString();
    tx.from = senderAddress.address;
    tx.to = recipientAddress;
    tx.value = value;
    tx.fee = 10;
    tx.data = message;
    tx.dateCreated = today;
    tx.senderPubKey = senderAddress.publicKey;
    const sigKey = this.EC.keyFromPrivate(senderAddress.privateKey);
    const transactionHash = sha256(JSON.stringify(tx.from + tx.to + tx.value + tx.fee + tx.data + tx.senderPubKey));
    tx.transactionDataHash = transactionHash;
    const signature = sigKey.sign(transactionHash);
    sig.rVal = signature.r.toString('hex');
    sig.sVal = signature.s.toString('hex');
    sigArr.push(sig.rVal, sig.sVal);
    tx.senderSignature = sigArr;
    console.log(tx);
    return tx;
  }

}
