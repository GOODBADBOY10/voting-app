import { VotingappAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useVotingappSetMutation } from '@/features/votingapp/data-access/use-votingapp-set-mutation'

export function VotingappUiButtonSet({ account, votingapp }: { account: UiWalletAccount; votingapp: VotingappAccount }) {
  const setMutation = useVotingappSetMutation({ account, votingapp })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', votingapp.data.count.toString() ?? '0')
        if (!value || parseInt(value) === votingapp.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}
