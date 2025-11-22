-- Создание таблицы для настроек темы сайта
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Создание таблицы для страниц
CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  meta_description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Создание таблицы для секций страниц
CREATE TABLE public.page_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_type text NOT NULL,
  section_data jsonb NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Включение RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Политики для site_settings
CREATE POLICY "Настройки сайта доступны всем для чтения"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Только админы могут изменять настройки сайта"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::app_role
    )
  );

-- Политики для pages
CREATE POLICY "Активные страницы доступны всем для чтения"
  ON public.pages FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  ));

CREATE POLICY "Только админы могут управлять страницами"
  ON public.pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::app_role
    )
  );

-- Политики для page_sections
CREATE POLICY "Секции активных страниц доступны всем для чтения"
  ON public.page_sections FOR SELECT
  USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = page_sections.page_id
      AND pages.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::app_role
    )
  );

CREATE POLICY "Только админы могут управлять секциями страниц"
  ON public.page_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::app_role
    )
  );

-- Триггеры для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Вставка начальных данных
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('theme_colors', '{"primary": "220 70% 50%", "secondary": "200 20% 50%", "background": "0 0% 100%", "foreground": "222.2 84% 4.9%"}'),
  ('site_title', '"ТеплоКомфорт"'),
  ('site_description', '"Отопительное оборудование для дома в Томмоте, Якутия"'),
  ('contact_phone', '"+7 (xxx) xxx-xx-xx"'),
  ('contact_email', '"info@teplokomfort.ru"'),
  ('contact_address', '"г. Томмот, Якутия"');

INSERT INTO public.pages (slug, title, meta_description) VALUES
  ('home', 'Главная', 'Отопительное оборудование для дома в Томмоте, Якутия'),
  ('catalog', 'Каталог', 'Каталог отопительного оборудования'),
  ('about', 'О нас', 'О компании ТеплоКомфорт'),
  ('contact', 'Контакты', 'Контактная информация');

-- Вставка секций для главной страницы
INSERT INTO public.page_sections (page_id, section_type, section_data, sort_order) VALUES
  (
    (SELECT id FROM pages WHERE slug = 'home'),
    'hero',
    '{"title": "Тепло и Комфорт для Вашего Дома", "subtitle": "Современное отопительное оборудование в Томмоте, Якутия", "image": "/src/assets/hero-snowboarding.jpg", "buttonText": "Смотреть каталог", "buttonLink": "/catalog"}',
    1
  ),
  (
    (SELECT id FROM pages WHERE slug = 'home'),
    'news_carousel',
    '{"title": "Новости и акции"}',
    2
  ),
  (
    (SELECT id FROM pages WHERE slug = 'home'),
    'featured_products',
    '{"title": "Рекомендуемые товары"}',
    3
  ),
  (
    (SELECT id FROM pages WHERE slug = 'home'),
    'product_grid',
    '{"title": "Новинки", "showOnlyNew": true}',
    4
  );