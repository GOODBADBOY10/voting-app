import { useSolana } from '@/components/solana/use-solana'

export function useVotingappAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['votingapp', 'accounts', { cluster }]
}
