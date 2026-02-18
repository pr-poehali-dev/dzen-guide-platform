import { useState } from "react";
import Icon from "@/components/ui/icon";
import { facultyChallenges } from "@/data/archipelago";
import { universities } from "@/data/universities";

interface ChallengeModalProps {
  facultyId: number;
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

const ChallengeModal = ({ facultyId, onComplete, onClose }: ChallengeModalProps) => {
  const challenge = facultyChallenges[facultyId];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  let facultyName = "";
  for (const uni of universities) {
    const fac = uni.faculties.find((f) => f.id === facultyId);
    if (fac) {
      facultyName = fac.name;
      break;
    }
  }

  if (!challenge) return null;

  const handleAnswer = (optionIndex: number) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
    setShowResult(true);
    const correct = challenge.options[optionIndex].correct;
    setIsCorrect(correct);

    setTimeout(() => {
      onComplete(correct);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="Lightbulb" size={16} className="text-[var(--dzen-gold)]" />
            <span className="text-xs text-muted-foreground font-medium">Челлендж · {facultyName}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-[var(--dzen-blue-dark)]">
            <Icon name="X" size={18} />
          </button>
        </div>

        <h3 className="font-heading font-semibold text-lg text-[var(--dzen-blue-dark)] mb-5">
          {challenge.question}
        </h3>

        <div className="space-y-3">
          {challenge.options.map((option, i) => {
            let style = "border-transparent bg-[var(--dzen-cream)] hover:border-[var(--dzen-sky)]/30";
            if (showResult && selectedOption === i) {
              style = option.correct
                ? "border-green-400 bg-green-50"
                : "border-red-300 bg-red-50";
            } else if (showResult && option.correct) {
              style = "border-green-400 bg-green-50/50";
            } else if (showResult) {
              style = "opacity-40 border-transparent bg-white/40";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${style}`}
              >
                <span className="text-sm text-[var(--dzen-blue-dark)]">{option.text}</span>
              </button>
            );
          })}
        </div>

        {showResult && selectedOption !== null && (
          <div
            className={`mt-4 p-4 rounded-2xl animate-fade-in ${
              isCorrect
                ? "bg-green-50 border border-green-200"
                : "bg-amber-50 border border-amber-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{isCorrect ? "🎉" : "💡"}</span>
              <span className={`text-sm font-medium ${isCorrect ? "text-green-700" : "text-amber-700"}`}>
                {isCorrect ? "Верно! Здание загорается светом" : "Не совсем, но знание — сила!"}
              </span>
            </div>
            <p className={`text-xs ${isCorrect ? "text-green-600" : "text-amber-600"}`}>
              {challenge.options[selectedOption].explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeModal;