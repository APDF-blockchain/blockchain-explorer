export interface INodeInfo {
    about: string;
    nodeId: string;
    chainId: string;
    nodeUrl: string;
    peers: number;
    currentDifficulty: number;
    blockCount: number;
    cumulativeDifficulty: number;
    confirmedTransactions: number;
    pendingTransactions: number;
}
