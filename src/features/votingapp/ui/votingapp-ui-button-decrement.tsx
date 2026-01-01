import { VotingappAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useVotingappDecrementMutation } from '../data-access/use-votingapp-decrement-mutation'

export function VotingappUiButtonDecrement({ account, votingapp }: { account: UiWalletAccount; votingapp: VotingappAccount }) {
  const decrementMutation = useVotingappDecrementMutation({ account, votingapp })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}
