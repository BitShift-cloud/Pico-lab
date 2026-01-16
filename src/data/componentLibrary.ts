import { ComponentDefinition } from '@/types/picolab';

export const componentLibrary: ComponentDefinition[] = [
  // Microcontrollers
  {
    type: 'arduino-uno',
    name: 'Arduino Uno',
    category: 'microcontroller',
    description: 'ATmega328P microcontroller board with 14 digital and 6 analog pins',
    width: 200,
    height: 120,
    pins: [
      // Digital pins
      { id: 'd0', name: 'D0/RX', type: 'digital' },
      { id: 'd1', name: 'D1/TX', type: 'digital' },
      { id: 'd2', name: 'D2', type: 'digital' },
      { id: 'd3', name: 'D3~', type: 'digital' },
      { id: 'd4', name: 'D4', type: 'digital' },
      { id: 'd5', name: 'D5~', type: 'digital' },
      { id: 'd6', name: 'D6~', type: 'digital' },
      { id: 'd7', name: 'D7', type: 'digital' },
      { id: 'd8', name: 'D8', type: 'digital' },
      { id: 'd9', name: 'D9~', type: 'digital' },
      { id: 'd10', name: 'D10~', type: 'digital' },
      { id: 'd11', name: 'D11~', type: 'digital' },
      { id: 'd12', name: 'D12', type: 'digital' },
      { id: 'd13', name: 'D13', type: 'digital' },
      // Analog pins
      { id: 'a0', name: 'A0', type: 'analog' },
      { id: 'a1', name: 'A1', type: 'analog' },
      { id: 'a2', name: 'A2', type: 'analog' },
      { id: 'a3', name: 'A3', type: 'analog' },
      { id: 'a4', name: 'A4', type: 'analog' },
      { id: 'a5', name: 'A5', type: 'analog' },
      // Power pins
      { id: '5v', name: '5V', type: 'power' },
      { id: '3v3', name: '3.3V', type: 'power' },
      { id: 'gnd1', name: 'GND', type: 'ground' },
      { id: 'gnd2', name: 'GND', type: 'ground' },
      { id: 'vin', name: 'VIN', type: 'power' },
    ],
  },

  // LEDs
  {
    type: 'led-red',
    name: 'LED (Red)',
    category: 'output',
    description: 'Red light-emitting diode, forward voltage 2V',
    width: 40,
    height: 60,
    pins: [
      { id: 'anode', name: 'Anode (+)', type: 'input' },
      { id: 'cathode', name: 'Cathode (-)', type: 'ground' },
    ],
  },
  {
    type: 'led-green',
    name: 'LED (Green)',
    category: 'output',
    description: 'Green light-emitting diode, forward voltage 2.2V',
    width: 40,
    height: 60,
    pins: [
      { id: 'anode', name: 'Anode (+)', type: 'input' },
      { id: 'cathode', name: 'Cathode (-)', type: 'ground' },
    ],
  },
  {
    type: 'led-blue',
    name: 'LED (Blue)',
    category: 'output',
    description: 'Blue light-emitting diode, forward voltage 3.2V',
    width: 40,
    height: 60,
    pins: [
      { id: 'anode', name: 'Anode (+)', type: 'input' },
      { id: 'cathode', name: 'Cathode (-)', type: 'ground' },
    ],
  },
  {
    type: 'led-yellow',
    name: 'LED (Yellow)',
    category: 'output',
    description: 'Yellow light-emitting diode, forward voltage 2.1V',
    width: 40,
    height: 60,
    pins: [
      { id: 'anode', name: 'Anode (+)', type: 'input' },
      { id: 'cathode', name: 'Cathode (-)', type: 'ground' },
    ],
  },
  {
    type: 'rgb-led',
    name: 'RGB LED',
    category: 'output',
    description: 'Common cathode RGB LED for multi-color output',
    width: 50,
    height: 70,
    pins: [
      { id: 'red', name: 'Red', type: 'input' },
      { id: 'green', name: 'Green', type: 'input' },
      { id: 'blue', name: 'Blue', type: 'input' },
      { id: 'cathode', name: 'GND', type: 'ground' },
    ],
  },

  // Passive Components
  {
    type: 'resistor',
    name: 'Resistor',
    category: 'passive',
    description: 'Current limiting resistor',
    width: 60,
    height: 20,
    defaultValue: '1000',
    pins: [
      { id: 'pin1', name: 'Pin 1', type: 'input' },
      { id: 'pin2', name: 'Pin 2', type: 'output' },
    ],
  },

  // Input Components
  {
    type: 'push-button',
    name: 'Push Button',
    category: 'input',
    description: 'Momentary tactile push button switch',
    width: 40,
    height: 40,
    pins: [
      { id: 'pin1', name: 'Pin 1', type: 'input' },
      { id: 'pin2', name: 'Pin 2', type: 'output' },
    ],
  },
  {
    type: 'potentiometer',
    name: 'Potentiometer',
    category: 'input',
    description: 'Variable resistor for analog input',
    width: 50,
    height: 50,
    defaultValue: '10000',
    pins: [
      { id: 'vcc', name: 'VCC', type: 'power' },
      { id: 'wiper', name: 'Wiper', type: 'output' },
      { id: 'gnd', name: 'GND', type: 'ground' },
    ],
  },

  // Power
  {
    type: 'battery-9v',
    name: '9V Battery',
    category: 'power',
    description: '9V DC power source',
    width: 50,
    height: 80,
    pins: [
      { id: 'positive', name: '+', type: 'power' },
      { id: 'negative', name: '-', type: 'ground' },
    ],
  },

  // Sensors
  {
    type: 'dht11',
    name: 'DHT11 Sensor',
    category: 'sensor',
    description: 'Temperature and humidity sensor',
    width: 50,
    height: 60,
    pins: [
      { id: 'vcc', name: 'VCC', type: 'power' },
      { id: 'data', name: 'Data', type: 'output' },
      { id: 'gnd', name: 'GND', type: 'ground' },
    ],
  },

  // Motors
  {
    type: 'dc-motor',
    name: 'DC Motor',
    category: 'motor',
    description: 'Small DC motor, 3-6V',
    width: 60,
    height: 60,
    pins: [
      { id: 'pin1', name: 'Pin 1', type: 'input' },
      { id: 'pin2', name: 'Pin 2', type: 'input' },
    ],
  },
  {
    type: 'servo-motor',
    name: 'Servo Motor',
    category: 'motor',
    description: 'Standard servo motor with position control',
    width: 70,
    height: 50,
    pins: [
      { id: 'vcc', name: 'VCC (Red)', type: 'power' },
      { id: 'signal', name: 'Signal (Orange)', type: 'input' },
      { id: 'gnd', name: 'GND (Brown)', type: 'ground' },
    ],
  },

  // Output
  {
    type: 'buzzer',
    name: 'Buzzer',
    category: 'output',
    description: 'Piezo buzzer for audio output',
    width: 40,
    height: 40,
    pins: [
      { id: 'positive', name: '+', type: 'input' },
      { id: 'negative', name: '-', type: 'ground' },
    ],
  },
];

export const getComponentsByCategory = () => {
  const categories: Record<string, ComponentDefinition[]> = {};
  
  componentLibrary.forEach(comp => {
    if (!categories[comp.category]) {
      categories[comp.category] = [];
    }
    categories[comp.category].push(comp);
  });
  
  return categories;
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    microcontroller: '🔌 Microcontrollers',
    input: '🎛️ Input',
    output: '💡 Output',
    passive: '📐 Passive',
    power: '🔋 Power',
    sensor: '📡 Sensors',
    motor: '⚙️ Motors',
  };
  return labels[category] || category;
};

export const getComponentDefinition = (type: string): ComponentDefinition | undefined => {
  return componentLibrary.find(c => c.type === type);
};
