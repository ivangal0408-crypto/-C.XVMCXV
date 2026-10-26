// Язык по региону: СНГ → русский, Европа и Америка → английский.
// Регион определяем по часовому поясу устройства (без внешних API и cookies),
// затем — по языку браузера. Ручной выбор запоминается.
(function () {
  const CIS_TZ = [
    // Россия
    'Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara', 'Europe/Volgograd', 'Europe/Saratov',
    'Europe/Ulyanovsk', 'Europe/Astrakhan', 'Europe/Kirov', 'Europe/Simferopol',
    'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Barnaul', 'Asia/Tomsk',
    'Asia/Novokuznetsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Chita', 'Asia/Yakutsk',
    'Asia/Khandyga', 'Asia/Vladivostok', 'Asia/Ust-Nera', 'Asia/Magadan', 'Asia/Sakhalin',
    'Asia/Srednekolymsk', 'Asia/Kamchatka', 'Asia/Anadyr',
    // Беларусь, Молдова, Армения, Азербайджан
    'Europe/Minsk', 'Europe/Chisinau', 'Asia/Yerevan', 'Asia/Baku',
    // Казахстан
    'Asia/Almaty', 'Asia/Qostanay', 'Asia/Aqtobe', 'Asia/Aqtau', 'Asia/Atyrau', 'Asia/Oral', 'Asia/Qyzylorda',
    // Центральная Азия
    'Asia/Tashkent', 'Asia/Samarkand', 'Asia/Bishkek', 'Asia/Dushanbe', 'Asia/Ashgabat'
  ];
  const WEST = /^(Europe|America|Atlantic|US|Canada|Brazil|Mexico|Chile)\//;
  const CIS_LANGS = /^(ru|be|kk|ky|uz|tg|hy|az|tk)\b/i;
  const KEY = 'ig-lang';

  function detect() {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved === 'ru' || saved === 'en') return { lang: saved, reason: 'saved' };

    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    if (CIS_TZ.includes(tz)) return { lang: 'ru', reason: 'cis', tz };
    if (WEST.test(tz)) return { lang: 'en', reason: 'west', tz };

    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    return { lang: langs.some(l => CIS_LANGS.test(l)) ? 'ru' : 'en', reason: 'browser', tz };
  }

  const BLOG_RU = `
<p>Когда предприниматель слышит «ИИ-автоматизация», он часто представляет робота, который увольняет половину команды. На практике всё скромнее и полезнее: автоматизация забирает у людей ту работу, которую они и так не любят.</p>
<p>Возьмём типичный малый бизнес — студию, салон или онлайн-школу. Заявки приходят в мессенджеры, на сайт, в соцсети. Менеджер снова и снова отвечает на одни и те же вопросы: сколько стоит, есть ли свободное время, как добраться. Часть заявок теряется вечером и в выходные. Клиент, которому не ответили за пятнадцать минут, уходит к конкуренту.</p>
<p>Здесь ИИ работает как первая линия поддержки. Бот в Telegram отвечает на типовые вопросы по базе знаний компании, уточняет детали, записывает клиента и передаёт заявку человеку уже «тёплой». Менеджер подключается там, где нужны эмпатия, переговоры и нестандартные решения.</p>
<h3>Начинать с одного процесса</h3>
<p>Главная ошибка — пытаться автоматизировать всё сразу. Хороший проект начинается с одного узкого процесса, например обработки входящих заявок. Его можно запустить за пару недель, измерить результат и только потом расширять.</p>
<h3>Контроль и честность</h3>
<p>ИИ ошибается, поэтому система должна сохранять диалоги, уметь передавать разговор человеку и не выдумывать цены или условия. Это вопрос не технологий, а честности перед клиентом.</p>
<h3>Измеримость</h3>
<p>До запуска фиксируем, сколько заявок теряется и сколько времени уходит на ответы. После — сравниваем. Если цифры не изменились, автоматизация не нужна, и это тоже нормальный результат.</p>
<p>Простой ориентир — правило одного часа: если сотрудник каждый день тратит больше часа на однотипные ответы или перенос данных между таблицами, именно этот процесс стоит автоматизировать первым.</p>
<p>Я думаю, в ближайшие годы выиграют не те компании, у которых больше всего ИИ, а те, кто встроил его в процессы аккуратно: там, где он экономит время людей, а не заменяет их внимание к клиенту.</p>`;

  const BLOG_EN = `
<p>When business owners hear “AI automation”, many picture a robot that fires half the team. In practice it is more modest and more useful: automation takes away the work people never enjoyed in the first place.</p>
<p>Take a typical small business — a studio, a salon or an online school. Requests come in through messengers, the website and social media. A manager answers the same questions again and again: how much it costs, whether there is a free slot, how to get there. Some requests get lost in the evening and at weekends. A client who waits more than fifteen minutes for a reply goes to a competitor.</p>
<p>This is where AI works as the first line of support. A Telegram bot answers common questions from the company’s knowledge base, clarifies details, books the client and hands a “warm” request over to a human. The manager steps in where empathy, negotiation and non-standard decisions are needed.</p>
<h3>Start with one process</h3>
<p>The biggest mistake is trying to automate everything at once. A good project starts with one narrow process, such as handling incoming requests. It can be launched in a couple of weeks, measured, and only then expanded.</p>
<h3>Control and honesty</h3>
<p>AI makes mistakes, so the system must log conversations, be able to hand a chat over to a person and never invent prices or terms. That is not a question of technology — it is a question of honesty towards the client.</p>
<h3>Measurability</h3>
<p>Before launch we record how many requests are lost and how much time replies take. After launch we compare. If the numbers have not changed, the automation is not needed — and that is a perfectly valid result too.</p>
<p>A simple rule of thumb is the one-hour rule: if an employee spends more than an hour a day on repetitive replies or copying data between spreadsheets, that is the process to automate first.</p>
<p>I believe the companies that win in the coming years will not be the ones with the most AI, but the ones that built it into their processes carefully: where it saves people’s time rather than replacing their attention to the client.</p>`;

  const DICT = {
    ru: {
      'meta.title': 'Иван Галь — ИИ-автоматизация для бизнеса',
      skip: 'К содержимому',
      'intro.presents': 'Gal Studio представляет', 'intro.name': 'Иван Галь', 'intro.skip': 'Пропустить ›',
      'nav.home': 'Обо мне', 'nav.resume': 'Резюме', 'nav.idea': 'Бизнес-идея', 'nav.blog': 'Блог', 'nav.contacts': 'Контакты',
      'hero.eyebrow': 'Сцена 01 — Главная', 'hero.first': 'Иван', 'hero.last': 'Галь',
      'hero.role': 'IT-предприниматель · ИИ-автоматизации · Telegram-боты · Сайты',
      'hero.uvp': 'Автоматизирую рутину бизнеса с&nbsp;помощью ИИ — вы растёте, а&nbsp;не&nbsp;тонете в&nbsp;задачах.',
      'hero.cta': 'Смотреть работы', 'hero.linkedin': 'Профиль LinkedIn', 'hero.scroll': 'Листайте',
      'hero.photoAlt': 'Иван Галь', 'hero.mono': 'ИГ',
      'about.eyebrow': 'Сцена 01.2 — Обо мне',
      'about.text': 'Мне 19, я IT-предприниматель и студент РЭУ им. Г.В. Плеханова. Делаю сайты, Telegram-ботов, мини-приложения и ИИ-автоматизации, которые снимают с бизнеса рутину: заявки, ответы клиентам, отчёты. Мне интересно, как технологии превращаются в деньги и свободное время — для клиентов и для меня.',
      'about.f1k': 'Фокус', 'about.f1v': 'ИИ-автоматизации', 'about.f2k': 'Учёба', 'about.f2v': 'РЭУ им. Плеханова',
      'about.f3k': 'Ищу', 'about.f3v': 'Клиентов и партнёров',
      'skills.title': 'Навыки',
      'skills.s1': 'ИИ-автоматизации', 'skills.s1d': 'n8n, Make, LLM API: заявки, ответы, отчёты без ручной работы',
      'skills.s2': 'Telegram-боты и мини-аппы', 'skills.s2d': 'Python, Telegram Bot API, Web Apps',
      'skills.s3': 'Веб-разработка', 'skills.s3d': 'HTML/CSS/JS, Next.js, Supabase',
      'skills.s4': 'Промпт-инжиниринг', 'skills.s4d': 'Ассистенты на базе OpenAI и Claude под задачи бизнеса',
      'skills.s5': 'Работа с клиентами', 'skills.s5d': 'Сбор требований, ТЗ, презентация решения',
      'skills.s6': 'Продуктовое мышление', 'skills.s6d': 'Считаю пользу автоматизации в часах и деньгах',
      'media.soon': 'Премьера скоро', 'media.videoT': 'Видеопрезентация',
      'media.videoD': 'Кто я, чему учусь, что умею и какие возможности ищу — за 2 минуты.',
      'media.audioT': 'Аудиоистория', 'media.audioD': 'Один опыт, который сделал меня тем, кто я есть сегодня.',
      'resume.eyebrow': 'Сцена 02 — Резюме и портфолио', 'resume.title': 'Путь и работы',
      'resume.edu': 'Образование', 'resume.exp': 'Опыт', 'resume.now': 'Сейчас',
      'resume.eduT': 'РЭУ им. Г.В. Плеханова', 'resume.eduD': 'Студент. Экономика и управление — фундамент для IT-бизнеса.',
      'resume.expT': 'Собственная практика · IT-предприниматель',
      'resume.expD': 'Сайты, Telegram-боты, мини-приложения и ИИ-автоматизации для малого бизнеса.',
      'resume.cvView': 'Посмотреть резюме', 'resume.cvDl': 'Скачать PDF', 'resume.cvNote': 'PDF-версия — в монтаже',
      'case.draft': 'черновик', 'case.live': 'в эфире', 'case.task': 'Задача', 'case.did': 'Что сделал', 'case.result': 'Результат',
      'case1.t': 'Telegram-бот для записи клиентов', 'case1.task': 'Студия теряла заявки вечером и в выходные.',
      'case1.did': 'Бот на Python: ИИ отвечает на частые вопросы, записывает клиента в таблицу и уведомляет администратора.',
      'case1.result': 'Заявки принимаются 24/7, администратор получает готовую запись.',
      'case2.t': 'ИИ-обработка заявок в n8n', 'case2.task': 'Заявки с сайта вручную переносились в CRM.',
      'case2.did': 'Сценарий n8n: форма → ИИ классифицирует заявку → карточка в CRM → уведомление в Telegram.',
      'case2.result': 'Менеджер сразу видит приоритет и суть запроса, без ручного копирования.',
      'case3.t': 'Этот сайт', 'case3.task': 'Персональный сайт-портфолио, который запоминается.',
      'case3.did': 'HTML/CSS/JS + GSAP, кинематографичные анимации, язык по региону посетителя. ИИ — для структуры и кода, доработка — вручную.',
      'case3.result': 'Сайт опубликован на GitHub Pages и работает на телефоне и ПК.',
      'idea.eyebrow': 'Сцена 03 — Моя бизнес-идея', 'idea.title': 'ИИ-администратор',
      'idea.sub': 'Цифровой сотрудник для малого бизнеса: отвечает клиентам, записывает и не теряет ни одной заявки.',
      'idea.aud': 'Целевая аудитория', 'idea.audD': 'Салоны, студии, онлайн-школы и локальные сервисы, где заявки идут через мессенджеры.',
      'idea.prob': 'Проблема', 'idea.probD': 'Менеджеры не успевают отвечать: часть заявок теряется вечером и в выходные, клиенты уходят к конкурентам.',
      'idea.sol': 'Решение', 'idea.solD': 'Telegram-бот с ИИ на базе знаний компании: отвечает, уточняет детали, записывает и передаёт «тёплую» заявку человеку.',
      'idea.val': 'Ценностное предложение', 'idea.valD': 'Ответ клиенту за секунды, 24/7 — без найма ещё одного сотрудника.',
      'idea.how': 'Как это работает — 3 шага',
      'idea.s1': 'Аудит', 'idea.s1d': 'Разбираем, где теряются заявки и время.',
      'idea.s2': 'Запуск', 'idea.s2d': 'Настраиваю бота и базу знаний за 1–2 недели.',
      'idea.s3': 'Рост', 'idea.s3d': 'Меряем результат и расширяем автоматизацию.',
      'idea.cta': 'Обсудить автоматизацию',
      'blog.eyebrow': 'Сцена 04 — Блог / Публикации', 'blog.title': 'Мысли вслух', 'blog.tag': 'ИИ и бизнес', 'blog.time': '2 мин чтения',
      'blog.postT': 'ИИ-автоматизация: не замена людей, а возврат времени',
      'blog.postE': 'Почему бизнесу не нужен «робот, который всех уволит», и с какого одного процесса стоит начинать.',
      'blog.read': 'Читать статью', 'blog.body': BLOG_RU,
      'contacts.eyebrow': 'Сцена 05 — Контакты', 'contacts.t1': 'Снимем', 'contacts.t2': 'следующую сцену', 'contacts.t3': 'вместе?',
      'contacts.in': 'Профессиональный профиль', 'contacts.tg': 'Самый быстрый ответ',
      'credits.h': 'В ролях', 'credits.dir': 'Режиссёр и продюсер', 'credits.script': 'Сценарий', 'credits.scriptV': 'Иван Галь при участии ИИ',
      'credits.code': 'Код', 'credits.host': 'Прокат', 'credits.end': 'Конец первой части',
      'toast.cis': 'Регион: СНГ — язык сайта русский', 'toast.west': 'Region: Europe / Americas — English',
      'toast.browser': 'Язык выбран по настройкам браузера', 'toast.linkedin': 'Ссылка на LinkedIn появится совсем скоро',
      'toast.cv': 'PDF-резюме появится на следующем этапе'
    },
    en: {
      'meta.title': 'Ivan Gal — AI automation for business',
      skip: 'Skip to content',
      'intro.presents': 'Gal Studio presents', 'intro.name': 'Ivan Gal', 'intro.skip': 'Skip ›',
      'nav.home': 'About', 'nav.resume': 'Resume', 'nav.idea': 'Business idea', 'nav.blog': 'Blog', 'nav.contacts': 'Contact',
      'hero.eyebrow': 'Scene 01 — Home', 'hero.first': 'Ivan', 'hero.last': 'Gal',
      'hero.role': 'IT entrepreneur · AI automation · Telegram bots · Websites',
      'hero.uvp': 'I automate business routine with AI — so you grow instead of drowning in&nbsp;tasks.',
      'hero.cta': 'See my work', 'hero.linkedin': 'LinkedIn profile', 'hero.scroll': 'Scroll',
      'hero.photoAlt': 'Ivan Gal', 'hero.mono': 'IG',
      'about.eyebrow': 'Scene 01.2 — About me',
      'about.text': 'I’m 19, an IT entrepreneur and a student at Plekhanov Russian University of Economics. I build websites, Telegram bots, mini apps and AI automations that take routine off a business’s plate: requests, client replies, reports. I’m interested in how technology turns into money and free time — for my clients and for me.',
      'about.f1k': 'Focus', 'about.f1v': 'AI automation', 'about.f2k': 'Studying', 'about.f2v': 'Plekhanov University',
      'about.f3k': 'Looking for', 'about.f3v': 'Clients & partners',
      'skills.title': 'Skills',
      'skills.s1': 'AI automation', 'skills.s1d': 'n8n, Make, LLM APIs: requests, replies and reports without manual work',
      'skills.s2': 'Telegram bots & mini apps', 'skills.s2d': 'Python, Telegram Bot API, Web Apps',
      'skills.s3': 'Web development', 'skills.s3d': 'HTML/CSS/JS, Next.js, Supabase',
      'skills.s4': 'Prompt engineering', 'skills.s4d': 'OpenAI and Claude assistants tailored to business tasks',
      'skills.s5': 'Client work', 'skills.s5d': 'Requirements, specs, solution pitches',
      'skills.s6': 'Product thinking', 'skills.s6d': 'I measure automation value in hours and money',
      'media.soon': 'Premiere soon', 'media.videoT': 'Video introduction',
      'media.videoD': 'Who I am, what I study, what I can do and what I’m looking for — in 2 minutes.',
      'media.audioT': 'Audio story', 'media.audioD': 'One experience that made me who I am today.',
      'resume.eyebrow': 'Scene 02 — Resume & portfolio', 'resume.title': 'Path & work',
      'resume.edu': 'Education', 'resume.exp': 'Experience', 'resume.now': 'Now',
      'resume.eduT': 'Plekhanov Russian University of Economics', 'resume.eduD': 'Student. Economics and management — a foundation for an IT business.',
      'resume.expT': 'Own practice · IT entrepreneur',
      'resume.expD': 'Websites, Telegram bots, mini apps and AI automation for small businesses.',
      'resume.cvView': 'View resume', 'resume.cvDl': 'Download PDF', 'resume.cvNote': 'PDF version — in post-production',
      'case.draft': 'draft', 'case.live': 'on air', 'case.task': 'Task', 'case.did': 'What I did', 'case.result': 'Result',
      'case1.t': 'Booking bot on Telegram', 'case1.task': 'A studio was losing requests in the evenings and at weekends.',
      'case1.did': 'A Python bot: AI answers FAQs, books the client into a spreadsheet and notifies the admin.',
      'case1.result': 'Requests are handled 24/7; the admin gets a ready booking.',
      'case2.t': 'AI request handling in n8n', 'case2.task': 'Website requests were copied into the CRM by hand.',
      'case2.did': 'n8n flow: form → AI classifies the request → CRM card → Telegram alert.',
      'case2.result': 'The manager instantly sees priority and intent — no manual copying.',
      'case3.t': 'This website', 'case3.task': 'A personal portfolio site people remember.',
      'case3.did': 'HTML/CSS/JS + GSAP, cinematic animation, language by visitor region. AI for structure and code, polish done by hand.',
      'case3.result': 'Published on GitHub Pages, works on phone and desktop.',
      'idea.eyebrow': 'Scene 03 — My business idea', 'idea.title': 'AI Front Desk',
      'idea.sub': 'A digital employee for small businesses: answers clients, books them and never loses a request.',
      'idea.aud': 'Target audience', 'idea.audD': 'Salons, studios, online schools and local services that get requests via messengers.',
      'idea.prob': 'Problem', 'idea.probD': 'Managers can’t keep up: requests get lost in the evenings and at weekends, and clients leave for competitors.',
      'idea.sol': 'Solution', 'idea.solD': 'An AI Telegram bot trained on the company’s knowledge base: answers, clarifies, books and hands a warm lead to a human.',
      'idea.val': 'Value proposition', 'idea.valD': 'Replies in seconds, 24/7 — without hiring another employee.',
      'idea.how': 'How it works — 3 steps',
      'idea.s1': 'Audit', 'idea.s1d': 'We find where requests and time are lost.',
      'idea.s2': 'Launch', 'idea.s2d': 'I set up the bot and knowledge base in 1–2 weeks.',
      'idea.s3': 'Growth', 'idea.s3d': 'We measure results and expand the automation.',
      'idea.cta': 'Discuss automation',
      'blog.eyebrow': 'Scene 04 — Blog / Publications', 'blog.title': 'Thinking out loud', 'blog.tag': 'AI & business', 'blog.time': '2 min read',
      'blog.postT': 'AI automation: not replacing people, but giving time back',
      'blog.postE': 'Why a business doesn’t need “a robot that fires everyone”, and which single process to start with.',
      'blog.read': 'Read the article', 'blog.body': BLOG_EN,
      'contacts.eyebrow': 'Scene 05 — Contact', 'contacts.t1': 'Shall we shoot', 'contacts.t2': 'the next scene', 'contacts.t3': 'together?',
      'contacts.in': 'Professional profile', 'contacts.tg': 'Fastest reply',
      'credits.h': 'Starring', 'credits.dir': 'Director & producer', 'credits.script': 'Screenplay', 'credits.scriptV': 'Ivan Gal, assisted by AI',
      'credits.code': 'Code', 'credits.host': 'Distribution', 'credits.end': 'End of part one',
      'toast.cis': 'Регион: СНГ — язык сайта русский', 'toast.west': 'Region: Europe / Americas — English',
      'toast.browser': 'Language picked from your browser settings', 'toast.linkedin': 'LinkedIn link is coming very soon',
      'toast.cv': 'The PDF resume arrives in the next stage'
    }
  };

  const listeners = [];
  const state = detect();

  function t(key) { return (DICT[state.lang] && DICT[state.lang][key]) || DICT.ru[key] || ''; }

  function apply(lang) {
    state.lang = lang;
    document.documentElement.lang = lang;
    document.title = t('meta.title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = t(el.dataset.i18nAlt); });
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    listeners.forEach(fn => fn(lang));
  }

  function set(lang, persist) {
    if (persist) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
    apply(lang);
  }

  window.I18N = { state, t, set, onChange: fn => listeners.push(fn) };
  apply(state.lang);
})();
