import { useState } from "react";
import Icon from "@/components/ui/icon";
import { universitySimulations } from "@/data/archipelago";

interface SimulationModalProps {
  universityId: number;
  onComplete: (harmony: number) => void;
  onClose: () => void;
}

const SimulationModal = ({ universityId, onComplete, onClose }: SimulationModalProps) => {
  const simulation = universitySimulations[universityId];
  const [stepIndex, setStepIndex] = useState(0);
  const [totalHarmony, setTotalHarmony] = useState(0);
  const [choiceCount, setChoiceCount] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);

  if (!simulation) return null;

  const currentStep = simulation.steps[stepIndex];

  const handleChoice = (choiceIndex: number) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(choiceIndex);
    const choice = currentStep.choices[choiceIndex];
    setFeedback(choice.feedback);
    const newHarmony = totalHarmony + choice.harmony;
    const newCount = choiceCount + 1;
    setTotalHarmony(newHarmony);
    setChoiceCount(newCount);

    setTimeout(() => {
      if (stepIndex < simulation.steps.length - 1) {
        setStepIndex(stepIndex + 1);
        setSelectedChoice(null);
        setFeedback("");
      } else {
        const avgHarmony = newHarmony / newCount;
        setFinished(true);
        setTimeout(() => {
          onComplete(avgHarmony);
        }, 2000);
      }
    }, 2000);
  };

  if (finished) {
    const avgHarmony = totalHarmony / choiceCount;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-scale-in shadow-xl">
          <div className="text-5xl mb-4">{avgHarmony >= 0.8 ? "🌟" : avgHarmony >= 0.6 ? "✨" : "🌤️"}</div>
          <h3 className="font-heading font-bold text-xl text-[var(--dzen-blue-dark)] mb-2">
            Город открыт!
          </h3>
          <p className="text-muted-foreground mb-2">
            Гармония с профилем: {Math.round(avgHarmony * 100)}%
          </p>
          {avgHarmony >= 0.8 ? (
            <p className="text-sm text-green-600">Город сияет ярким светом — отличное совпадение!</p>
          ) : avgHarmony >= 0.6 ? (
            <p className="text-sm text-[var(--dzen-sky)]">Город светится мягким светом — хороший путь</p>
          ) : (
            <p className="text-sm text-amber-600">Этот путь возможен, но потребует подготовки</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="Compass" size={16} className="text-[var(--dzen-sky)]" />
            <span className="text-xs text-muted-foreground font-medium">{simulation.title}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-[var(--dzen-blue-dark)]">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="flex gap-1 mb-5">
          {simulation.steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all ${
                i <= stepIndex ? "bg-[var(--dzen-sky)]" : "bg-[var(--dzen-sand)]/30"
              }`}
            />
          ))}
        </div>

        <p className="text-[var(--dzen-blue-dark)] mb-5 leading-relaxed">
          {currentStep.text}
        </p>

        <div className="space-y-3">
          {currentStep.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              disabled={selectedChoice !== null}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                selectedChoice === i
                  ? "border-[var(--dzen-sky)] bg-[var(--dzen-sky)]/10"
                  : selectedChoice !== null
                  ? "opacity-40 border-transparent bg-white/40"
                  : "border-transparent bg-[var(--dzen-cream)] hover:border-[var(--dzen-sky)]/30"
              }`}
            >
              <span className="text-sm text-[var(--dzen-blue-dark)]">{choice.text}</span>
            </button>
          ))}
        </div>

        {feedback && (
          <div className="mt-4 p-4 rounded-2xl bg-[var(--dzen-sky)]/5 border border-[var(--dzen-sky)]/20 animate-fade-in">
            <p className="text-sm text-[var(--dzen-blue-dark)]">💬 {feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationModal;