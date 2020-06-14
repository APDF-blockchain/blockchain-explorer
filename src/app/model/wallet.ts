export interface IHDWallet {
    mnemonic: string;
    accounts: IAccount[];
}

export interface IAccount {
    publicKey: string;
    privateKey: string;
    address: string;
    confirmedBalance?: number;
}
