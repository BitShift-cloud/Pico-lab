import { Pin } from '@/types/picolab';

interface PinTooltipProps {
  pin: Pin;
  isSimulating: boolean;
  componentPowered: boolean;
}

export function PinTooltip({ pin, isSimulating, componentPowered }: PinTooltipProps) {
  const getPinRoleLabel = (type: Pin['type']) => {
    switch (type) {
      case 'power': return 'Power (+)';
      case 'ground': return 'Ground (-)';
      case 'input': return 'Input';
      case 'output': return 'Output';
      case 'analog': return 'Analog I/O';
      case 'digital': return 'Digital I/O';
      case 'gpio': return 'GPIO';
      default: return type;
    }
  };

  const getPinState = () => {
    if (!isSimulating) return 'Not simulating';
    if (pin.type === 'power') return componentPowered ? '5V' : '0V';
    if (pin.type === 'ground') return '0V (GND)';
    if (pin.type === 'digital') return componentPowered ? 'HIGH' : 'LOW';
    if (pin.type === 'analog') return componentPowered ? 'Active' : 'Inactive';
    return componentPowered ? 'Active' : 'Inactive';
  };

  const getRoleColor = (type: Pin['type']) => {
    switch (type) {
      case 'power': return 'text-red-400';
      case 'ground': return 'text-gray-400';
      case 'digital': return 'text-blue-400';
      case 'analog': return 'text-yellow-400';
      case 'input': return 'text-green-400';
      case 'output': return 'text-purple-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
      <div className="bg-popover border border-border rounded-lg shadow-xl p-2 min-w-[120px] text-xs">
        <div className="font-bold text-foreground mb-1">{pin.name}</div>
        <div className={`${getRoleColor(pin.type)} mb-1`}>
          {getPinRoleLabel(pin.type)}
        </div>
        <div className="text-muted-foreground border-t border-border pt-1 mt-1">
          State: <span className={isSimulating && componentPowered ? 'text-secondary' : 'text-muted-foreground'}>
            {getPinState()}
          </span>
        </div>
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
        <div className="border-4 border-transparent border-t-popover" />
      </div>
    </div>
  );
}
