import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getVotingappProgramAccounts } from '@project/anchor'
import { useVotingappAccountsQueryKey } from './use-votingapp-accounts-query-key'

export function useVotingappAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useVotingappAccountsQueryKey(),
    queryFn: async () => await getVotingappProgramAccounts(client.rpc),
  })
}
