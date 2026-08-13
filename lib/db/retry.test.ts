import { describe, expect, it, vi } from 'vitest'

import {
  isTransientDatabaseError,
  withTransientDatabaseRetry,
} from './retry'

describe('database retry handling', () => {
  it('recognises transient errors nested by the query layer', () => {
    const error = new Error('Failed query', {
      cause: Object.assign(new Error('read ECONNRESET'), { code: 'ECONNRESET' }),
    })

    expect(isTransientDatabaseError(error)).toBe(true)
  })

  it('does not classify validation or authentication errors as transient', () => {
    expect(isTransientDatabaseError(new Error('password authentication failed'))).toBe(false)
  })

  it('retries a safe operation and returns its eventual result', async () => {
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(
        Object.assign(new Error('write CONNECT_TIMEOUT'), { code: 'CONNECT_TIMEOUT' }),
      )
      .mockResolvedValue('connected')

    await expect(
      withTransientDatabaseRetry(operation, { baseDelayMilliseconds: 0 }),
    ).resolves.toBe('connected')
    expect(operation).toHaveBeenCalledTimes(2)
  })

  it('does not retry non-transient failures', async () => {
    const operation = vi.fn<() => Promise<string>>().mockRejectedValue(
      Object.assign(new Error('invalid credentials'), { code: '28P01' }),
    )

    await expect(
      withTransientDatabaseRetry(operation, { baseDelayMilliseconds: 0 }),
    ).rejects.toThrow('invalid credentials')
    expect(operation).toHaveBeenCalledOnce()
  })
})
