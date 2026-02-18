import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  selfDiscoveryQuizzes,
  teamRoles,
  interactiveSituation,
} from "@/data/archipelago";
import type { SelfDiscoveryStep } from "@/hooks/useArchipelagoState";

interface SelfDiscoveryPhaseProps {
  step: SelfDiscoveryStep;
  quizIndex: number;
  onQuizAnswer: (scores: Partial<Record<string, number>>) => void;
  onRoleSelect: (roleId: string, scores: Partial<Record<string, number>>) => void;
  onSituationAnswer: (scores: Partial<Record<string, number>>, feedback: string) => void;
  onComplete: () => void;
}

const SelfDiscoveryPhase = ({
  step,
  quizIndex,
  onQuizAnswer,
  onRoleSelect,
  onSituationAnswer,
  onComplete,
}: SelfDiscoveryPhaseProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleQuizAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    const quiz = selfDiscoveryQuizzes[quizIndex];
    if (quiz) {
      onQuizAnswer(quiz.options[optionIndex].scores);
    }
    setTimeout(() => {
      setSelectedOption(null);
    }, 600);
  };

  const handleRoleSelect = (roleId: string) => {
    const role = teamRoles.find((r) => r.id === roleId);
    if (role) {
      onRoleSelect(roleId, role.scores);
    }
  };

  const handleSituationAnswer = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    const option = interactiveSituation.options[optionIndex];
    setFeedback(option.feedback);
    setTimeout(() => {
      onSituationAnswer(option.scores, option.feedback);
      setShowFeedback(false);
      setSelectedOption(null);
      setFeedback("");
    }, 2500);
  };

  if (step === "done") {
    return (
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-[var(--dzen-sky)]/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🏝️</span>
        </div>
        <h3 className="font-heading font-bold text-xl text-[var(--dzen-blue-dark)] mb-2">
          Первый остров проявился!
        </h3>
        <p className="text-muted-foreground mb-6">
          Самопознание завершено. Силуэт острова расцвёл светом.
        </p>
        <button
          onClick={onComplete}
          className="bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white px-8 py-3 rounded-2xl font-heading font-semibold transition-all"
        >
          Продолжить путешествие
          <Icon name="ArrowRight" size={16} className="inline ml-2" />
        </button>
      </div>
    );
  }

  if (step === "quiz") {
    const quiz = selfDiscoveryQuizzes[quizIndex];
    if (!quiz) return null;

    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-[var(--dzen-sky)]/10 flex items-center justify-center">
            <span className="text-sm">🔮</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Самопознание · Вопрос {quizIndex + 1} из {selfDiscoveryQuizzes.length}
          </span>
        </div>

        <h3 className="font-heading font-semibold text-lg text-[var(--dzen-blue-dark)] mb-5">
          {quiz.question}
        </h3>

        <div className="space-y-3">
          {quiz.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleQuizAnswer(i)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                selectedOption === i
                  ? "border-[var(--dzen-sky)] bg-[var(--dzen-sky)]/10 scale-[0.98]"
                  : "border-transparent bg-white/60 hover:bg-white hover:border-[var(--dzen-sky)]/30"
              }`}
            >
              <span className="text-sm text-[var(--dzen-blue-dark)]">{option.text}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-1 mt-6">
          {selfDiscoveryQuizzes.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all ${
                i < quizIndex ? "bg-[var(--dzen-sky)]" : i === quizIndex ? "bg-[var(--dzen-sky)]/50" : "bg-[var(--dzen-sand)]/30"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === "role") {
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-[var(--dzen-peach)]/20 flex items-center justify-center">
            <span className="text-sm">👥</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">Самопознание · Роль в команде</span>
        </div>

        <h3 className="font-heading font-semibold text-lg text-[var(--dzen-blue-dark)] mb-2">
          Какая роль тебе ближе в командной работе?
        </h3>
        <p className="text-sm text-muted-foreground mb-5">Выбери роль, которая отзывается сильнее всего</p>

        <div className="space-y-3">
          {teamRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="w-full text-left p-4 rounded-2xl border-2 border-transparent bg-white/60 hover:bg-white hover:border-[var(--dzen-sky)]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{role.emoji}</span>
                <div>
                  <div className="font-medium text-[var(--dzen-blue-dark)] text-sm">{role.name}</div>
                  <div className="text-xs text-muted-foreground">{role.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "situation") {
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
            <span className="text-sm">🎭</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">Самопознание · Ситуация</span>
        </div>

        <h3 className="font-heading font-semibold text-lg text-[var(--dzen-blue-dark)] mb-5">
          {interactiveSituation.text}
        </h3>

        <div className="space-y-3">
          {interactiveSituation.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSituationAnswer(i)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                selectedOption === i && showFeedback
                  ? "border-green-400 bg-green-50"
                  : showFeedback
                  ? "opacity-50 border-transparent bg-white/40"
                  : "border-transparent bg-white/60 hover:bg-white hover:border-[var(--dzen-sky)]/30"
              }`}
            >
              <span className="text-sm text-[var(--dzen-blue-dark)]">{option.text}</span>
            </button>
          ))}
        </div>

        {showFeedback && feedback && (
          <div className="mt-4 p-4 rounded-2xl bg-green-50 border border-green-200 animate-fade-in">
            <p className="text-sm text-green-700">✨ {feedback}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default SelfDiscoveryPhase;