export type PartnerCategory =
  | "BANK"
  | "MFO"
  | "INSURANCE"
  | "FINTECH"
  | "EDU"
  | "ASSOCIATION";

export type Partner = {
  id: string;
  name: string;
  description?: string;
  category: PartnerCategory;
  siteUrl?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  tags?: string[];
};

// ----- Mock data (замените на реальные данные или подключите CMS/API) -----
export const partners: Partner[] = [
  {
    id: "halyk",
    name: "Halyk Bank",
    description:
      "Крупнейший банк Казахстана. Партнёр в рамках ипотечных и потребительских программ.",
    category: "BANK",
    siteUrl: "https://halykbank.kz",
    city: "Алматы",
    country: "KZ",
    tags: ["ипотека", "потребкредит"],
    logoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmR1oCNt7ejwikxu692haSVgLiyQJCkB-QIA&s",
  },
  {
    id: "kaspi",
    name: "Kaspi.kz",
    description:
      "Экосистема платежей и маркетплейс. Совместные инициативы по повышению финансовой грамотности.",
    category: "FINTECH",
    siteUrl: "https://kaspi.kz",
    city: "Алматы",
    country: "KZ",
    tags: ["финтех", "эквайринг"],
    logoUrl:
      "data:image/jpeg;base64,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",
  },
  {
    id: "freedom",
    name: "Freedom Finance",
    description:
      "Финансовая группа: брокеридж, инвестиции, рассрочка. Партнёрские программы для брокеров.",
    category: "FINTECH",
    siteUrl: "https://freedomfinance.kz",
    city: "Алматы",
    country: "KZ",
    tags: ["инвестиции", "рассрочка"],
  },
  {
    id: "eubank",
    name: "Евразийский Банк",
    description: "Программы автокредитования и POS-кредитования.",
    category: "BANK",
    siteUrl: "https://eubank.kz",
    city: "Алматы",
    country: "KZ",
    tags: ["автокредит", "POS"],
  },
  {
    id: "nomad",
    name: "Nomad Insurance",
    description: "Страховые продукты для заёмщиков и партнёров Ассоциации.",
    category: "INSURANCE",
    siteUrl: "https://nomadinsurance.kz",
    city: "Астана",
    country: "KZ",
    tags: ["страхование", "личные риски"],
  },
  {
    id: "kolesa",
    name: "Kolesa Group",
    description:
      "Маркетплейс авто и недвижимости. Совместные проекты по кредитованию.",
    category: "FINTECH",
    siteUrl: "https://kolesa.group",
    city: "Алматы",
    country: "KZ",
    tags: ["маркетплейс", "аукцион"],
  },
  {
    id: "mfoexample",
    name: "МФО Надёжная",
    description:
      "Микрофинансовая организация. Партнёр по продуктам экспресс-кредитования.",
    category: "MFO",
    siteUrl: "https://example-mfo.kz",
    city: "Шымкент",
    country: "KZ",
    tags: ["микрозайм", "скоринг"],
  },
  {
    id: "eduskill",
    name: "EduSkill Academy",
    description: "Обучение кредитных брокеров и курсы повышения квалификации.",
    category: "EDU",
    siteUrl: "https://eduskill.kz",
    city: "Алматы",
    country: "KZ",
    tags: ["обучение", "сертификация"],
  },
  {
    id: "assoc",
    name: "Ассоциация Финансовых Организаций",
    description:
      "Партнёрское объединение. Совместные рабочие группы и стандарты.",
    category: "ASSOCIATION",
    siteUrl: "https://afk.kz",
    city: "Астана",
    country: "KZ",
    tags: ["регуляторика", "стандарты"],
  },
];
