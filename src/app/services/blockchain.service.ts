import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// var dns = require('dns');

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
    const url = environment.endPoints.getTx + '/' + tranHash;
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

  public getPeers(): Observable<any> {
    const url = environment.endPoints.getPeers;
    // var w3 = dns.lookup('w3schools.com', function (err, addresses, family) {
    //   console.log(addresses);
    // });
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
   });
    // this.httpClient.get('https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=at_DFFOrPAQTWpQpvrhaTCO6xvB8N02X&ipAddress=127.0.0.1').subscribe(res => {
    //   console.log(res);
    // });
    // return this.httpClient.get(url).pipe(first());
    return of([
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-73.585071, 45.4696563]
        }
      }
    ]);
  }

  private initWS() {
    this.myWebSocket = webSocket(environment.wsAddress);
    this.myWebSocket$ = this.myWebSocket.asObservable();
  }


}
