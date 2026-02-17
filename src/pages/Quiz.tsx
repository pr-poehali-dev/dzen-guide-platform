import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import { Progress } from "@/components/ui/progress";
import { quizQuestions } from "@/data/quizQuestions";
import type { StudentProfile } from "@/lib/algorithm";

const motivations = [
  "Отлично! Продолжай в том же духе 🌟",
  "Ты на верном пути! ✨",
  "Каждый ответ приближает тебя к цели 🎯",
  "Супер! Уже немного осталось 💫",
  "Ты молодец! Почти финиш 🚀",
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [profile, setProfile] = useState<StudentProfile>({
    technical: 0,
    analytical: 0,
    creative: 0,
    social: 0,
    leadership: 0,
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);

  const totalQuestions = quizQuestions.length;
  const progress = ((currentQ) / totalQuestions) * 100;
  const question = quizQuestions[currentQ];

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(optionIndex);

      const option = question.options[optionIndex];
      const newProfile = { ...profile };
      Object.entries(option.scores).forEach(([key, value]) => {
        newProfile[key as keyof StudentProfile] += value || 0;
      });
      setProfile(newProfile);

      if ((currentQ + 1) % 5 === 0 && currentQ < totalQuestions - 1) {
        setShowMotivation(true);
        setTimeout(() => setShowMotivation(false), 2000);
      }

      setTimeout(() => {
        if (currentQ < totalQuestions - 1) {
          setCurrentQ(currentQ + 1);
          setSelectedOption(null);
        } else {
          localStorage.setItem("dzenguide_profile", JSON.stringify(newProfile));
          navigate("/results");
        }
      }, 600);
    },
    [currentQ, profile, question, selectedOption, totalQuestions, navigate]
  );

  return (
    <div className="min-h-screen bg-[var(--dzen-cream)]">
      <Header />

      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <Icon name="Compass" size={14} />
                Вопрос {currentQ + 1} из {totalQuestions}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-[var(--dzen-sand)]/30" />
          </div>

          {showMotivation && (
            <div className="mb-6 animate-fade-in-up">
              <div className="bg-gradient-to-r from-[var(--dzen-sky)]/10 to-[var(--dzen-peach)]/10 rounded-2xl px-6 py-4 text-center">
                <p className="text-[var(--dzen-blue-dark)] font-medium">
                  {motivations[Math.floor(currentQ / 5)] || motivations[0]}
                </p>
              </div>
            </div>
          )}

          <div className="animate-fade-in-up" key={currentQ}>
            <div className="bg-white/80 rounded-3xl p-8 shadow-lg shadow-black/3 border border-white/60 mb-6">
              <h2 className="font-heading font-bold text-xl md:text-2xl text-[var(--dzen-blue-dark)] mb-2">
                {question.text}
              </h2>
              {question.hint && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-6">
                  <Icon name="Lightbulb" size={14} />
                  {question.hint}
                </p>
              )}
              {!question.hint && <div className="mb-6" />}

              <div className="space-y-3">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedOption === i
                        ? "border-[var(--dzen-sky)] bg-[var(--dzen-sky)]/10 scale-[1.02]"
                        : selectedOption !== null
                        ? "border-transparent bg-black/[0.02] opacity-50"
                        : "border-transparent bg-black/[0.02] hover:bg-[var(--dzen-sky)]/5 hover:border-[var(--dzen-sky)]/30 hover:scale-[1.01]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
                          selectedOption === i
                            ? "bg-[var(--dzen-sky)] text-white"
                            : "bg-[var(--dzen-sand)]/30 text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-[var(--dzen-blue-dark)]">{option.text}</span>
                      {selectedOption === i && (
                        <Icon name="Check" size={18} className="ml-auto text-[var(--dzen-sky)] animate-scale-in" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentQ
                      ? "bg-[var(--dzen-sky)] w-6"
                      : i < currentQ
                      ? "bg-[var(--dzen-sky)]/40"
                      : "bg-[var(--dzen-sand)]/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
