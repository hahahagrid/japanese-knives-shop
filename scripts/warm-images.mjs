/**
 * Прогрев кеша оптимизированных картинок (/_next/image).
 *
 * Зачем: Next генерирует каждый вариант (файл × ширина × качество) при первом
 * запросе (~1.5с на вариант), и только потом его запоминают origin и Cloudflare.
 * Без прогрева первый посетитель каждой страницы ножа ждёт фото 2-3 секунды.
 * Кеш origin'а стирается при каждом деплое, новые фото из админки всегда холодные.
 *
 * Скрипт берёт товары и статьи из публичного Payload API и запрашивает те
 * варианты, которые реально выбирают браузеры (см. sizes в KnifeCard /
 * KnifeGallery / LatestPosts / blog/[slug]).
 *
 * Запуск: node scripts/warm-images.mjs
 * База переопределяется через WARM_BASE_URL (по умолчанию продакшн).
 */

const BASE = process.env.WARM_BASE_URL || 'https://japanese-kitchen-knives.com.ua'
const CONCURRENCY = 8

// Ширины подобраны под реальные sizes-атрибуты и DPR 1x/2x/3x
const HERO_WIDTHS = [640, 750, 1080, 1200] // KnifeGallery, q=75, оригинал файла
const HERO_WIDTHS_SECONDARY = [750, 1200] // остальные фото галереи (листание)
const CARD_WIDTHS = [384, 640, 750] // KnifeCard в каталоге/рекомендациях, q=65, size card
const THUMB_WIDTHS = [128, 256] // лента миниатюр галереи, q=65, size thumbnail
const BLOG_WIDTHS = [640, 828, 1080, 1920] // обложка статьи + LatestPosts, q=75, size tablet

const variantUrl = (fileUrl, w, q) =>
  `${BASE}/_next/image?url=${encodeURIComponent(fileUrl)}&w=${w}&q=${q}`

const targets = new Set()

const addVariants = (fileUrl, widths, q) => {
  if (!fileUrl) return
  for (const w of widths) targets.add(variantUrl(fileUrl, w, q))
}

const fetchJson = async (path) => {
  const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`)
  return res.json()
}

// --- Собираем список вариантов ---

const { docs: products } = await fetchJson('/api/products?limit=300&depth=1')
for (const product of products) {
  const images = (product.images || []).filter((img) => img && typeof img === 'object')
  images.forEach((img, i) => {
    addVariants(img.url, i === 0 ? HERO_WIDTHS : HERO_WIDTHS_SECONDARY, 75)
    if (i < 2) addVariants(img.sizes?.card?.url, CARD_WIDTHS, 65)
    if (i < 5) addVariants(img.sizes?.thumbnail?.url, THUMB_WIDTHS, 65)
  })
}

const { docs: posts } = await fetchJson('/api/posts?limit=100&depth=1')
for (const post of posts) {
  const cover = post.coverImage
  if (cover && typeof cover === 'object') {
    addVariants(cover.sizes?.tablet?.url ?? cover.sizes?.card?.url ?? cover.url, BLOG_WIDTHS, 75)
  }
}

console.log(`Товаров: ${products.length}, статей: ${posts.length}, вариантов: ${targets.size}`)

// --- Прогреваем с ограниченной конкурентностью ---

const queue = [...targets]
let done = 0
let failed = 0
let bytes = 0

const worker = async () => {
  for (;;) {
    const url = queue.pop()
    if (!url) return
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60000) })
      if (res.ok) {
        const buf = await res.arrayBuffer()
        bytes += buf.byteLength
      } else {
        failed++
        console.warn(`HTTP ${res.status}: ${url}`)
      }
    } catch (err) {
      failed++
      console.warn(`FAIL: ${url} (${err.message})`)
    }
    done++
    if (done % 100 === 0) console.log(`  ...${done}/${targets.size}`)
  }
}

const t0 = Date.now()
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

console.log(
  `Готово: ${done - failed}/${targets.size} прогрето, ошибок: ${failed}, ` +
    `${Math.round(bytes / 1024 / 1024)}MB за ${Math.round((Date.now() - t0) / 1000)}с`,
)
if (failed > targets.size / 10) process.exit(1)
