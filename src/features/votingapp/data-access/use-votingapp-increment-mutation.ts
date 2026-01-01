import { VotingappAccount, getIncrementInstruction } from '@project/anchor'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useVotingappAccountsInvalidate } from './use-votingapp-accounts-invalidate'

export function useVotingappIncrementMutation({
  account,
  votingapp,
}: {
  account: UiWalletAccount
  votingapp: VotingappAccount
}) {
  const invalidateAccounts = useVotingappAccountsInvalidate()
  const signAndSend = useWalletUiSignAndSend()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ votingapp: votingapp.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
