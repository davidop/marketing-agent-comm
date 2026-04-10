/**
 * Shim for @github/spark/hooks
 * Replaces Spark KV with localStorage to avoid rate limiting in local development.
 */
export { useKV } from './useKV'
