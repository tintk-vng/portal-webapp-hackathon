import useSWR, { Fetcher } from 'swr'

export default function useCustomSWR(key: any, fetcher: Fetcher) {
  return useSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })
}
