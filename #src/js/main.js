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
  // const subscribeButton = document.querySelector(".header__subscribe"); // Находим кнопку подписки
  // const mobileLinks = document.querySelector(".header__links-mobile"); // Находим все мобильные ссылки
  const mobileMenu = document.querySelector(".mobile-menu"); // Находим мобильное меню
  const ham = document.querySelector(".ham"); // Находим иконку бургера

  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    ham.classList.toggle("active");

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

function initAcc() {
  // Аккордеон сервиса
  const serviceAccordion = document.querySelector(".service-accordion");
  if (serviceAccordion) {
    new Accordion(serviceAccordion, {
      onOpen: function (currentElement) {
        currentElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      },
    });
  }
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

const circleText = document.getElementById("circle-text");
if (circleText) {
  new CircleType(circleText);
}

// basic slider
const basicSliderBlocks = document.querySelectorAll(".basic-slider");
if (basicSliderBlocks.length > 0) {
  basicSliderBlocks.forEach((basicSliderBlock) => {
    let basicSlider = new Swiper(basicSliderBlock.querySelector(".swiper"), {
      slidesPerView: 1.15,
      spaceBetween: 10,
      observer: true,
      observeParents: true,
      watchSlidesProgress: true,
      navigation: {
        prevEl: basicSliderBlock.querySelector(".nav-btn--prev"),
        nextEl: basicSliderBlock.querySelector(".nav-btn--next"),
      },
      breakpoints: {
        991.98: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        767.98: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      },
      speed: 800,
    });
  });
}

// reasons slider
const reasonsSliderBlock = document.querySelector(".reasons-slider");
if (reasonsSliderBlock) {
  let basicSlider = new Swiper(reasonsSliderBlock.querySelector(".swiper"), {
    slidesPerView: 1.1,
    centeredSlides: true, // центрируем активный слайд
    // loop: true,          // делаем слайдер зацикленным
    effect: "coverflow",
    coverflowEffect: {
      rotate: 30,
      slideShadows: false,
      depth: 300,
      scale: 0.9,
    },
    spaceBetween: 0,
    observer: true,
    observeParents: true,
    watchSlidesProgress: true,
    navigation: {
      prevEl: reasonsSliderBlock.querySelector(".nav-btn--prev"),
      nextEl: reasonsSliderBlock.querySelector(".nav-btn--next"),
    },
    breakpoints: {
      575.98: {
        slidesPerView: 1,
      },
    },
    speed: 800,
  });
}

// simple slider
const simpleSliderBlock = document.querySelector(".simple-slider");
if (simpleSliderBlock) {
  let basicSlider = new Swiper(simpleSliderBlock.querySelector(".swiper"), {
    slidesPerView: 1.3,
    spaceBetween: 10,
    observer: true,
    observeParents: true,
    watchSlidesProgress: true,
    navigation: {
      prevEl: simpleSliderBlock.querySelector(".nav-btn--prev"),
      nextEl: simpleSliderBlock.querySelector(".nav-btn--next"),
    },
    breakpoints: {
      991.98: {
        // slidesPerView: 3,
        spaceBetween: 20,
      },
      767.98: {
        // slidesPerView: 2,
        // spaceBetween: 20,
      },
      // 575.98: {
      //   slidesPerView: 1
      // }
    },
    speed: 800,
  });
}

// basic slider 4
const basicSlider4Block = document.querySelector(".basic-slider-4");
if (basicSlider4Block) {
  let basicSlider = new Swiper(basicSlider4Block.querySelector(".swiper"), {
    slidesPerView: 1.2,
    spaceBetween: 10,
    observer: true,
    observeParents: true,
    watchSlidesProgress: true,
    navigation: {
      prevEl: basicSlider4Block.querySelector(".nav-btn--prev"),
      nextEl: basicSlider4Block.querySelector(".nav-btn--next"),
    },
    breakpoints: {
      991.98: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      767.98: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      575.98: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      380: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    },
    speed: 800,
  });
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

const rangeWrap = document.querySelector(".range-wrap");

if (rangeWrap) {
  rangeWrap.classList.remove("no-js");

  const range = document.querySelector(".range");
  const output = document.querySelector(".output");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
  };

  const onRangeInput = () => {
    const value = range.value;
    output.textContent = formatCurrency(value);

    const min = range.min;
    const max = range.max;
    const valuePercent = `${100 - ((max - value) / (max - min)) * 100}%`;
    range.style.backgroundSize = `${valuePercent} 100%`;
  };

  onRangeInput();
  range.addEventListener("input", onRangeInput);
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

initMap();

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

// calendar
// Функция, превращающая объект Date в строку формата YYYY-MM-DD
function dateToString(date) {
  const year = date.getFullYear();
  // Месяц и день приводим к двухзначному формату (01, 02, ... 12)
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * initCalendar - инициализирует AirDatepicker на переданном селекторе,
 * делая недоступными определенные даты.
 *
 * @param {string}   selector   Селектор поля ввода (например, '#datepicker')
 * @param {string[]} busyDates  Массив строк дат в формате 'YYYY-MM-DD'
 */
function initCalendar(selector, busyDates = []) {
  new AirDatepicker(selector, {
    onRenderCell({ date, cellType }) {
      if (cellType === "day") {
        const dateStr = dateToString(date);
        // Если дата содержится в списке "занятых" дат - добавляем класс
        if (busyDates.includes(dateStr)) {
          return {
            classes: "not-available",
          };
        }
      }
    },

    onSelect({ date }) {
      // Собираем нужный формат даты (например, YYYY-MM-DD)
      const dateStr = date ? dateToString(date) : "";

      // Записываем выбранную дату в data-value на самом div #datepicker
      document.querySelector(selector).dataset.value = dateStr;
    },
  });
}


function initTabAnchors() {
  const modalLeft = document.querySelector('.modal-left__result')

  if (modalLeft) {
    const tabBtns = modalLeft.querySelectorAll('[data-nav]')
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        console.log(btn);
        const targetId = event.target.getAttribute("data-nav");
        const targetElement = modalLeft.querySelector(targetId);
    
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      })
    })
  }
}