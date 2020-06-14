import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ILocationApiResponse } from '../model/locationApiResponse';
import { INodeInfo } from '../model/nodeInfo';
import * as psl from 'psl';
import { extractHostname } from '../utils/extractHostname';
import { IGeoJson } from '../model/geoJSON';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private myWebSocket: WebSocketSubject<any>;
  private mapDataStream: BehaviorSubject<IGeoJson>;
  public myWebSocket$: Observable<any>;
  public mapDataStream$: Observable<IGeoJson>;

  constructor(private httpClient: HttpClient) {
    this.mapDataStream = new BehaviorSubject(null);
    this.mapDataStream$ = this.mapDataStream.asObservable();
    this.initPeers();
    this.initWS();
  }

  public getInfo(): Observable<any> {
    return this.httpClient.get(environment.endPoints.getInfo).pipe(
      first(),
      map((info: INodeInfo) => {
        const domain = psl.get(extractHostname(info.nodeUrl));
        const query = 'domain=' + domain; // TODO: change for real domain
        this.httpClient.get(environment.locationApiBaseUrl + query).pipe(
            first(),
          ).subscribe((res: ILocationApiResponse) => {
            try {
              const location = [+res.location.lng, +res.location.lat];
              const geoJson = this.fromatGeoJSON(info.nodeUrl, location);
              this.mapDataStream.next(geoJson);
            } catch (err) {
              console.log('ERRORRR');
            }
        });
        return info;
      })
    );
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

  private initPeers(): void {
    const url = environment.endPoints.getPeers;
    this.httpClient.get(url).subscribe((peers: string[]) => {
      peers.forEach(peer => {
        if (peer.includes('localhost')) {
          navigator.geolocation.getCurrentPosition((position) => {
            const location = [+position.coords.longitude, +position.coords.latitude];
            const geoJson = this.fromatGeoJSON(peer, location);
            setTimeout(() => {
              this.mapDataStream.next(geoJson);
            }, 1000);
          }, err => console.log('MEGA ERRROR '), { timeout: 10000 });
        } else {
          const query = 'domain=' + 'awesome-blockchain-node.herokuapp.com'; // TODO: change for real domain
          this.httpClient.get(environment.locationApiBaseUrl + query).pipe(
            first(),
          ).subscribe((res: ILocationApiResponse) => {
            try {
              const location = [+res.location.lng, +res.location.lat];
              const geoJson = this.fromatGeoJSON(peer, location);
              this.mapDataStream.next(geoJson);
            } catch (err) {
              console.log('ERRORRR');
            }
          });
        }
      });
    },
    err => console.log(err)
    );
  }

  private initWS() {
    this.myWebSocket = webSocket(environment.wsAddress);
    this.myWebSocket$ = this.myWebSocket.asObservable();
  }

  private fromatGeoJSON(peer: string, location: number[]): IGeoJson {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: location
      },
      properties: {
        url: peer
      }
    };
  }


}
