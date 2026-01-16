import { useState } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { componentLibrary, getComponentsByCategory, getCategoryLabel } from '@/data/componentLibrary';
import { ComponentDefinition } from '@/types/picolab';
import { ChevronDown, ChevronRight, Search, Info } from 'lucide-react';
import { ComponentIcon } from './ComponentIcon';

interface ComponentLibraryPanelProps {
  allowedComponents?: string[];
}

export function ComponentLibraryPanel({ allowedComponents }: ComponentLibraryPanelProps) {
  const { addFeedback } = usePicoLab();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['microcontroller', 'output', 'passive']);
  const [hoveredComponent, setHoveredComponent] = useState<ComponentDefinition | null>(null);

  const categories = getComponentsByCategory();
  
  const filteredCategories = Object.entries(categories).reduce((acc, [category, components]) => {
    let filtered = components.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (allowedComponents) {
      filtered = filtered.filter(c => allowedComponents.includes(c.type));
    }
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, ComponentDefinition[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleDragStart = (e: React.DragEvent, component: ComponentDefinition) => {
    e.dataTransfer.setData('component', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
    addFeedback('info', `Dragging ${component.name}`);
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Components
        </h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-9 pr-4 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {Object.entries(filteredCategories).map(([category, components]) => (
          <div key={category} className="mb-2">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              {expandedCategories.includes(category) ? (
                <ChevronDown size={16} className="text-muted-foreground" />
              ) : (
                <ChevronRight size={16} className="text-muted-foreground" />
              )}
              <span className="text-sm font-medium">{getCategoryLabel(category)}</span>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {components.length}
              </span>
            </button>
            
            {expandedCategories.includes(category) && (
              <div className="ml-2 mt-1 space-y-1">
                {components.map(component => (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                    onMouseEnter={() => setHoveredComponent(component)}
                    onMouseLeave={() => setHoveredComponent(null)}
                    className="component-card"
                  >
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      <ComponentIcon type={component.type} size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{component.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {component.pins.length} pins
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Component Info Tooltip */}
      {hoveredComponent && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-4 bg-popover border border-border rounded-xl shadow-xl z-50 scale-in">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-primary" />
            <h4 className="font-semibold">{hoveredComponent.name}</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{hoveredComponent.description}</p>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase">Pins:</p>
            <div className="flex flex-wrap gap-1">
              {hoveredComponent.pins.map(pin => (
                <span 
                  key={pin.id}
                  className={`text-xs px-2 py-0.5 rounded ${
                    pin.type === 'power' ? 'bg-destructive/20 text-destructive' :
                    pin.type === 'ground' ? 'bg-muted text-muted-foreground' :
                    pin.type === 'digital' ? 'bg-primary/20 text-primary' :
                    pin.type === 'analog' ? 'bg-secondary/20 text-secondary' :
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  {pin.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
