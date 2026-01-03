import { PublicKey } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { BN, Program } from "@coral-xyz/anchor";
import { Voting } from '../target/types/voting';
import * as anchor from "@coral-xyz/anchor";
import path from "path";

const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

describe('voting', () => {
  it('Initialize Poll', async () => {
    // Use absolute path to anchor directory
    const context = await startAnchor(
      path.join(__dirname, ".."), 
      [{ name: "voting", programId: votingAddress }],
      []
    );

    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Voting>(
      IDL,
      provider,
    );

    await votingProgram.methods
      .initializePoll(
        new anchor.BN(1),
        "what is your favorite type of peanut butter",
        new anchor.BN(0),
        new anchor.BN(1967442516),
      )
      .rpc();

    console.log("Poll initialized successfully!");
  });
});

// import { PublicKey } from "@solana/web3.js";
// import { BankrunProvider, startAnchor } from "anchor-bankrun";
// import { BN, Program } from "@coral-xyz/anchor";
// import * as anchor from "@coral-xyz/anchor";
// import { Voting } from '../target/types/voting';

// const IDL = require("../target/idl/voting.json");

// const votingAddress = new PublicKey("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

// describe('voting', () => {

//   it('Initialize Poll', async () => {
//     const context = await startAnchor(
//       "./",
//       [{ name: "voting", programId: votingAddress }],
//       []
//     );

//     const provider = new BankrunProvider(context);

//     const votingProgram = new Program<Voting>(
//       IDL,
//       provider,
//     );

//     await votingProgram.methods.initializePoll(
//       new anchor.BN(1),
//       "what is your favorite type of peanut butter",
//       new anchor.BN(0),
//       new anchor.BN(1967442516),
//     ).rpc();

//   });
// });