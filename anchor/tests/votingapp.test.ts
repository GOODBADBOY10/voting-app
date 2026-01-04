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
  let votingProgram: Program<Voting>;

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
  });

  it('Initialize Poll', async () => {
    const pollId = new BN(1);

    // Derive the PDA using ONLY poll_id (no "poll" prefix)
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8)],
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
    const pollId = new BN(1);

    // Derive poll address
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8)],
      votingProgram.programId
    );

    // Derive smooth candidate address
    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), Buffer.from("smooth")],
      votingProgram.programId
    );

    // Initialize smooth candidate
    await votingProgram.methods
      .initializeCandidate("smooth", pollId)
      .accounts({
        poll: pollAddress,
        candidate: smoothAddress,
      })
      .rpc();

    // Derive crunchy candidate address
    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), Buffer.from("crunchy")],
      votingProgram.programId
    );

    // Initialize crunchy candidate
    await votingProgram.methods
      .initializeCandidate("crunchy", pollId)
      .accounts({
        poll: pollAddress,
        candidate: crunchyAddress,
      })
      .rpc();

    // Fetch and verify smooth candidate
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress);
    console.log("Smooth candidate:", smoothCandidate);
    expect(smoothCandidate.candidateName).toBe("smooth");
    expect(smoothCandidate.candidateVotes.toNumber()).toBe(0);

    // Fetch and verify crunchy candidate
    const crunchyCandidate = await votingProgram.account.candidate.fetch(crunchyAddress);
    console.log("Crunchy candidate:", crunchyCandidate);
    expect(crunchyCandidate.candidateName).toBe("crunchy");
    expect(crunchyCandidate.candidateVotes.toNumber()).toBe(0);

    // Verify poll candidate count was updated
    const poll = await votingProgram.account.poll.fetch(pollAddress);
    expect(poll.candidateAmount.toString()).toBe("2");
  });

  it('vote', async () => {
    const pollId = new BN(1);

    // Derive addresses
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8)],
      votingProgram.programId
    );

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), Buffer.from("crunchy")],
      votingProgram.programId
    );

    const [voterRecordAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), provider.wallet.publicKey.toBuffer()],
      votingProgram.programId
    );

    // Vote for crunchy
    await votingProgram.methods
      .vote("crunchy", pollId)
      .accounts({
        poll: pollAddress,
        candidate: crunchyAddress,
        voterRecord: voterRecordAddress,
      })
      .rpc();

    // Verify vote was counted
    const crunchyCandidate = await votingProgram.account.candidate.fetch(crunchyAddress);
    console.log("Crunchy candidate after vote:", crunchyCandidate);
    expect(crunchyCandidate.candidateVotes.toNumber()).toBe(1);

    // Verify voter record was created
    const voterRecord = await votingProgram.account.voterRecord.fetch(voterRecordAddress);
    console.log("Voter record:", voterRecord);
    expect(voterRecord.hasVoted).toBe(true);
  });

  it('vote - prevent double voting', async () => {
    const pollId = new BN(1);

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8)],
      votingProgram.programId
    );

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), Buffer.from("smooth")],
      votingProgram.programId
    );

    const [voterRecordAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), provider.wallet.publicKey.toBuffer()],
      votingProgram.programId
    );

    // Try to vote again - should fail
    try {
      await votingProgram.methods
        .vote("smooth", pollId)
        .accounts({
          poll: pollAddress,
          candidate: smoothAddress,
          voterRecord: voterRecordAddress,
        })
        .rpc();
      
      // If we get here, the test should fail
      throw new Error("Expected voting to fail but it succeeded");
    } catch (error: any) {
      // Verify it's the correct error
      expect(error.message).toContain("AlreadyVoted");
      console.log("Double voting correctly prevented");
    }
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