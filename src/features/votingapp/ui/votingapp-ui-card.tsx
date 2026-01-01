import { VotingappAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { VotingappUiButtonClose } from './votingapp-ui-button-close'
import { VotingappUiButtonDecrement } from './votingapp-ui-button-decrement'
import { VotingappUiButtonIncrement } from './votingapp-ui-button-increment'
import { VotingappUiButtonSet } from './votingapp-ui-button-set'

export function VotingappUiCard({ account, votingapp }: { account: UiWalletAccount; votingapp: VotingappAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Votingapp: {votingapp.data.count}</CardTitle>
        <CardDescription>
          Account: <AppExplorerLink address={votingapp.address} label={ellipsify(votingapp.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <VotingappUiButtonIncrement account={account} votingapp={votingapp} />
          <VotingappUiButtonSet account={account} votingapp={votingapp} />
          <VotingappUiButtonDecrement account={account} votingapp={votingapp} />
          <VotingappUiButtonClose account={account} votingapp={votingapp} />
        </div>
      </CardContent>
    </Card>
  )
}
