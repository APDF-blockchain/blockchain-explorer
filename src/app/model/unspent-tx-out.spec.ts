import { UnspentTxOut } from './unspent-tx-out';

describe('UnspentTxOut', () => {
  it('should create an instance', () => {
    expect(new UnspentTxOut()).toBeTruthy();
  });
});
