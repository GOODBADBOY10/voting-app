import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { VotingappUiButtonInitialize } from './ui/votingapp-ui-button-initialize'
import { VotingappUiList } from './ui/votingapp-ui-list'
import { VotingappUiProgramExplorerLink } from './ui/votingapp-ui-program-explorer-link'
import { VotingappUiProgramGuard } from './ui/votingapp-ui-program-guard'

export default function VotingappFeature() {
  const { account } = useSolana()

  return (
    <VotingappUiProgramGuard>
      <AppHero
        title="Votingapp"
        subtitle={
          account
            ? "Initialize a new votingapp onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <VotingappUiProgramExplorerLink />
        </p>
        {account ? (
          <VotingappUiButtonInitialize account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <VotingappUiList account={account} /> : null}
    </VotingappUiProgramGuard>
  )
}
