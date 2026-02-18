import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface FinaleOverlayProps {
  totalFaculties: number;
  onDismiss: () => void;
}

const FinaleOverlay = ({ totalFaculties, onDismiss }: FinaleOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[var(--dzen-sky)]/20 to-[var(--dzen-peach)]/20 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-scale-in">
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--dzen-sky)]/20 to-[var(--dzen-peach)]/20 flex items-center justify-center">
            <span className="text-5xl animate-pulse-soft">🌟</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[var(--dzen-gold)]"
                style={{
                  transform: `rotate(${i * 60}deg) translateY(-50px)`,
                  animation: `pulseSoft ${2 + i * 0.3}s ease-in-out infinite`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </div>

        <h2 className="font-heading font-bold text-2xl text-[var(--dzen-blue-dark)] mb-3">
          Твой путь начинает проявляться
        </h2>

        <p className="text-muted-foreground mb-2">
          Ты открыл {totalFaculties} факультетов на Архипелаге Будущего
        </p>

        <p className="text-sm text-muted-foreground mb-6">
          Карта засветилась — ты нашёл свои направления!
        </p>

        <div className="space-y-3">
          <Link
            to="/results"
            className="block w-full bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white py-3.5 rounded-2xl font-heading font-semibold transition-all"
          >
            <Icon name="Sparkles" size={16} className="inline mr-2" />
            Создать мой персональный DzenGuide
          </Link>

          <button
            onClick={onDismiss}
            className="block w-full bg-white border border-[var(--dzen-sand)] text-[var(--dzen-blue-dark)] py-3 rounded-2xl text-sm font-medium transition-all hover:bg-[var(--dzen-cream)]"
          >
            Продолжить исследование
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinaleOverlay;