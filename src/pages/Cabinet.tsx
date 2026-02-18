import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { getProfilePercentages, getTopDirection, type StudentProfile } from "@/lib/algorithm";
import { directionEmojis, universities, type Direction } from "@/data/universities";
import { syncCollectedFaculties } from "@/lib/energySync";

const profileLabels: Record<string, string> = {
  technical: "Технический",
  analytical: "Аналитический",
  creative: "Креативный",
  social: "Социальный",
  leadership: "Лидерский",
};

const Cabinet = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [collected, setCollected] = useState<number[]>([]);

  useEffect(() => {
    syncCollectedFaculties();

    const savedProfile = localStorage.getItem("dzenguide_profile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedCollected = localStorage.getItem("dzenguide_collected");
    if (savedCollected) setCollected(JSON.parse(savedCollected));
  }, []);

  const percentages = useMemo(() => (profile ? getProfilePercentages(profile) : null), [profile]);
  const topDirection = useMemo(() => (profile ? getTopDirection(profile) : null), [profile]);
  const totalFaculties = universities.reduce((sum, u) => sum + u.faculties.length, 0);

  return (
    <div className="min-h-screen bg-[var(--dzen-cream)]">
      <Header />
      <BottomNav />

      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="font-heading font-bold text-3xl text-[var(--dzen-blue-dark)] mb-2">
              Личный кабинет
            </h1>
            <p className="text-muted-foreground">Твой прогресс и достижения</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon="Compass"
              label="Тест"
              value={profile ? "Пройден ✓" : "Не пройден"}
              color={profile ? "text-green-600" : "text-muted-foreground"}
            />
            <StatCard
              icon="Star"
              label="Коллекция"
              value={`${collected.length} / ${totalFaculties}`}
              color="text-[var(--dzen-gold)]"
            />
            <StatCard
              icon="Target"
              label="Направление"
              value={topDirection ? `${directionEmojis[topDirection as Direction]} ${topDirection}` : "—"}
              color="text-[var(--dzen-sky)]"
            />
          </div>

          {profile && percentages ? (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/80 rounded-3xl p-6 border border-white/60 animate-fade-in-up">
                <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-4">Профиль</h3>
                <div className="space-y-3">
                  {Object.entries(percentages).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-28 shrink-0">
                        {profileLabels[key]}
                      </span>
                      <div className="flex-1 h-2.5 bg-black/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--dzen-sky)] rounded-full transition-all duration-1000"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[var(--dzen-blue-dark)] w-10 text-right">
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 rounded-3xl p-6 border border-white/60 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-4">Действия</h3>
                <div className="space-y-3">
                  <Link
                    to="/results"
                    className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--dzen-cream)] hover:bg-[var(--dzen-sky)]/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--dzen-sky)]/10 flex items-center justify-center">
                      <Icon name="Trophy" size={18} className="text-[var(--dzen-sky)]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--dzen-blue-dark)]">Рекомендации вузов</div>
                      <div className="text-xs text-muted-foreground">Топ-5 по твоему профилю</div>
                    </div>
                    <Icon name="ChevronRight" size={16} className="ml-auto text-muted-foreground" />
                  </Link>

                  <Link
                    to="/archipelago"
                    className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--dzen-cream)] hover:bg-[var(--dzen-peach)]/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--dzen-peach)]/20 flex items-center justify-center">
                      <Icon name="Map" size={18} className="text-[var(--dzen-gold)]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--dzen-blue-dark)]">Архипелаг Будущего</div>
                      <div className="text-xs text-muted-foreground">Открывай острова и факультеты</div>
                    </div>
                    <Icon name="ChevronRight" size={16} className="ml-auto text-muted-foreground" />
                  </Link>

                  <Link
                    to="/student-day"
                    className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--dzen-cream)] hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Icon name="Gamepad2" size={18} className="text-purple-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--dzen-blue-dark)]">День студента</div>
                      <div className="text-xs text-muted-foreground">+Энергия для Архипелага</div>
                    </div>
                    <Icon name="ChevronRight" size={16} className="ml-auto text-muted-foreground" />
                  </Link>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--dzen-sky)]/10 to-[var(--dzen-peach)]/10 border border-[var(--dzen-sky)]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--dzen-gold)]/20 flex items-center justify-center">
                        <Icon name="FileText" size={18} className="text-[var(--dzen-gold)]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[var(--dzen-blue-dark)]">PDF-гайд</div>
                        <div className="text-xs text-muted-foreground">Полный персональный отчёт</div>
                      </div>
                      <span className="font-heading font-bold text-[var(--dzen-gold)]">750 ₽</span>
                    </div>
                    <button className="w-full mt-3 bg-[var(--dzen-gold)] hover:bg-[var(--dzen-blue-dark)] text-white py-2.5 rounded-xl text-sm font-medium transition-all">
                      Получить гайд
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 rounded-3xl p-10 border border-white/60 text-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-[var(--dzen-sky)]/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Compass" size={28} className="text-[var(--dzen-sky)]" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-[var(--dzen-blue-dark)] mb-2">
                Начни с теста
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Пройди тест из 17 вопросов, чтобы определить свой профиль и получить персональные рекомендации
              </p>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white px-8 py-3.5 rounded-2xl font-heading font-semibold transition-all hover:shadow-lg"
              >
                <Icon name="Rocket" size={18} />
                Начать путешествие
              </Link>
            </div>
          )}

          {collected.length > 0 && (
            <div className="bg-white/80 rounded-3xl p-6 border border-white/60 animate-fade-in-up">
              <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-4 flex items-center gap-2">
                <Icon name="Star" size={18} className="text-[var(--dzen-gold)]" />
                Коллекция открытий
              </h3>
              <div className="flex flex-wrap gap-2">
                {universities.flatMap((uni) =>
                  uni.faculties
                    .filter((f) => collected.includes(f.id))
                    .map((fac) => (
                      <span
                        key={fac.id}
                        className="inline-flex items-center gap-1 bg-[var(--dzen-cream)] px-3 py-1.5 rounded-full text-xs text-[var(--dzen-blue-dark)]"
                      >
                        {directionEmojis[fac.direction as Direction]} {uni.name} — {fac.name}
                      </span>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="bg-white/80 rounded-2xl p-5 border border-white/60 text-center animate-fade-in-up">
      <div className="w-10 h-10 rounded-full bg-[var(--dzen-cream)] flex items-center justify-center mx-auto mb-2">
        <Icon name={icon} size={18} className="text-[var(--dzen-sky)]" />
      </div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`font-heading font-semibold ${color}`}>{value}</div>
    </div>
  );
}

export default Cabinet;