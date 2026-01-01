import { VotingappAccount, getDecrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useVotingappAccountsInvalidate } from './use-votingapp-accounts-invalidate'

export function useVotingappDecrementMutation({
  account,
  votingapp,
}: {
  account: UiWalletAccount
  votingapp: VotingappAccount
}) {
  const invalidateAccounts = useVotingappAccountsInvalidate()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ votingapp: votingapp.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
