import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PhotoManifest = { products: Record<string, string[]>; shops: Record<string, string> };
let manifest: PhotoManifest = { products: {}, shops: {} };
try {
  manifest = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "products", "manifest.json"), "utf8")
  );
} catch {
  console.warn("manifest.json не найден — использую запасные изображения");
}

const categories = [
  { slug: "toys", name: "Игрушки и куклы", emoji: "🧸", position: 1 },
  { slug: "ceramics", name: "Керамика и посуда", emoji: "🍶", position: 2 },
  { slug: "jewelry", name: "Украшения", emoji: "💍", position: 3 },
  { slug: "textile", name: "Текстиль для дома", emoji: "🧶", position: 4 },
  { slug: "decor", name: "Декор", emoji: "🏡", position: 5 },
  { slug: "candles", name: "Свечи и аромат", emoji: "🕯️", position: 6 },
  { slug: "furniture", name: "Мебель", emoji: "🪑", position: 7 },
  { slug: "materials", name: "Сырьё и материалы", emoji: "🪵", position: 8 },
];

type ProductSeed = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock?: number;
  category: string;
  handmade?: boolean;
  eco?: boolean;
  madeToOrder?: boolean;
  productionDays?: number;
  weightGrams?: number;
  dimensions?: string;
  materials?: string;
  care?: string;
  applications?: string;
  production?: string;
  materialSources?: { name: string; origin?: string; supplierSlug?: string; supplierName?: string }[];
  featured?: boolean;
  variants?: { kind: string; value: string }[];
  reviews?: { rating: number; text: string; authorName: string; verified?: boolean; sellerReply?: string }[];
};

type ShopSeed = {
  slug: string;
  name: string;
  description: string;
  city: string;
  region?: string;
  kind?: string;
  address?: string;
  exportInfo?: string;
  promoted?: boolean;
  ownerName: string;
  ownerEmail: string;
  rating: number;
  ratingCount: number;
  verified: boolean;
  deliveryInfo: string;
  returnPolicy: string;
  products: ProductSeed[];
};

const shops: ShopSeed[] = [
  {
    slug: "teplye-lapki",
    name: "Морские петельки",
    description:
      "Вязаные игрушки и декор для детей. Каждый зверёк связан вручную из мягкой хлопковой пряжи — безопасно для малышей, тепло для души.",
    city: "Краснодар",
    ownerName: "Марина Соколова",
    ownerEmail: "marina@teplye-lapki.ru",
    rating: 4.9,
    ratingCount: 87,
    verified: true,
    promoted: true,
    deliveryInfo: "Почта России и СДЭК по всей стране, 3–7 дней. Самовывоз в Краснодаре.",
    returnPolicy: "Возврат в течение 14 дней, если игрушка не использовалась.",
    products: [
      {
        slug: "myagkiy-mishka-toptyzhka",
        title: "Вязаный мишка «Топтыжка»",
        shortDescription: "Мягкий мишка амигуруми из хлопка, ручная вязка",
        description:
          "Мишка «Топтыжка» связан вручную крючком из мягкой хлопковой пряжи. Наполнитель — гипоаллергенный холлофайбер. Крепкие нитяные крепления лап и головы делают игрушку безопасной для малышей. Каждый мишка немного индивидуален — это и есть прелесть ручной работы.",
        price: 1890,
        oldPrice: 2200,
        stock: 6,
        category: "toys",
        handmade: true,
        eco: true,
        productionDays: 5,
        weightGrams: 120,
        dimensions: "22 см",
        materials: "Хлопок 100%, холлофайбер",
        care: "Ручная стирка при 30°, сушка в расправленном виде.",
        featured: true,
        variants: [
          { kind: "Цвет", value: "Молочный" },
          { kind: "Цвет", value: "Карамель" },
          { kind: "Цвет", value: "Серый" },
        ],
        reviews: [
          { rating: 5, text: "Мишка чудесный, дочка не расстаётся. Качество вязки на высоте!", authorName: "Анна", sellerReply: "Спасибо, Анна! Рада, что Топтыжка нашёл свой дом — вязала его с особой любовью." },
          { rating: 5, text: "Заказывала в подарок — упаковано бережно, выглядит дороже своей цены.", authorName: "Ирина" },
          { rating: 4, text: "Очень милый, чуть меньше чем ожидала, но это мелочь.", authorName: "Светлана" },
        ],
      },
      {
        slug: "zayka-sonya-amigurumi",
        title: "Зайка «Соня» амигуруми",
        shortDescription: "Нежный зайчик ручной вязки с длинными ушками",
        description:
          "Зайка «Соня» — уютная игрушка ручной вязки. Длинные мягкие ушки, аккуратно вышитая мордочка. Отлично подходит и для игр, и как элемент детского декора.",
        price: 1650,
        stock: 8,
        category: "toys",
        handmade: true,
        eco: true,
        productionDays: 4,
        weightGrams: 95,
        dimensions: "26 см с ушами",
        materials: "Хлопок 100%, холлофайбер",
        care: "Ручная стирка при 30°.",
        featured: true,
        variants: [
          { kind: "Цвет", value: "Пудровый" },
          { kind: "Цвет", value: "Мятный" },
        ],
        reviews: [
          { rating: 5, text: "Невероятно нежная работа. Спасибо мастеру!", authorName: "Ольга" },
        ],
      },
      {
        slug: "slonenok-timka",
        title: "Слонёнок «Тимка»",
        shortDescription: "Маленький слонёнок, помещается в ладошку",
        description:
          "Слонёнок «Тимка» связан из мягкого хлопка. Компактный размер — удобно брать с собой. Приятный подарок для малыша и взрослого.",
        price: 1490,
        stock: 10,
        category: "toys",
        handmade: true,
        eco: true,
        weightGrams: 70,
        dimensions: "15 см",
        materials: "Хлопок 100%, холлофайбер",
      },
      {
        slug: "nabor-zveryata-3",
        title: "Набор «Зверята» — 3 игрушки",
        shortDescription: "Мишка, зайка и слонёнок в подарочной упаковке",
        description:
          "Готовый подарочный набор из трёх вязаных игрушек в крафтовой коробке. Изготавливается под заказ — цвета можно согласовать с мастером.",
        price: 3990,
        stock: 3,
        category: "toys",
        handmade: true,
        eco: true,
        madeToOrder: true,
        productionDays: 10,
        materials: "Хлопок 100%, холлофайбер",
      },
    ],
  },
  {
    slug: "kubanskaya-glina",
    name: "Кубанская глина",
    description:
      "Керамика ручной работы из Краснодара. Посуда, обожжённая в дровяной печи, с авторскими глазурями.",
    city: "Краснодар",
    ownerName: "Андрей Кравцов",
    ownerEmail: "andrey@kubanglina.ru",
    rating: 4.8,
    ratingCount: 54,
    verified: true,
    deliveryInfo: "СДЭК по России, 4–8 дней. Бережная упаковка хрупких изделий. Самовывоз в Краснодаре.",
    returnPolicy: "Возврат 14 дней. Бой при доставке компенсируем.",
    products: [
      {
        slug: "keramicheskaya-kruzhka",
        title: "Керамическая кружка ручной работы",
        shortDescription: "Кружка 350 мл с авторской глазурью",
        description:
          "Кружка вылеплена и расписана вручную, покрыта пищевой глазурью. Объём 350 мл. Можно мыть в посудомоечной машине. Каждая кружка уникальна по оттенку.",
        price: 1290,
        stock: 14,
        category: "ceramics",
        handmade: true,
        weightGrams: 320,
        dimensions: "Ø9 × 10 см, 350 мл",
        materials: "Глина, пищевая глазурь",
        care: "Можно мыть в посудомоечной машине.",
        featured: true,
        variants: [
          { kind: "Глазурь", value: "Синяя" },
          { kind: "Глазурь", value: "Зелёная" },
          { kind: "Глазурь", value: "Песочная" },
        ],
        reviews: [
          { rating: 5, text: "Держит тепло, приятно в руке. Беру вторую.", authorName: "Дмитрий", sellerReply: "Благодарю! Вторую подберу из той же партии обжига, чтобы оттенок совпал." },
          { rating: 5, text: "Цвет глазури вживую ещё красивее.", authorName: "Мария" },
        ],
      },
      {
        slug: "tarelka-kuban-22",
        title: "Тарелка «Кубань» 22 см",
        shortDescription: "Обеденная тарелка ручной работы",
        description:
          "Тарелка диаметром 22 см с матовой глазурью. Подходит для повседневной сервировки и фотосъёмки блюд.",
        price: 1450,
        stock: 9,
        category: "ceramics",
        handmade: true,
        weightGrams: 480,
        dimensions: "Ø22 см",
        materials: "Глина, пищевая глазурь",
      },
      {
        slug: "kuvshin-dlya-vody",
        title: "Кувшин для воды 1,2 л",
        shortDescription: "Керамический кувшин с удобной ручкой",
        description:
          "Вместительный кувшин на 1,2 литра. Толстые стенки сохраняют прохладу напитка. Ручная лепка и обжиг.",
        price: 2390,
        stock: 5,
        category: "ceramics",
        handmade: true,
        weightGrams: 900,
        dimensions: "Высота 22 см, 1,2 л",
        materials: "Глина, пищевая глазурь",
      },
    ],
  },
  {
    slug: "loza-i-nit",
    name: "Лоза и нить",
    description:
      "Текстиль и плетение для дома. Лён, шерсть и натуральная лоза — спокойные природные фактуры.",
    city: "Сочи",
    ownerName: "Ольга Дёмина",
    ownerEmail: "olga@lozanit.ru",
    rating: 4.7,
    ratingCount: 33,
    verified: false,
    deliveryInfo: "Почта России и СДЭК, 4–9 дней.",
    returnPolicy: "Возврат 14 дней при сохранении товарного вида.",
    products: [
      {
        slug: "lnyanaya-skatert-vyshivka",
        title: "Льняная скатерть с вышивкой",
        shortDescription: "Натуральный лён, ручная вышивка по краю",
        description:
          "Скатерть из плотного льна с аккуратной ручной вышивкой. Лён мягкий, приятно ложится, со временем становится только лучше.",
        price: 3490,
        stock: 4,
        category: "textile",
        handmade: true,
        eco: true,
        dimensions: "150 × 220 см",
        materials: "Лён 100%",
        care: "Машинная стирка 40°, гладить влажной.",
        featured: true,
      },
      {
        slug: "sherstyanoy-pled-tuman",
        title: "Шерстяной плед «Туман»",
        shortDescription: "Тёплый плед из овечьей шерсти",
        description:
          "Плед связан из мягкой овечьей шерсти. Большой размер, приятная фактура. Идеален для прохладных вечеров.",
        price: 4990,
        oldPrice: 5600,
        stock: 6,
        category: "textile",
        handmade: true,
        eco: true,
        dimensions: "130 × 170 см",
        materials: "Шерсть 80%, акрил 20%",
        care: "Деликатная стирка вручную.",
        variants: [
          { kind: "Цвет", value: "Серый туман" },
          { kind: "Цвет", value: "Песочный" },
        ],
      },
      {
        slug: "korzina-iz-lozy",
        title: "Корзина из лозы",
        shortDescription: "Плетёная корзина для хранения",
        description:
          "Корзина из натуральной ивовой лозы. Универсальна: для пледов, игрушек, мелочей. Каждая сплетена вручную.",
        price: 1790,
        stock: 11,
        category: "decor",
        handmade: true,
        eco: true,
        dimensions: "Ø35 × 28 см",
        materials: "Ивовая лоза",
      },
    ],
  },
  {
    slug: "serebro-kubani",
    name: "Тёплый уют",
    description:
      "Вязаный декор, свечи и уютные мелочи для дома. Тёплая атмосфера ручной работы в каждой детали.",
    city: "Краснодар",
    ownerName: "Игорь Лазарев",
    ownerEmail: "igor@serebrokubani.ru",
    rating: 5.0,
    ratingCount: 21,
    verified: true,
    deliveryInfo: "СДЭК с описью вложения, 3–6 дней. Застрахованная доставка.",
    returnPolicy: "Возврат 14 дней. Украшение должно быть без следов носки.",
    products: [
      {
        slug: "serebryanoe-kolco-volna",
        title: "Серебряное кольцо «Волна»",
        shortDescription: "Кольцо ручной работы, серебро 925°",
        description:
          "Кольцо с плавной линией волны — отсылка к реке Волге и южному морю. Серебро 925 пробы, ручная полировка. Каждое изделие клеймится мастером.",
        price: 4500,
        stock: 7,
        category: "jewelry",
        handmade: true,
        weightGrams: 4,
        materials: "Серебро 925°",
        care: "Хранить отдельно, чистить мягкой тканью.",
        featured: true,
        variants: [
          { kind: "Размер", value: "16" },
          { kind: "Размер", value: "17" },
          { kind: "Размер", value: "18" },
          { kind: "Размер", value: "19" },
        ],
        reviews: [
          { rating: 5, text: "Тонкая работа, сидит идеально. Ношу не снимая.", authorName: "Екатерина" },
        ],
      },
      {
        slug: "sergi-kapli-serebro",
        title: "Серьги «Капли»",
        shortDescription: "Лёгкие серебряные серьги-капли",
        description:
          "Минималистичные серьги в форме капель. Лёгкие, не оттягивают мочку. Серебро 925 пробы.",
        price: 3200,
        stock: 9,
        category: "jewelry",
        handmade: true,
        weightGrams: 3,
        materials: "Серебро 925°",
      },
      {
        slug: "kulon-pshenica",
        title: "Кулон «Пшеница»",
        shortDescription: "Кулон с колоском — символ Кубани",
        description:
          "Кулон в виде колоска пшеницы — символ плодородной кубанской земли. Серебро 925 пробы, цепочка в комплекте.",
        price: 2800,
        stock: 6,
        category: "jewelry",
        handmade: true,
        weightGrams: 5,
        materials: "Серебро 925°",
      },
    ],
  },
  {
    slug: "svet-v-dome",
    name: "Свет в доме",
    description:
      "Соевые свечи и ароматы для дома. Натуральный воск, сдержанные южные ароматы.",
    city: "Геленджик",
    ownerName: "Екатерина Власова",
    ownerEmail: "kate@svetvdome.ru",
    rating: 4.9,
    ratingCount: 40,
    verified: true,
    deliveryInfo: "СДЭК и Почта России, 3–7 дней. Самовывоз в Геленджике.",
    returnPolicy: "Возврат 14 дней для нераспечатанных изделий.",
    products: [
      {
        slug: "soevaya-svecha-step",
        title: "Соевая свеча «Степь»",
        shortDescription: "Натуральный соевый воск, время горения 40 ч",
        description:
          "Свеча из 100% соевого воска в стеклянном стакане. Ровное горение до 40 часов, деревянный фитиль с приятным потрескиванием. Сдержанный аромат степных трав.",
        price: 990,
        stock: 20,
        category: "candles",
        handmade: true,
        eco: true,
        weightGrams: 250,
        dimensions: "Ø8 × 8 см",
        materials: "Соевый воск, деревянный фитиль",
        care: "Подрезайте фитиль до 5 мм перед розжигом.",
        featured: true,
        variants: [
          { kind: "Аромат", value: "Полынь" },
          { kind: "Аромат", value: "Лаванда" },
          { kind: "Аромат", value: "Хвоя" },
        ],
        reviews: [
          { rating: 5, text: "Аромат ненавязчивый, горит ровно. Беру уже третью.", authorName: "Наталья" },
          { rating: 5, text: "Деревянный фитиль — отдельная любовь.", authorName: "Павел" },
        ],
      },
      {
        slug: "aromadiffuzor-more",
        title: "Аромадиффузор «Море»",
        shortDescription: "Палочки-диффузор, свежий морской аромат",
        description:
          "Аромадиффузор на натуральной основе с ротанговыми палочками. Наполняет комнату свежим морским ароматом до 2 месяцев.",
        price: 1390,
        stock: 12,
        category: "candles",
        eco: true,
        handmade: true,
        dimensions: "100 мл",
        materials: "Ароматическая основа, ротанг",
      },
      {
        slug: "derevyannyy-podsvechnik",
        title: "Деревянный подсвечник",
        shortDescription: "Подсвечник из массива дуба",
        description:
          "Лаконичный подсвечник из массива дуба, покрыт натуральным маслом. Под чайную свечу. Подчёркивает тёплую атмосферу дома.",
        price: 1190,
        stock: 15,
        category: "decor",
        handmade: true,
        eco: true,
        materials: "Массив дуба, натуральное масло",
      },
    ],
  },
  {
    slug: "baltiyskiy-yantar",
    name: "Балтийский янтарь",
    description:
      "Украшения и сувениры из натурального балтийского янтаря. Ручная обработка, Калининград — янтарный край России.",
    city: "Калининград",
    region: "Калининградская область",
    ownerName: "Анна Гофман",
    ownerEmail: "anna@baltamber.ru",
    rating: 4.9,
    ratingCount: 38,
    verified: true,
    deliveryInfo: "СДЭК и Почта России по стране, 4–9 дней. Самовывоз в Калининграде.",
    returnPolicy: "Возврат 14 дней при сохранении товарного вида.",
    products: [
      {
        slug: "kulon-yantar-baltika",
        title: "Кулон из янтаря «Балтика»",
        shortDescription: "Подвеска из натурального балтийского янтаря",
        description:
          "Кулон из цельного кусочка балтийского янтаря медового оттенка в серебряной оправе. Каждый камень уникален по рисунку. Цепочка в комплекте.",
        price: 2900,
        stock: 8,
        category: "jewelry",
        handmade: true,
        weightGrams: 6,
        materials: "Натуральный янтарь, серебро 925°",
        care: "Беречь от растворителей и парфюмерии.",
        featured: true,
        reviews: [
          { rating: 5, text: "Янтарь тёплый, живой, очень красивый оттенок.", authorName: "Татьяна" },
        ],
      },
      {
        slug: "braslet-yantar",
        title: "Браслет из янтаря",
        shortDescription: "Браслет из янтарных бусин",
        description:
          "Браслет из обработанных вручную бусин балтийского янтаря на эластичной основе. Подходит на любое запястье.",
        price: 3400,
        stock: 6,
        category: "jewelry",
        handmade: true,
        weightGrams: 14,
        materials: "Натуральный янтарь",
      },
      {
        slug: "sergi-yantar",
        title: "Серьги с янтарём",
        shortDescription: "Серебряные серьги с балтийским янтарём",
        description:
          "Серьги из серебра 925 пробы с медовым балтийским янтарём. Лёгкие, на каждый день и для особых случаев.",
        price: 2600,
        stock: 9,
        category: "jewelry",
        handmade: true,
        weightGrams: 4,
        materials: "Натуральный янтарь, серебро 925°",
      },
      {
        slug: "figurka-yantar-obereg",
        title: "Фигурка-оберег из янтаря",
        shortDescription: "Сувенирный оберег из янтаря",
        description:
          "Небольшая фигурка-оберег ручной работы из балтийского янтаря на деревянной подставке. Тёплый подарок и сувенир.",
        price: 1900,
        stock: 5,
        category: "decor",
        handmade: true,
        eco: true,
        materials: "Натуральный янтарь, дерево",
      },
    ],
  },
  {
    slug: "les-kubani",
    name: "Лес Кубани",
    description:
      "Поставщик древесины: дуб, сосна, ясень. Заготовка и камерная сушка на Кубани. Сырьё для мебели, столярных и декоративных изделий.",
    city: "Краснодар",
    kind: "supplier",
    address: "г. Краснодар, ул. Промышленная, 12 — склад, самовывоз",
    exportInfo: "Беларусь, Казахстан",
    ownerName: "Виктор Дубов",
    ownerEmail: "info@les-kubani.ru",
    rating: 4.8,
    ratingCount: 26,
    verified: true,
    deliveryInfo: "Доставка по ЮФО своим транспортом, отгрузка в ТК, самовывоз со склада.",
    returnPolicy: "Возврат некондиции по согласованию в течение 7 дней.",
    products: [
      {
        slug: "dub-suhoy-stroganyy",
        title: "Дуб сухой строганый",
        shortDescription: "Доска дубовая камерной сушки, влажность 8–10% (цена за м.п.)",
        description:
          "Дубовая доска естественной и камерной сушки. Подходит для мебели, столешниц, декоративных панелей. Заготавливается на Кубани.",
        price: 4500,
        stock: 100,
        category: "materials",
        handmade: false,
        materials: "Дуб, 100% натуральная древесина",
        dimensions: "Доступны разные сечения и длины",
        production: "Заготовка на Кубани → распил → камерная сушка до 8–10% → строгание.",
        applications:
          "Из этой древесины изготавливают: столы и столешницы, корпусную мебель, разделочные доски, декоративные панели.",
      },
    ],
  },
  {
    slug: "epoksi-rossiya",
    name: "Эпокси Россия",
    description:
      "Производство эпоксидной смолы для мебели и творчества. Сделано в России. Прозрачная смола для столов-рек, заливки и украшений.",
    city: "Краснодар",
    kind: "supplier",
    address: "г. Краснодар, ул. Заводская, 5 — производство",
    exportInfo: "Казахстан",
    ownerName: "Сергей Литов",
    ownerEmail: "sales@epoksi-rf.ru",
    rating: 4.9,
    ratingCount: 41,
    verified: true,
    deliveryInfo: "СДЭК и транспортные компании по РФ и СНГ. Самовывоз с производства.",
    returnPolicy: "Возврат запечатанной продукции в течение 14 дней.",
    products: [
      {
        slug: "epoksidnaya-smola-proclear",
        title: "Эпоксидная смола ProClear",
        shortDescription: "Прозрачная двухкомпонентная смола, сделано в России",
        description:
          "Двухкомпонентная эпоксидная смола для столов-рек, заливки и украшений. Высокая прозрачность, минимальная усадка. Произведено в России.",
        price: 3200,
        stock: 200,
        category: "materials",
        handmade: false,
        materials: "Эпоксидная смола + отвердитель",
        production: "Произведено в России. Двухкомпонентный состав, контроль прозрачности.",
        applications:
          "Применяется для: столов-рек, заливочного декора, украшений и бижутерии, защитного покрытия столешниц.",
      },
    ],
  },
  {
    slug: "stol-art",
    name: "Лаванда ручной работы",
    description:
      "Вязаные сумки и аксессуары ручной работы. Лавандовые мотивы и натуральная пряжа — стиль, который дарит уют.",
    city: "Краснодар",
    kind: "production",
    address: "г. Краснодар, ул. Мебельная, 3 — мастерская, осмотр по записи",
    exportInfo: "Беларусь, Казахстан",
    ownerName: "Денис Орлов",
    ownerEmail: "hello@stol-art.ru",
    rating: 5.0,
    ratingCount: 18,
    verified: true,
    promoted: true,
    deliveryInfo: "Доставка до двери по ЮФО силами мастерской, ТК по РФ, самовывоз.",
    returnPolicy: "Возврат 14 дней; изделия под заказ — по согласованию.",
    products: [
      {
        slug: "stol-reka-dub-epoksi",
        title: "Стол-река из дуба и эпоксидной смолы",
        shortDescription: "Обеденный стол: массив дуба + прозрачная эпоксидная «река»",
        description:
          "Обеденный стол ручной работы из массива дуба с эпоксидной «рекой». Каждый стол уникален по рисунку. Изготавливается под заказ. Полная прослеживаемость материалов: видно, у кого закуплены дерево и смола.",
        price: 89000,
        stock: 4,
        category: "furniture",
        handmade: true,
        madeToOrder: true,
        productionDays: 30,
        dimensions: "180 × 90 × 75 см (под заказ)",
        materials: "Массив дуба, эпоксидная смола",
        care: "Протирать сухой тканью, избегать прямых солнечных лучей.",
        featured: true,
        materialSources: [
          {
            name: "Массив дуба",
            origin: "Сделано в России (Кубань)",
            supplierSlug: "les-kubani",
            supplierName: "Лес Кубани",
          },
          {
            name: "Эпоксидная смола",
            origin: "Сделано в России",
            supplierSlug: "epoksi-rossiya",
            supplierName: "Эпокси Россия",
          },
        ],
        reviews: [
          {
            rating: 5,
            text: "Стол — произведение искусства, и приятно, что видно, из чего и у кого закуплены материалы.",
            authorName: "Алексей",
          },
        ],
      },
    ],
  },
];

// Тематические фото по ключевым словам (LoremFlickr, без API-ключа).
const productTags: Record<string, string> = {
  "myagkiy-mishka-toptyzhka": "teddy,bear",
  "zayka-sonya-amigurumi": "bunny,toy",
  "slonenok-timka": "elephant,toy",
  "nabor-zveryata-3": "stuffed,toys",
  "keramicheskaya-kruzhka": "ceramic,mug",
  "tarelka-kuban-22": "ceramic,plate",
  "kuvshin-dlya-vody": "ceramic,jug",
  "lnyanaya-skatert-vyshivka": "linen,tablecloth",
  "sherstyanoy-pled-tuman": "wool,blanket",
  "korzina-iz-lozy": "wicker,basket",
  "serebryanoe-kolco-volna": "silver,ring",
  "sergi-kapli-serebro": "silver,earrings",
  "kulon-pshenica": "pendant,necklace",
  "soevaya-svecha-step": "candle",
  "aromadiffuzor-more": "reed,diffuser",
  "derevyannyy-podsvechnik": "candlestick",
};

const shopTags: Record<string, string> = {
  "teplye-lapki": "crochet,toys",
  "kubanskaya-glina": "pottery,ceramics",
  "loza-i-nit": "linen,textile",
  "serebro-kubani": "jewelry,silver",
  "svet-v-dome": "candles,home",
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 100000;
}

function flickr(w: number, h: number, tags: string, lock: number) {
  return `https://loremflickr.com/${w}/${h}/${tags}?lock=${lock}`;
}

function imagesFor(slug: string, title: string) {
  const local = manifest.products[slug] ?? [];
  if (local.length > 0) {
    return local.map((url, i) => ({ url, alt: title, position: i }));
  }
  const tags = productTags[slug] ?? "handmade,craft";
  const base = hash(slug);
  return [0, 1, 2, 3].map((i) => ({
    url: flickr(1000, 1000, tags, base + i + 1),
    alt: title,
    position: i,
  }));
}

// ── Пул «клиентов» для демо-истории покупок (реальные заказы от разных людей) ──
const CLIENT_FIRST = [
  "Анна", "Мария", "Елена", "Ольга", "Наталья", "Ирина", "Татьяна", "Светлана", "Юлия", "Екатерина",
  "Дмитрий", "Алексей", "Сергей", "Андрей", "Павел", "Максим", "Игорь", "Роман", "Денис", "Артём",
  "Виктория", "Полина", "Ксения", "Дарья", "Алина", "Никита", "Владимир", "Глеб", "Кирилл", "Степан",
];
const CLIENT_LAST = [
  "Иванова", "Петров", "Смирнова", "Кузнецов", "Соколова", "Попов", "Лебедева", "Козлов", "Новиков", "Морозова",
  "Волкова", "Зайцев", "Павлова", "Семёнов", "Голубева", "Виноградов", "Богданова", "Воробьёв", "Фёдорова", "Михайлов",
];
function clientName(i: number) {
  return `${CLIENT_FIRST[i % CLIENT_FIRST.length]} ${CLIENT_LAST[(i * 7 + 3) % CLIENT_LAST.length]}`;
}
// Сколько реальных клиентов (уникальных покупателей) у каждого магазина в демо.
// Числа правдоподобные для молодого регионального маркетплейса (старт — Краснодар).
const CLIENT_TARGETS: Record<string, number> = {
  "teplye-lapki": 46,
  "kubanskaya-glina": 29,
  "svet-v-dome": 24,
  "baltiyskiy-yantar": 22,
  "epoksi-rossiya": 17,
  "loza-i-nit": 16,
  "serebro-kubani": 12,
  "les-kubani": 9,
  "stol-art": 8,
};

// Личные истории мастеров — лицо «канала автора» (без клише и эмодзи).
const STORIES: Record<string, { story: string; craftSince: number }> = {
  "teplye-lapki": { story: "Вязать игрушки я начала, когда родилась дочь — хотелось, чтобы рядом были не фабричные, а тёплые, живые зверята. Сейчас их выбирают мамы по всей стране, и каждый зверёк по-прежнему рождается у меня на коленях.", craftSince: 2018 },
  "kubanskaya-glina": { story: "Когда-то я ушёл из офиса ради гончарного круга и ни разу не пожалел. Каждую кружку обжигаю в дровяной печи — поэтому двух одинаковых не бывает, у каждой свой характер.", craftSince: 2016 },
  "loza-i-nit": { story: "Лён и лоза становятся только лучше со временем. Я плету и тку то, что хочется трогать руками и оставлять детям — вещи без срока годности.", craftSince: 2019 },
  "serebro-kubani": { story: "Делаю вязаный декор и свечи — вещи, от которых дома становится спокойнее. Начинала для себя, а теперь это дело, в которое вкладываю каждый вечер.", craftSince: 2020 },
  "svet-v-dome": { story: "Я долго не могла найти свечи без резкой отдушки — и начала лить их сама, из соевого воска. Сдержанный аромат, ровное горение, деревянный фитиль с тихим потрескиванием.", craftSince: 2017 },
  "baltiyskiy-yantar": { story: "Я выросла в Калининграде, среди янтаря, и обрабатываю каждый камень вручную. У живого янтаря всегда свой рисунок — поэтому ни одно украшение не повторяется.", craftSince: 2015 },
  "les-kubani": { story: "Заготавливаю и сушу древесину на Кубани — дуб, сосну, ясень. Поставляю сырьё мастерам, которым важно знать происхождение материала и держать его в руках до покупки.", craftSince: 2012 },
  "epoksi-rossiya": { story: "Произвожу прозрачную эпоксидную смолу для мебели и творчества. Контролирую каждую партию на прозрачность лично — от этого зависит, каким получится стол-река у мастера.", craftSince: 2014 },
  "stol-art": { story: "Вяжу сумки и аксессуары с лавандовыми мотивами. Натуральная пряжа, спокойные цвета и ничего лишнего — вещи, которые носят годами.", craftSince: 2019 },
};

// Журнал мастеров — посты процесса для «канала» (productIndex → фото из товара).
const POSTS: Record<string, { title?: string; body: string; daysAgo: number; productIndex?: number }[]> = {
  "teplye-lapki": [
    { title: "Новая партия мишек", body: "Закончила партию «Топтыжек» — каждый получил свой характер. Молочные разобрали почти сразу, довязываю карамельных.", daysAgo: 2, productIndex: 0 },
    { title: "Из чего вяжу", body: "Перешла на новую хлопковую пряжу — мягче и лучше держит форму. Наполнитель прежний, гипоаллергенный холлофайбер.", daysAgo: 9, productIndex: 1 },
    { title: "Как рождается зайка", body: "Один зайка «Соня» — это около пяти вечеров: тело, длинные уши, мордочка вышивается отдельно. Тороплюсь редко — от этого зависит, будет ли он живым.", daysAgo: 18, productIndex: 1 },
  ],
  "kubanskaya-glina": [
    { title: "Обжиг в дровяной печи", body: "Сегодняшний обжиг дал глубокий синий с прожилками — такой оттенок не повторить специально. Поэтому двух одинаковых кружек не бывает.", daysAgo: 3, productIndex: 0 },
    { title: "Пробую песочную глазурь", body: "Тестирую матовую песочную глазурь на тарелках «Кубань» — получается тёплый, землистый тон.", daysAgo: 12, productIndex: 1 },
  ],
  "baltiyskiy-yantar": [
    { title: "Камень с историей", body: "Попался кусок янтаря с инклюзом — крошечный пузырёк воздуха возрастом в миллионы лет. Оставлю его в кулоне как есть.", daysAgo: 4, productIndex: 0 },
    { title: "Полировка вручную", body: "Каждый камень довожу руками — станок «съедает» рисунок. Медленнее, зато виден характер янтаря.", daysAgo: 15, productIndex: 1 },
  ],
  "stol-art": [
    { title: "Лавандовая партия", body: "Связала новую партию сумок в лавандовой гамме. Пряжа натуральная, цвет спокойный — под любой образ.", daysAgo: 5, productIndex: 0 },
  ],
};

async function main() {
  // Идемпотентность: если база уже заполнена — НЕ пересеваем (реальные данные сохраняются
  // между деплоями на постоянной БД). Полный пересев: FORCE_SEED=1 npm run db:seed
  // (или npm run db:reset, который сначала очищает схему).
  const seeded = await prisma.shop.count();
  if (seeded > 0 && process.env.FORCE_SEED !== "1") {
    console.log(`База уже заполнена (${seeded} магазинов) — пропускаю сидинг, данные сохраняются. Для пересева: FORCE_SEED=1.`);
    return;
  }

  console.log("Очистка базы…");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Категории…");
  for (const c of categories) await prisma.category.create({ data: c });
  const cats = await prisma.category.findMany();
  const catId = (slug: string) => {
    const c = cats.find((x) => x.slug === slug);
    if (!c) throw new Error(`Категория не найдена: ${slug}`);
    return c.id;
  };

  await prisma.user.create({
    data: { email: "admin@volga.market", name: "Администратор платформы", role: "ADMIN" },
  });

  for (const s of shops) {
    const owner = await prisma.user.create({
      data: { email: s.ownerEmail, name: s.ownerName, role: "SELLER" },
    });
    const shop = await prisma.shop.create({
      data: {
        slug: s.slug,
        name: s.name,
        description: s.description,
        city: s.city,
        region: s.region ?? "Краснодарский край",
        kind: s.kind ?? "workshop",
        address: s.address ?? null,
        exportInfo: s.exportInfo ?? null,
        story: STORIES[s.slug]?.story ?? null,
        craftSince: STORIES[s.slug]?.craftSince ?? null,
        promoted: s.promoted ?? false,
        avatarUrl: manifest.shops[s.slug] ?? flickr(300, 300, shopTags[s.slug] ?? "handmade", hash(s.slug)),
        coverUrl: manifest.shops[s.slug] ?? flickr(1600, 600, shopTags[s.slug] ?? "handmade,craft", hash(s.slug) + 7),
        rating: s.rating,
        ratingCount: s.ratingCount,
        verified: s.verified,
        deliveryInfo: s.deliveryInfo,
        returnPolicy: s.returnPolicy,
        ownerId: owner.id,
      },
    });

    for (const p of s.products) {
      await prisma.product.create({
        data: {
          slug: p.slug,
          title: p.title,
          shortDescription: p.shortDescription,
          description: p.description,
          price: p.price,
          oldPrice: p.oldPrice ?? null,
          stock: p.stock ?? 10,
          handmade: p.handmade ?? true,
          madeInRussia: true,
          eco: p.eco ?? false,
          madeToOrder: p.madeToOrder ?? false,
          productionDays: p.productionDays ?? null,
          weightGrams: p.weightGrams ?? null,
          dimensions: p.dimensions ?? null,
          materials: p.materials ?? null,
          care: p.care ?? null,
          applications: p.applications ?? null,
          production: p.production ?? null,
          deliveryInfo: s.deliveryInfo,
          returnPolicy: s.returnPolicy,
          featured: p.featured ?? false,
          status: "ACTIVE",
          shopId: shop.id,
          categoryId: catId(p.category),
          images: { create: imagesFor(p.slug, p.title) },
          variants: { create: p.variants ?? [] },
          reviews: { create: (p.reviews ?? []).map((r) => ({ ...r, verified: r.verified ?? true })) },
          materialSources: {
            create: (p.materialSources ?? []).map((m, i) => ({ ...m, position: i })),
          },
        },
      });
    }

    // Журнал мастера — посты процесса (фото берём из изображений товара)
    for (const post of POSTS[s.slug] ?? []) {
      const prod = s.products[post.productIndex ?? 0];
      const img = prod ? imagesFor(prod.slug, prod.title)[0]?.url ?? null : null;
      await prisma.post.create({
        data: {
          shopId: shop.id,
          title: post.title ?? null,
          body: post.body,
          imageUrl: img,
          createdAt: new Date(Date.now() - post.daysAgo * 86400000),
        },
      });
    }
  }

  // ── Демо-данные для кабинетов ──────────────────────────────────────────
  const buyer = await prisma.user.create({
    data: { email: "buyer@volga.market", name: "Анна Воронова", role: "BUYER" },
  });

  const teplye = await prisma.shop.findUniqueOrThrow({
    where: { slug: "teplye-lapki" },
    include: { products: true },
  });
  const glina = await prisma.shop.findUniqueOrThrow({
    where: { slug: "kubanskaya-glina" },
    include: { products: true },
  });

  const pick = (shop: { products: { slug: string; id: string; title: string; price: number }[] }, slug: string) => {
    const prod = shop.products.find((x) => x.slug === slug);
    if (!prod) throw new Error(`Нет товара ${slug}`);
    return prod;
  };

  let seq = 100100;
  async function makeOrder(o: {
    shop: typeof teplye;
    status: string;
    escrow: string;
    tracking?: string;
    delivery: string;
    payment: string;
    daysAgo: number;
    items: { slug: string; qty: number; variant?: string }[];
  }) {
    const items = o.items.map((it) => {
      const prod = pick(o.shop, it.slug);
      return { productId: prod.id, title: prod.title, price: prod.price, qty: it.qty, variant: it.variant ?? null };
    });
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    return prisma.order.create({
      data: {
        number: `В-${seq++}`,
        status: o.status,
        escrowStatus: o.escrow,
        trackingNumber: o.tracking ?? null,
        total,
        deliveryMethod: o.delivery,
        paymentMethod: o.payment,
        address: "г. Краснодар, ул. Красная, 1",
        customerName: buyer.name,
        customerPhone: "+7 918 000-00-00",
        buyerId: buyer.id,
        shopId: o.shop.id,
        createdAt: new Date(Date.now() - o.daysAgo * 86400000),
        items: { create: items },
      },
    });
  }

  const oShipped = await makeOrder({ shop: teplye, status: "SHIPPED", escrow: "HELD", tracking: "CDEK1234567890", delivery: "СДЭК", payment: "Перевод на карту", daysAgo: 3, items: [{ slug: "myagkiy-mishka-toptyzhka", qty: 1, variant: "Цвет: Молочный" }] });
  await makeOrder({ shop: teplye, status: "PROCESSING", escrow: "HELD", delivery: "Почта России", payment: "При получении", daysAgo: 1, items: [{ slug: "zayka-sonya-amigurumi", qty: 2, variant: "Цвет: Пудровый" }] });
  const oDelivered = await makeOrder({ shop: teplye, status: "DELIVERED", escrow: "HELD", tracking: "CDEK9876543210", delivery: "СДЭК", payment: "Перевод на карту", daysAgo: 7, items: [{ slug: "slonenok-timka", qty: 1 }] });
  await makeOrder({ shop: teplye, status: "COMPLETED", escrow: "RELEASED", tracking: "RU555123456", delivery: "Почта России", payment: "При получении", daysAgo: 20, items: [{ slug: "nabor-zveryata-3", qty: 1 }] });
  await makeOrder({ shop: glina, status: "ACCEPTED", escrow: "HELD", delivery: "Самовывоз", payment: "Перевод на карту", daysAgo: 0, items: [{ slug: "keramicheskaya-kruzhka", qty: 2, variant: "Глазурь: Синяя" }] });

  await prisma.employee.createMany({
    data: [
      { shopId: teplye.id, name: "Ольга Петрова", email: "olga@teplye-lapki.ru", role: "Менеджер заказов" },
      { shopId: teplye.id, name: "Игорь Сухов", email: "igor@teplye-lapki.ru", role: "Контент-менеджер" },
      { shopId: teplye.id, name: "Лариса Ким", role: "Бухгалтер" },
    ],
  });

  const pending = [
    { slug: "vyazanaya-lisichka", title: "Вязаная лисичка «Алиса»", price: 1750, category: "toys", shopId: teplye.id, status: "PENDING" },
    { slug: "keramicheskaya-vaza-volna", title: "Керамическая ваза «Волна»", price: 2890, category: "ceramics", shopId: glina.id, status: "PENDING" },
    { slug: "lnyanoe-polotence", title: "Льняное полотенце с кружевом", price: 1290, category: "textile", shopId: teplye.id, status: "PENDING" },
    { slug: "svecha-narushenie", title: "Свеча (подозрение на нарушение)", price: 90, category: "candles", shopId: glina.id, status: "REJECTED" },
  ];
  for (const pp of pending) {
    await prisma.product.create({
      data: {
        slug: pp.slug,
        title: pp.title,
        shortDescription: "Ожидает проверки модератором.",
        description: "Товар добавлен продавцом и находится в очереди модерации.",
        price: pp.price,
        stock: 5,
        handmade: true,
        madeInRussia: true,
        status: pp.status,
        shopId: pp.shopId,
        categoryId: catId(pp.category),
      },
    });
  }

  await prisma.dispute.createMany({
    data: [
      { orderId: oShipped.id, status: "IN_REVIEW", reason: "Задержка доставки более 5 дней, трек не обновляется." },
      { orderId: oDelivered.id, status: "RESOLVED", reason: "Цвет не соответствует описанию.", resolution: "Частичный возврат 30% по решению арбитра." },
    ],
  });

  const thread = `order:${oShipped.number}`;
  await prisma.chatMessage.createMany({
    data: [
      { threadKey: thread, sender: "buyer", authorName: buyer.name, text: "Здравствуйте! Когда отправите заказ?", createdAt: new Date(Date.now() - 3 * 3600000) },
      { threadKey: thread, sender: "seller", authorName: "Тёплые лапки", text: "Добрый день! Отправили сегодня, трек CDEK1234567890.", createdAt: new Date(Date.now() - 2 * 3600000) },
      { threadKey: thread, sender: "buyer", authorName: buyer.name, text: "Спасибо большое, будем ждать!", createdAt: new Date(Date.now() - 1 * 3600000) },
    ],
  });

  // ── Реальные клиенты: демо-история заказов от разных покупателей ──────────
  // «Клиент» = тот, кто оформил заказ. История демонстрационная, но механика
  // честная: счёт клиентов магазина = число уникальных покупателей, и каждая
  // новая покупка через оформление заказа увеличивает его на 1 (без накрутки).
  const poolSize = Math.max(...Object.values(CLIENT_TARGETS)) + 8;
  const clientPool: { id: string; name: string }[] = [];
  for (let i = 0; i < poolSize; i++) {
    clientPool.push(
      await prisma.user.create({
        data: { email: `client${i + 1}@volga.market`, name: clientName(i), role: "BUYER" },
      })
    );
  }

  const bulkFlow = [
    { status: "COMPLETED", escrow: "RELEASED" },
    { status: "DELIVERED", escrow: "HELD" },
    { status: "COMPLETED", escrow: "RELEASED" },
    { status: "SHIPPED", escrow: "HELD" },
  ];
  const shopsForOrders = await prisma.shop.findMany({
    include: {
      products: {
        where: { status: "ACTIVE" },
        select: { id: true, title: true, price: true },
      },
    },
  });
  let windowStart = 0;
  for (const sh of shopsForOrders) {
    const target = CLIENT_TARGETS[sh.slug] ?? 0;
    if (target === 0 || sh.products.length === 0) continue;
    for (let k = 0; k < target; k++) {
      const client = clientPool[(windowStart + k) % clientPool.length];
      const prod = sh.products[k % sh.products.length];
      const flow = bulkFlow[k % bulkFlow.length];
      const qty = (k % 3) + 1;
      const daysAgo = 4 + ((k * 13 + windowStart * 7) % 200);
      await prisma.order.create({
        data: {
          number: `В-${seq++}`,
          status: flow.status,
          escrowStatus: flow.escrow,
          total: prod.price * qty,
          deliveryMethod: k % 2 === 0 ? "СДЭК" : "Почта России",
          paymentMethod: k % 2 === 0 ? "Перевод на карту" : "При получении",
          customerName: client.name,
          customerPhone: `+7 918 ${String(2000000 + windowStart * 1000 + k).slice(-7)}`,
          buyerId: client.id,
          shopId: sh.id,
          createdAt: new Date(Date.now() - daysAgo * 86400000),
          items: { create: [{ productId: prod.id, title: prod.title, price: prod.price, qty }] },
        },
      });
    }
    windowStart += 5;
  }

  const [users, shopCount, products, reviews, orders, disputes] = await Promise.all([
    prisma.user.count(),
    prisma.shop.count(),
    prisma.product.count(),
    prisma.review.count(),
    prisma.order.count(),
    prisma.dispute.count(),
  ]);
  console.log("Готово:", { users, shops: shopCount, products, reviews, orders, disputes });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
