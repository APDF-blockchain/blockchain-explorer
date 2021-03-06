/**
 * @classdesc - This class contains the attributes for a transaction
 * @class Transaction
 */
export class Transaction {
  /**
   * @description - from address(40 hex digits)
   */
  public from: string;
  /**
   * @description - to address(40 hex digits)
   */
  public to: string;
  /**
   * @description - non-negative number
   */
  public value: number;
  /**
   * @description - non-negative number
   */
  public fee: number;
  /**
   * @description - ISO8601 date
   */
  public dateCreated: string;
  /**
   * @description - string (optional)
   */
  public data: string;
  /**
   * @description - hex number[65]
   */
  public senderPubKey: string;
  /**
   * @description - hex number
   */
  //public transactionDataHash: string;
  /**
   * @description - hex number[2][64]
   */
  public senderSignature: string[] = [];

  /**
   * @description - hash of the transaction
   */
  public transactionDataHash: string;

  /**
   * @description - default empty constructor
   * @constructor
   */
  constructor() {

  }

}
