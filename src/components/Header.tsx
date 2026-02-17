import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://cdn.poehali.dev/files/5b750c0f-7484-449d-b8bb-3f1c79a33b19.jpeg"
            alt="DzenGuide"
            className="w-10 h-10 rounded-full shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="font-heading font-bold text-lg text-[var(--dzen-blue-dark)]">
            Dzen<span className="text-[var(--dzen-gold)]">Guide</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {!isHome && (
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Главная
            </Link>
          )}
          <Link to="/quiz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <span className="flex items-center gap-1.5">
              <Icon name="Compass" size={16} />
              Тест
            </span>
          </Link>
          <Link to="/map" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <span className="flex items-center gap-1.5">
              <Icon name="Map" size={16} />
              Карта
            </span>
          </Link>
          <Link to="/cabinet" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <span className="flex items-center gap-1.5">
              <Icon name="User" size={16} />
              Кабинет
            </span>
          </Link>
        </nav>

        <Link
          to="/quiz"
          className="bg-[var(--dzen-sky)] hover:bg-[var(--dzen-sky)]/90 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-[var(--dzen-sky)]/20"
        >
          Начать путешествие
        </Link>
      </div>
    </header>
  );
};

export default Header;
