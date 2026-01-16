import { useState } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { Logo } from './Logo';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

export function FlashcardsPage() {
  const { setCurrentView, flashcards, addFlashcard, removeFlashcard } = usePicoLab();
  const [showAddForm, setShowAddForm] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      addFlashcard(front.trim(), back.trim());
      setFront('');
      setBack('');
      setShowAddForm(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <Logo size="small" />
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Add Card
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Custom Flashcards</h1>
        <p className="text-muted-foreground mb-8">
          Create and review your own study cards for electronics concepts
        </p>

        {showAddForm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-md scale-in">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Create New Flashcard</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Front (Question)
                    </label>
                    <textarea
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      className="input-field min-h-[80px]"
                      placeholder="What is Ohm's Law?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Back (Answer)
                    </label>
                    <textarea
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      className="input-field min-h-[80px]"
                      placeholder="V = I × R (Voltage = Current × Resistance)"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="btn-ghost flex-1"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      Add Card
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {flashcards.length === 0 ? (
          <div className="text-center py-16">
            <Lightbulb size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Flashcards Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first flashcard to start studying
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <Plus size={16} className="inline mr-2" />
              Create First Card
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Flashcard Display */}
            <div className="mb-8">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
              >
                <div
                  className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-border p-8 flex items-center justify-center backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                        Question
                      </p>
                      <p className="text-2xl font-semibold">{currentCard?.front}</p>
                      <p className="text-sm text-muted-foreground mt-6">
                        Click to reveal answer
                      </p>
                    </div>
                  </div>
                  
                  {/* Back */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl border border-border p-8 flex items-center justify-center"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                        Answer
                      </p>
                      <p className="text-xl">{currentCard?.back}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={prevCard}
                disabled={flashcards.length <= 1}
                className="p-3 rounded-full bg-muted hover:bg-muted/80 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              
              <span className="text-lg font-mono">
                {currentIndex + 1} / {flashcards.length}
              </span>
              
              <button
                onClick={nextCard}
                disabled={flashcards.length <= 1}
                className="p-3 rounded-full bg-muted hover:bg-muted/80 disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Card Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsFlipped(false)}
                className="btn-ghost flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                onClick={() => {
                  if (currentCard) {
                    removeFlashcard(currentCard.id);
                    if (currentIndex >= flashcards.length - 1) {
                      setCurrentIndex(Math.max(0, flashcards.length - 2));
                    }
                  }
                }}
                className="btn-ghost text-destructive flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>

            {/* All Cards List */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">All Cards ({flashcards.length})</h3>
              <div className="grid gap-3">
                {flashcards.map((card, index) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsFlipped(false);
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      index === currentIndex 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium truncate">{card.front}</p>
                    <p className="text-sm text-muted-foreground truncate mt-1">{card.back}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
