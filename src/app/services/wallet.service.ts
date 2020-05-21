import { Injectable } from '@angular/core';
import {ec} from 'elliptic';
import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'fs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() {
    console.log('Hello');
  }



}
