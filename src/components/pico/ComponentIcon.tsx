import { ComponentType } from '@/types/picolab';

interface ComponentIconProps {
  type: ComponentType | string;
  size?: number;
  lit?: boolean;
  color?: string;
}

export function ComponentIcon({ type, size = 40, lit = false, color }: ComponentIconProps) {
  const baseColor = color || getDefaultColor(type);
  
  switch (type) {
    case 'arduino-uno':
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 100 60" fill="none">
          <rect x="2" y="2" width="96" height="56" rx="4" fill="#00979D" stroke="#00796B" strokeWidth="2"/>
          <rect x="8" y="8" width="20" height="8" rx="1" fill="#333"/>
          <rect x="72" y="8" width="20" height="8" rx="1" fill="#333"/>
          {/* USB Port */}
          <rect x="40" y="2" width="20" height="12" fill="#B0B0B0" stroke="#808080" strokeWidth="1"/>
          {/* Reset button */}
          <circle cx="85" cy="45" r="4" fill="#333" stroke="#666"/>
          {/* LED indicators */}
          <circle cx="75" cy="45" r="2" fill="#00FF00" opacity={lit ? 1 : 0.3}/>
          <circle cx="65" cy="45" r="2" fill="#FF0000" opacity={0.3}/>
          {/* Pin headers */}
          <rect x="10" y="48" width="60" height="6" fill="#333"/>
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={12 + i * 4} y="50" width="2" height="2" fill="#FFD700"/>
          ))}
          {/* Text */}
          <text x="30" y="35" fontSize="8" fill="white" fontFamily="monospace">UNO</text>
        </svg>
      );

    case 'led-red':
    case 'led-green':
    case 'led-blue':
    case 'led-yellow':
      const ledColor = type.includes('red') ? '#FF3333' : 
                       type.includes('green') ? '#33FF33' : 
                       type.includes('blue') ? '#3333FF' : '#FFFF33';
      return (
        <svg width={size} height={size * 1.5} viewBox="0 0 40 60" fill="none">
          {/* LED body */}
          <ellipse 
            cx="20" 
            cy="20" 
            rx="15" 
            ry="18" 
            fill={ledColor}
            opacity={lit ? 1 : 0.4}
            className={lit ? 'led-on' : ''}
            style={{ filter: lit ? `drop-shadow(0 0 10px ${ledColor})` : 'none' }}
          />
          <ellipse cx="20" cy="20" rx="15" ry="18" stroke={ledColor} strokeWidth="2" fill="none"/>
          {/* Reflection */}
          <ellipse cx="14" cy="14" rx="4" ry="5" fill="white" opacity="0.3"/>
          {/* Legs */}
          <line x1="15" y1="38" x2="15" y2="58" stroke="#808080" strokeWidth="2"/>
          <line x1="25" y1="38" x2="25" y2="55" stroke="#808080" strokeWidth="2"/>
          {/* Labels */}
          <text x="10" y="56" fontSize="6" fill="#808080">+</text>
          <text x="23" y="56" fontSize="6" fill="#808080">-</text>
        </svg>
      );

    case 'rgb-led':
      return (
        <svg width={size * 1.2} height={size * 1.5} viewBox="0 0 50 60" fill="none">
          <ellipse cx="25" cy="20" rx="18" ry="20" fill="#FFFFFF" opacity={lit ? 1 : 0.4}/>
          <ellipse cx="25" cy="20" rx="18" ry="20" stroke="#CCCCCC" strokeWidth="2" fill="none"/>
          <circle cx="18" cy="18" r="5" fill="#FF0000" opacity="0.5"/>
          <circle cx="25" cy="22" r="5" fill="#00FF00" opacity="0.5"/>
          <circle cx="32" cy="18" r="5" fill="#0000FF" opacity="0.5"/>
          {/* Legs */}
          <line x1="12" y1="40" x2="12" y2="58" stroke="#FF0000" strokeWidth="2"/>
          <line x1="20" y1="40" x2="20" y2="58" stroke="#00FF00" strokeWidth="2"/>
          <line x1="30" y1="40" x2="30" y2="58" stroke="#0000FF" strokeWidth="2"/>
          <line x1="38" y1="40" x2="38" y2="55" stroke="#808080" strokeWidth="2"/>
        </svg>
      );

    case 'resistor':
      return (
        <svg width={size * 1.5} height={size * 0.5} viewBox="0 0 60 20" fill="none">
          {/* Leads */}
          <line x1="0" y1="10" x2="12" y2="10" stroke="#808080" strokeWidth="2"/>
          <line x1="48" y1="10" x2="60" y2="10" stroke="#808080" strokeWidth="2"/>
          {/* Body */}
          <rect x="12" y="4" width="36" height="12" rx="2" fill="#D4A574"/>
          {/* Color bands */}
          <rect x="16" y="4" width="3" height="12" fill="#8B4513"/>
          <rect x="22" y="4" width="3" height="12" fill="#000000"/>
          <rect x="28" y="4" width="3" height="12" fill="#FF0000"/>
          <rect x="40" y="4" width="3" height="12" fill="#FFD700"/>
        </svg>
      );

    case 'push-button':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <rect x="4" y="4" width="32" height="32" rx="4" fill="#333" stroke="#555" strokeWidth="2"/>
          <circle cx="20" cy="20" r="10" fill="#666" stroke="#888" strokeWidth="1"/>
          <circle cx="20" cy="20" r="6" fill="#444"/>
          {/* Pins */}
          <rect x="8" y="0" width="3" height="6" fill="#FFD700"/>
          <rect x="29" y="0" width="3" height="6" fill="#FFD700"/>
          <rect x="8" y="34" width="3" height="6" fill="#FFD700"/>
          <rect x="29" y="34" width="3" height="6" fill="#FFD700"/>
        </svg>
      );

    case 'dc-motor':
      return (
        <svg width={size * 1.5} height={size} viewBox="0 0 60 40" fill="none">
          <rect x="10" y="5" width="40" height="30" rx="4" fill="#808080" stroke="#666" strokeWidth="2"/>
          {/* Shaft */}
          <rect x="48" y="16" width="12" height="8" fill="#FFD700"/>
          {/* Terminal posts */}
          <rect x="2" y="12" width="8" height="6" fill="#B22222"/>
          <rect x="2" y="22" width="8" height="6" fill="#000"/>
          {/* Motor label */}
          <text x="22" y="24" fontSize="8" fill="#333" fontFamily="monospace">M</text>
        </svg>
      );

    case 'servo-motor':
      return (
        <svg width={size * 1.75} height={size * 1.25} viewBox="0 0 70 50" fill="none">
          <rect x="5" y="10" width="45" height="30" rx="2" fill="#1E3A5F" stroke="#152D4D" strokeWidth="2"/>
          <circle cx="55" cy="25" r="8" fill="#333" stroke="#555"/>
          <rect x="55" y="22" width="12" height="6" fill="#666"/>
          {/* Wires */}
          <line x1="15" y1="40" x2="15" y2="50" stroke="#B22222" strokeWidth="3"/>
          <line x1="25" y1="40" x2="25" y2="50" stroke="#FF8C00" strokeWidth="3"/>
          <line x1="35" y1="40" x2="35" y2="50" stroke="#8B4513" strokeWidth="3"/>
        </svg>
      );

    case 'battery-9v':
      return (
        <svg width={size * 0.6} height={size} viewBox="0 0 25 40" fill="none">
          <rect x="2" y="8" width="21" height="30" rx="2" fill="#1C1C1C" stroke="#333" strokeWidth="1"/>
          {/* Terminals */}
          <rect x="5" y="2" width="5" height="8" rx="1" fill="#FFD700"/>
          <rect x="15" y="4" width="4" height="6" rx="0.5" fill="#808080"/>
          {/* Label */}
          <text x="6" y="28" fontSize="7" fill="#FFD700" fontFamily="monospace">9V</text>
        </svg>
      );

    case 'dht11':
      return (
        <svg width={size} height={size * 1.2} viewBox="0 0 40 48" fill="none">
          <rect x="2" y="2" width="36" height="36" rx="4" fill="#00A0E0" stroke="#0080C0" strokeWidth="2"/>
          {/* Vents */}
          <rect x="8" y="8" width="24" height="3" fill="#0090D0"/>
          <rect x="8" y="14" width="24" height="3" fill="#0090D0"/>
          <rect x="8" y="20" width="24" height="3" fill="#0090D0"/>
          {/* Pins */}
          <rect x="8" y="38" width="3" height="10" fill="#FFD700"/>
          <rect x="18" y="38" width="3" height="10" fill="#FFD700"/>
          <rect x="28" y="38" width="3" height="10" fill="#FFD700"/>
          {/* Label */}
          <text x="6" y="34" fontSize="6" fill="white" fontFamily="monospace">DHT11</text>
        </svg>
      );

    case 'potentiometer':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" fill="#333" stroke="#555" strokeWidth="2"/>
          <circle cx="20" cy="20" r="8" fill="#666"/>
          {/* Knob indicator */}
          <line x1="20" y1="20" x2="20" y2="8" stroke="#00FFFF" strokeWidth="2"/>
          {/* Pins */}
          <rect x="8" y="36" width="3" height="6" fill="#FFD700"/>
          <rect x="18" y="36" width="3" height="6" fill="#FFD700"/>
          <rect x="28" y="36" width="3" height="6" fill="#FFD700"/>
        </svg>
      );

    case 'buzzer':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="18" r="14" fill="#1C1C1C" stroke="#333" strokeWidth="2"/>
          <circle cx="20" cy="18" r="8" fill="#333"/>
          <circle cx="20" cy="18" r="3" fill="#FFD700"/>
          {/* Pins */}
          <rect x="14" y="32" width="3" height="8" fill="#FFD700"/>
          <rect x="23" y="32" width="3" height="8" fill="#FFD700"/>
          <text x="11" y="38" fontSize="6" fill="#808080">+</text>
          <text x="24" y="38" fontSize="6" fill="#808080">-</text>
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <rect x="4" y="4" width="32" height="32" rx="4" fill="#666" stroke="#888" strokeWidth="2"/>
          <text x="14" y="25" fontSize="12" fill="#CCC">?</text>
        </svg>
      );
  }
}

function getDefaultColor(type: string): string {
  if (type.includes('red')) return '#FF3333';
  if (type.includes('green')) return '#33FF33';
  if (type.includes('blue')) return '#3333FF';
  if (type.includes('yellow')) return '#FFFF33';
  return '#FFFFFF';
}
