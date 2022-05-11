import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { CreateOrderBookIXLayout } from "../state/layouts";
import { LoanTermsSpec, SharkyInstruction } from "../state/types";
import { PROGRAM_ID } from "./common";


export interface CreateOrderBookInstruction {
  creator: PublicKey; 
  orderBookPubkey: PublicKey;
  collectionKey: PublicKey;
  orderBookType: number;
  apy: number;
  loanTerms: LoanTermsSpec;
}

export const initializeCreateOrderBookInstructionRaw = (
  instruction: CreateOrderBookInstruction
): TransactionInstruction => {
  const keys = [
    { pubkey: instruction.creator, isSigner: true, isWritable: true},
    { pubkey: instruction.collectionKey, isSigner: false, isWritable: false},
    { pubkey: instruction.orderBookPubkey, isSigner: false, isWritable: true},
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
  ];

  const data = Buffer.alloc(CreateOrderBookIXLayout.span);
  CreateOrderBookIXLayout.encode({
    instruction: SharkyInstruction.CREATE_ORDER_BOOK,
    orderBookType: instruction.orderBookType,
    apy: instruction.apy,
    loanTerms: {
      loanTermsType: instruction.loanTerms.loanTermsType,
      duration: Uint8Array.of(...instruction.loanTerms.duration.toArray("le", 8))
    }
  }, data);

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(PROGRAM_ID),
    data,
  });
}