// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Votingapp, VOTINGAPP_DISCRIMINATOR, VOTINGAPP_PROGRAM_ADDRESS, getVotingappDecoder } from './client/js'
import VotingappIDL from '../target/idl/votingapp.json'

export type VotingappAccount = Account<Votingapp, string>

// Re-export the generated IDL and type
export { VotingappIDL }

export * from './client/js'

export function getVotingappProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getVotingappDecoder(),
    filter: getBase58Decoder().decode(VOTINGAPP_DISCRIMINATOR),
    programAddress: VOTINGAPP_PROGRAM_ADDRESS,
  })
}
