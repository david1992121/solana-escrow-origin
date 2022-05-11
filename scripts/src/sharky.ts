import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import BN = require("bn.js");
import { PROGRAM_ID } from "./instructions/common";
import { initializeCreateOrderBookInstructionRaw } from "./instructions/orderbook";
import { OrderBookLayout } from "./state/layouts";
import { LoanTermsType, OrderBookBuffer, OrderBookType } from "./state/types";
import { getKeypair, logError } from "./utils";

const sharky = async () => {
  const programID = new PublicKey(PROGRAM_ID);
  const newOrderBookKeypair = new Keypair();
  const connection = new Connection("http://localhost:8899", "confirmed");
  const creatorKeypair = getKeypair("alice");

  await connection.requestAirdrop(creatorKeypair.publicKey, LAMPORTS_PER_SOL * 10);

  const collectionKey = new Keypair();

  console.log(OrderBookLayout.span);

  const createOrderBookAccountIx = SystemProgram.createAccount({
    programId: programID,
    space: OrderBookLayout.span,
    lamports: await connection.getMinimumBalanceForRentExemption(
      OrderBookLayout.span
    ),
    fromPubkey: creatorKeypair.publicKey,
    newAccountPubkey: newOrderBookKeypair.publicKey,
  });

  const createOrderBookIx = initializeCreateOrderBookInstructionRaw({
    creator: creatorKeypair.publicKey,
    orderBookPubkey: newOrderBookKeypair.publicKey,
    collectionKey: collectionKey.publicKey,
    orderBookType: OrderBookType.Collection,
    apy: 10,
    loanTerms: {
      loanTermsType: LoanTermsType.Fixed,
      duration: new BN("100")
    }
  });

  const tx = new Transaction().add(
    createOrderBookAccountIx,
    createOrderBookIx
  );

  console.log("Sending Create Orderbook Instruction ...");
  await connection.sendTransaction(
    tx,
    [creatorKeypair, newOrderBookKeypair],
    { skipPreflight: false, preflightCommitment: "confirmed" }
  );

  console.log("Now waiting for a while ...");

  // sleep to allow time to update
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // get order book info
  const orderBookAccount = await connection.getAccountInfo(
    newOrderBookKeypair.publicKey
  );

  if (orderBookAccount === null || orderBookAccount.data.length === 0) {
    logError("Escrow state account has not been initialized properly");
    process.exit(1);
  }

  const encodedOrderBookState = orderBookAccount.data;
  const decodedOrderBook = OrderBookLayout.decode(
    encodedOrderBookState
  ) as OrderBookBuffer;

  console.log(decodedOrderBook);
}

sharky();