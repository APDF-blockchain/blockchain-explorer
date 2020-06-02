import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { first } from 'rxjs/operators';

const IS_MOCK_MODE = false;
const BASE_URL = IS_MOCK_MODE ? 'https://stormy-everglades-34766.herokuapp.com' : 'http://localhost:3001';
const WS_ADDRESS = 'ws://localhost:6001';
const ENDPOINTS = {
  GET_INFO: BASE_URL + '/info',
  GET_BLOCKS: BASE_URL + '/blocks',
  GET_BLOCK: BASE_URL + '/blocks',
  GET_CONFIRMED_TX: BASE_URL + '/transactions/confirmed',
  GET_PENDING_TX: BASE_URL + '/transactions/pending',
  GET_TX: BASE_URL + '/transactions',
  GET_ADD: BASE_URL +  '/address'
};

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
    return this.httpClient.get(ENDPOINTS.GET_INFO).pipe(first());
  }

  public getBlock(index: number): Observable<any> {
    console.log(index);
    // const options = { params: new HttpParams().set('index', index.toString()) };
    const url = ENDPOINTS.GET_BLOCK + '/' + index.toString();
    return this.httpClient.get(url);
  }

  public getBlocks(): Observable<any> {
    return this.httpClient.get(ENDPOINTS.GET_BLOCKS);
  }

  public getConfirmedTx(): Observable<any> {
    return this.httpClient.get(ENDPOINTS.GET_CONFIRMED_TX);
  }

  public getPendingTx(): Observable<any> {
    return this.httpClient.get(ENDPOINTS.GET_PENDING_TX);
  }

  public getTx(tranHash: string): Observable<any> {
    const url = ENDPOINTS.GET_TX + '/' + tranHash;
    return this.httpClient.get(url).pipe(first());
  }

  public getAddressTxs(address: string): Observable<any> {
    const url = ENDPOINTS.GET_ADD + '/' + address + '/transactions';
    return this.httpClient.get(url).pipe(first());
  }

  public getAddressBalance(address: string): Observable<any> {
    const url = ENDPOINTS.GET_ADD + '/' + address + '/balance';
    return this.httpClient.get(url).pipe(first());
  }

  private initWS() {
    this.myWebSocket = webSocket(WS_ADDRESS);
    this.myWebSocket$ = this.myWebSocket.asObservable();
  }


}
