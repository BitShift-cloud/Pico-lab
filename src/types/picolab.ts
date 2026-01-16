// Core types for Pico Lab

export type UserMode = 'student' | 'teacher' | null;

export type AppView = 'auth' | 'dashboard' | 'workspace' | 'flashcards' | 'scoreboard' | 'profile';

export type WorkspaceMode = 'practice' | 'exam' | 'play';

export interface Pin {
  id: string;
  name: string;
  type: 'input' | 'output' | 'power' | 'ground' | 'analog' | 'digital' | 'gpio';
  x: number;
  y: number;
}

export interface Component {
  id: string;
  type: ComponentType;
  name: string;
  x: number;
  y: number;
  rotation: number;
  pins: Pin[];
  state: ComponentState;
  value?: string | number;
}

export type ComponentType = 
  | 'arduino-uno'
  | 'led-red'
  | 'led-green'
  | 'led-blue'
  | 'led-yellow'
  | 'resistor'
  | 'push-button'
  | 'dc-motor'
  | 'battery-9v'
  | 'dht11'
  | 'potentiometer'
  | 'buzzer'
  | 'servo-motor'
  | 'rgb-led';

export interface ComponentState {
  powered: boolean;
  active: boolean;
  value?: number;
  burnedOut?: boolean;
  shortCircuit?: boolean;
}

export interface Wire {
  id: string;
  fromComponent: string;
  fromPin: string;
  toComponent: string;
  toPin: string;
  color: WireColor;
  points: { x: number; y: number }[];
}

export type WireColor = 'power' | 'ground' | 'data' | 'signal' | 'custom';

export interface Connection {
  from: string; // component-pin format
  to: string;
  wireId: string;
}

export interface Exam {
  id: string;
  code: string;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  validUntil: Date;
  components: ComponentType[];
  createdBy: string;
  active: boolean;
}

export interface ExamSubmission {
  id: string;
  examCode: string;
  studentCode: string;
  components: Component[];
  connections: Connection[];
  submittedAt: Date;
  score?: number;
  feedback?: string;
}

export interface StudentProfile {
  code: string;
  name: string;
  class: string;
  division: string;
  school: string;
  createdAt: Date;
}

export interface TeacherProfile {
  id: string;
  name: string;
  school: string;
  verifiedStudents: string[];
}

export interface ScoreboardEntry {
  studentCode: string;
  name: string;
  totalTasks: number;
  completedTasks: number;
  practiceCircuits: number;
  matchesWon: number;
  matchesLost: number;
  examScores: { examCode: string; score: number }[];
  accuracy: number;
  timeSpent: number; // in minutes
  points: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  createdAt: Date;
}

export interface FeedbackMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface HistoryAction {
  type: 'add' | 'remove' | 'move' | 'connect' | 'disconnect';
  data: any;
  timestamp: Date;
}

// Component library definition
export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  category: 'microcontroller' | 'input' | 'output' | 'passive' | 'power' | 'sensor' | 'motor';
  description: string;
  pins: Omit<Pin, 'x' | 'y'>[];
  width: number;
  height: number;
  defaultValue?: string | number;
}

// Play mode types
export interface MatchState {
  status: 'idle' | 'searching' | 'matched' | 'playing' | 'finished';
  opponentName?: string;
  task?: string;
  timeLimit?: number;
  startTime?: Date;
  result?: 'win' | 'lose' | 'draw';
}
