import { VotingappAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useVotingappCloseMutation } from '@/features/votingapp/data-access/use-votingapp-close-mutation'

export function VotingappUiButtonClose({ account, votingapp }: { account: UiWalletAccount; votingapp: VotingappAccount }) {
  const closeMutation = useVotingappCloseMutation({ account, votingapp })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
