(function () {
  const navItems = [
    ["О нас", "about"],
    ["Тарифы", "pricing"],
    ["Для бизнеса", "business"],
    ["Психологам", "specialists"],
    ["Сертификат", "certificate"],
    ["Материалы", "materials"],
    ["FAQ", "faq"],
  ];

  function renderHeader(target) {
    target.outerHTML = `
      <header class="header">
        <div class="container header__inner">
          <a class="header__logo" href="index.html" aria-label="YouTalk на главную">
            <img src="assets/logo.svg" alt="YouTalk" />
          </a>
          <nav class="header__nav" aria-label="Основная навигация">
            <ul class="header__menu">
              ${navItems
                .map(
                  ([label, action]) => `
                    <li class="header__menu-item">
                      <button class="header__link" type="button" data-nav="${action}">${label}</button>
                    </li>
                  `,
                )
                .join("")}
            </ul>
          </nav>
          <button class="button button--soft header__cta" type="button" data-action="pick-psychologist">Подобрать психолога</button>
          <button class="header__burger" type="button" aria-label="Открыть меню" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
    `;
  }

  function renderFooter(target) {
    target.outerHTML = `
      <footer class="footer">
        <div class="container footer__inner">
          <nav class="footer__nav" aria-label="Навигация в подвале">
            <ul>
              <li><button type="button" data-nav="about">О нас</button></li>
              <li><button type="button" data-nav="pricing">Тарифы</button></li>
              <li><button type="button" data-nav="business">Для бизнеса</button></li>
              <li><button type="button" data-nav="specialists">Психологам</button></li>
              <li><button type="button" data-nav="faq">FAQ</button></li>
            </ul>
            <ul>
              <li><a href="index.html">Блог</a></li>
              <li><button type="button" data-nav="webinars">Вебинары</button></li>
              <li><button type="button" data-nav="podcast">Подкаст</button></li>
              <li><button type="button" data-nav="certificate">Сертификат</button></li>
              <li><button type="button" data-nav="contacts">Контакты</button></li>
            </ul>
          </nav>
          <section class="footer__subscribe" aria-labelledby="subscribe-title">
            <h2 id="subscribe-title">Одно письмо в неделю со свежими новостями и акциями</h2>
            <form class="subscribe-form" action="#" method="post">
              <label class="visually-hidden" for="email">Ваш e-mail</label>
              <input id="email" name="email" type="email" placeholder="Ваш e-mail" />
              <button type="submit" aria-label="Подписаться">
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13m0 0-5-5m5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </form>
            <p>
              Подписываясь, я соглашаюсь на обработку персональных данных в соответствии с ФЗ РФ
              № 152-ФЗ «О персональных данных», а также с Политикой конфиденциальности.
            </p>
          </section>
          <section class="footer__social" aria-label="Социальные сети и партнеры">
            <div class="footer__partner">
              <img src="assets/sk-logo.svg" alt="Сколково" />
              <img src="assets/participant.svg" alt="Участник" />
            </div>
            <ul class="social">
              <li>
                <a href="https://vk.com/" target="_blank" rel="noreferrer" aria-label="ВКонтакте">
                  <img src="assets/social-vk.svg" alt="" />
                </a>
              </li>
              <li>
                <a href="https://telegram.org/" target="_blank" rel="noreferrer" aria-label="Telegram">
                  <img src="assets/social-tg.svg" alt="" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <img src="assets/social-twitter.svg" alt="" />
                </a>
              </li>
              <li>
                <a href="https://dzen.ru/" target="_blank" rel="noreferrer" aria-label="Дзен">
                  <img src="assets/social-dzen.svg" alt="" />
                </a>
              </li>
            </ul>
          </section>
          <div class="footer__bottom">
            <p>©Youtalk, 2018 - 2022</p>
            <button type="button" data-nav="docs">Юридические документы</button>
            <button type="button" data-nav="payment">Способы оплаты</button>
          </div>
        </div>
      </footer>
    `;
  }

  document.querySelectorAll('[data-layout="header"]').forEach(renderHeader);
  document.querySelectorAll('[data-layout="footer"]').forEach(renderFooter);

  const burger = document.querySelector(".header__burger");
  const header = document.querySelector(".header");

  if (burger && header) {
    burger.addEventListener("click", () => {
      const isOpen = header.classList.toggle("header--open");
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });
  }

  let activeFilter = "all";
  let moreExpanded = false;

  function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.append(toast);
    }

    toast.textContent = message;
    toast.classList.add("toast--visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("toast--visible");
    }, 3200);
  }

  function updateCards() {
    const cards = [...document.querySelectorAll(".card[data-tags]")].sort(
      (a, b) => Number(a.dataset.order) - Number(b.dataset.order),
    );
    const moreButton = document.querySelector('[data-action="toggle-more"]');
    const extraCards = [...document.querySelectorAll(".card--extra[data-tags]")];
    const articles = document.querySelector(".articles");
    const featured = document.querySelector(".articles__featured");
    const grid = document.querySelector(".articles__grid");

    if (!featured || !grid) {
      return;
    }

    articles?.classList.toggle("articles--filtered", activeFilter !== "all");

    cards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
      const isExtra = card.classList.contains("card--extra");

      if (activeFilter === "all") {
        const target = card.dataset.group === "featured" ? featured : grid;
        target.append(card);
        card.hidden = isExtra && !moreExpanded;
      } else {
        grid.append(card);
        card.hidden = !matchesFilter || (isExtra && !moreExpanded);
      }
    });

    if (moreButton) {
      const hasMatchingExtra = extraCards.some((card) => {
        const tags = card.dataset.tags.split(" ");
        return activeFilter === "all" || tags.includes(activeFilter);
      });

      moreButton.hidden = !hasMatchingExtra;
      moreButton.textContent = moreExpanded ? "Скрыть" : "Ещё";
    }
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      moreExpanded = false;

      document.querySelectorAll("[data-filter]").forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("tag--active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      updateCards();
    });
  });

  document.querySelectorAll(".card[data-tags]").forEach((card, index) => {
    card.dataset.order = String(index);
    card.dataset.group = card.parentElement?.classList.contains("articles__featured")
      ? "featured"
      : "grid";
  });

  function ensureModal() {
    let modal = document.querySelector(".modal");

    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal";
      modal.hidden = true;
      modal.innerHTML = `
        <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button class="modal__close" type="button" aria-label="Закрыть">×</button>
          <h2 id="modal-title"></h2>
          <p class="modal__text"></p>
          <form class="modal__form">
            <label>
              Имя
              <input name="name" type="text" autocomplete="name" placeholder="Например, Анна" required />
            </label>
            <label>
              Телефон или e-mail
              <input name="contact" type="text" autocomplete="email" placeholder="+7 или mail@example.com" required />
            </label>
            <button class="button button--primary" type="submit">Отправить</button>
          </form>
        </div>
      `;
      document.body.append(modal);

      modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.closest(".modal__close")) {
          modal.hidden = true;
          document.body.classList.remove("modal-open");
        }
      });

      modal.querySelector(".modal__form").addEventListener("submit", (event) => {
        event.preventDefault();
        modal.hidden = true;
        document.body.classList.remove("modal-open");
        event.currentTarget.reset();
        showToast("Заявка принята. В демо-версии данные никуда не отправляются.");
      });
    }

    return modal;
  }

  function openModal(title, text) {
    const modal = ensureModal();
    modal.querySelector("#modal-title").textContent = title;
    modal.querySelector(".modal__text").textContent = text;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("input").focus();
  }

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    const navButton = event.target.closest("[data-nav]");

    if (navButton) {
      const labels = {
        about: ["О нас", "YouTalk помогает людям подобрать своего специалиста и начать терапию в комфортном формате."],
        pricing: ["Тарифы", "В демо-проекте тарифы открываются как интерактивный раздел. Реальная страница подключается отдельным роутом."],
        business: ["Для бизнеса", "Корпоративные программы можно оформить через заявку. Сейчас это демонстрационное окно."],
        specialists: ["Психологам", "Раздел для специалистов в этой версии показывает форму связи."],
        certificate: ["Сертификат", "Здесь можно оформить подарочный сертификат на консультации."],
        materials: ["Материалы", "На странице блога материалы представлены фильтрами и карточками статей."],
        faq: ["FAQ", "Частые вопросы в демо-версии открываются через это окно."],
        webinars: ["Вебинары", "Вебинары будут отдельным разделом сайта."],
        podcast: ["Подкаст", "Подкаст будет отдельным разделом сайта."],
        contacts: ["Контакты", "Оставьте контакт, и команда YouTalk свяжется с вами."],
        docs: ["Юридические документы", "В демо-версии документы открываются в этом окне. В продакшене здесь будет отдельная страница."],
        payment: ["Способы оплаты", "Оплату можно будет выполнить картой или через подарочный сертификат."],
      };
      const [title, text] = labels[navButton.dataset.nav];

      if (navButton.dataset.nav === "materials" && document.querySelector(".tags")) {
        document.querySelector(".tags").scrollIntoView({ behavior: "smooth", block: "center" });
        showToast("Материалы можно отфильтровать по темам.");
      } else if (title) {
        openModal(title, text);
      }

      if (header && header.classList.contains("header--open")) {
        header.classList.remove("header--open");
        burger?.setAttribute("aria-expanded", "false");
      }

      return;
    }

    if (!actionButton) {
      return;
    }

    const action = actionButton.dataset.action;

    if (action === "toggle-more") {
      moreExpanded = !moreExpanded;
      updateCards();
      return;
    }

    if (action === "pick-psychologist") {
      openModal("Подобрать психолога", "Оставьте контакт, и мы покажем подходящих специалистов.");
    }

    if (action === "show-schedule") {
      openModal("Свободные окошки", "Оставьте контакт, чтобы получить ближайшие доступные слоты.");
    }

    if (action === "psychologist-details") {
      openModal("Записаться к Лилии", "Расскажем о формате консультации и подберем удобное время.");
    }

    if (action === "buy-sessions") {
      openModal("Купить пакет сессий", "Оставьте контакт для оформления пакета из 8 видео-сессий.");
    }
  });

  document.querySelectorAll(".subscribe-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');

      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }

      form.reset();
      showToast("Спасибо за подписку. Демо-форма не отправляет данные на сервер.");
    });
  });

  updateCards();
})();
