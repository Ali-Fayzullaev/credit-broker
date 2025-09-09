// lib/nav.ts
export type NavItem = {
  href: string;
  label: string;      // полный текст (мобилка)
  short?: string;     // короткий текст (десктоп)
  desktop?: boolean;  // показывать в верхнем меню на десктопе
  order?: number;     // порядок на десктопе
};

export const navItems: NavItem[] = [
  // { href: "/", label: "Главная", desktop: false }, // логотип = главная
  { href: "/registry",   label: "Реестр брокеров", short: "Реестр",     desktop: true,  order: 10 },
  { href: "/news",       label: "Новости",                             desktop: true,  order: 20 },
  { href: "/partners",   label: "Партнёры",                            desktop: true,  order: 30 },
  { href: "/blog",       label: "Аналитика",                           desktop: true,  order: 40 },
  { href: "/about",      label: "Об Ассоциации", short: "О нас",       desktop: true,  order: 50 },
  { href: "/contacts",   label: "Контакты",                            desktop: true,  order: 60 },

  // второстепенные — в «Ещё» (на мобиле показываем как обычно)
  { href: "/membership", label: "Членство",        short: "Членство",  desktop: false },
  { href: "/legal",      label: "Юридическая база",short: "Документы", desktop: false },
  { href: "/leads",      label: "Купить лиды",     short: "Лиды",      desktop: false },
  { href: "/cabinet",    label: "Личный кабинет",  short: "Кабинет",   desktop: false },
];
