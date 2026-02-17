import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";

const features = [
  {
    icon: "Compass",
    title: "Интерактивный тест",
    desc: "17 вопросов для определения твоего профиля и направления",
    color: "bg-[var(--dzen-sky)]/10 text-[var(--dzen-sky)]",
  },
  {
    icon: "Map",
    title: "Карта вузов",
    desc: "Собирай коллекцию факультетов на карте России",
    color: "bg-[var(--dzen-peach)]/20 text-[var(--dzen-gold)]",
  },
  {
    icon: "Trophy",
    title: "Топ-5 рекомендаций",
    desc: "AI подберёт лучшие вузы с вероятностью поступления",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: "GraduationCap",
    title: "День студента",
    desc: "Мини-игра — проживи один день на факультете мечты",
    color: "bg-purple-50 text-purple-500",
  },
];

const steps = [
  { num: "01", title: "Пройди тест", desc: "Ответь на вопросы о себе" },
  { num: "02", title: "Получи профиль", desc: "AI определит твои сильные стороны" },
  { num: "03", title: "Исследуй вузы", desc: "Посмотри топ-5 и карту" },
  { num: "04", title: "Скачай гайд", desc: "Персональный PDF с планом" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-[var(--dzen-cream)]">
      <Header />

      <section className="pt-28 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/60 rounded-full px-4 py-2 mb-6 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
                AI-помощник для абитуриентов
              </div>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight text-[var(--dzen-blue-dark)] mb-6">
                Найди свой <br />
                <span className="text-[var(--dzen-sky)]">идеальный вуз</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
                Спокойный помощник, который проведёт тебя через выбор факультета в игровом формате. Без стресса и давления.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-2 bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white px-8 py-4 rounded-2xl font-heading font-semibold transition-all hover:shadow-xl hover:shadow-[var(--dzen-sky)]/20 hover:-translate-y-0.5"
                >
                  <Icon name="Rocket" size={20} />
                  Начать путешествие
                </Link>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 bg-white hover:bg-white/80 text-[var(--dzen-blue-dark)] px-8 py-4 rounded-2xl font-medium border border-[var(--dzen-sand)] transition-all"
                >
                  <Icon name="Map" size={20} />
                  Карта вузов
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Icon name="Clock" size={14} />
                  ~10 минут
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="Shield" size={14} />
                  Бесплатный тест
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="Sparkles" size={14} />
                  AI-анализ
                </span>
              </div>
            </div>

            <div className="relative animate-fade-in hidden lg:block">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-[var(--dzen-peach)]/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[var(--dzen-sky)]/20 rounded-full blur-3xl" />
              <div className="relative bg-white/70 rounded-3xl p-8 shadow-xl shadow-black/5 border border-white/50">
                <div className="flex items-center gap-3 mb-6">
                  <img
                    src="https://cdn.poehali.dev/files/5b750c0f-7484-449d-b8bb-3f1c79a33b19.jpeg"
                    alt="DzenGuide"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-heading font-bold text-[var(--dzen-blue-dark)]">DzenGuide</div>
                    <div className="text-xs text-muted-foreground">Твой путь к вузу мечты</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-[var(--dzen-cream)] rounded-2xl p-4">
                    <div className="text-xs text-muted-foreground mb-2">Твой профиль</div>
                    <div className="space-y-2">
                      {[
                        { label: "Technical", value: 85, color: "bg-[var(--dzen-sky)]" },
                        { label: "Analytical", value: 72, color: "bg-[var(--dzen-gold)]" },
                        { label: "Creative", value: 60, color: "bg-[var(--dzen-peach)]" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm">
                    <Icon name="CheckCircle" size={16} />
                    Топ-направление: IT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl text-[var(--dzen-blue-dark)] mb-3">
              Как это работает
            </h2>
            <p className="text-muted-foreground">Четыре шага к осознанному выбору</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="bg-white/70 rounded-2xl p-6 border border-white/50 hover-lift"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl font-heading font-extrabold text-[var(--dzen-sky)]/20 mb-3">
                  {step.num}
                </div>
                <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white/40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl text-[var(--dzen-blue-dark)] mb-3">
              Возможности платформы
            </h2>
            <p className="text-muted-foreground">Всё для осознанного выбора</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-white/80 rounded-2xl p-6 border border-white/60 hover-lift flex gap-4"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center shrink-0`}>
                  <Icon name={f.icon} size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-gradient-to-br from-[var(--dzen-sky)]/10 to-[var(--dzen-peach)]/10 rounded-3xl p-12 border border-white/50">
            <h2 className="font-heading font-bold text-3xl text-[var(--dzen-blue-dark)] mb-4">
              Персональный гайд
            </h2>
            <p className="text-muted-foreground mb-2 max-w-md mx-auto">
              Полный PDF-отчёт с профилем, топ-5 вузов, стратегией поступления и визуальной картой
            </p>
            <div className="text-3xl font-heading font-bold text-[var(--dzen-gold)] mb-6">750 ₽</div>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white px-8 py-4 rounded-2xl font-heading font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <Icon name="Sparkles" size={20} />
              Пройти тест бесплатно
            </Link>
            <p className="text-xs text-muted-foreground mt-4">Тест бесплатный. Оплата только за PDF-гайд</p>
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-[var(--dzen-sand)]/30">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.poehali.dev/files/5b750c0f-7484-449d-b8bb-3f1c79a33b19.jpeg"
              alt="DzenGuide"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-muted-foreground">
              DzenGuide © 2026. Спокойный путь к образованию.
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/quiz" className="hover:text-foreground transition-colors">Тест</Link>
            <Link to="/map" className="hover:text-foreground transition-colors">Карта</Link>
            <Link to="/cabinet" className="hover:text-foreground transition-colors">Кабинет</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
