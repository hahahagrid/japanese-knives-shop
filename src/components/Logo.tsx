import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
  onClick?: () => void
}

export const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => {
  return (
    <Link
      href="/"
      className={`inline-block group transition-all duration-300 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-sm overflow-hidden ${className}`}
      onClick={onClick}
    >
      <Image
        src="/images/final.svg"
        alt="Japanese Kitchen Knives"
        width={180}
        height={80}
        priority
        className="h-auto w-full max-h-[60px] object-contain"
      />
    </Link>
  )
}
