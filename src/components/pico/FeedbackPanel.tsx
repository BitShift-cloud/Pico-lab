import { useState } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Trash2, 
  MessageCircle,
  Send,
  Bot
} from 'lucide-react';

const PICO_AI_RESPONSES: Record<string, string> = {
  'how do i connect an led': 'To connect an LED: 1) Connect the anode (+, longer leg) to a digital pin through a current-limiting resistor (220-1kΩ). 2) Connect the cathode (-, shorter leg) to GND. 3) In code, set the pin HIGH to turn it on!',
  'what is a resistor': 'A resistor limits current flow in a circuit. For LEDs, use 220-1000Ω to prevent burnout. The color bands indicate resistance value.',
  'why is my led not working': 'Check: 1) LED polarity (longer leg is +), 2) Resistor in series, 3) Wire connections, 4) Pin set to OUTPUT and HIGH in code.',
  'what is ground': 'Ground (GND) is the reference point (0V) in a circuit. All components need a return path to ground to complete the circuit.',
  'how to use a button': 'Connect one pin to a digital input and one to GND. Enable internal pull-up resistor or use external 10kΩ pull-up to VCC. Read LOW when pressed.',
  'default': "I'm Pico AI! Ask me about electronics, circuits, or how to use components. Try: 'How do I connect an LED?' or 'What is a resistor?'",
};

export function FeedbackPanel() {
  const { feedbackMessages, clearFeedback } = usePicoLab();
  const [activeTab, setActiveTab] = useState<'alerts' | 'ai'>('alerts');
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "👋 Hi! I'm Pico AI, your virtual lab assistant. Ask me anything about electronics!" }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={14} className="text-secondary shrink-0" />;
      case 'warning': return <AlertTriangle size={14} className="text-warning shrink-0" />;
      case 'error': return <XCircle size={14} className="text-destructive shrink-0" />;
      default: return <Info size={14} className="text-primary shrink-0" />;
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMessage = aiInput.trim().toLowerCase();
    setAiMessages(prev => [...prev, { role: 'user', text: aiInput }]);
    setAiInput('');

    // Find matching response
    setTimeout(() => {
      const response = Object.entries(PICO_AI_RESPONSES).find(([key]) => 
        userMessage.includes(key)
      )?.[1] || PICO_AI_RESPONSES.default;

      setAiMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 500);
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'alerts' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageCircle size={14} className="inline mr-2" />
          Alerts
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'ai' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bot size={14} className="inline mr-2" />
          Pico AI
        </button>
      </div>

      {activeTab === 'alerts' ? (
        <>
          {/* Header */}
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Feedback & Alerts
            </span>
            {feedbackMessages.length > 0 && (
              <button
                onClick={clearFeedback}
                className="p-1 hover:bg-muted rounded transition-colors"
                title="Clear all"
              >
                <Trash2 size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
            {feedbackMessages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                <Info size={24} className="mx-auto mb-2 opacity-50" />
                <p>No alerts yet</p>
                <p className="text-xs mt-1">Build a circuit to see feedback</p>
              </div>
            ) : (
              feedbackMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 p-2 rounded-lg text-xs slide-in-left ${
                    msg.type === 'success' ? 'bg-secondary/10' :
                    msg.type === 'warning' ? 'bg-warning/10' :
                    msg.type === 'error' ? 'bg-destructive/10' :
                    'bg-muted/50'
                  }`}
                >
                  {getIcon(msg.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground">{msg.message}</p>
                    <p className="text-muted-foreground text-[10px] mt-0.5 font-mono">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* AI Chat */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
            {aiMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none'
                  }`}
                >
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-1 mb-1 text-primary">
                      <Bot size={12} />
                      <span className="text-xs font-medium">Pico AI</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* AI Input */}
          <form onSubmit={handleAiSubmit} className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about circuits..."
                className="flex-1 px-3 py-2 bg-background rounded-lg border border-border text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
