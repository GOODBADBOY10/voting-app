import { VotingappUiCard } from './votingapp-ui-card'
import { useVotingappAccountsQuery } from '@/features/votingapp/data-access/use-votingapp-accounts-query'
import { UiWalletAccount } from '@wallet-ui/react'

export function VotingappUiList({ account }: { account: UiWalletAccount }) {
  const votingappAccountsQuery = useVotingappAccountsQuery()

  if (votingappAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!votingappAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {votingappAccountsQuery.data?.map((votingapp) => (
        <VotingappUiCard account={account} key={votingapp.address} votingapp={votingapp} />
      ))}
    </div>
  )
}
