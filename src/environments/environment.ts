// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const baseUrl = 'https://awesome-blockchain-node.herokuapp.com';
const wsAddress = 'ws://awesome-blockchain-node.herokuapp.com:6001';
// const baseUrl = 'http://localhost:3001';
// const wsAddress = 'ws://localhost:6001';

export const environment = {
  production: false,
  baseUrl,
  wsAddress,
  endPoints: {
    getInfo: baseUrl + '/info',
    getBlocks: baseUrl + '/blocks',
    getBlock: baseUrl + '/blocks',
    getConfirmedTx: baseUrl + '/transactions/confirmed',
    getPendingTx: baseUrl + '/transactions/pending',
    getTx: baseUrl + '/transactions',
    postTx: baseUrl + '/transactions/send',
    getAddress: baseUrl + '/address',
    getPeers: baseUrl + '/peers'
  },
  faucet: {
    faucetTxValue: 1000,
    faucetAccount: {
      address: 'd0618a61161d600c993093970ca4e75c56c978c41e0f85605bdf5c3fc24fe0c5',
      privateKey: 'cb3aabb88a7d00b2370558897b1f1e7a69a22815a5133da4db9d1d69d8ffbad2',
      publicKey: '0381753f1277e0c01302d7f4f3a474c78b3831bb9a3ab4c4619bbb3e4fcf3fd240'
    }
  },
  locationApiBaseUrl: 'https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=at_DFFOrPAQTWpQpvrhaTCO6xvB8N02X&'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
