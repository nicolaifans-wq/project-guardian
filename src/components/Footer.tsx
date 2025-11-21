import { NavLink } from "@/components/NavLink";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-winter-deep text-white mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <span className="text-xl font-bold">ТК</span>
              </div>
              <span className="text-xl font-bold">ТеплоКомфорт</span>
            </div>
            <p className="text-sm text-white/70">
              Ваш надежный партнер в мире отопительного оборудования с 2010 года
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="text-sm text-white/70 hover:text-white transition-colors">
                  Главная
                </NavLink>
              </li>
              <li>
                <NavLink to="/catalog" className="text-sm text-white/70 hover:text-white transition-colors">
                  Каталог
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="text-sm text-white/70 hover:text-white transition-colors">
                  О нас
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">
                  Контакты
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>info@teplokomfort.ru</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>г. Москва, ул. Примерная, д. 1</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Режим работы</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Пн-Пт: 9:00 - 19:00</li>
              <li>Сб: 10:00 - 16:00</li>
              <li>Вс: выходной</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} ТеплоКомфорт. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
