/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Caveats:
 *   - Per-instance. With multiple Railway replicas each gets its own window,
 *     so the effective limit is `limit * replicas`. Fine as a basic flood
 *     guard; for strict limits move to Redis/Upstash.
 *   - Lost on cold start / restart.
 */

type Bucket = { timestamps: number[] }

const buckets = new Map<string, Bucket>()

let lastSweep = 0
const SWEEP_INTERVAL_MS = 60_000

function sweep(now: number, windowMs: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return
  lastSweep = now
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs)
    if (bucket.timestamps.length === 0) buckets.delete(key)
  }
}

export type RateLimitResult = {
  success: boolean
  remaining: number
  resetInMs: number
}

export function checkRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): RateLimitResult {
  const { limit, windowMs } = options
  const now = Date.now()
  sweep(now, windowMs)

  const bucket = buckets.get(key) ?? { timestamps: [] }
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs)

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0]
    return {
      success: false,
      remaining: 0,
      resetInMs: Math.max(0, windowMs - (now - oldest)),
    }
  }

  bucket.timestamps.push(now)
  buckets.set(key, bucket)

  return {
    success: true,
    remaining: limit - bucket.timestamps.length,
    resetInMs: windowMs,
  }
}

/**
 * Best-effort client IP extraction for rate-limiting purposes.
 * Don't use for trust-sensitive decisions — clients can spoof headers
 * unless the app is strictly behind a known proxy.
 */
export function getClientKey(req: Request): string {
  const h = req.headers
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || h.get('cf-connecting-ip') || h.get('x-real-ip') || 'unknown'
}
