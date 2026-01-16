import { Cpu } from 'lucide-react';

export function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizes = {
    small: { icon: 20, text: 'text-lg' },
    default: { icon: 28, text: 'text-2xl' },
    large: { icon: 40, text: 'text-4xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Cpu size={icon} className="text-primary" />
        <div className="absolute inset-0 animate-pulse-glow rounded-full opacity-50" />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold ${text} font-mono text-glow-cyan text-primary`}>
          Pico<span className="text-secondary">Lab</span>
        </span>
        {size !== 'small' && (
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            by BitShift
          </span>
        )}
      </div>
    </div>
  );
}
