import { PublicKey } from "@solana/web3.js";
import BN = require("bn.js");

export enum LoanTermsType{
  Fixed = 0,
  LenderChooses = 1
};

export type LoanTermsSpec = {
  loanTermsType: LoanTermsType;
  duration: BN;
};

export enum OrderBookType {
  Collection = 0,
  NFTList = 1,
};

export type OrderBook = {
  isInitialized: boolean;
  version: number;
  orderBookType: OrderBookType;
  collectionKey: PublicKey;
  apy: number;
  loanTerms: LoanTermsSpec;
};

export type OrderBookBuffer = {
  isInitialized: 0 | 1;
  version: number;
  orderBookType: OrderBookType;
  collectionKey: Uint8Array;
  apy: number;
  loanTerms: {
    loanTermsType: LoanTermsType;
    duration: Uint8Array;
  };
};

export enum SharkyInstruction {
  CREATE_ORDER_BOOK = 0,
  OFFER_LOAN = 1
}