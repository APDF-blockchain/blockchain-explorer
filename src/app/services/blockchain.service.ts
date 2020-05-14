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
    this.initP2PServer();
  }

  public getBlocks(): Observable<any> {
    return this.httpClient.get('http://localhost:3002/blocks');
  }

  private initP2PServer() {
    this.myWebSocket = webSocket('ws://localhost:6002');
    this.myWebSocket$ = this.myWebSocket.asObservable();
  }

  // private initConnection(ws) {
  //   sockets.push(ws);
  //   // blockChainObject.addSocket(ws);
  //   // this.initMessageHandler(ws);
  //   // initErrorHandler(ws);
  //   // this.write(ws, queryChainLengthMsg());
  // }

  // private initMessageHandler(ws) {
  //   ws.on('message', (data) => {
  //       const message = JSON.parse(data);
  //       console.log('Received message' + JSON.stringify(message));
  //       switch (message.type) {
  //           case MessageType.QUERY_LATEST:
  //               this.write(ws, blockChainObject.responseLatestMsg());
  //               break;
  //           case MessageType.QUERY_ALL:
  //               this.write(ws, responseChainMsg());
  //               break;
  //           case MessageType.RESPONSE_BLOCKCHAIN:
  //               blockChainObject.handleBlockchainResponse(message);
  //               break;
  //       }
  //   });
  // }

  // private write(ws, message) {
  //   ws.send(JSON.stringify(message));
  // }


}
