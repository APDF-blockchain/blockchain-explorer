import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private myWebSocket: WebSocketSubject<any>;
  public myWebSocket$: Observable<any>;

  constructor(private httpClient: HttpClient) {
    this.initWS();
  }

  public getBlocks(): Observable<any> {
    return this.httpClient.get('http://localhost:3002/blocks');
  }

  private initWS() {
    this.myWebSocket = webSocket('ws://localhost:6002');
    this.myWebSocket$ = this.myWebSocket.asObservable();
  }

}
