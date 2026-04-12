import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 pt-32 pb-32">
      <AnimatedSection className="text-center max-w-xl">
        <span className="text-[10px] tracking-[0.5em] uppercase text-[var(--accent)] mb-6 block font-bold">
          Помилка 404
        </span>
        <h1 className="heading-display text-5xl md:text-7xl mb-8 leading-tight">
          Сторінку не знайдено
        </h1>
        <p className="text-lg text-neutral-500 mb-12 italic font-serif leading-relaxed">
          Можливо, цей виріб вже знайшов свого власника, або адреса сторінки була змінена.
          Пропонуємо ознайомитись з нашою актуальною колекцією.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/"
            className="w-full sm:w-auto bg-black text-white px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-neutral-800 transition-all active:scale-95 text-center"
          >
            На головну
          </Link>
          <Link
            href="/knives/in-stock"
            className="w-full sm:w-auto border border-black/10 text-black px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-neutral-50 transition-all active:scale-95 text-center"
          >
            Усі товари
          </Link>
        </div>
      </AnimatedSection>

      {/* 
        Ядерный способ убить анимацию: 
        CSS срабатывает быстрее любого скрипта.
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        #loading-screen { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
      `,
        }}
      />

      {/* Скрипт-выключатель для следующих переходов */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              sessionStorage.setItem('knives_intro_played', 'true');
              document.documentElement.classList.add('skip-intro');
            } catch (e) {}
          `,
        }}
      />
    </div>
  )
}
