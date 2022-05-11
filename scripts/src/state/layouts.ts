import * as BufferLayout from "@solana/buffer-layout";
import { LoanTermsType, OrderBookBuffer, OrderBookType, SharkyInstruction } from "./types";

const Uint64Layout = (property = "uint64"): BufferLayout.Blob => {
  return BufferLayout.blob(8, property);
};

export const PublicKeyLayout = (property = "publicKey"): BufferLayout.Blob => {
  return BufferLayout.blob(32, property);
};


export const LoanTermsSpecLayout = BufferLayout.struct<{
  loanTermsType: LoanTermsType;
  duration: Uint8Array;
}>([
  BufferLayout.u8("loanTermsType"),
  Uint64Layout("duration"),
], "loanTerms");

export const OrderBookLayout = BufferLayout.struct<
  OrderBookBuffer
>([
  BufferLayout.u8("isInitialized"),
  BufferLayout.u8("version"),
  BufferLayout.u8("orderBookType"),
  PublicKeyLayout("collectionKey"),
  BufferLayout.u32("apy"),
  LoanTermsSpecLayout,
])

export const CreateOrderBookIXLayout = BufferLayout.struct<{
  instruction: SharkyInstruction.CREATE_ORDER_BOOK;
  orderBookType: OrderBookType;
  apy: number;
  loanTerms: {
    loanTermsType: LoanTermsType;
    duration: Uint8Array;
  }
}>([
  BufferLayout.u8("instruction"),
  BufferLayout.u8("orderBookType"),
  BufferLayout.u32("apy"),
  LoanTermsSpecLayout
])