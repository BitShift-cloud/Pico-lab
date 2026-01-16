import { useRef, useState, useCallback } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { Component, Wire, Pin } from '@/types/picolab';
import { getComponentDefinition } from '@/data/componentLibrary';
import { ComponentIcon } from './ComponentIcon';
import { PinTooltip } from './PinTooltip';

export function Canvas() {
  const {
    components,
    setComponents,
    wires,
    setWires,
    connections,
    setConnections,
    selectedPin,
    setSelectedPin,
    selectedComponent,
    setSelectedComponent,
    addFeedback,
    pushHistory,
    isSimulating,
  } = usePicoLab();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [drawingWire, setDrawingWire] = useState<{ x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredPin, setHoveredPin] = useState<{ componentId: string; pinId: string } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('component');
    if (!data || !canvasRef.current) return;

    // Save state before adding component
    pushHistory();

    const componentDef = JSON.parse(data);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - componentDef.width / 2;
    const y = e.clientY - rect.top - componentDef.height / 2;

    const newComponent: Component = {
      id: `comp-${Date.now()}`,
      type: componentDef.type,
      name: componentDef.name,
      x: Math.max(0, x),
      y: Math.max(0, y),
      rotation: 0,
      pins: componentDef.pins.map((pin: any, index: number) => ({
        ...pin,
        x: index * 15 + 10,
        y: componentDef.height - 5,
      })),
      state: { powered: false, active: false },
      value: componentDef.defaultValue,
    };

    setComponents(prev => [...prev, newComponent]);
    addFeedback('success', `Added ${componentDef.name} to canvas`);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggingComponent) {
      setComponents(prev => prev.map(comp =>
        comp.id === draggingComponent
          ? { ...comp, x: x - dragOffset.x, y: y - dragOffset.y }
          : comp
      ));
    }
  }, [draggingComponent, dragOffset, setComponents]);

  const handleComponentMouseDown = (e: React.MouseEvent, compId: string) => {
    e.stopPropagation();
    const comp = components.find(c => c.id === compId);
    if (!comp || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDraggingComponent(compId);
    setDragOffset({ x: x - comp.x, y: y - comp.y });
    setSelectedComponent(compId);
  };

  const handleMouseUp = () => {
    if (draggingComponent) {
      // Save state after moving component
      pushHistory();
    }
    setDraggingComponent(null);
  };

  const handlePinClick = (componentId: string, pinId: string, pinPos: { x: number; y: number }) => {
    if (selectedPin) {
      if (selectedPin.componentId === componentId && selectedPin.pinId === pinId) {
        setSelectedPin(null);
        setDrawingWire(null);
        return;
      }

      // Save state before creating wire
      pushHistory();

      // Create wire
      const fromComp = components.find(c => c.id === selectedPin.componentId);
      const toComp = components.find(c => c.id === componentId);
      if (!fromComp || !toComp) return;

      const fromPin = fromComp.pins.find(p => p.id === selectedPin.pinId);
      const toPin = toComp.pins.find(p => p.id === pinId);
      if (!fromPin || !toPin) return;

      const wireColor = getWireColor(fromPin.type, toPin.type);
      
      const newWire: Wire = {
        id: `wire-${Date.now()}`,
        fromComponent: selectedPin.componentId,
        fromPin: selectedPin.pinId,
        toComponent: componentId,
        toPin: pinId,
        color: wireColor,
        points: [],
      };

      setWires(prev => [...prev, newWire]);
      setConnections(prev => [...prev, {
        from: `${selectedPin.componentId}-${selectedPin.pinId}`,
        to: `${componentId}-${pinId}`,
        wireId: newWire.id,
      }]);

      addFeedback('success', `Connected ${fromPin.name} to ${toPin.name}`);
      setSelectedPin(null);
      setDrawingWire(null);
    } else {
      setSelectedPin({ componentId, pinId });
      setDrawingWire(pinPos);
    }
  };

  const getWireColor = (fromType: string, toType: string): Wire['color'] => {
    if (fromType === 'power' || toType === 'power') return 'power';
    if (fromType === 'ground' || toType === 'ground') return 'ground';
    if (fromType === 'digital' || toType === 'digital') return 'data';
    return 'signal';
  };

  const getWireStrokeColor = (color: Wire['color']) => {
    switch (color) {
      case 'power': return '#ff4444';
      case 'ground': return '#333333';
      case 'data': return '#4488ff';
      case 'signal': return '#ffaa00';
      default: return '#888888';
    }
  };

  const getPinPosition = (component: Component, pin: Pin) => {
    const def = getComponentDefinition(component.type);
    if (!def) return { x: 0, y: 0 };
    
    const pinIndex = component.pins.findIndex(p => p.id === pin.id);
    const pinSpacing = def.width / (component.pins.length + 1);
    
    return {
      x: component.x + pinSpacing * (pinIndex + 1),
      y: component.y + def.height,
    };
  };

  const handleCanvasClick = () => {
    if (selectedPin) {
      setSelectedPin(null);
      setDrawingWire(null);
    }
    setSelectedComponent(null);
  };

  const handleDeleteComponent = (compId: string) => {
    // Save state before deleting
    pushHistory();

    // Remove component and its connections
    setWires(prev => prev.filter(w => w.fromComponent !== compId && w.toComponent !== compId));
    setConnections(prev => prev.filter(c => 
      !c.from.startsWith(compId) && !c.to.startsWith(compId)
    ));
    setComponents(prev => prev.filter(c => c.id !== compId));
    addFeedback('info', 'Component removed');
  };

  const handleDeleteWire = (wireId: string) => {
    // Save state before deleting wire
    pushHistory();

    setWires(prev => prev.filter(w => w.id !== wireId));
    setConnections(prev => prev.filter(c => c.wireId !== wireId));
    addFeedback('info', 'Wire removed');
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-background grid-pattern overflow-hidden cursor-crosshair"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* SVG layer for wires */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Existing wires */}
        {wires.map(wire => {
          const fromComp = components.find(c => c.id === wire.fromComponent);
          const toComp = components.find(c => c.id === wire.toComponent);
          if (!fromComp || !toComp) return null;

          const fromPin = fromComp.pins.find(p => p.id === wire.fromPin);
          const toPin = toComp.pins.find(p => p.id === wire.toPin);
          if (!fromPin || !toPin) return null;

          const from = getPinPosition(fromComp, fromPin);
          const to = getPinPosition(toComp, toPin);

          const midY = Math.min(from.y, to.y) + Math.abs(to.y - from.y) / 2 + 30;

          return (
            <g key={wire.id} className="pointer-events-auto cursor-pointer" onClick={(e) => {
              e.stopPropagation();
              handleDeleteWire(wire.id);
            }}>
              <path
                d={`M ${from.x} ${from.y} 
                    C ${from.x} ${midY}, 
                      ${to.x} ${midY}, 
                      ${to.x} ${to.y}`}
                fill="none"
                stroke={getWireStrokeColor(wire.color)}
                strokeWidth="3"
                strokeLinecap="round"
                className={isSimulating ? 'wire-flow' : ''}
              />
              {/* Wider invisible hit area for clicking */}
              <path
                d={`M ${from.x} ${from.y} 
                    C ${from.x} ${midY}, 
                      ${to.x} ${midY}, 
                      ${to.x} ${to.y}`}
                fill="none"
                stroke="transparent"
                strokeWidth="12"
              />
              {/* Glow effect when simulating */}
              {isSimulating && (
                <path
                  d={`M ${from.x} ${from.y} 
                      C ${from.x} ${midY}, 
                        ${to.x} ${midY}, 
                        ${to.x} ${to.y}`}
                  fill="none"
                  stroke={getWireStrokeColor(wire.color)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.3"
                  filter="blur(4px)"
                  className="pointer-events-none"
                />
              )}
            </g>
          );
        })}

        {/* Wire being drawn */}
        {drawingWire && (
          <line
            x1={drawingWire.x}
            y1={drawingWire.y}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke="#00d9ff"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>

      {/* Components */}
      {components.map(comp => {
        const def = getComponentDefinition(comp.type);
        if (!def) return null;

        return (
          <div
            key={comp.id}
            className={`absolute cursor-move select-none transition-shadow ${
              selectedComponent === comp.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
            }`}
            style={{
              left: comp.x,
              top: comp.y,
              width: def.width,
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, comp.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleDeleteComponent(comp.id);
            }}
          >
            <div className="relative">
              <ComponentIcon 
                type={comp.type} 
                size={def.width * 0.8} 
                lit={comp.state.active && isSimulating}
              />
              
              {/* Pins with tooltips */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around px-2 transform translate-y-2">
                {comp.pins.map((pin) => {
                  const pinPos = getPinPosition(comp, pin);
                  const isSelected = selectedPin?.componentId === comp.id && selectedPin?.pinId === pin.id;
                  const isHovered = hoveredPin?.componentId === comp.id && hoveredPin?.pinId === pin.id;
                  
                  return (
                    <div key={pin.id} className="relative">
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <PinTooltip 
                          pin={pin} 
                          isSimulating={isSimulating}
                          componentPowered={comp.state.powered}
                        />
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinClick(comp.id, pin.id, pinPos);
                        }}
                        onMouseEnter={() => setHoveredPin({ componentId: comp.id, pinId: pin.id })}
                        onMouseLeave={() => setHoveredPin(null)}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          isSelected 
                            ? 'bg-primary border-primary scale-125 pin-pulse' 
                            : 'bg-muted border-muted-foreground hover:border-primary hover:scale-110'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Component label */}
            <div className="text-center mt-3">
              <span className="text-xs text-muted-foreground font-mono bg-background/80 px-1 rounded">
                {comp.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Drag components here to start building</p>
            <p className="text-sm">Click on pins to connect them with wires</p>
            <p className="text-xs mt-2">Right-click components or wires to delete</p>
          </div>
        </div>
      )}
    </div>
  );
}
