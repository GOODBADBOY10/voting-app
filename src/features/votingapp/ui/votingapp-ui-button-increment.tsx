import { VotingappAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useVotingappIncrementMutation } from '../data-access/use-votingapp-increment-mutation'

export function VotingappUiButtonIncrement({ account, votingapp }: { account: UiWalletAccount; votingapp: VotingappAccount }) {
  const incrementMutation = useVotingappIncrementMutation({ account, votingapp })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}
