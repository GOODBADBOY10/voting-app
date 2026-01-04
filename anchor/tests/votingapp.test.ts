import { PublicKey } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { BN, Program } from "@coral-xyz/anchor";
import { Voting } from '../target/types/voting';
import * as anchor from "@coral-xyz/anchor";
import path from "path";

const IDL = require("../target/idl/voting.json");

const votingAddress = new PublicKey("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

describe('voting', () => {

  let context;
  let provider;
  let votingProgram;

  beforeAll(async () => {
    context = await startAnchor(
      path.join(__dirname, ".."),
      [{ name: "voting", programId: votingAddress }],
      []
    );

    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider,
    );
  })

  it('Initialize Poll', async () => {
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

    const pollId = new BN(1);

    // Derive the PDA using ONLY poll_id (no "poll" prefix)
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8)],  // Only poll_id, no b"poll"
      votingProgram.programId
    );

    console.log("Expected poll address:", pollAddress.toBase58());

    await votingProgram.methods
      .initializePoll(
        pollId,
        "what is your favorite type of peanut butter",
        new BN(0),
        new BN(1967442516),
      )
      .accounts({
        poll: pollAddress,
      })
      .rpc();

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log("Poll created:", poll);

    expect(poll.pollId.toString()).toBe(pollId.toString());
    expect(poll.description).toBe("what is your favorite type of peanut butter");
    expect(poll.pollStart.toString()).toBe("0");
    expect(poll.pollEnd.toString()).toBe("1967442516");
    expect(poll.candidateAmount.toString()).toBe("0");
  });

  it('initialize candidate', async () => {
    await votingProgram.methods.initializeCandidate(
      "smooth",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "cruchy",
      new anchor.BN(1),
    ).rpc();

    const [cruchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      Buffer.from("cruchy")],
      votingAddress,
    );

    const cruchyCandidate = await votingProgram.candidate.fetch(cruchyAddress);
    console.log(cruchyCandidate);
    expect(cruchyCandidate.candidateVotes.toNumber()).toEqual(0);

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      Buffer.from("smooth")],
      votingAddress,
    );

    const smoothCandidate = await votingProgram.candidate.fetch(smoothAddress);
    console.log(smoothCandidate);
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);

  })


  it('vote', async () => { })

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