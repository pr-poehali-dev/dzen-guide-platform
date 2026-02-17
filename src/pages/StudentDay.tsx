import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import { directions, directionEmojis, type Direction } from "@/data/universities";

interface TimeSlot {
  time: string;
  title: string;
  description: string;
  icon: string;
  mood: "great" | "good" | "neutral";
}

const daySchedules: Record<Direction, TimeSlot[]> = {
  IT: [
    { time: "08:30", title: "Алгоритмы и структуры данных", description: "Разбираешь графы и деревья. Сложно, но увлекательно!", icon: "Code", mood: "good" },
    { time: "10:15", title: "Практика программирования", description: "Пишешь свой первый web-сервер на Python", icon: "Terminal", mood: "great" },
    { time: "12:00", title: "Обед в столовой", description: "Бургер и чай. Обсуждаешь проект с однокурсниками", icon: "Coffee", mood: "good" },
    { time: "13:30", title: "Математический анализ", description: "Интегралы... но преподаватель объясняет классно", icon: "Calculator", mood: "neutral" },
    { time: "15:15", title: "Хакатон в IT-клубе", description: "Командный проект — делаете приложение за 3 часа!", icon: "Rocket", mood: "great" },
    { time: "18:00", title: "Вечер в кампусе", description: "Играешь в настолки с друзьями в общежитии", icon: "Gamepad2", mood: "great" },
  ],
  Экономика: [
    { time: "09:00", title: "Микроэкономика", description: "Спрос, предложение, рыночное равновесие", icon: "TrendingUp", mood: "good" },
    { time: "10:45", title: "Статистика", description: "Строишь модели в Excel — данные оживают!", icon: "BarChart3", mood: "great" },
    { time: "12:15", title: "Бизнес-ланч", description: "Кафе у кампуса. Читаешь Forbes за кофе", icon: "Coffee", mood: "good" },
    { time: "13:30", title: "Финансовый анализ", description: "Разбираешь отчётность реальной компании", icon: "FileText", mood: "great" },
    { time: "15:00", title: "Английский для бизнеса", description: "Готовишь презентацию на английском", icon: "Globe", mood: "neutral" },
    { time: "17:00", title: "Экономический клуб", description: "Дебаты о крипте и будущем финансов", icon: "Users", mood: "great" },
  ],
  Менеджмент: [
    { time: "09:00", title: "Основы менеджмента", description: "Кейсы из практики лучших компаний мира", icon: "Briefcase", mood: "good" },
    { time: "10:45", title: "Управление проектами", description: "Учишься планировать по Agile и Scrum", icon: "ClipboardList", mood: "great" },
    { time: "12:15", title: "Нетворкинг-ланч", description: "Обед с приглашённым предпринимателем", icon: "Coffee", mood: "great" },
    { time: "13:30", title: "Маркетинг", description: "Придумываешь рекламную кампанию для стартапа", icon: "Megaphone", mood: "great" },
    { time: "15:00", title: "Право", description: "Основы для будущих руководителей", icon: "Scale", mood: "neutral" },
    { time: "17:00", title: "Бизнес-инкубатор", description: "Работаешь над своим стартап-проектом", icon: "Lightbulb", mood: "great" },
  ],
  Юриспруденция: [
    { time: "09:00", title: "Конституционное право", description: "Разбираешь основы правовой системы", icon: "Scale", mood: "good" },
    { time: "10:45", title: "Юридическая клиника", description: "Помогаешь реальным людям с документами", icon: "Heart", mood: "great" },
    { time: "12:15", title: "Обед", description: "Столовая юрфака — лучшие пирожки в универе", icon: "Coffee", mood: "good" },
    { time: "13:30", title: "Гражданское право", description: "Решаешь юридические задачи-кейсы", icon: "FileText", mood: "good" },
    { time: "15:00", title: "Судебные дебаты", description: "Играешь роль адвоката в учебном суде", icon: "Users", mood: "great" },
    { time: "17:30", title: "Правовой киноклуб", description: "Смотрите фильм о знаменитом судебном процессе", icon: "Film", mood: "great" },
  ],
  "Естественные науки": [
    { time: "08:30", title: "Общая физика", description: "Лекция про квантовую механику — мозг кипит!", icon: "Atom", mood: "neutral" },
    { time: "10:15", title: "Лабораторная работа", description: "Ставишь эксперимент с лазером. Космос!", icon: "FlaskConical", mood: "great" },
    { time: "12:00", title: "Обед в лаборатории", description: "Ну, почти. Перекус в коридоре между парами", icon: "Coffee", mood: "good" },
    { time: "13:30", title: "Высшая математика", description: "Дифуры — сложно, но ты справляешься", icon: "Calculator", mood: "neutral" },
    { time: "15:00", title: "Научный семинар", description: "Профессор рассказывает про своё открытие", icon: "Lightbulb", mood: "great" },
    { time: "17:00", title: "Астрономический кружок", description: "Наблюдаешь звёзды в телескоп на крыше", icon: "Star", mood: "great" },
  ],
  "Гуманитарные науки": [
    { time: "09:30", title: "История искусств", description: "От Ренессанса до современного арта", icon: "Palette", mood: "great" },
    { time: "11:15", title: "Зарубежная литература", description: "Обсуждаешь Кафку — философские дебаты!", icon: "BookOpen", mood: "great" },
    { time: "12:45", title: "Обед в кафе", description: "Уютная кофейня рядом с гуманитарным корпусом", icon: "Coffee", mood: "good" },
    { time: "14:00", title: "Творческое письмо", description: "Пишешь рассказ — преподаватель хвалит!", icon: "PenTool", mood: "great" },
    { time: "15:45", title: "Философия", description: "Размышляешь о смысле жизни с однокурсниками", icon: "Brain", mood: "good" },
    { time: "17:30", title: "Литературный клуб", description: "Читаете друг другу свои тексты", icon: "Heart", mood: "great" },
  ],
};

const moodIcons: Record<string, string> = { great: "😊", good: "🙂", neutral: "😐" };

const StudentDay = () => {
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [started, setStarted] = useState(false);

  const schedule = useMemo(
    () => (selectedDirection ? daySchedules[selectedDirection] : []),
    [selectedDirection]
  );

  const handleStart = () => {
    if (!selectedDirection) return;
    setStarted(true);
    setCurrentSlot(0);
  };

  const handleNext = () => {
    if (currentSlot < schedule.length - 1) {
      setCurrentSlot(currentSlot + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--dzen-cream)]">
      <Header />

      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-3xl">
          {!started ? (
            <div className="animate-fade-in-up">
              <div className="text-center mb-10">
                <h1 className="font-heading font-bold text-3xl text-[var(--dzen-blue-dark)] mb-2">
                  🎓 День студента
                </h1>
                <p className="text-muted-foreground">Проживи один день на факультете мечты</p>
              </div>

              <div className="bg-white/80 rounded-3xl p-8 border border-white/60 mb-6">
                <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-4">
                  Выбери направление
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {directions.map((dir) => (
                    <button
                      key={dir}
                      onClick={() => setSelectedDirection(dir)}
                      className={`p-4 rounded-2xl border-2 transition-all text-center ${
                        selectedDirection === dir
                          ? "border-[var(--dzen-sky)] bg-[var(--dzen-sky)]/10"
                          : "border-transparent bg-[var(--dzen-cream)] hover:border-[var(--dzen-sky)]/30"
                      }`}
                    >
                      <div className="text-2xl mb-1">{directionEmojis[dir]}</div>
                      <div className="text-sm font-medium text-[var(--dzen-blue-dark)]">{dir}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDirection && (
                <div className="text-center animate-scale-in">
                  <button
                    onClick={handleStart}
                    className="inline-flex items-center gap-2 bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white px-8 py-4 rounded-2xl font-heading font-semibold transition-all hover:shadow-lg"
                  >
                    <Icon name="Play" size={18} />
                    Начать день
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {directionEmojis[selectedDirection!]} {selectedDirection}
                  </div>
                  <h2 className="font-heading font-bold text-xl text-[var(--dzen-blue-dark)]">
                    {schedule[currentSlot].time}
                  </h2>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentSlot + 1} / {schedule.length}
                </div>
              </div>

              <div className="relative mb-6">
                <div className="flex gap-1">
                  {schedule.map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        i <= currentSlot ? "bg-[var(--dzen-sky)]" : "bg-[var(--dzen-sand)]/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white/80 rounded-3xl p-8 border border-white/60 mb-6" key={currentSlot}>
                <div className="flex items-start gap-4 animate-fade-in-up">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--dzen-sky)]/10 flex items-center justify-center shrink-0">
                    <Icon name={schedule[currentSlot].icon} size={24} className="text-[var(--dzen-sky)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-lg text-[var(--dzen-blue-dark)]">
                        {schedule[currentSlot].title}
                      </h3>
                      <span className="text-lg">{moodIcons[schedule[currentSlot].mood]}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {schedule[currentSlot].description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {currentSlot < schedule.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white py-3.5 rounded-2xl font-heading font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    Далее
                    <Icon name="ArrowRight" size={18} />
                  </button>
                ) : (
                  <div className="flex-1 text-center">
                    <div className="bg-green-50 rounded-2xl p-6 mb-4">
                      <div className="text-3xl mb-2">🎉</div>
                      <h3 className="font-heading font-semibold text-green-700 mb-1">День завершён!</h3>
                      <p className="text-sm text-green-600">
                        Ты прожил день студента направления «{selectedDirection}»
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setStarted(false); setSelectedDirection(null); }}
                        className="flex-1 bg-white border border-[var(--dzen-sand)] text-[var(--dzen-blue-dark)] py-3 rounded-2xl text-sm font-medium transition-all hover:bg-[var(--dzen-cream)]"
                      >
                        Попробовать другое
                      </button>
                      <Link
                        to="/results"
                        className="flex-1 bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white py-3 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-1"
                      >
                        К рекомендациям
                        <Icon name="ArrowRight" size={16} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDay;
