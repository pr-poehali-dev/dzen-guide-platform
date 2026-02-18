import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const slides = [
  {
    image:
      "https://cdn.poehali.dev/projects/9765b0b2-6566-413b-a4e7-eefc808258e4/files/b07ed17d-2e85-4c15-8cae-2339d0dc1f79.jpg",
    question: "Не можешь определиться с вузом?",
    subtitle: "Сотни вариантов, а ясности — ноль. Знакомо?",
  },
  {
    image:
      "https://cdn.poehali.dev/projects/9765b0b2-6566-413b-a4e7-eefc808258e4/files/0064c2e1-f59b-4071-ad29-315ba9132f82.jpg",
    question: "Устал от бесконечных советов?",
    subtitle: "Родители хотят одно, друзья — другое, а ты — третье",
  },
  {
    image:
      "https://cdn.poehali.dev/projects/9765b0b2-6566-413b-a4e7-eefc808258e4/files/5c63d2f7-97a1-4c2e-9ab0-aedad2d14257.jpg",
    question: "А что, если путь уже есть?",
    subtitle: "Пройди короткий тест — и мы покажем твоё направление",
  },
];

const WELCOME_SEEN_KEY = "dzen_welcome_seen";

export function hasSeenWelcome(): boolean {
  return localStorage.getItem(WELCOME_SEEN_KEY) === "true";
}

export function markWelcomeSeen(): void {
  localStorage.setItem(WELCOME_SEEN_KEY, "true");
}

const Welcome = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const isLast = current === slides.length - 1;

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setDirection(index > current ? "next" : "prev");
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 400);
    },
    [animating, current]
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      markWelcomeSeen();
      navigate("/quiz");
      return;
    }
    goTo(current + 1);
  }, [isLast, current, goTo, navigate]);

  const handleSkip = useCallback(() => {
    markWelcomeSeen();
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isLast) {
        goTo(current + 1);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [current, isLast, goTo]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < slides.length - 1) goTo(current + 1);
      if (diff < 0 && current > 0) goTo(current - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--dzen-cream)] flex flex-col relative overflow-hidden">
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-30 text-sm text-muted-foreground hover:text-[var(--dzen-blue-dark)] transition-colors flex items-center gap-1"
      >
        Пропустить
        <Icon name="ChevronRight" size={16} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <div
            className="relative w-72 h-72 md:w-80 md:h-80 mb-10"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-all duration-500 ease-out"
                style={{
                  opacity: i === current ? 1 : 0,
                  transform:
                    i === current
                      ? "scale(1) translateX(0)"
                      : i < current
                        ? "scale(0.9) translateX(-30px)"
                        : "scale(0.9) translateX(30px)",
                  pointerEvents: i === current ? "auto" : "none",
                }}
              >
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border-4 border-white/60">
                  <img
                    src={slide.image}
                    alt={slide.question}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}

            <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-[var(--dzen-peach)]/40 rounded-full blur-2xl" />
            <div className="absolute -top-3 -left-3 w-16 h-16 bg-[var(--dzen-sky)]/30 rounded-full blur-2xl" />
          </div>

          <div className="text-center min-h-[120px] flex flex-col items-center justify-start">
            <h1
              key={`q-${current}`}
              className="font-heading font-extrabold text-2xl md:text-3xl text-[var(--dzen-blue-dark)] mb-3 animate-fade-in-up"
            >
              {slides[current].question}
            </h1>
            <p
              key={`s-${current}`}
              className="text-muted-foreground text-base md:text-lg max-w-sm animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              {slides[current].subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-10 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group p-1"
              aria-label={`Слайд ${i + 1}`}
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-[var(--dzen-sky)]"
                    : "w-2 bg-[var(--dzen-sand)] group-hover:bg-[var(--dzen-sky)]/40"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full max-w-sm flex items-center justify-center gap-2 bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white px-8 py-4 rounded-2xl font-heading font-semibold transition-all hover:shadow-xl hover:shadow-[var(--dzen-sky)]/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLast ? (
            <>
              <Icon name="Rocket" size={20} />
              Пройти тест
            </>
          ) : (
            <>
              Дальше
              <Icon name="ArrowRight" size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Welcome;