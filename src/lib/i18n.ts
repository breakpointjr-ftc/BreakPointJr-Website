import { useSyncExternalStore } from "react";

export type Lang = "tr" | "en";

const STORAGE_KEY = "bpj-lang";

// Tiny external store: server and first client render always use "tr" (so
// hydration matches); <LangInit/> then applies the saved choice.
let current: Lang = "tr";
const listeners = new Set<() => void>();

export function setLang(next: Lang, persist = true) {
  if (next === current) return;
  current = next;
  if (typeof document !== "undefined") document.documentElement.lang = next;
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage can be blocked; the choice just won't persist */
    }
  }
  listeners.forEach((l) => l());
}

export function readStoredLang(): Lang | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "en" || v === "tr" ? v : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useLang(): Lang {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => "tr" as Lang
  );
}

const tr = {
  nav: {
    about: "Hakkımızda",
    team: "Takım",
    goals: "Hedefler",
    sponsors: "Sponsorluk",
    contact: "İletişim",
    top: "Giriş",
    cta: "Bize Ulaşın",
    menu: "Menüyü aç/kapat",
    langLabel: "Dil seçimi",
  },
  cur: {
    brk: "KIR",
    explore: "KEŞFET",
    support: "DESTEK",
    open: "AÇ",
    inspect: "İNCELE",
    pick: "SEÇ",
    go: "GİT",
    write: "YAZ",
    send: "GÖNDER",
    up: "YUKARI",
    top: "BAŞA",
  },
  intro: {
    log: [
      '$ ./build --takım "BreakPoint Jr." --sezon 2026',
      "[ok] robot.kinematics ............ derlendi",
      "[ok] otonom.rota ................. derlendi",
      "[ok] ekip.moral .................. %100",
      "[!!] breakpoint bulundu  →  satır 1",
    ],
    skip: "atlamak için tıkla veya boşluk tuşuna bas",
  },
  hero: {
    meta: "FIRST Tech Challenge · Sezon 2026",
    aria: "BreakPoint — kırmak için tıkla",
    text: [
      "Türkiye'nin yeni FIRST Tech Challenge takımı. Her sınırı kırarak, her ",
      "breakpoint",
      "'te öğrenerek ve daha güçlü devam ederek büyüyoruz.",
    ],
    meet: "Takımı Tanı",
    sponsor: "Sponsor Ol",
    hint: "Yazıya tıkla",
  },
  marquee: ["KIR", "ÖĞREN", "İNŞA ET", "TEKRARLA"],
  cycle: {
    label: "şunlar için var",
    words: ["Mühendisler.", "Meraklılar.", "Sen."],
  },
  about: {
    tag: "Hakkımızda",
    manifesto:
      "BreakPoint Jr., FIRST Tech Challenge sahasına çıkan yepyeni bir robotik takımı. Adımızı yazılımdaki *breakpoint* anından aldık: kod durur, hata görünür, *öğrenme* başlar.",
    pillars: [
      {
        title: "Mühendislik",
        desc: "CAD tasarımından üretime, her robot parçasını takım içinde tasarlıyor ve test ediyoruz.",
      },
      {
        title: "Yazılım",
        desc: "Otonom algoritmalar ve kontrol sistemleri geliştirerek robotumuza zeka katıyoruz.",
      },
      {
        title: "Takım Ruhu",
        desc: "Gracious Professionalism ilkesiyle rekabet ederken birlikte öğreniyor, birlikte büyüyoruz.",
      },
    ],
  },
  team: {
    tag: "Takım",
    title: "Robotun arkasındaki isimler.",
    desc: "Farklı yeteneklerden bir araya gelen ekibimiz, ilk sezonumuzda aynı hedef için çalışıyor: daha iyi bir robot, daha güçlü bir takım.",
    members: [
      { role: "Takım Kaptanı", dept: "Liderlik" },
      { role: "Baş Mühendis", dept: "Mekanik" },
      { role: "Yazılım Lideri", dept: "Programlama" },
      { role: "CAD Tasarımcı", dept: "Mekanik" },
      { role: "Strateji Sorumlusu", dept: "Saha" },
      { role: "Medya & Outreach", dept: "İletişim" },
      { role: "Elektronik Sorumlusu", dept: "Donanım" },
      { role: "Mentor", dept: "Danışmanlık" },
    ],
  },
  goals: {
    tag: "Hedeflerimiz",
    title: "Küçük adımlar, büyük kırılma noktaları.",
    now: "▶ şu an",
    items: [
      { fn: "ilk_turnuva()", title: "Bölgesel Turnuva", desc: "İlk resmi FTC sezonumuzda sahne almaya hazırlanıyoruz." },
      { fn: "inspire_award()", title: "Inspire Award Hedefi", desc: "Takım olarak en üst seviye ödül kategorisini hedefliyoruz." },
      { fn: "stem_outreach()", title: "STEM Outreach", desc: "Bölgemizdeki öğrencilere robotik ve kodlama atölyeleri düzenliyoruz." },
      { fn: "uzun_vade()", title: "Uzun Vadeli Vizyon", desc: "İlk sezonumuzu güçlü bir temel olarak görüyor, takımı yıllar içinde büyütmeyi hedefliyoruz." },
    ],
  },
  sponsor: {
    tag: "Sponsorluk",
    title: "Geleceğin mühendislerine yatırım yapın.",
    desc: "Sponsorluğunuz; robot parçalarından turnuva masraflarına, atölye malzemelerinden seyahat giderlerine kadar takımımızın bu sezon boyunca yarışabilmesini sağlıyor. Aşağıdaki paketler örnek niteliğindedir, ihtiyaçlarınıza göre özel bir iş birliği de kurabiliriz.",
    budgetTitle: "Sponsorluğunuz nereye gidiyor",
    budgetNote: "* Yaklaşık dağılımdır, sezon ihtiyaçlarına göre değişebilir.",
    budgetAria: "Bütçe dağılımı",
    segments: [
      "Robot Parçaları & Donanım",
      "Turnuva Kayıt & Seyahat",
      "Malzeme & Prototipleme",
      "Atölye & Outreach",
    ],
    popular: "En popüler",
    contactLink: "İletişime Geç",
    footnote: "* Fiyatlar örnek niteliğindedir, güncel sponsorluk dosyamız talep üzerine paylaşılır.",
    tiers: [
      {
        name: "Bronz",
        price: "5.000₺",
        perks: ["Web sitesinde logo", "Sosyal medyada teşekkür paylaşımı", "Sezon sonu teşekkür belgesi"],
      },
      {
        name: "Gümüş",
        price: "15.000₺",
        perks: [
          "Bronz paketin tüm avantajları",
          "Robot üzerinde logo alanı",
          "Takım formasında logo",
          "Turnuva standında marka görünürlüğü",
        ],
      },
      {
        name: "Altın",
        price: "30.000₺",
        perks: [
          "Gümüş paketin tüm avantajları",
          "Robot üzerinde öne çıkan logo alanı",
          "Turnuva sunumlarında isim anonsu",
          "Takım araç/ekipmanlarında marka görünürlüğü",
        ],
      },
      {
        name: "Platin",
        price: "Görüşelim",
        perks: [
          "Altın paketin tüm avantajları",
          "Resmi ana sponsor unvanı",
          "Ortak içerik ve etkinlik iş birlikleri",
          "Özel raporlama ve geri bildirim görüşmeleri",
        ],
      },
    ],
  },
  cta: {
    eyebrow: "İlk sezonumuzda yanımızda olun",
    lines: ["Sınırları", "Birlikte", "Kıralım."],
    text: "İster sponsorluk, ister mühendislik desteği, ister sadece iyi şanslar — bu yolculukta bize katılan herkes bizim için değerli.",
    sponsor: "Sponsorumuz Ol",
    contact: "Bize Ulaşın",
  },
  contact: {
    tag: "İletişim",
    title: "Bizimle bağlantıya geçin.",
    desc: "Sponsorluk, iş birliği veya takıma katılım hakkında sorularınız mı var? Aşağıdaki kanallardan bize ulaşabilirsiniz.",
    country: "Türkiye",
    nameKey: "ad_soyad",
    nameLabel: "Ad Soyad",
    namePh: "Adınız Soyadınız",
    emailKey: "e_posta",
    emailLabel: "E-posta",
    emailPh: "ornek@eposta.com",
    msgKey: "mesaj",
    msgLabel: "Mesajınız",
    msgPh: "Sponsorluk veya iş birliği hakkında...",
    send: "Mesajı Gönder",
    doneTitle: "Commit edildi.",
    doneBody: "→ origin/main · kırıldı, öğrendik, devam ediyoruz.",
    doneNote:
      "(Bu form şu an demo amaçlıdır — mesajınız gerçekte gönderilmedi, e-posta entegrasyonu eklenecek. Yukarıdaki adresten bize ulaşabilirsiniz.)",
    again: "yeni mesaj yaz",
  },
  footer: {
    tagline: ["Türkiye'den yeni bir ", "FIRST Tech Challenge", " takımı."],
    status: "Sezona hazırlanıyoruz",
    pages: "Sayfalar",
    contact: "İletişim",
    toTop: "başa dön",
    season: "sezon · 2026.01",
  },
};

export type Dict = typeof tr;

const en: Dict = {
  nav: {
    about: "About",
    team: "Team",
    goals: "Goals",
    sponsors: "Sponsors",
    contact: "Contact",
    top: "Intro",
    cta: "Contact Us",
    menu: "Toggle menu",
    langLabel: "Language",
  },
  cur: {
    brk: "BREAK",
    explore: "EXPLORE",
    support: "SUPPORT",
    open: "OPEN",
    inspect: "INSPECT",
    pick: "PICK",
    go: "GO",
    write: "WRITE",
    send: "SEND",
    up: "UP",
    top: "TOP",
  },
  intro: {
    log: [
      '$ ./build --team "BreakPoint Jr." --season 2026',
      "[ok] robot.kinematics ............ compiled",
      "[ok] auto.path ................... compiled",
      "[ok] team.morale ................. 100%",
      "[!!] breakpoint found  →  line 1",
    ],
    skip: "click or press space to skip",
  },
  hero: {
    meta: "FIRST Tech Challenge · Season 2026",
    aria: "BreakPoint — click to break it",
    text: [
      "Türkiye's newest FIRST Tech Challenge team. We grow by breaking every limit, learning at every ",
      "breakpoint",
      " and coming back stronger.",
    ],
    meet: "Meet the Team",
    sponsor: "Sponsor Us",
    hint: "Click the word",
  },
  marquee: ["BREAK", "LEARN", "BUILD", "REPEAT"],
  cycle: {
    label: "exists for",
    words: ["Engineers.", "The curious.", "You."],
  },
  about: {
    tag: "About Us",
    manifesto:
      "BreakPoint Jr. is a brand-new robotics team stepping onto the FIRST Tech Challenge field. We took our name from the *breakpoint* in software: the code stops, the bug shows up, *learning* begins.",
    pillars: [
      {
        title: "Engineering",
        desc: "From CAD design to production, we design and test every robot part within the team.",
      },
      {
        title: "Software",
        desc: "We give our robot intelligence by developing autonomous algorithms and control systems.",
      },
      {
        title: "Team Spirit",
        desc: "We compete with Gracious Professionalism while learning and growing together.",
      },
    ],
  },
  team: {
    tag: "Team",
    title: "The people behind the robot.",
    desc: "Our team, brought together from different talents, works toward one goal in our first season: a better robot and a stronger team.",
    members: [
      { role: "Team Captain", dept: "Leadership" },
      { role: "Head Engineer", dept: "Mechanical" },
      { role: "Software Lead", dept: "Programming" },
      { role: "CAD Designer", dept: "Mechanical" },
      { role: "Strategy Lead", dept: "Field" },
      { role: "Media & Outreach", dept: "Communications" },
      { role: "Electronics Lead", dept: "Hardware" },
      { role: "Mentor", dept: "Advisory" },
    ],
  },
  goals: {
    tag: "Our Goals",
    title: "Small steps, big breakpoints.",
    now: "▶ now",
    items: [
      { fn: "first_tournament()", title: "Regional Tournament", desc: "We are getting ready to take the stage in our first official FTC season." },
      { fn: "inspire_award()", title: "Inspire Award Goal", desc: "As a team, we are aiming for the highest award category." },
      { fn: "stem_outreach()", title: "STEM Outreach", desc: "We run robotics and coding workshops for students in our region." },
      { fn: "long_term()", title: "Long-Term Vision", desc: "We see our first season as a strong foundation and aim to grow the team over the years." },
    ],
  },
  sponsor: {
    tag: "Sponsorship",
    title: "Invest in the engineers of the future.",
    desc: "Your sponsorship lets our team compete all season long, covering everything from robot parts and tournament fees to workshop supplies and travel. The packages below are examples; we are happy to build a custom partnership around your needs.",
    budgetTitle: "Where your sponsorship goes",
    budgetNote: "* Approximate split; it may change with the season's needs.",
    budgetAria: "Budget allocation",
    segments: [
      "Robot Parts & Hardware",
      "Tournament Fees & Travel",
      "Materials & Prototyping",
      "Workshop & Outreach",
    ],
    popular: "Most popular",
    contactLink: "Get in touch",
    footnote: "* Prices are examples; our current sponsorship deck is shared on request.",
    tiers: [
      {
        name: "Bronze",
        price: "₺5,000",
        perks: ["Logo on the website", "Thank-you post on social media", "End-of-season certificate of thanks"],
      },
      {
        name: "Silver",
        price: "₺15,000",
        perks: [
          "Everything in Bronze",
          "Logo space on the robot",
          "Logo on the team jersey",
          "Brand visibility at the tournament booth",
        ],
      },
      {
        name: "Gold",
        price: "₺30,000",
        perks: [
          "Everything in Silver",
          "Featured logo space on the robot",
          "Name announcement in tournament presentations",
          "Brand visibility on team vehicles and equipment",
        ],
      },
      {
        name: "Platinum",
        price: "Let's talk",
        perks: [
          "Everything in Gold",
          "Official title sponsor status",
          "Joint content and event collaborations",
          "Custom reporting and feedback meetings",
        ],
      },
    ],
  },
  cta: {
    eyebrow: "Be with us in our first season",
    lines: ["Our limits", "Together", "We break."],
    text: "Whether it's sponsorship, engineering support, or just good luck — everyone who joins us on this journey matters to us.",
    sponsor: "Become a Sponsor",
    contact: "Contact Us",
  },
  contact: {
    tag: "Contact",
    title: "Get in touch with us.",
    desc: "Have questions about sponsorship, collaboration, or joining the team? Reach us through the channels below.",
    country: "Türkiye",
    nameKey: "full_name",
    nameLabel: "Full name",
    namePh: "Your full name",
    emailKey: "email",
    emailLabel: "Email",
    emailPh: "example@email.com",
    msgKey: "message",
    msgLabel: "Your message",
    msgPh: "About sponsorship or collaboration...",
    send: "Send Message",
    doneTitle: "Committed.",
    doneBody: "→ origin/main · we broke it, we learned, we keep going.",
    doneNote:
      "(This form is a demo for now — your message was not actually sent; email integration is coming. You can reach us at the address above.)",
    again: "write another message",
  },
  footer: {
    tagline: ["A new ", "FIRST Tech Challenge", " team from Türkiye."],
    status: "Getting ready for the season",
    pages: "Pages",
    contact: "Contact",
    toTop: "back to top",
    season: "season · 2026.01",
  },
};

export const dict: Record<Lang, Dict> = { tr, en };

export function useDict(): Dict {
  return dict[useLang()];
}
