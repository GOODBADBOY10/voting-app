import { useQueryClient } from '@tanstack/react-query'
import { useVotingappAccountsQueryKey } from './use-votingapp-accounts-query-key'

export function useVotingappAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useVotingappAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}
