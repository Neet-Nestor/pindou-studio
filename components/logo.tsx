import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  showIcon?: boolean;
}

const sizeConfig = {
  sm: {
    icon: { width: 36, height: 36, className: 'h-9 w-9' },
    text: 'text-xl',
  },
  md: {
    icon: { width: 44, height: 44, className: 'h-11 w-11' },
    text: 'text-2xl',
  },
  lg: {
    icon: { width: 48, height: 48, className: 'h-12 w-12' },
    text: 'text-3xl',
  },
};

export function Logo({ href = '/', size = 'md', className, showText = true, showIcon = true }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center hover:opacity-80 transition-opacity',
        showText && showIcon ? 'gap-3' : '',
        className
      )}
    >
      {showIcon && (
        <Image
          src="/icon.png"
          alt="拼豆工坊"
          width={config.icon.width}
          height={config.icon.height}
          className={cn(config.icon.className, 'flex-shrink-0 translate-y-0.25')}
        />
      )}
      {showText && (
        <span className={cn(config.text, 'font-handwritten text-primary leading-none whitespace-nowrap')}>
          拼豆工坊
        </span>
      )}
    </Link>
  );
}
