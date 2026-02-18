import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface NavItem {
  path: string;
  icon: string;
  label: string;
  badge?: number;
}

interface BottomNavProps {
  archipelagoProgress?: number;
}

const BottomNav = ({ archipelagoProgress }: BottomNavProps) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: "/", icon: "Home", label: "Главная" },
    { path: "/quiz", icon: "Compass", label: "Тест" },
    { path: "/archipelago", icon: "Map", label: "Архипелаг", badge: archipelagoProgress },
    { path: "/student-day", icon: "GraduationCap", label: "День" },
    { path: "/cabinet", icon: "User", label: "Кабинет" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass border-t border-white/20 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-xl transition-all ${
                  active
                    ? "text-[var(--dzen-sky)]"
                    : "text-muted-foreground hover:text-[var(--dzen-blue-dark)]"
                }`}
              >
                {active && (
                  <div className="absolute -top-0.5 w-8 h-1 rounded-full bg-[var(--dzen-sky)]" />
                )}
                <div className="relative">
                  <Icon
                    name={item.icon}
                    size={active ? 22 : 20}
                    className={`transition-all ${active ? "drop-shadow-sm" : ""}`}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-[var(--dzen-gold)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] leading-tight ${active ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
