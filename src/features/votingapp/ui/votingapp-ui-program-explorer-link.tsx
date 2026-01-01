import { VOTINGAPP_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function VotingappUiProgramExplorerLink() {
  return <AppExplorerLink address={VOTINGAPP_PROGRAM_ADDRESS} label={ellipsify(VOTINGAPP_PROGRAM_ADDRESS)} />
}
