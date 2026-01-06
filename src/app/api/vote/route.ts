import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS } from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

export const OPTIONS = GET;

export async function GET(request: Request) {
    const actionMetadata: ActionGetResponse = {
        icon: "https://media.gettyimages.com/id/75941645/photo/woman-scooping-peanut-butter-from-jar.jpg?s=612x612&w=0&k=20&c=etUc0P3NdZ6TdjKmTEURwQg74hTys7UL2FSjoFIzVYY=",
        title: "Vote for your favorite type of peanut butter",
        description: "vote between cruchy and smooth peanut butter",
        label: "Vote",
        links: {
            actions: [
                {
                    label: "Vote for crunchy",
                    href: "/api/vote?candidate=crunchy",
                    type: "transaction",
                },
                {
                    label: "Vote for crunchy",
                    href: "/api/vote?candidate=smooth",
                    type: "transaction",
                },
            ]
        }
    }
    return Response.json(actionMetadata, {
        headers: ACTIONS_CORS_HEADERS
    });
}


export async function POST(request: Request) {
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate");

    if (candidate != "crunchy" && candidate != "smooth") {
        return new Response("Invalid Credentials", {
            status: 400,
            headers: ACTIONS_CORS_HEADERS
        });
    }
    const connection = new Connection("https://127.0.0.1:8000", "confirmed");
    
    const body: ActionPostRequest = await request.json();
    let voter;

    try {
        voter = new PublicKey(body.account);
    } catch (error) {
        return new Response("Invalid account", {
            status: 400,
            headers: ACTIONS_CORS_HEADERS
        });
    }
}


// import { 
//     ActionGetResponse, 
//     ActionPostRequest, 
//     ActionPostResponse,
//     ACTIONS_CORS_HEADERS 
// } from "@solana/actions";
// import { 
//     Connection, 
//     PublicKey, 
//     Transaction,
//     clusterApiUrl 
// } from "@solana/web3.js";
// import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
// import idl from "./idl/voting.json"; // Your Anchor IDL

// const PROGRAM_ID = new PublicKey("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

// export const OPTIONS = GET;

// export async function GET(request: Request) {
//     const actionMetadata: ActionGetResponse = {
//         icon: "https://media.gettyimages.com/id/75941645/photo/woman-scooping-peanut-butter-from-jar.jpg?s=612x612&w=0&k=20&c=etUc0P3NdZ6TdjKmTEURwQg74hTys7UL2FSjoFIzVYY=",
//         title: "Vote for your favorite type of peanut butter",
//         description: "Vote between crunchy and smooth peanut butter",
//         label: "Vote",
//         links: {
//             actions: [
//                 {
//                     label: "Vote for Crunchy",
//                     href: "/api/vote?candidate=crunchy",
//                 },
//                 {
//                     label: "Vote for Smooth",
//                     href: "/api/vote?candidate=smooth",
//                 },
//             ]
//         }
//     };
    
//     return Response.json(actionMetadata, {
//         headers: ACTIONS_CORS_HEADERS
//     });
// }

// export async function POST(request: Request) {
//     const url = new URL(request.url);
//     const candidate = url.searchParams.get("candidate");

//     // Validate candidate
//     if (candidate !== "crunchy" && candidate !== "smooth") {
//         return new Response("Invalid candidate", {
//             status: 400,
//             headers: ACTIONS_CORS_HEADERS
//         });
//     }

//     // Get request body
//     const body: ActionPostRequest = await request.json();
    
//     let voter: PublicKey;
//     try {
//         voter = new PublicKey(body.account);
//     } catch (error) {
//         return new Response("Invalid account", {
//             status: 400,
//             headers: ACTIONS_CORS_HEADERS
//         });
//     }

//     // Connect to Solana
//     const connection = new Connection(
//         clusterApiUrl("devnet"), // or your RPC
//         "confirmed"
//     );

//     try {
//         // Create Anchor provider (without wallet for read-only operations)
//         const provider = new AnchorProvider(
//             connection,
//             {
//                 publicKey: voter,
//                 signTransaction: async (tx) => tx,
//                 signAllTransactions: async (txs) => txs,
//             } as any,
//             { commitment: "confirmed" }
//         );

//         const program = new Program(idl as any, PROGRAM_ID, provider);

//         const pollId = new BN(1); // Your poll ID

//         // Derive PDAs
//         const [pollAddress] = PublicKey.findProgramAddressSync(
//             [pollId.toArrayLike(Buffer, "le", 8)],
//             program.programId
//         );

//         const [candidateAddress] = PublicKey.findProgramAddressSync(
//             [pollId.toArrayLike(Buffer, "le", 8), Buffer.from(candidate)],
//             program.programId
//         );

//         const [voterRecordAddress] = PublicKey.findProgramAddressSync(
//             [pollId.toArrayLike(Buffer, "le", 8), voter.toBuffer()],
//             program.programId
//         );

//         // Build vote transaction
//         const transaction = await program.methods
//             .vote(candidate, pollId)
//             .accounts({
//                 signer: voter,
//                 poll: pollAddress,
//                 candidate: candidateAddress,
//                 voterRecord: voterRecordAddress,
//                 systemProgram: web3.SystemProgram.programId,
//             })
//             .transaction();

//         // Set recent blockhash
//         transaction.recentBlockhash = (
//             await connection.getLatestBlockhash()
//         ).blockhash;
//         transaction.feePayer = voter;

//         // Serialize transaction
//         const serializedTransaction = transaction.serialize({
//             requireAllSignatures: false,
//             verifySignatures: false,
//         });

//         const base64Transaction = serializedTransaction.toString("base64");

//         // Return response
//         const response: ActionPostResponse = {
//             transaction: base64Transaction,
//             message: `Vote recorded for ${candidate}!`,
//         };

//         return Response.json(response, {
//             headers: ACTIONS_CORS_HEADERS,
//         });

//     } catch (error: any) {
//         console.error("Error creating vote transaction:", error);
        
//         return new Response(
//             JSON.stringify({ 
//                 error: "Failed to create transaction",
//                 details: error.message 
//             }),
//             {
//                 status: 500,
//                 headers: ACTIONS_CORS_HEADERS,
//             }
//         );
//     }
// }