import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useVotingappInitializeMutation } from '@/features/votingapp/data-access/use-votingapp-initialize-mutation'

export function VotingappUiButtonInitialize({ account }: { account: UiWalletAccount }) {
  const mutationInitialize = useVotingappInitializeMutation({ account })

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Votingapp {mutationInitialize.isPending && '...'}
    </Button>
  )
}
