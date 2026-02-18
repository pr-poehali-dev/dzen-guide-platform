import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Progress } from "@/components/ui/progress";
import { getRecommendations, getTopDirection, getProfilePercentages, type StudentProfile, type FacultyRecommendation } from "@/lib/algorithm";
import { directionEmojis, type Direction } from "@/data/universities";

const profileLabels: Record<string, string> = {
  technical: "Технический",
  analytical: "Аналитический",
  creative: "Креативный",
  social: "Социальный",
  leadership: "Лидерский",
};

const profileColors: Record<string, string> = {
  technical: "bg-[var(--dzen-sky)]",
  analytical: "bg-[var(--dzen-gold)]",
  creative: "bg-[var(--dzen-peach)]",
  social: "bg-green-400",
  leadership: "bg-purple-400",
};

const Results = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [egeTotal, setEgeTotal] = useState(250);
  const [budget, setBudget] = useState(400000);
  const [showRecs, setShowRecs] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dzenguide_profile");
    if (!saved) {
      navigate("/quiz");
      return;
    }
    setProfile(JSON.parse(saved));
  }, [navigate]);

  const percentages = useMemo(() => (profile ? getProfilePercentages(profile) : null), [profile]);
  const topDirection = useMemo(() => (profile ? getTopDirection(profile) : null), [profile]);

  const recommendations = useMemo(() => {
    if (!profile || !showRecs) return [];
    return getRecommendations({
      profile,
      egeTotal,
      budget,
      canRelocate: true,
    });
  }, [profile, egeTotal, budget, showRecs]);

  if (!profile || !percentages || !topDirection) return null;

  return (
    <div className="min-h-screen bg-[var(--dzen-cream)]">
      <Header />
      <BottomNav />

      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-2 mb-4 text-sm">
              <Icon name="CheckCircle" size={16} />
              Тест пройден!
            </div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-[var(--dzen-blue-dark)] mb-2">
              Твой профиль готов
            </h1>
            <p className="text-muted-foreground">
              Топ-направление: {directionEmojis[topDirection as Direction]} <strong>{topDirection}</strong>
            </p>
            <div className="mt-4">
              <Link
                to="/archipelago"
                className="inline-flex items-center gap-2 bg-[var(--dzen-peach)]/20 hover:bg-[var(--dzen-peach)]/30 text-[var(--dzen-blue-dark)] px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                <Icon name="Zap" size={14} className="text-[var(--dzen-gold)]" />
                Энергия из теста добавлена на Архипелаг
                <Icon name="ArrowRight" size={14} />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/80 rounded-3xl p-6 border border-white/60 animate-fade-in-up">
              <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-4 flex items-center gap-2">
                <Icon name="BarChart3" size={18} />
                Индексы профиля
              </h3>
              <div className="space-y-4">
                {Object.entries(percentages).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{profileLabels[key] || key}</span>
                      <span className="font-medium text-[var(--dzen-blue-dark)]">{value}%</span>
                    </div>
                    <div className="h-3 bg-black/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${profileColors[key] || "bg-gray-400"} rounded-full transition-all duration-1000`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 rounded-3xl p-6 border border-white/60 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-4 flex items-center gap-2">
                <Icon name="Settings" size={18} />
                Параметры подбора
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Сумма баллов ЕГЭ (3 предмета): <strong className="text-[var(--dzen-blue-dark)]">{egeTotal}</strong>
                  </label>
                  <input
                    type="range"
                    min={150}
                    max={300}
                    value={egeTotal}
                    onChange={(e) => { setEgeTotal(Number(e.target.value)); setShowRecs(false); }}
                    className="w-full accent-[var(--dzen-sky)]"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>150</span>
                    <span>300</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Бюджет на обучение в год: <strong className="text-[var(--dzen-blue-dark)]">{(budget / 1000).toFixed(0)}к ₽</strong>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={800000}
                    step={10000}
                    value={budget}
                    onChange={(e) => { setBudget(Number(e.target.value)); setShowRecs(false); }}
                    className="w-full accent-[var(--dzen-gold)]"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 ₽</span>
                    <span>800к ₽</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowRecs(true)}
                  className="w-full bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white py-3.5 rounded-2xl font-heading font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Icon name="Sparkles" size={18} />
                  Подобрать вузы
                </button>
              </div>
            </div>
          </div>

          {showRecs && recommendations.length > 0 && (
            <div className="animate-fade-in-up">
              <h2 className="font-heading font-bold text-2xl text-[var(--dzen-blue-dark)] mb-6 text-center">
                🏆 Топ-5 рекомендаций
              </h2>
              <div className="space-y-4">
                {recommendations.map((rec, i) => (
                  <RecommendationCard key={rec.faculty.id} rec={rec} index={i} />
                ))}
              </div>

              <div className="mt-10 text-center">
                <div className="bg-gradient-to-br from-[var(--dzen-sky)]/10 to-[var(--dzen-peach)]/10 rounded-3xl p-8 border border-white/50">
                  <h3 className="font-heading font-bold text-xl text-[var(--dzen-blue-dark)] mb-2">
                    Хочешь полный персональный гайд?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    PDF с подробным профилем, стратегией поступления и визуальной картой
                  </p>
                  <div className="text-2xl font-heading font-bold text-[var(--dzen-gold)] mb-4">750 ₽</div>
                  <Link
                    to="/cabinet"
                    className="inline-flex items-center gap-2 bg-[var(--dzen-gold)] hover:bg-[var(--dzen-blue-dark)] text-white px-8 py-3.5 rounded-2xl font-heading font-semibold transition-all hover:shadow-lg"
                  >
                    <Icon name="Download" size={18} />
                    Получить PDF-гайд
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function RecommendationCard({ rec, index }: { rec: FacultyRecommendation; index: number }) {
  const probabilityPercent = Math.round(rec.probability * 100);
  const matchPercent = Math.round(rec.profileMatch * 100);

  return (
    <div
      className="bg-white/80 rounded-2xl p-5 border border-white/60 hover-lift"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-8 h-8 rounded-full bg-[var(--dzen-sky)]/10 flex items-center justify-center text-sm font-bold text-[var(--dzen-sky)]">
            {index + 1}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-heading font-semibold text-[var(--dzen-blue-dark)]">
              {rec.university.name}
            </h4>
            {rec.isBudget && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">бюджет</span>
            )}
            {!rec.isBudget && (
              <span className="text-xs bg-[var(--dzen-peach)]/30 text-[var(--dzen-gold)] px-2 py-0.5 rounded-full">
                {(rec.faculty.fee_paid / 1000).toFixed(0)}к ₽/год
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {directionEmojis[rec.faculty.direction as Direction]} {rec.faculty.name} · {rec.university.city}
          </p>
        </div>

        <div className="flex gap-4 sm:gap-6 shrink-0">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Совпадение</div>
            <div className="font-heading font-bold text-[var(--dzen-sky)]">{matchPercent}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Вероятность</div>
            <div className={`font-heading font-bold ${probabilityPercent >= 80 ? "text-green-600" : probabilityPercent >= 50 ? "text-[var(--dzen-gold)]" : "text-red-400"}`}>
              {probabilityPercent}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Рейтинг</div>
            <Progress value={rec.universityRating * 100} className="w-16 h-2 mt-2 bg-black/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;