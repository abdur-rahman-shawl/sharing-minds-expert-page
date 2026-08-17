const TRANSIENT_DATABASE_ERROR_CODES = new Set([
  'CONNECT_TIMEOUT',
  'ECONNREFUSED',
  'ECONNRESET',
  'EPIPE',
  'ETIMEDOUT',
  'EAI_AGAIN',
  '57P01',
  '57P02',
  '57P03',
])

const TRANSIENT_DATABASE_MESSAGE_PATTERNS = [
  'connect_timeout',
  'connection terminated unexpectedly',
  'connection reset',
  'connection closed',
  'socket hang up',
  'timeout expired',
]

function errorChain(error: unknown): Array<Record<string, unknown>> {
  const chain: Array<Record<string, unknown>> = []
  const seen = new Set<unknown>()
  let current = error

  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current)
    const record = current as Record<string, unknown>
    chain.push(record)
    current = record.cause
  }

  return chain
}

export function isTransientDatabaseError(error: unknown): boolean {
  return errorChain(error).some(candidate => {
    const code = typeof candidate.code === 'string' ? candidate.code.toUpperCase() : ''
    const message =
      typeof candidate.message === 'string' ? candidate.message.toLowerCase() : ''

    return (
      TRANSIENT_DATABASE_ERROR_CODES.has(code) ||
      TRANSIENT_DATABASE_MESSAGE_PATTERNS.some(pattern => message.includes(pattern))
    )
  })
}

export async function withTransientDatabaseRetry<T>(
  operation: () => Promise<T>,
  options: {
    attempts?: number
    baseDelayMilliseconds?: number
  } = {},
): Promise<T> {
  const attempts = Math.max(1, options.attempts ?? 3)
  const baseDelayMilliseconds = Math.max(0, options.baseDelayMilliseconds ?? 250)

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === attempts || !isTransientDatabaseError(error)) throw error

      const delay = baseDelayMilliseconds * 2 ** (attempt - 1)
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error('Database retry attempts were exhausted')
}
