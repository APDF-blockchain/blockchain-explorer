import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private myWebSocket: WebSocketSubject<any>;
  public myWebSocket$: Observable<any>;

  constructor(private httpClient: HttpClient) {
    this.initWS();
  }

  public getInfo(): Observable<any> {
    return this.httpClient.get(environment.endPoints.getInfo).pipe(first());
  }

  public getBlock(index: number): Observable<any> {
    const url = environment.endPoints.getBlock + '/' + index.toString();
    return this.httpClient.get(url);
  }

  public getBlocks(): Observable<any> {
    return this.httpClient.get(environment.endPoints.getBlocks);
  }

  public getConfirmedTx(): Observable<any> {
    return this.httpClient.get(environment.endPoints.getConfirmedTx);
  }

  public getPendingTx(): Observable<any> {
    return this.httpClient.get(environment.endPoints.getPendingTx);
  }

  public getTx(tranHash: string): Observable<any> {
    const url = environment.endPoints.getTx+ '/' + tranHash;
    return this.httpClient.get(url).pipe(first());
  }

  public getAddressTxs(address: string): Observable<any> {
    const url = environment.endPoints.getAddress + '/' + address + '/transactions';
    return this.httpClient.get(url).pipe(first());
  }

  public getAddressBalance(address: string): Observable<any> {
    const url = environment.endPoints.getAddress + '/' + address + '/balance';
    return this.httpClient.get(url).pipe(first());
  }

  private initWS() {
    this.myWebSocket = webSocket(environment.wsAddress);
    this.myWebSocket$ = this.myWebSocket.asObservable();
  }


}
