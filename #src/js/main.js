//enable scroll
function enableScroll() {
  if (document.querySelectorAll(".fixed-block")) {
    document
      .querySelectorAll(".fixed-block")
      .forEach((block) => (block.style.paddingRight = "0px"));
  }
  document.body.style.paddingRight = "0px";
  document.body.classList.remove("no-scroll");
}
//disable scroll
function disableScroll() {
  let paddingValue =
    window.innerWidth > 350
      ? window.innerWidth - document.documentElement.clientWidth + "px"
      : 0;
  if (document.querySelectorAll(".fixed-block")) {
    document
      .querySelectorAll(".fixed-block")
      .forEach((block) => (block.style.paddingRight = paddingValue));
  }
  document.body.style.paddingRight = paddingValue;
  document.body.classList.add("no-scroll");
}

let animSpd = 400; //переменная для скорости анимации

// бургер
const burger = document.querySelector("#burger");

if (burger) {
  const mobileMenu = document.querySelector(".mobile-menu"); // Находим мобильное меню
  const ham = document.querySelector(".ham"); // Находим иконку бургера
  const header = document.querySelector(".header"); // Находим хедер

  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    ham.classList.toggle("active");
    header.classList.toggle("burger-active");

    if (burger.classList.contains("active")) {
      disableScroll();
    } else {
      enableScroll();
    }
  });
}

// меню десткоп
const menuTriggers = document.querySelectorAll("[data-menu-open]");

if (menuTriggers.length) {
  menuTriggers.forEach((trigger) => {
    const menuId = trigger.getAttribute("data-menu-open"); // Получаем ID связанного меню
    const menu = document.querySelector(`[data-menu="${menuId}"]`); // Находим соответствующее меню
    const overlay = document.querySelector(".overlay"); // Находим оверлей
    const allMenus = document.querySelectorAll("[data-menu]"); // Находим все меню

    if (menu) {
      // Функция для отображения активного меню
      const showMenu = () => {
        // Закрыть все другие меню
        allMenus.forEach((otherMenu) => {
          if (otherMenu !== menu) {
            otherMenu.classList.remove("active");
          }
        });
        menu.classList.add("active");
        overlay.classList.add("show");
      };

      // Функция для скрытия меню
      const hideMenu = () => {
        menu.classList.remove("active");
        overlay.classList.remove("show");
      };

      // Наведение на триггер
      trigger.addEventListener("mouseenter", showMenu);

      // Наведение на меню
      menu.addEventListener("mouseenter", showMenu);

      // Уход с меню
      menu.addEventListener("mouseleave", (e) => {
        hideMenu();
      });
    }
  });

  // Найти все элементы меню и соответствующие заголовки
  const headerMenus = document.querySelectorAll(".header__menu");
  const header = document.querySelector(".header");

  // Функция для проверки состояния активных меню
  const updateHeaderRadius = () => {
    let hasActiveMenu = false;

    // Проверяем, есть ли хотя бы одно меню с классом .active
    headerMenus.forEach((menu) => {
      if (menu.classList.contains("active")) {
        hasActiveMenu = true;
      }
    });

    // Убираем или возвращаем радиус в зависимости от состояния
    if (hasActiveMenu) {
      header.style.borderBottomRightRadius = "0";
      header.style.borderBottomLeftRadius = "0";
    } else {
      header.style.borderBottomRightRadius = "52px";
      header.style.borderBottomLeftRadius = "52px";
    }
  };

  // Наблюдатели для всех меню
  headerMenus.forEach((menu) => {
    const observer = new MutationObserver(() => {
      updateHeaderRadius();
    });

    // Настраиваем наблюдение за изменением классов
    observer.observe(menu, { attributes: true, attributeFilter: ["class"] });
  });
}

// Аккордеон меню
const menuAccordion = document.querySelector(".accordion-container");
if (menuAccordion) {
  new Accordion(menuAccordion, {
    onOpen: function (currentElement) {
      currentElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    },
  });
}

// тултип
const buttons = document.querySelectorAll(".tooltip-btn");

if (buttons.length) {
  buttons.forEach((button) => {
    const tooltipId = button.getAttribute("data-tooltip-target");
    const tooltip = document.querySelector(`[data-tooltip="${tooltipId}"]`);

    if (tooltip) {
      // Открытие тултипа
      button.addEventListener("click", (e) => {
        e.stopPropagation(); // Предотвращаем закрытие тултипа при клике на кнопку
        closeAllTooltips(); // Закрываем другие тултипы
        tooltip.classList.toggle("active"); // Тогглим текущий тултип
        button.classList.toggle("active"); // Добавляем класс active кнопке
      });
    }

    // Закрытие тултипов при клике вне
    document.addEventListener("click", (e) => {
      closeAllTooltips();
      button.classList.remove("active"); // Добавляем класс active кнопке
    });
  });

  // Функция для закрытия всех тултипов
  function closeAllTooltips() {
    const allTooltips = document.querySelectorAll(".tooltip");
    allTooltips.forEach((tooltip) => {
      tooltip.classList.remove("active");
    });
  }
}

// модальное окно
const modalOpenBtn = document.querySelectorAll(".mod-open-btn");
const modalCloseBtn = document.querySelectorAll(".mod-close-btn");
const modal = document.querySelectorAll(".modal");
const successModal = document.querySelector("#success-modal");
const errorModal = document.querySelector("#error-modal");

//open success modal
function openSuccessModal(title, text, btnText, isReview = false) {
  successModal.querySelector("h3").textContent = title
    ? title
    : "Заявка успешно отправлена";
  successModal.querySelector("p").textContent = text ? text : "";
  successModal.querySelector(".main-btn").textContent = btnText
    ? btnText
    : "Закрыть";

  if (isReview) {
    const icon = successModal.querySelector(".icon-success");
    icon.classList.remove("icon-success");
    icon.classList.add("icon-review");
  }

  let activeModal = document.querySelector(".modal.open");
  if (!activeModal) {
    disableScroll();
  }
  if (activeModal) {
    activeModal.classList.remove("open");
  }
  successModal.classList.add("open");
}

//open error modal
function openErrorModal(title, text, btnText) {
  errorModal.querySelector("h3").textContent = title
    ? title
    : "Что-то пошло не так";
  errorModal.querySelector("p").textContent = text ? text : "";
  errorModal.querySelector(".main-btn").textContent = btnText
    ? btnText
    : "Закрыть";

  let activeModal = document.querySelector(".modal.open");
  if (!activeModal) {
    disableScroll();
  }
  if (activeModal) {
    activeModal.classList.remove("open");
  }
  errorModal.classList.add("open");
}

//open modal
function openModal(modal) {
  let activeModal = document.querySelector(".modal.open");
  if (!activeModal) {
    disableScroll();
  }
  if (activeModal) {
    activeModal.classList.remove("open");
  }
  modal.classList.add("open");
}
//close modal
function closeModal(modal) {
  modal.classList.remove("open");

  const burgerMenu = document.querySelector(".mobile-menu");

  if (!burgerMenu.classList.contains("active")) {
    setTimeout(() => {
      enableScroll();
    }, animSpd);
  }
}
// modal click outside
modal.forEach((mod) => {
  mod.addEventListener("click", (e) => {
    if (
      !mod.querySelector(".modal__content").contains(e.target) ||
      mod.querySelector(".btn-close").contains(e.target)
    ) {
      closeModal(mod);
    }
  });
});
// modal button on click
modalOpenBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    let href = btn.getAttribute("data-modal");
    openModal(document.getElementById(href));
  });
});
// modal close button on click
modalCloseBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    let href = btn.getAttribute("data-modal");
    closeModal(document.getElementById(href));
  });
});

// mask input
const inp = document.querySelectorAll("input[type=tel]");
if (inp) {
  inp.forEach((item) => {
    Inputmask({ mask: "+7 999 999-99-99" }).mask(item);
  });
}

// intro swiper
const introSwiper = new Swiper(".intro-swiper", {
  loop: true,
  speed: 700,
  effect: "fade",
  autoplay: { delay: 8000, disableOnInteraction: false },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    // кастомная разметка пули: точка + svg-дуга прогресса
    renderBullet: (index, className) => `
      <span class="${className} bullet">
        <span class="dot"></span>
        <svg class="ring" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="progress" cx="12" cy="12" r="10"></circle>
        </svg>
      </span>
    `,
  },

  observer: true,
  observeParents: true,

  on: {
    init() {
      handleVideos(this);
      resetBulletProgress(this);
      startBulletRaf(this);
    },
    slideChangeTransitionStart() {
      handleVideos(this);
      resetBulletProgress(this);
      startBulletRaf(this);
    },
    autoplayTimeLeft(swiper, time, progress) {
      // progress 0→1; пишем в CSS-переменную активной пули
      const active = swiper.pagination?.el?.querySelector(
        ".swiper-pagination-bullet-active"
      );
      if (active)
        active.style.setProperty("--p", Math.max(0, Math.min(1, progress)));
    },
  },
});

function resetBulletProgress(swiper) {
  swiper.pagination?.bullets?.forEach((b) => b.style.setProperty("--p", 0));
  if (swiper._bulletRaf) cancelAnimationFrame(swiper._bulletRaf);
}

function startBulletRaf(swiper) {
  if (swiper._bulletRaf) cancelAnimationFrame(swiper._bulletRaf);
  const delay =
    (typeof swiper.params.autoplay === "object"
      ? swiper.params.autoplay.delay
      : swiper.params.autoplay) || 5000;
  const start = performance.now();

  const tick = (now) => {
    const p = Math.max(0, Math.min(1, (now - start) / delay));
    const active = swiper.pagination?.el?.querySelector(
      ".swiper-pagination-bullet-active"
    );
    if (active) active.style.setProperty("--p", p);
    swiper._bulletRaf = requestAnimationFrame(tick);
  };
  swiper._bulletRaf = requestAnimationFrame(tick);
}

function handleVideos(sw) {
  document.querySelectorAll(".intro__video").forEach((v) => {
    try {
      v.pause();
    } catch (_) {}
  });
  const active = sw.slides[sw.activeIndex];
  const vid = active && active.querySelector(".intro__video");
  if (!vid) return;
  const p = vid.play();
  if (p && typeof p.then === "function") p.catch(() => {});
}

//swhitch tab
function tabSwitch(nav, block) {
  nav.forEach((item, idx) => {
    item.addEventListener("click", () => {
      nav.forEach((el) => {
        el.classList.remove("active");
      });
      block.forEach((el) => {
        el.classList.remove("active");
      });
      item.classList.add("active");
      block[idx].classList.add("active");
      item.style.opacity = "0";
      block[idx].style.opacity = "0";
      setTimeout(() => {
        item.style.opacity = "1";
        block[idx].style.opacity = "1";
      }, 0);
    });
  });
}

//switch active tab/block
const switchBlock = document.querySelectorAll(".switch-block");
if (switchBlock) {
  switchBlock.forEach((item) => {
    tabSwitch(
      item.querySelectorAll("[data-nav]"),
      item.querySelectorAll("[data-block]")
    );
  });
}

// tabs scroll btn
const tabsScroll = document.querySelectorAll(".tabs-scroll");
function viewScroll() {
  tabsScroll.forEach((item) => {
    item.querySelector(".tabs").scrollWidth -
      item.querySelector(".tabs").clientWidth -
      item.querySelector(".tabs").scrollLeft >
    5
      ? item.classList.add("show-btn")
      : item.classList.remove("show-btn");
    item.querySelector(".tabs").addEventListener("scroll", () => {
      item.querySelector(".tabs").scrollWidth -
        item.querySelector(".tabs").clientWidth -
        item.querySelector(".tabs").scrollLeft >
      5
        ? item.classList.add("show-btn")
        : item.classList.remove("show-btn");
    });
  });
}
if (tabsScroll) {
  viewScroll(), window.addEventListener("resize", viewScroll);
}

// input search
const searchBlock = document.querySelector("#search-block");

if (searchBlock) {
  const searchInput = searchBlock.querySelector("#search-input");
  const searchEmpty = searchBlock.querySelector("#search-empty");

  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim()) {
      searchEmpty.classList.add("visible");
    } else {
      searchEmpty.classList.remove("visible");
    }
  });

  searchEmpty.addEventListener("click", () => {
    searchInput.value = "";
    searchEmpty.classList.remove("visible");
    searchInput.focus();
  });
}

// initMap();

async function initMap() {
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapMarker, YMapDefaultFeaturesLayer } =
    ymaps3;

  const map = new YMap(document.getElementById("map"), {
    location: {
      center: [37.69241140342709, 55.792086375807806],
      zoom: 16,
    },
  });

  map.addChild(new YMapDefaultSchemeLayer());
  map.addChild(new YMapDefaultFeaturesLayer());

  const markerElement = document.createElement("div");
  markerElement.className = "map-marker";

  const markerImage = document.createElement("img");
  markerImage.src = "img/marker.svg";
  markerImage.classList.add("map-icon");

  markerElement.appendChild(markerImage);

  const marker = new YMapMarker(
    {
      coordinates: [37.6939241693115, 55.79234629163217],
      draggable: false,
      mapFollowsOnDrag: true,
    },
    markerElement
  );

  map.addChild(marker);
}

// scroll more
const scrollBlock = document.getElementById("more-scroll");

if (scrollBlock) {
  const scrollBlockBody = document.getElementById("more-scroll-body");
  const buttonWrapper = scrollBlock.querySelector(".home-text__bottom");
  const button = buttonWrapper.querySelector(".nav-btn--next");

  if (scrollBlockBody && button) {
    button.addEventListener("click", function () {
      scrollBlockBody.style.transition = "height 0.5s ease-in-out";
      scrollBlockBody.style.height = scrollBlockBody.scrollHeight + "px";
      button.classList.add("rotate");
      buttonWrapper.style.display = "none";

      setTimeout(() => {
        scrollBlockBody.style.height = "auto";
      }, 500);
    });
  }
}

function initTabAnchors() {
  const modalLeft = document.querySelector(".modal-left__result");

  if (modalLeft) {
    const tabBtns = modalLeft.querySelectorAll("[data-nav]");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        console.log(btn);
        const targetId = event.target.getAttribute("data-nav");
        const targetElement = modalLeft.querySelector(targetId);

        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }
}

const animTexts = document.querySelectorAll(".animated-text");
if (animTexts.length) {
  animTexts.forEach((item) => {
    const text = item.innerHTML.split("<br>");
    item.innerHTML = "";

    text.forEach((line, i) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("line-wrapper");

      const span = document.createElement("span");
      span.classList.add("line");
      span.style.animationDelay = `${i * 0.3}s`;
      span.innerHTML = line.trim();

      wrapper.appendChild(span);
      item.appendChild(wrapper);
    });
  });
}

// LENIS SCROLL
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    smoothTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  // Используем requestAnimationFrame, чтобы избежать дерганья
  function raf(t) {
    lenis.raf(t);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  document.querySelectorAll(".scroll-scene").forEach((section) => {
    const title = section.querySelector(".title");
    const subtitle = section.querySelector(".subtitle");
    if (!title || !subtitle) return;

    // вспомогалки
    const insetPx = () =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--scene-inset"
        )
      ) || 16;

    // финальный X для заголовка: ставим левый край на inset
    const titleTargetX = () => {
      const ww = window.innerWidth; // ширина окна
      const w = title.getBoundingClientRect().width; // ширина заголовка при scale=1
      const s = 0.5; // target scale (0.5 — уменьшаем в два раза)
      const scaledWidth = w * s; // ширина заголовка после scale

      // Центр (ww/2) + x - (scaledWidth/2) = inset
      const x = insetPx() + scaledWidth / 2 - ww / 2;

      return x;
    };

    // стартовые состояния (центр задаёт wrapper .center)
    gsap.set(title, { x: 0, scale: 1, transformOrigin: "50% 50%" });
    gsap.set(subtitle, { x: () => window.innerWidth * 0.5, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=150%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true, // пересчитать функции при resize/refresh
      },
    });

    // Фаза 1: подзаголовок въезжает справа в центр
    tl.to(subtitle, { x: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, 0)
      // Фаза 2: заголовок уезжает влево до inset и масштабируется, чтобы влез
      .to(
        title,
        {
          x: titleTargetX, // функция — пересчёт при каждом refresh
          scale: 0.5,
          duration: 0.2,
          ease: "power2.inOut",
        },
        0
      );

    // на очень узких экранах можно чуть «смягчить» увод
    ScrollTrigger.matchMedia({
      "(max-width: 480px)": () => {
        tl.vars.end = "+=130%";
        ScrollTrigger.refresh();
      },
    });
  });

  // если шрифты грузятся позже — пересчитать размеры
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("resize", () => ScrollTrigger.refresh(), {
    passive: true,
  });

  // header color change on scroll
  const header = document.querySelector(".header");
  const intro = document.querySelector(".intro");
  if (header && intro) {
    ScrollTrigger.create({
      trigger: intro,
      start: "bottom top",
      onEnter: () => header.classList.add("white"),
      onLeaveBack: () => header.classList.remove("white"),
    });
  }
});
