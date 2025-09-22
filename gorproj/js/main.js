let lenisInstance;
let isScrollDisabled = false;
let animSpd = 400; //переменная для скорости анимации

// LENIS SCROLL
document.addEventListener("DOMContentLoaded", () => {
  // Небольшая задержка для уверенности в полной загрузке страницы
  // setTimeout(() => {
  //   ScrollTrigger.refresh(); // Пересчитываем размеры всех элементов после загрузки
  // }, 500); // 500ms для того, чтобы дождаться полной загрузки

  gsap.registerPlugin(ScrollTrigger);

  lenisInstance = new Lenis({
    duration: 1,
    smoothWheel: true,
    smoothTouch: true,
  });

  lenisInstance.on("scroll", ScrollTrigger.update);

  // Используем requestAnimationFrame, чтобы избежать дерганья
  function raf(t) {
    lenisInstance.raf(t);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // очистить память скролла у ScrollTrigger
  ScrollTrigger.clearScrollMemory("manual");

  // если шрифты грузятся позже — пересчитать размеры
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("resize", () => ScrollTrigger.refresh(), {
    passive: true,
  });

  ScrollTrigger.matchMedia({
    // только десктоп
    "(min-width: 1200px)": function () {
      const sceneOffice = document.querySelector(".scene-office");
      if (sceneOffice) {
        const title = sceneOffice.querySelector(".center-title .title");
        const secondTitle = sceneOffice.querySelector(".address");
        const imgs = sceneOffice.querySelector(".scene-office__imgs");
        const secondImg = sceneOffice.querySelector(".scene-office__img-right");
        const officePreview = sceneOffice.querySelector(
          ".scene-office__preview"
        );
        const staffPreview = sceneOffice.querySelector(".scene-office__staff");
        const staffList = sceneOffice.querySelector(".staff");

        if (!title && !secondTitle) return;

        // вспомогалки
        const insetPx = () =>
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--scene-inset"
            )
          ) || 16;

        // финальный X для заголовка: ставим левый край на inset
        const titleTargetX = () => {
          const ww = window.innerWidth;
          const w = title.getBoundingClientRect().width;
          const s = 0.4;
          const scaledWidth = w * s;

          const x = insetPx() + scaledWidth / 2 - ww / 2;

          return x;
        };

        gsap.set(title, {
          x: 0,
          scale: 1,
          transformOrigin: "50% 50%",
        });
        gsap.set(secondTitle, {
          opacity: 0,
        });
        gsap.set(secondImg, { opacity: 0, xPercent: 100 });
        gsap.set(imgs, { display: "flex", overflow: "hidden" });
        gsap.set(officePreview, { xPercent: 0 });
        gsap.set(staffPreview, { xPercent: 150 });
        gsap.set(staffList, { x: () => staffList.offsetWidth });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneOffice,
            start: "top top",
            end: "+=600%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          imgs,
          {
            width: "50%",
            height: "100%",
            duration: 0.65,
            ease: "none",
          },
          0
        );

        tl.to(
          title,
          {
            x: titleTargetX,
            scale: 0.4,
            duration: 0.65,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0
        );

        tl.to(
          title,
          {
            opacity: 0,
            duration: 0.2,
            immediateRender: false,
          },
          0.3
        );

        tl.to(
          secondTitle,
          {
            opacity: 1,
            duration: 0.3,
            immediateRender: false,
          },
          0.5
        );

        tl.to(
          secondTitle,
          {
            opacity: 1,
            duration: 0.2,
            immediateRender: false,
          },
          0.5
        );

        tl.to(
          secondImg,
          {
            opacity: 1,
            duration: 0,
            immediateRender: false,
          },
          0.9
        );

        tl.to(
          secondImg,
          {
            xPercent: 0,
            duration: 0.6,
            immediateRender: false,
          },
          0.9
        );

        tl.to(
          officePreview,
          {
            xPercent: -100,
            duration: 1.4,
            immediateRender: false,
          },
          1.5
        );

        tl.to(
          staffPreview,
          {
            xPercent: 0,
            duration: 1.4,
            immediateRender: false,
          },
          1.5
        );

        // TODO: сделать чтобы список кончался у края окна
        tl.to(
          staffList,
          {
            x: () => {
              const ww = window.innerWidth; // ширина окна
              const blockWidth = staffList.offsetWidth; // ширина блока

              const blockLeft = staffList.getBoundingClientRect().left;
              const x = ww - blockWidth - blockLeft * 0.8;
              return -staffList.offsetWidth / 2.8;
            },
            duration: 5,
            immediateRender: false,
          },
          1.9
        );
      }

      document.querySelectorAll(".scene-sevices").forEach((section) => {
        const title = section.querySelector(".title");
        const subtitle = section.querySelector(".subtitle");
        const list = section.querySelector(".services-list");
        const overlay = section.querySelector(".do-overlay");
        if (!title || !subtitle || !list || !overlay) return;

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
          const s = 0.4; // target scale (0.5 — уменьшаем в два раза)
          const scaledWidth = w * s; // ширина заголовка после scale

          // Центр (ww/2) + x - (scaledWidth/2) = inset
          const x = insetPx() + scaledWidth / 2 - ww / 2;

          return x;
        };

        // стартовые состояния (центр задаёт wrapper .center)
        gsap.set(title, { x: 0, scale: 1, transformOrigin: "50% 50%" });
        gsap.set(subtitle, { x: () => window.innerWidth * 0.5, opacity: 0 });
        gsap.set(overlay, {
          opacity: 0,
          x: -overlay.offsetWidth * 2.3,
          yPercent: -50,
        });

        // список стартует чуть сбоку и ниже центра
        gsap.set(list, {
          // x: () => list.offsetWidth * 0.2, // вправо на 20% ширины самого списка
          x: 134,
          y: () => list.offsetHeight * 0.45, // вниз на половину его высоты
          opacity: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true, // пересчитать функции при resize/refresh
          },
        });

        // Фаза 1: подзаголовок въезжает справа → в центр
        tl.to(
          subtitle,
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            immediateRender: false,
          },
          0.1
        );

        // Фаза 2: заголовок уезжает влево до inset и масштабируется
        tl.to(
          title,
          {
            x: titleTargetX,
            scale: 0.4,
            duration: 0.4,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0
        );

        // Фаза 3: subtitle уезжает вверх/полупрозрачный
        tl.to(
          subtitle,
          {
            y: () => -subtitle.offsetHeight * 1.8,
            opacity: 0.4,
            duration: 0.3,
            ease: "power2.out",
          },
          0.8
        );

        // Фаза 4: список и overlay появляются
        tl.to(
          list,
          { opacity: 1, duration: 0.6, ease: "none", immediateRender: false },
          0.9
        );
        tl.to(
          overlay,
          {
            opacity: 1,
            duration: 0.6,
            ease: "power1.out",
            immediateRender: false,
          },
          0.9
        );

        tl.to(
          overlay,
          { y: () => list.offsetHeight * 0.288, duration: 2.0, ease: "none" },
          1.2
        );

        // Фаза 5: список едет вверх
        tl.to(
          list,
          { y: () => -list.offsetHeight * 0.15, duration: 2.0, ease: "none" },
          1.2
        );

        tl.to(
          subtitle,
          { y: () => -list.offsetHeight * 0.9, duration: 2.0, ease: "none" },
          1.2
        );

        // === Подсветка активного пункта по положению overlay ===
        const items = Array.from(list.querySelectorAll("li"));
        const inactive = "#9b9b9b"; // серый для остальных
        gsap.set(items, { color: inactive });

        function highlightClosest() {
          const o = overlay.getBoundingClientRect();
          const overlayCenterY = o.top + o.height / 2;

          let bestIdx = -1;
          let bestDist = Infinity;

          items.forEach((li, i) => {
            const r = li.getBoundingClientRect();
            const liCenterY = r.top + r.height / 2;
            const d = Math.abs(liCenterY - overlayCenterY);
            if (d < bestDist) {
              bestDist = d;
              bestIdx = i;
            }
          });

          items.forEach((li, i) => {
            gsap.to(li, {
              color: i === bestIdx ? "#000" : inactive,
              duration: 0.2,
              overwrite: "auto",
            });
          });
        }

        // дергаем подсветку во время анимации списка
        tl.eventCallback("onUpdate", highlightClosest);
        // и один раз сразу
        highlightClosest();
      });

      document.querySelectorAll(".scene-advantages").forEach((section) => {
        const title = section.querySelector(".center-title .title");
        const panel = section.querySelector(".advantages");
        if (!title || !panel) return;

        // стартовые: заголовок в центре, панель справа вне экрана
        gsap.set(panel, { x: () => window.innerWidth, autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 0) пауза с чистым заголовком (немного «подышать»)
        tl.to({}, { duration: 0.5 }); // короткий холд

        // 1) панель въезжает справа → в центр; заголовок мягко растворяется
        tl.to(
          panel,
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "<"
        ) // старт одновременно с фазой
          .to(
            title,
            {
              opacity: 0.0,
              duration: 0.1,
              ease: "power2.out",
            },
            "<"
          ); // почти одновременно, чуть позже
      });

      const scenePosts = document.querySelector(".scene-posts");
      if (scenePosts) {
        const title = scenePosts.querySelector(".center-title .title");
        const postsList = scenePosts.querySelector(".posts__list");
        const items = scenePosts.querySelectorAll(".posts-item");
        if (!title || !postsList || !items.length) return;

        const xStart = () => (window.innerWidth + postsList.scrollWidth) * 0.6;
        gsap.set(postsList, { x: () => xStart() }); // старт справа

        // финальная позиция: центр последнего элемента = центр списка (при x:0)
        const calcEndX = () => {
          const listW = postsList.scrollWidth;
          const listCenter = listW / 2;
          const last = items[items.length - 1];
          const lastCenter = last.offsetLeft + last.offsetWidth / 2; // в координатах списка
          return -(lastCenter - listCenter);
        };

        const tlPosts = gsap.timeline({
          scrollTrigger: {
            trigger: scenePosts,
            start: "top top",
            end: "+=220%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tlPosts
          .to(
            postsList,
            {
              x: calcEndX, // функция — пересчитается на refresh/resize
              duration: 0.65,
              ease: "none",
            },
            "<"
          )
          .to(
            title,
            {
              opacity: 0.0,
              duration: 0.1,
              ease: "power2.out",
            },
            0.2
          );
      }

      const sceneAbout = document.querySelector(".scene-about");
      if (sceneAbout) {
        const sceneInner = sceneAbout.querySelector(".scene-inner");
        if (!sceneInner) return;

        // Начинаем блок сверху (на 100% выше)
        gsap.set(sceneInner, { yPercent: -50 });

        gsap.utils.toArray(".scene-about__text p").forEach((p) => {
          ScrollTrigger.create({
            trigger: p,
            start: "center center",
            onEnter: () => {
              p.style.color = "#000000"; // перекрашиваем в черный
            },
            once: true, // срабатывает только один раз
          });
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sceneAbout,
              start: "top 80%",
              end: "bottom top",
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(sceneInner, {
            yPercent: 50, // плывем до исходного положения
            ease: "none",
          });
      }
    },

    "(min-width: 769px) and (max-width: 1199px)": function () {
      document.querySelectorAll(".scene-sevices").forEach((section) => {
        const title = section.querySelector(".title");
        const subtitle = section.querySelector(".subtitle");
        const list = section.querySelector(".services-list");
        const overlay = section.querySelector(".do-overlay");
        if (!title || !subtitle || !list || !overlay) return;

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
          const s = 0.4; // target scale (0.5 — уменьшаем в два раза)
          const scaledWidth = w * s; // ширина заголовка после scale

          // Центр (ww/2) + x - (scaledWidth/2) = inset
          const x = insetPx() + scaledWidth / 2 - ww / 2;

          return x;
        };

        // стартовые состояния (центр задаёт wrapper .center)
        gsap.set(title, { x: 0, scale: 1, transformOrigin: "50% 50%" });
        gsap.set(subtitle, { x: () => window.innerWidth * 0.5, opacity: 0 });
        gsap.set(overlay, {
          opacity: 0,
          x: -overlay.offsetWidth * 3,
          yPercent: -50,
        });

        // список стартует чуть сбоку и ниже центра
        gsap.set(list, {
          x: () => list.offsetWidth * 0.2, // вправо на 20% ширины самого списка
          y: () => list.offsetHeight * 0.45, // вниз на половину его высоты
          opacity: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=400%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true, // пересчитать функции при resize/refresh
          },
        });

        // Фаза 1: подзаголовок въезжает справа → в центр
        tl.fromTo(
          subtitle,
          { x: () => window.innerWidth * 0.5, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            immediateRender: false,
          },
          0.1
        );

        // Фаза 2: заголовок уезжает влево до inset и масштабируется
        tl.fromTo(
          title,
          { x: 0, scale: 1, transformOrigin: "50% 50%" },
          {
            x: titleTargetX,
            y: -list.offsetHeight * 1.1,
            scale: 0.4,
            duration: 0.4,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0
        );

        // Фаза 3: subtitle уезжает вверх/полупрозрачный
        tl.to(
          subtitle,
          {
            y: -list.offsetHeight * 1.1,
            opacity: 0.6,
            duration: 0.3,
            ease: "power2.out",
          },
          0.7
        );

        // Фаза 4: список и overlay появляются
        tl.fromTo(
          list,
          {
            y: () => list.offsetHeight * 0.45,
            opacity: 0,
          },
          { opacity: 1, duration: 0.6, ease: "none", immediateRender: false },
          0.9
        );
        tl.fromTo(
          overlay,
          { opacity: 0, x: () => -overlay.offsetWidth * 3, yPercent: -50 },
          {
            opacity: 1,
            duration: 0.6,
            ease: "power1.out",
            immediateRender: false,
          },
          0.9
        );

        // Фаза 5: список едет вверх
        tl.to(
          list,
          { y: () => -list.offsetHeight * 0.45, duration: 2.0, ease: "none" },
          1.2
        );

        // === Подсветка активного пункта по положению overlay ===
        const items = Array.from(list.querySelectorAll("li"));
        const inactive = "#9b9b9b"; // серый для остальных
        gsap.set(items, { color: inactive });

        function highlightClosest() {
          const o = overlay.getBoundingClientRect();
          const overlayCenterY = o.top + o.height / 2;

          let bestIdx = -1;
          let bestDist = Infinity;

          items.forEach((li, i) => {
            const r = li.getBoundingClientRect();
            const liCenterY = r.top + r.height / 2;
            const d = Math.abs(liCenterY - overlayCenterY);
            if (d < bestDist) {
              bestDist = d;
              bestIdx = i;
            }
          });

          items.forEach((li, i) => {
            gsap.to(li, {
              color: i === bestIdx ? "#000" : inactive,
              duration: 0.2,
              overwrite: "auto",
            });
          });
        }

        // дергаем подсветку во время анимации списка
        tl.eventCallback("onUpdate", highlightClosest);
        // и один раз сразу
        highlightClosest();

        // на очень узких экранах можно чуть «смягчить» увод
        ScrollTrigger.matchMedia({
          "(max-width: 480px)": () => {
            tl.vars.end = "+=130%";
            ScrollTrigger.refresh();
          },
        });
      });

      document.querySelectorAll(".scene-advantages").forEach((section) => {
        const title = section.querySelector(".center-title .title");
        const panel = section.querySelector(".advantages");
        if (!title || !panel) return;

        // стартовые: заголовок в центре, панель справа вне экрана
        gsap.set(panel, { x: () => window.innerWidth, autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 0) пауза с чистым заголовком (немного «подышать»)
        tl.to({}, { duration: 0.5 }); // короткий холд

        // 1) панель въезжает справа → в центр; заголовок мягко растворяется
        tl.to(
          panel,
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "<"
        ) // старт одновременно с фазой
          .to(
            title,
            {
              opacity: 0.0,
              duration: 0.1,
              ease: "power2.out",
            },
            "<"
          ); // почти одновременно, чуть позже
      });

      const scenePosts = document.querySelector(".scene-posts");
      if (scenePosts) {
        const title = scenePosts.querySelector(".center-title .title");
        const postsList = scenePosts.querySelector(".posts__list");
        const items = scenePosts.querySelectorAll(".posts-item");
        if (!title || !postsList || !items.length) return;

        const xStart = () => (window.innerWidth + postsList.scrollWidth) * 0.6;
        gsap.set(postsList, { x: () => xStart() }); // старт справа

        // финальная позиция: центр последнего элемента = центр списка (при x:0)
        const calcEndX = () => {
          const listW = postsList.scrollWidth;
          const listCenter = listW / 2;
          const last = items[items.length - 1];
          const lastCenter = last.offsetLeft + last.offsetWidth / 2; // в координатах списка
          return -(lastCenter - listCenter);
        };

        const tlPosts = gsap.timeline({
          scrollTrigger: {
            trigger: scenePosts,
            start: "top top",
            end: "+=220%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // один твинап: едем с xStart() до calcEndX()
        tlPosts.to(
          postsList,
          {
            x: calcEndX, // функция — пересчитается на refresh/resize
            duration: 0.65,
            ease: "none",
          },
          0
        );

        tlPosts.to(
          title,
          {
            opacity: 0,
            duration: 0.2,
            ease: "none",
          },
          0.2
        );
      }

      const sceneAbout = document.querySelector(".scene-about");
      if (sceneAbout) {
        const sceneInner = sceneAbout.querySelector(".scene-inner");
        if (!sceneInner) return;

        // Начинаем блок сверху (на 100% выше)
        gsap.set(sceneInner, { yPercent: -90 });

        gsap.utils.toArray(".scene-about__text p").forEach((p) => {
          ScrollTrigger.create({
            trigger: p,
            start: "center center",
            onEnter: () => {
              p.style.color = "#000000"; // перекрашиваем в черный
            },
            once: true, // срабатывает только один раз
          });
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sceneAbout,
              start: "top 80%",
              end: "bottom top",
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(sceneInner, {
            yPercent: 90, // плывем до исходного положения
            ease: "none",
          });
      }

      const sceneOffice = document.querySelector(".scene-office");
      if (sceneOffice) {
        const title = sceneOffice.querySelector(".center-title .title");
        const secondTitle = sceneOffice.querySelector(".address");
        const imgs = sceneOffice.querySelector(".scene-office__imgs");
        const secondImg = sceneOffice.querySelector(".scene-office__img-right");
        const officePreview = sceneOffice.querySelector(
          ".scene-office__preview"
        );
        const staffPreview = sceneOffice.querySelector(".scene-office__staff");
        const staffList = sceneOffice.querySelector(".staff");

        if (!title && !secondTitle) return;

        // вспомогалки
        const insetPx = () =>
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--scene-inset"
            )
          ) || 16;

        // финальный X для заголовка: ставим левый край на inset
        const titleTargetX = () => {
          const ww = window.innerWidth;
          const w = title.getBoundingClientRect().width;
          const s = 0.4;
          const scaledWidth = w * s;

          const x = insetPx() + scaledWidth / 2 - ww / 2;

          return x;
        };

        gsap.set(title, {
          x: 0,
          scale: 1,
          transformOrigin: "50% 50%",
        });
        gsap.set(secondTitle, {
          opacity: 0,
        });
        gsap.set(secondImg, { opacity: 0, xPercent: 100 });
        gsap.set(imgs, { display: "flex", overflow: "hidden" });
        gsap.set(officePreview, { xPercent: 0 });
        gsap.set(staffPreview, { xPercent: 150 });
        gsap.set(staffList, { x: () => staffList.offsetWidth });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneOffice,
            start: "top top",
            end: "+=350%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          imgs,
          {
            width: "50%",
            height: "100%",
            duration: 0.65,
            ease: "none",
          },
          0
        );

        tl.to(
          title,
          {
            x: titleTargetX,
            scale: 0.4,
            duration: 0.65,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0
        );

        tl.to(
          title,
          {
            opacity: 0,
            duration: 0.2,
            immediateRender: false,
          },
          0.3
        );

        tl.to(
          secondTitle,
          {
            opacity: 1,
            duration: 0.3,
            immediateRender: false,
          },
          0.5
        );

        tl.to(
          secondTitle,
          {
            opacity: 1,
            duration: 0.2,
            immediateRender: false,
          },
          0.5
        );

        tl.to(
          secondImg,
          {
            opacity: 1,
            duration: 0,
            immediateRender: false,
          },
          0.9
        );

        tl.to(
          secondImg,
          {
            xPercent: 0,
            duration: 0.6,
            immediateRender: false,
          },
          0.9
        );

        tl.to(
          officePreview,
          {
            xPercent: -100,
            duration: 1.4,
            immediateRender: false,
          },
          1.5
        );

        tl.to(
          staffPreview,
          {
            xPercent: 0,
            duration: 1.4,
            immediateRender: false,
          },
          1.5
        );

        tl.to(
          staffList,
          {
            x: () => {
              const ww = window.innerWidth; // ширина окна
              const blockWidth = staffList.offsetWidth; // ширина блока

              const blockLeft = staffList.getBoundingClientRect().left;
              const x = ww - blockWidth - blockLeft * 0.8;
              return -staffList.offsetWidth / 2.2;
            },
            duration: 5,
            immediateRender: false,
          },
          1.9
        );
      }
    },

    // мобильные/планшеты
    "(max-width: 768px)": function () {
      document.querySelectorAll(".scene-sevices").forEach((section) => {
        const title = section.querySelector(".title");
        const subtitle = section.querySelector(".subtitle");
        const list = section.querySelector(".services-list");
        const overlay = section.querySelector(".do-overlay");
        if (!title || !subtitle || !list || !overlay) return;

        // статичное положение заголовков
        gsap.set(title, { y: -220, opacity: 1 });
        gsap.set(subtitle, { y: -160, opacity: 1 });

        // список остаётся на месте
        gsap.set(list, { x: 0, y: 0, opacity: 1 });

        // overlay стартует слева от списка
        gsap.set(overlay, {
          opacity: 1,
          yPercent: -30,
          y: -90,
        });

        // таймлайн без pin, overlay двигается вниз вместе со скроллом
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: list,
            start: "top 80%",
            end: "bottom top",
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // overlay двигается сверху списка до низа списка
        tl.fromTo(
          overlay,
          { y: -30 },
          {
            y: () => list.scrollHeight - overlay.offsetHeight - 50,
            ease: "none",
          }
        );

        // === Подсветка активного пункта по положению overlay ===
        const items = Array.from(list.querySelectorAll("li"));
        const inactive = "#9b9b9b";
        gsap.set(items, { color: inactive });

        function highlightClosest() {
          const o = overlay.getBoundingClientRect();
          const overlayCenterY = o.top + o.height / 2;

          let bestIdx = -1;
          let bestDist = Infinity;

          items.forEach((li, i) => {
            const r = li.getBoundingClientRect();
            const liCenterY = r.top + r.height / 2;
            const d = Math.abs(liCenterY - overlayCenterY);
            if (d < bestDist) {
              bestDist = d;
              bestIdx = i;
            }
          });

          items.forEach((li, i) => {
            gsap.to(li, {
              color: i === bestIdx ? "#000" : inactive,
              duration: 0.2,
              overwrite: "auto",
            });
          });
        }

        tl.eventCallback("onUpdate", highlightClosest);
        highlightClosest();
      });

      const sceneAbout = document.querySelector(".scene-about");
      if (sceneAbout) {
        const sceneInner = sceneAbout.querySelector(".scene-inner");
        if (!sceneInner) return;

        gsap.utils.toArray(".scene-about__text p").forEach((p) => {
          ScrollTrigger.create({
            trigger: p,
            start: "center center",
            onEnter: () => {
              p.style.color = "#000000"; // перекрашиваем в черный
            },
            once: true, // срабатывает только один раз
          });
        });
      }
    },
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

  // footer animation
  const footer = document.querySelector(".footer");
  if (footer) {
    const links = footer.querySelectorAll(
      ".footer__link, .footer-body__link, .link"
    );

    gsap.set(links, { y: 30, opacity: 0 });

    gsap.to(links, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: { each: 0.1, from: "start" },
      scrollTrigger: {
        trigger: footer,
        start: "top 90%", // футер почти заходит
        toggleActions: "play none none reverse",
      },
    });
  }

  // footer logo animation
  const footerLogo = document.querySelector(".footer-logo");
  if (footerLogo) {
    const letters = footerLogo.querySelectorAll(".footer-logo__letter svg");
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // стартовое состояние
    gsap.set(letters, { yPercent: 110 });

    // таймлайн (пауза по умолчанию)
    const tlLogo = gsap.timeline({ paused: true }).to(letters, {
      yPercent: 2,
      duration: prefersReduced ? 0 : 2,
      ease: "power3.out",
      stagger: { each: 0.1, from: "start" },
    });

    // ScrollTrigger управляет запуском/сбросом
    ScrollTrigger.create({
      trigger: footerLogo,
      start: "top bottom", // блок вошёл в экран (снизу)
      end: "bottom top", // блок полностью вышел (сверху)
      onEnter: () => tlLogo.restart(),
      onEnterBack: () => tlLogo.restart(),
      onLeave: () => {
        tlLogo.pause(0);
        gsap.set(letters, { yPercent: 110 });
      },
      onLeaveBack: () => {
        tlLogo.pause(0);
        gsap.set(letters, { yPercent: 110 });
      },
      invalidateOnRefresh: true,
    });
  }

  // project animation
  const projectHatImgs = document.querySelectorAll(".project-hat__img");
  if (projectHatImgs.length > 0) {
    projectHatImgs.forEach((img) => {
      const wrapper = img.closest(".project-hat__inner");
      const scaleAmount = 1.1; // легкое увеличение
      const movePercent = 50; // смещение по Y

      // Создаем ScrollTrigger для параллакса
      const st = gsap.fromTo(
        img,
        { yPercent: 0, scale: 1 },
        {
          yPercent: movePercent,
          scale: scaleAmount,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      // Сразу синхронизируем при загрузке страницы
      window.addEventListener("load", () => {
        ScrollTrigger.refresh();
      });
    });
  }

  // Параллакс для слайдера
  const projectGalleries = document.querySelectorAll(
    ".project-swiper-parallax"
  );
  if (projectGalleries.length > 0) {
    projectGalleries.forEach((gallery) => {
      gsap.fromTo(
        gallery,
        { yPercent: 0 },
        {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: gallery,
            start: "top bottom", // когда верх галереи виден снизу
            end: "bottom top", // когда галерея полностью ушла вверх
            scrub: true, // плавная синхронизация с прокруткой
            invalidateOnRefresh: true,
          },
        }
      );
    });

    // пересчет ScrollTrigger после загрузки страницы
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });
  }

  // preloader
  const loader = document.querySelector(".loader");
  if (loader) {
    disableScroll();

    const svgs = gsap.utils.toArray(".loader__inner svg");

    // уважение reduce-motion
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // стартовые состояния
    gsap.set(svgs, { transformOrigin: "50% 50%", x: 0, y: 0 });

    const tl = gsap.timeline({
      repeat: 0,
      yoyo: true,
      defaults: { ease: "power2.inOut" },
    });

    if (!reduced) {
      // Фаза 1: движение элементов одновременно
      tl.to(
        svgs[0],
        {
          keyframes: [
            { x: 0, y: -53, duration: 0.6, ease: "power2.inOut" }, // для svgs[0]
          ],
        },
        0.2
      );

      tl.to(
        svgs[1],
        {
          keyframes: [
            { x: 0, y: 53, duration: 0.6, ease: "power2.inOut" }, // для svgs[1]
          ],
        },
        0.2
      );

      // Фаза 2: задержка на 1 секунду и затем движение элементов одновременно
      tl.to(
        svgs[0],
        {
          keyframes: [{ x: 105, y: -53, duration: 0.6, ease: "power2.inOut" }],
        },
        0.9
      );

      tl.to(
        svgs[1],
        {
          keyframes: [{ x: -107, y: 53, duration: 0.6, ease: "power2.inOut" }],
        },
        0.9
      );
    }

    // анимация скрытия лоадера с параллакс эффектом
    function hideLoader() {
      if (reduced) {
        loader.classList.add("hidden");
        return;
      }

      const tlHide = gsap.timeline({
        onComplete: () => {
          animateText();
          enableScroll();
          loader.classList.add("hidden");
        },
      });

      // Параллакс эффект при скрытии
      tlHide.to(loader, {
        y: "-100vh", // двигаем лоадер вверх
        duration: 1.5,
        ease: "power3.out",
      });

      // Элементы внутри лоадера двигаются с разной скоростью
      tlHide.to(svgs[0], { y: "80vh", duration: 1.5, ease: "power3.out" }, 0);
      tlHide.to(svgs[1], { y: "88vh", duration: 1.5, ease: "power3.out" }, 0);
    }

    window.onload = function () {
      setTimeout(hideLoader, 2000); // скрытие лоадера с задержкой 2000 мс
    };
  }

  // Анимация для текста
  function animateText() {
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

        item.style.visibility = "visible";
      });
    }
  }

  function disableScroll() {
    if (!lenisInstance || isScrollDisabled) return;
    isScrollDisabled = true;

    // останавливаем Lenis
    lenisInstance.stop();

    // блокируем wheel/touch/keyboard события
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventKeyScroll, { passive: false });

    // фиксируем body и padding-right
    const paddingValue =
      window.innerWidth > 350
        ? window.innerWidth - document.documentElement.clientWidth + "px"
        : 0;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = paddingValue;

    document.querySelectorAll(".fixed-block").forEach((block) => {
      block.style.paddingRight = paddingValue;
    });
  }

  function enableScroll() {
    if (!lenisInstance || !isScrollDisabled) return;
    isScrollDisabled = false;

    // запускаем Lenis
    lenisInstance.start();

    window.removeEventListener("wheel", preventDefault, { passive: false });
    window.removeEventListener("touchmove", preventDefault, { passive: false });
    window.removeEventListener("keydown", preventKeyScroll, { passive: false });

    document.body.style.overflow = "";
    document.body.style.paddingRight = "0px";

    document.querySelectorAll(".fixed-block").forEach((block) => {
      block.style.paddingRight = "0px";
    });
  }

  // ===== Burger, Advantages & Project Image Modal =====
  const burger = document.querySelector("#burger");
  const mobileMenu = document.getElementById("mobile-menu");
  const advModal = document.getElementById("advantages-modal");
  const projectImgModal = document.getElementById("project-img-modal");
  // const header = document.querySelector(".header");
  const ham = document.querySelector(".ham");
  const advItems = document.querySelectorAll(".advantages__item");
  const projectImgs = document.querySelectorAll(".project__slide");

  // вспомогалки
  const isOpen = (el) => !!el && el.classList.contains("active");
  const anyOpen = () =>
    isOpen(mobileMenu) || isOpen(advModal) || isOpen(projectImgModal);

  const lockScroll = () =>
    typeof disableScroll === "function" ? disableScroll() : null;
  const unlockScroll = () =>
    typeof enableScroll === "function" ? enableScroll() : null;

  function applyHeaderState(open) {
    burger?.classList.toggle("active", open);
    ham?.classList.toggle("active", open);
    header?.classList.toggle("burger-active", open);
    open ? lockScroll() : unlockScroll();
  }

  function closeAll() {
    mobileMenu?.classList.remove("active");
    advModal?.classList.remove("active");
    projectImgModal?.classList.remove("active");
    applyHeaderState(false);
  }

  function openMenu() {
    advModal?.classList.remove("active");
    projectImgModal?.classList.remove("active");
    mobileMenu?.classList.add("active");
    applyHeaderState(true);
  }

  function openAdv() {
    mobileMenu?.classList.remove("active");
    projectImgModal?.classList.remove("active");
    advModal?.classList.add("active");
    applyHeaderState(true);
  }

  function openProjectModal() {
    mobileMenu?.classList.remove("active");
    advModal?.classList.remove("active");
    projectImgModal?.classList.add("active");
    applyHeaderState(true);
  }

  // ===== События =====

  // Клик по бургеру
  if (burger) {
    burger.addEventListener("click", () => {
      if (isOpen(advModal) || isOpen(projectImgModal)) {
        closeAll();
        return;
      }
      isOpen(mobileMenu) ? closeAll() : openMenu();
    });
  }

  // Клик по элементам «Награды» (только <=768px)
  if (advItems.length && advModal) {
    advItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (window.matchMedia("(max-width: 768px)").matches) {
          e.preventDefault();
          openAdv();
        }
      });
    });
  }

  // Клик по проекту открывает модалку
  if (projectImgs.length && projectImgModal) {
    projectImgs.forEach((item) => {
      item.addEventListener("click", () => {
        openProjectModal();
      });
    });
  }

  // ESC закрывает всё
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && anyOpen()) closeAll();
  });

  // модальное окно
  const modalOpenBtn = document.querySelectorAll(".mod-open-btn");
  const modalCloseBtn = document.querySelectorAll(".mod-close-btn");
  const modal = document.querySelectorAll(".modal");
  const successModal = document.querySelector("#success-modal");
  const errorModal = document.querySelector("#error-modal");

  //open success modal
  window.openSuccessModal = function (title, btnText) {
    successModal.querySelector("h3").textContent = title
      ? title
      : "Ваша заявка успешно отправлена";
    successModal.querySelector(".main-btn").textContent = btnText
      ? btnText
      : "Закрыть";

    let activeModal = document.querySelector(".modal.open");
    if (!activeModal) {
      disableScroll();
    }
    if (activeModal) {
      activeModal.classList.remove("open");
    }
    successModal.classList.add("open");
  };

  //open error modal
  window.openErrorModal = function (title, btnText) {
    errorModal.querySelector("h3").textContent = title
      ? title
      : "Что-то пошло не так, попробуйте еще раз";
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
  };

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
      if (!mod.querySelector(".modal__content").contains(e.target)) {
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
});

function preventDefault(e) {
  e.preventDefault();
}

function preventKeyScroll(e) {
  // стрелки, пробел, PageUp/PageDown, Home/End
  const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
  if (keys.includes(e.keyCode)) e.preventDefault();
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

// project swiper
const projectSwipers = document.querySelectorAll(".swiper-container");
if (projectSwipers.length > 0) {
  projectSwipers.forEach((swiper) => {
    const swiperBody = swiper.querySelector(".project-swiper");

    const pagination = swiper.querySelector(".swiper-pagination");
    const prev = swiper.querySelector(".swiper-button-prev");
    const next = swiper.querySelector(".swiper-button-next");

    const projectSwiper = new Swiper(swiperBody, {
      loop: true,
      speed: 700,
      autoplay: { delay: 8000, disableOnInteraction: false },

      navigation: {
        nextEl: next,
        prevEl: prev,
      },

      pagination: {
        el: pagination,
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
  });
}

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

// switch tabs + (optional) blocks + (optional) images
function tabSwitch(nav, blocks, imgs) {
  nav.forEach((item, idx) => {
    item.addEventListener("click", () => {
      // снять active у навигации
      nav.forEach((el) => el.classList.remove("active"));
      // снять active у блоков
      blocks.forEach((el) => el.classList.remove("active"));
      // снять active у картинок (если есть)
      if (imgs && imgs.length)
        imgs.forEach((el) => el.classList.remove("active"));

      // активировать текущие
      item.classList.add("active");
      blocks[idx].classList.add("active");
      if (imgs && imgs.length) imgs[idx].classList.add("active");

      // лёгкий фейд (как у вас)
      item.style.opacity = "0";
      blocks[idx].style.opacity = "0";
      if (imgs && imgs.length) imgs[idx].style.opacity = "0";
      setTimeout(() => {
        item.style.opacity = "1";
        blocks[idx].style.opacity = "1";
        if (imgs && imgs.length) imgs[idx].style.opacity = "1";
      }, 50);
    });
  });
}

// инициализация
const switchBlocks = document.querySelectorAll(".switch-block");
if (switchBlocks.length) {
  switchBlocks.forEach((switchEl) => {
    const nav = switchEl.querySelectorAll("[data-nav]");
    const blocks = switchEl.querySelectorAll("[data-block]");

    // ищем контейнер с картинками рядом со switch-block
    // логика: берём общего родителя, у которого внутри есть и .switch-block, и .request__imgs
    let root = switchEl.parentElement;
    while (root && !root.querySelector(".request__imgs")) {
      root = root.parentElement;
    }
    const imgsContainer = root ? root.querySelector(".request__imgs") : null;
    // можно отбирать по [data-img], а если их нет — берём все .request__img
    const imgs = imgsContainer
      ? imgsContainer.querySelectorAll("[data-img]")?.length
        ? imgsContainer.querySelectorAll("[data-img]")
        : imgsContainer.querySelectorAll(".request__img")
      : null;

    // проставим стартовый active для картинок в соответствии с активным табом
    if (imgs && imgs.length) {
      const activeIdx = Array.from(nav).findIndex((n) =>
        n.classList.contains("active")
      );
      imgs.forEach((el) => el.classList.remove("active"));
      if (activeIdx >= 0 && imgs[activeIdx]) {
        imgs[activeIdx].classList.add("active");
      } else if (imgs[0]) {
        imgs[0].classList.add("active");
      }
    }

    tabSwitch(nav, blocks, imgs);
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

initMap();

async function initMap() {
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapMarker, YMapDefaultFeaturesLayer } =
    ymaps3;

  const map = new YMap(document.getElementById("map"), {
    location: {
      center: [44.014637, 56.325315],
      zoom: 16,
    },
  });

  map.addChild(
    new YMapDefaultSchemeLayer({
      customization: [
        {
          tags: "country",
          elements: "geometry.fill",
          stylers: [
            {
              color: "#8c8c8c",
            },
            {
              zoom: 0,
              opacity: 0.8,
            },
            {
              zoom: 1,
              opacity: 0.8,
            },
            {
              zoom: 2,
              opacity: 0.8,
            },
            {
              zoom: 3,
              opacity: 0.8,
            },
            {
              zoom: 4,
              opacity: 0.8,
            },
            {
              zoom: 5,
              opacity: 1,
            },
            {
              zoom: 6,
              opacity: 1,
            },
            {
              zoom: 7,
              opacity: 1,
            },
            {
              zoom: 8,
              opacity: 1,
            },
            {
              zoom: 9,
              opacity: 1,
            },
            {
              zoom: 10,
              opacity: 1,
            },
            {
              zoom: 11,
              opacity: 1,
            },
            {
              zoom: 12,
              opacity: 1,
            },
            {
              zoom: 13,
              opacity: 1,
            },
            {
              zoom: 14,
              opacity: 1,
            },
            {
              zoom: 15,
              opacity: 1,
            },
            {
              zoom: 16,
              opacity: 1,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: "country",
          elements: "geometry.outline",
          stylers: [
            {
              color: "#dedede",
            },
            {
              zoom: 0,
              opacity: 0.15,
            },
            {
              zoom: 1,
              opacity: 0.15,
            },
            {
              zoom: 2,
              opacity: 0.15,
            },
            {
              zoom: 3,
              opacity: 0.15,
            },
            {
              zoom: 4,
              opacity: 0.15,
            },
            {
              zoom: 5,
              opacity: 0.15,
            },
            {
              zoom: 6,
              opacity: 0.25,
            },
            {
              zoom: 7,
              opacity: 0.5,
            },
            {
              zoom: 8,
              opacity: 0.47,
            },
            {
              zoom: 9,
              opacity: 0.44,
            },
            {
              zoom: 10,
              opacity: 0.41,
            },
            {
              zoom: 11,
              opacity: 0.38,
            },
            {
              zoom: 12,
              opacity: 0.35,
            },
            {
              zoom: 13,
              opacity: 0.33,
            },
            {
              zoom: 14,
              opacity: 0.3,
            },
            {
              zoom: 15,
              opacity: 0.28,
            },
            {
              zoom: 16,
              opacity: 0.25,
            },
            {
              zoom: 17,
              opacity: 0.25,
            },
            {
              zoom: 18,
              opacity: 0.25,
            },
            {
              zoom: 19,
              opacity: 0.25,
            },
            {
              zoom: 20,
              opacity: 0.25,
            },
            {
              zoom: 21,
              opacity: 0.25,
            },
          ],
        },
        {
          tags: "region",
          elements: "geometry.fill",
          stylers: [
            {
              zoom: 0,
              color: "#a6a6a6",
              opacity: 0.5,
            },
            {
              zoom: 1,
              color: "#a6a6a6",
              opacity: 0.5,
            },
            {
              zoom: 2,
              color: "#a6a6a6",
              opacity: 0.5,
            },
            {
              zoom: 3,
              color: "#a6a6a6",
              opacity: 0.5,
            },
            {
              zoom: 4,
              color: "#a6a6a6",
              opacity: 0.5,
            },
            {
              zoom: 5,
              color: "#a6a6a6",
              opacity: 0.5,
            },
            {
              zoom: 6,
              color: "#a6a6a6",
              opacity: 1,
            },
            {
              zoom: 7,
              color: "#a6a6a6",
              opacity: 1,
            },
            {
              zoom: 8,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 9,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 10,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 11,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 12,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 13,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 14,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 15,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 16,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 17,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 18,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 19,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 20,
              color: "#8c8c8c",
              opacity: 1,
            },
            {
              zoom: 21,
              color: "#8c8c8c",
              opacity: 1,
            },
          ],
        },
        {
          tags: "region",
          elements: "geometry.outline",
          stylers: [
            {
              color: "#dedede",
            },
            {
              zoom: 0,
              opacity: 0.15,
            },
            {
              zoom: 1,
              opacity: 0.15,
            },
            {
              zoom: 2,
              opacity: 0.15,
            },
            {
              zoom: 3,
              opacity: 0.15,
            },
            {
              zoom: 4,
              opacity: 0.15,
            },
            {
              zoom: 5,
              opacity: 0.15,
            },
            {
              zoom: 6,
              opacity: 0.25,
            },
            {
              zoom: 7,
              opacity: 0.5,
            },
            {
              zoom: 8,
              opacity: 0.47,
            },
            {
              zoom: 9,
              opacity: 0.44,
            },
            {
              zoom: 10,
              opacity: 0.41,
            },
            {
              zoom: 11,
              opacity: 0.38,
            },
            {
              zoom: 12,
              opacity: 0.35,
            },
            {
              zoom: 13,
              opacity: 0.33,
            },
            {
              zoom: 14,
              opacity: 0.3,
            },
            {
              zoom: 15,
              opacity: 0.28,
            },
            {
              zoom: 16,
              opacity: 0.25,
            },
            {
              zoom: 17,
              opacity: 0.25,
            },
            {
              zoom: 18,
              opacity: 0.25,
            },
            {
              zoom: 19,
              opacity: 0.25,
            },
            {
              zoom: 20,
              opacity: 0.25,
            },
            {
              zoom: 21,
              opacity: 0.25,
            },
          ],
        },
        {
          tags: {
            any: "admin",
            none: ["country", "region", "locality", "district", "address"],
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#8c8c8c",
            },
            {
              zoom: 0,
              opacity: 0.5,
            },
            {
              zoom: 1,
              opacity: 0.5,
            },
            {
              zoom: 2,
              opacity: 0.5,
            },
            {
              zoom: 3,
              opacity: 0.5,
            },
            {
              zoom: 4,
              opacity: 0.5,
            },
            {
              zoom: 5,
              opacity: 0.5,
            },
            {
              zoom: 6,
              opacity: 1,
            },
            {
              zoom: 7,
              opacity: 1,
            },
            {
              zoom: 8,
              opacity: 1,
            },
            {
              zoom: 9,
              opacity: 1,
            },
            {
              zoom: 10,
              opacity: 1,
            },
            {
              zoom: 11,
              opacity: 1,
            },
            {
              zoom: 12,
              opacity: 1,
            },
            {
              zoom: 13,
              opacity: 1,
            },
            {
              zoom: 14,
              opacity: 1,
            },
            {
              zoom: 15,
              opacity: 1,
            },
            {
              zoom: 16,
              opacity: 1,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: {
            any: "admin",
            none: ["country", "region", "locality", "district", "address"],
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#dedede",
            },
            {
              zoom: 0,
              opacity: 0.15,
            },
            {
              zoom: 1,
              opacity: 0.15,
            },
            {
              zoom: 2,
              opacity: 0.15,
            },
            {
              zoom: 3,
              opacity: 0.15,
            },
            {
              zoom: 4,
              opacity: 0.15,
            },
            {
              zoom: 5,
              opacity: 0.15,
            },
            {
              zoom: 6,
              opacity: 0.25,
            },
            {
              zoom: 7,
              opacity: 0.5,
            },
            {
              zoom: 8,
              opacity: 0.47,
            },
            {
              zoom: 9,
              opacity: 0.44,
            },
            {
              zoom: 10,
              opacity: 0.41,
            },
            {
              zoom: 11,
              opacity: 0.38,
            },
            {
              zoom: 12,
              opacity: 0.35,
            },
            {
              zoom: 13,
              opacity: 0.33,
            },
            {
              zoom: 14,
              opacity: 0.3,
            },
            {
              zoom: 15,
              opacity: 0.28,
            },
            {
              zoom: 16,
              opacity: 0.25,
            },
            {
              zoom: 17,
              opacity: 0.25,
            },
            {
              zoom: 18,
              opacity: 0.25,
            },
            {
              zoom: 19,
              opacity: 0.25,
            },
            {
              zoom: 20,
              opacity: 0.25,
            },
            {
              zoom: 21,
              opacity: 0.25,
            },
          ],
        },
        {
          tags: {
            any: "landcover",
            none: "vegetation",
          },
          stylers: [
            {
              hue: "#c7cfd6",
            },
          ],
        },
        {
          tags: "vegetation",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#aab6c0",
              opacity: 0.1,
            },
            {
              zoom: 1,
              color: "#aab6c0",
              opacity: 0.1,
            },
            {
              zoom: 2,
              color: "#aab6c0",
              opacity: 0.1,
            },
            {
              zoom: 3,
              color: "#aab6c0",
              opacity: 0.1,
            },
            {
              zoom: 4,
              color: "#aab6c0",
              opacity: 0.1,
            },
            {
              zoom: 5,
              color: "#aab6c0",
              opacity: 0.1,
            },
            {
              zoom: 6,
              color: "#aab6c0",
              opacity: 0.2,
            },
            {
              zoom: 7,
              color: "#c7cfd6",
              opacity: 0.3,
            },
            {
              zoom: 8,
              color: "#c7cfd6",
              opacity: 0.4,
            },
            {
              zoom: 9,
              color: "#c7cfd6",
              opacity: 0.6,
            },
            {
              zoom: 10,
              color: "#c7cfd6",
              opacity: 0.8,
            },
            {
              zoom: 11,
              color: "#c7cfd6",
              opacity: 1,
            },
            {
              zoom: 12,
              color: "#c7cfd6",
              opacity: 1,
            },
            {
              zoom: 13,
              color: "#c7cfd6",
              opacity: 1,
            },
            {
              zoom: 14,
              color: "#cdd4da",
              opacity: 1,
            },
            {
              zoom: 15,
              color: "#d3d9df",
              opacity: 1,
            },
            {
              zoom: 16,
              color: "#d3d9df",
              opacity: 1,
            },
            {
              zoom: 17,
              color: "#d3d9df",
              opacity: 1,
            },
            {
              zoom: 18,
              color: "#d3d9df",
              opacity: 1,
            },
            {
              zoom: 19,
              color: "#d3d9df",
              opacity: 1,
            },
            {
              zoom: 20,
              color: "#d3d9df",
              opacity: 1,
            },
            {
              zoom: 21,
              color: "#d3d9df",
              opacity: 1,
            },
          ],
        },
        {
          tags: "park",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 1,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 2,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 3,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 4,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 5,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 6,
              color: "#c7cfd6",
              opacity: 0.2,
            },
            {
              zoom: 7,
              color: "#c7cfd6",
              opacity: 0.3,
            },
            {
              zoom: 8,
              color: "#c7cfd6",
              opacity: 0.4,
            },
            {
              zoom: 9,
              color: "#c7cfd6",
              opacity: 0.6,
            },
            {
              zoom: 10,
              color: "#c7cfd6",
              opacity: 0.8,
            },
            {
              zoom: 11,
              color: "#c7cfd6",
              opacity: 1,
            },
            {
              zoom: 12,
              color: "#c7cfd6",
              opacity: 1,
            },
            {
              zoom: 13,
              color: "#c7cfd6",
              opacity: 1,
            },
            {
              zoom: 14,
              color: "#cdd4da",
              opacity: 1,
            },
            {
              zoom: 15,
              color: "#d3d9df",
              opacity: 1,
            },
            {
              zoom: 16,
              color: "#d3d9df",
              opacity: 0.9,
            },
            {
              zoom: 17,
              color: "#d3d9df",
              opacity: 0.8,
            },
            {
              zoom: 18,
              color: "#d3d9df",
              opacity: 0.7,
            },
            {
              zoom: 19,
              color: "#d3d9df",
              opacity: 0.7,
            },
            {
              zoom: 20,
              color: "#d3d9df",
              opacity: 0.7,
            },
            {
              zoom: 21,
              color: "#d3d9df",
              opacity: 0.7,
            },
          ],
        },
        {
          tags: "national_park",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 1,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 2,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 3,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 4,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 5,
              color: "#c7cfd6",
              opacity: 0.1,
            },
            {
              zoom: 6,
              color: "#c7cfd6",
              opacity: 0.2,
            },
            {
              zoom: 7,
              color: "#c7cfd6",
              opacity: 0.3,
            },
            {
              zoom: 8,
              color: "#c7cfd6",
              opacity: 0.4,
            },
            {
              zoom: 9,
              color: "#c7cfd6",
              opacity: 0.6,
            },
            {
              zoom: 10,
              color: "#c7cfd6",
              opacity: 0.8,
            },
            {
              zoom: 11,
              color: "#c7cfd6",
              opacity: 1,
            },
            {
              zoom: 12,
              color: "#c7cfd6",
              opacity: 1,
            },
            {
              zoom: 13,
              color: "#c7cfd6",
              opacity: 1,
            },
            {
              zoom: 14,
              color: "#cdd4da",
              opacity: 1,
            },
            {
              zoom: 15,
              color: "#d3d9df",
              opacity: 1,
            },
            {
              zoom: 16,
              color: "#d3d9df",
              opacity: 0.7,
            },
            {
              zoom: 17,
              color: "#d3d9df",
              opacity: 0.7,
            },
            {
              zoom: 18,
              color: "#d3d9df",
              opacity: 0.7,
            },
            {
              zoom: 19,
              color: "#d3d9df",
              opacity: 0.7,
            },
            {
              zoom: 20,
              color: "#d3d9df",
              opacity: 0.7,
            },
            {
              zoom: 21,
              color: "#d3d9df",
              opacity: 0.7,
            },
          ],
        },
        {
          tags: "cemetery",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#c7cfd6",
            },
            {
              zoom: 1,
              color: "#c7cfd6",
            },
            {
              zoom: 2,
              color: "#c7cfd6",
            },
            {
              zoom: 3,
              color: "#c7cfd6",
            },
            {
              zoom: 4,
              color: "#c7cfd6",
            },
            {
              zoom: 5,
              color: "#c7cfd6",
            },
            {
              zoom: 6,
              color: "#c7cfd6",
            },
            {
              zoom: 7,
              color: "#c7cfd6",
            },
            {
              zoom: 8,
              color: "#c7cfd6",
            },
            {
              zoom: 9,
              color: "#c7cfd6",
            },
            {
              zoom: 10,
              color: "#c7cfd6",
            },
            {
              zoom: 11,
              color: "#c7cfd6",
            },
            {
              zoom: 12,
              color: "#c7cfd6",
            },
            {
              zoom: 13,
              color: "#c7cfd6",
            },
            {
              zoom: 14,
              color: "#cdd4da",
            },
            {
              zoom: 15,
              color: "#d3d9df",
            },
            {
              zoom: 16,
              color: "#d3d9df",
            },
            {
              zoom: 17,
              color: "#d3d9df",
            },
            {
              zoom: 18,
              color: "#d3d9df",
            },
            {
              zoom: 19,
              color: "#d3d9df",
            },
            {
              zoom: 20,
              color: "#d3d9df",
            },
            {
              zoom: 21,
              color: "#d3d9df",
            },
          ],
        },
        {
          tags: "sports_ground",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 1,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 2,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 3,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 4,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 5,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 6,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 7,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 8,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 9,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 10,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 11,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 12,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 13,
              color: "#b8c2cb",
              opacity: 0,
            },
            {
              zoom: 14,
              color: "#bec7cf",
              opacity: 0,
            },
            {
              zoom: 15,
              color: "#c4ccd4",
              opacity: 0.5,
            },
            {
              zoom: 16,
              color: "#c5cdd5",
              opacity: 1,
            },
            {
              zoom: 17,
              color: "#c6ced5",
              opacity: 1,
            },
            {
              zoom: 18,
              color: "#c7ced6",
              opacity: 1,
            },
            {
              zoom: 19,
              color: "#c8cfd7",
              opacity: 1,
            },
            {
              zoom: 20,
              color: "#c9d0d7",
              opacity: 1,
            },
            {
              zoom: 21,
              color: "#cad1d8",
              opacity: 1,
            },
          ],
        },
        {
          tags: "terrain",
          elements: "geometry",
          stylers: [
            {
              hue: "#e1e3e5",
            },
            {
              zoom: 0,
              opacity: 0.3,
            },
            {
              zoom: 1,
              opacity: 0.3,
            },
            {
              zoom: 2,
              opacity: 0.3,
            },
            {
              zoom: 3,
              opacity: 0.3,
            },
            {
              zoom: 4,
              opacity: 0.3,
            },
            {
              zoom: 5,
              opacity: 0.35,
            },
            {
              zoom: 6,
              opacity: 0.4,
            },
            {
              zoom: 7,
              opacity: 0.6,
            },
            {
              zoom: 8,
              opacity: 0.8,
            },
            {
              zoom: 9,
              opacity: 0.9,
            },
            {
              zoom: 10,
              opacity: 1,
            },
            {
              zoom: 11,
              opacity: 1,
            },
            {
              zoom: 12,
              opacity: 1,
            },
            {
              zoom: 13,
              opacity: 1,
            },
            {
              zoom: 14,
              opacity: 1,
            },
            {
              zoom: 15,
              opacity: 1,
            },
            {
              zoom: 16,
              opacity: 1,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: "geographic_line",
          elements: "geometry",
          stylers: [
            {
              color: "#747d86",
            },
          ],
        },
        {
          tags: "land",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#e1e3e4",
            },
            {
              zoom: 1,
              color: "#e1e3e4",
            },
            {
              zoom: 2,
              color: "#e1e3e4",
            },
            {
              zoom: 3,
              color: "#e1e3e4",
            },
            {
              zoom: 4,
              color: "#e1e3e4",
            },
            {
              zoom: 5,
              color: "#e4e5e6",
            },
            {
              zoom: 6,
              color: "#e6e8e9",
            },
            {
              zoom: 7,
              color: "#e9eaeb",
            },
            {
              zoom: 8,
              color: "#ecedee",
            },
            {
              zoom: 9,
              color: "#ecedee",
            },
            {
              zoom: 10,
              color: "#ecedee",
            },
            {
              zoom: 11,
              color: "#ecedee",
            },
            {
              zoom: 12,
              color: "#ecedee",
            },
            {
              zoom: 13,
              color: "#ecedee",
            },
            {
              zoom: 14,
              color: "#eeeff0",
            },
            {
              zoom: 15,
              color: "#f1f2f3",
            },
            {
              zoom: 16,
              color: "#f1f2f3",
            },
            {
              zoom: 17,
              color: "#f2f3f4",
            },
            {
              zoom: 18,
              color: "#f2f3f4",
            },
            {
              zoom: 19,
              color: "#f3f4f4",
            },
            {
              zoom: 20,
              color: "#f3f4f5",
            },
            {
              zoom: 21,
              color: "#f4f5f5",
            },
          ],
        },
        {
          tags: "residential",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 1,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 2,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 3,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 4,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 5,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 6,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 7,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 8,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 9,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 10,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 11,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 12,
              color: "#e1e3e5",
              opacity: 0.5,
            },
            {
              zoom: 13,
              color: "#e1e3e5",
              opacity: 1,
            },
            {
              zoom: 14,
              color: "#e6e8e9",
              opacity: 1,
            },
            {
              zoom: 15,
              color: "#ecedee",
              opacity: 1,
            },
            {
              zoom: 16,
              color: "#edeeef",
              opacity: 1,
            },
            {
              zoom: 17,
              color: "#eeeff0",
              opacity: 1,
            },
            {
              zoom: 18,
              color: "#eeeff0",
              opacity: 1,
            },
            {
              zoom: 19,
              color: "#eff0f1",
              opacity: 1,
            },
            {
              zoom: 20,
              color: "#f0f1f2",
              opacity: 1,
            },
            {
              zoom: 21,
              color: "#f1f2f3",
              opacity: 1,
            },
          ],
        },
        {
          tags: "locality",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#e1e3e5",
            },
            {
              zoom: 1,
              color: "#e1e3e5",
            },
            {
              zoom: 2,
              color: "#e1e3e5",
            },
            {
              zoom: 3,
              color: "#e1e3e5",
            },
            {
              zoom: 4,
              color: "#e1e3e5",
            },
            {
              zoom: 5,
              color: "#e1e3e5",
            },
            {
              zoom: 6,
              color: "#e1e3e5",
            },
            {
              zoom: 7,
              color: "#e1e3e5",
            },
            {
              zoom: 8,
              color: "#e1e3e5",
            },
            {
              zoom: 9,
              color: "#e1e3e5",
            },
            {
              zoom: 10,
              color: "#e1e3e5",
            },
            {
              zoom: 11,
              color: "#e1e3e5",
            },
            {
              zoom: 12,
              color: "#e1e3e5",
            },
            {
              zoom: 13,
              color: "#e1e3e5",
            },
            {
              zoom: 14,
              color: "#e6e8e9",
            },
            {
              zoom: 15,
              color: "#ecedee",
            },
            {
              zoom: 16,
              color: "#edeeef",
            },
            {
              zoom: 17,
              color: "#eeeff0",
            },
            {
              zoom: 18,
              color: "#eeeff0",
            },
            {
              zoom: 19,
              color: "#eff0f1",
            },
            {
              zoom: 20,
              color: "#f0f1f2",
            },
            {
              zoom: 21,
              color: "#f1f2f3",
            },
          ],
        },
        {
          tags: {
            any: "structure",
            none: ["building", "fence"],
          },
          elements: "geometry",
          stylers: [
            {
              opacity: 0.9,
            },
            {
              zoom: 0,
              color: "#e1e3e5",
            },
            {
              zoom: 1,
              color: "#e1e3e5",
            },
            {
              zoom: 2,
              color: "#e1e3e5",
            },
            {
              zoom: 3,
              color: "#e1e3e5",
            },
            {
              zoom: 4,
              color: "#e1e3e5",
            },
            {
              zoom: 5,
              color: "#e1e3e5",
            },
            {
              zoom: 6,
              color: "#e1e3e5",
            },
            {
              zoom: 7,
              color: "#e1e3e5",
            },
            {
              zoom: 8,
              color: "#e1e3e5",
            },
            {
              zoom: 9,
              color: "#e1e3e5",
            },
            {
              zoom: 10,
              color: "#e1e3e5",
            },
            {
              zoom: 11,
              color: "#e1e3e5",
            },
            {
              zoom: 12,
              color: "#e1e3e5",
            },
            {
              zoom: 13,
              color: "#e1e3e5",
            },
            {
              zoom: 14,
              color: "#e6e8e9",
            },
            {
              zoom: 15,
              color: "#ecedee",
            },
            {
              zoom: 16,
              color: "#edeeef",
            },
            {
              zoom: 17,
              color: "#eeeff0",
            },
            {
              zoom: 18,
              color: "#eeeff0",
            },
            {
              zoom: 19,
              color: "#eff0f1",
            },
            {
              zoom: 20,
              color: "#f0f1f2",
            },
            {
              zoom: 21,
              color: "#f1f2f3",
            },
          ],
        },
        {
          tags: "building",
          elements: "geometry.fill",
          stylers: [
            {
              color: "#dee0e3",
            },
            {
              zoom: 0,
              opacity: 0.7,
            },
            {
              zoom: 1,
              opacity: 0.7,
            },
            {
              zoom: 2,
              opacity: 0.7,
            },
            {
              zoom: 3,
              opacity: 0.7,
            },
            {
              zoom: 4,
              opacity: 0.7,
            },
            {
              zoom: 5,
              opacity: 0.7,
            },
            {
              zoom: 6,
              opacity: 0.7,
            },
            {
              zoom: 7,
              opacity: 0.7,
            },
            {
              zoom: 8,
              opacity: 0.7,
            },
            {
              zoom: 9,
              opacity: 0.7,
            },
            {
              zoom: 10,
              opacity: 0.7,
            },
            {
              zoom: 11,
              opacity: 0.7,
            },
            {
              zoom: 12,
              opacity: 0.7,
            },
            {
              zoom: 13,
              opacity: 0.7,
            },
            {
              zoom: 14,
              opacity: 0.7,
            },
            {
              zoom: 15,
              opacity: 0.7,
            },
            {
              zoom: 16,
              opacity: 0.9,
            },
            {
              zoom: 17,
              opacity: 0.6,
            },
            {
              zoom: 18,
              opacity: 0.6,
            },
            {
              zoom: 19,
              opacity: 0.6,
            },
            {
              zoom: 20,
              opacity: 0.6,
            },
            {
              zoom: 21,
              opacity: 0.6,
            },
          ],
        },
        {
          tags: "building",
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd1",
            },
            {
              zoom: 0,
              opacity: 0.5,
            },
            {
              zoom: 1,
              opacity: 0.5,
            },
            {
              zoom: 2,
              opacity: 0.5,
            },
            {
              zoom: 3,
              opacity: 0.5,
            },
            {
              zoom: 4,
              opacity: 0.5,
            },
            {
              zoom: 5,
              opacity: 0.5,
            },
            {
              zoom: 6,
              opacity: 0.5,
            },
            {
              zoom: 7,
              opacity: 0.5,
            },
            {
              zoom: 8,
              opacity: 0.5,
            },
            {
              zoom: 9,
              opacity: 0.5,
            },
            {
              zoom: 10,
              opacity: 0.5,
            },
            {
              zoom: 11,
              opacity: 0.5,
            },
            {
              zoom: 12,
              opacity: 0.5,
            },
            {
              zoom: 13,
              opacity: 0.5,
            },
            {
              zoom: 14,
              opacity: 0.5,
            },
            {
              zoom: 15,
              opacity: 0.5,
            },
            {
              zoom: 16,
              opacity: 0.5,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: {
            any: "urban_area",
            none: [
              "residential",
              "industrial",
              "cemetery",
              "park",
              "medical",
              "sports_ground",
              "beach",
              "construction_site",
            ],
          },
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 1,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 2,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 3,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 4,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 5,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 6,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 7,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 8,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 9,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 10,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 11,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 12,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 13,
              color: "#d6d9dc",
              opacity: 1,
            },
            {
              zoom: 14,
              color: "#dddfe2",
              opacity: 1,
            },
            {
              zoom: 15,
              color: "#e4e6e8",
              opacity: 1,
            },
            {
              zoom: 16,
              color: "#ebeced",
              opacity: 0.67,
            },
            {
              zoom: 17,
              color: "#f2f3f3",
              opacity: 0.33,
            },
            {
              zoom: 18,
              color: "#f2f3f3",
              opacity: 0,
            },
            {
              zoom: 19,
              color: "#f2f3f3",
              opacity: 0,
            },
            {
              zoom: 20,
              color: "#f2f3f3",
              opacity: 0,
            },
            {
              zoom: 21,
              color: "#f2f3f3",
              opacity: 0,
            },
          ],
        },
        {
          tags: "poi",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "poi",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "poi",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "outdoor",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "outdoor",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "outdoor",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "park",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "park",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "park",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "cemetery",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "cemetery",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "cemetery",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "beach",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "beach",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "beach",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "medical",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "medical",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "medical",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "shopping",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "shopping",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "shopping",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "commercial_services",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "commercial_services",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "commercial_services",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "food_and_drink",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "food_and_drink",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "food_and_drink",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "road",
          elements: "label.icon",
          types: "point",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
            {
              "tertiary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "road",
          elements: "label.text.fill",
          types: "point",
          stylers: [
            {
              color: "#ffffff",
            },
          ],
        },
        {
          tags: "entrance",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "locality",
          elements: "label.icon",
          stylers: [
            {
              color: "#9da6af",
            },
            {
              "secondary-color": "#ffffff",
            },
          ],
        },
        {
          tags: "country",
          elements: "label.text.fill",
          stylers: [
            {
              opacity: 0.8,
            },
            {
              color: "#8f969e",
            },
          ],
        },
        {
          tags: "country",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "region",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#8f969e",
            },
            {
              opacity: 0.8,
            },
          ],
        },
        {
          tags: "region",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "district",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#8f969e",
            },
            {
              opacity: 0.8,
            },
          ],
        },
        {
          tags: "district",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: {
            any: "admin",
            none: ["country", "region", "locality", "district", "address"],
          },
          elements: "label.text.fill",
          stylers: [
            {
              color: "#8f969e",
            },
          ],
        },
        {
          tags: {
            any: "admin",
            none: ["country", "region", "locality", "district", "address"],
          },
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "locality",
          elements: "label.text.fill",
          stylers: [
            {
              zoom: 0,
              color: "#778088",
            },
            {
              zoom: 1,
              color: "#778088",
            },
            {
              zoom: 2,
              color: "#778088",
            },
            {
              zoom: 3,
              color: "#778088",
            },
            {
              zoom: 4,
              color: "#778088",
            },
            {
              zoom: 5,
              color: "#757e86",
            },
            {
              zoom: 6,
              color: "#737c83",
            },
            {
              zoom: 7,
              color: "#717a81",
            },
            {
              zoom: 8,
              color: "#6f777f",
            },
            {
              zoom: 9,
              color: "#6d757c",
            },
            {
              zoom: 10,
              color: "#6b737a",
            },
            {
              zoom: 11,
              color: "#6b737a",
            },
            {
              zoom: 12,
              color: "#6b737a",
            },
            {
              zoom: 13,
              color: "#6b737a",
            },
            {
              zoom: 14,
              color: "#6b737a",
            },
            {
              zoom: 15,
              color: "#6b737a",
            },
            {
              zoom: 16,
              color: "#6b737a",
            },
            {
              zoom: 17,
              color: "#6b737a",
            },
            {
              zoom: 18,
              color: "#6b737a",
            },
            {
              zoom: 19,
              color: "#6b737a",
            },
            {
              zoom: 20,
              color: "#6b737a",
            },
            {
              zoom: 21,
              color: "#6b737a",
            },
          ],
        },
        {
          tags: "locality",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "road",
          elements: "label.text.fill",
          types: "polyline",
          stylers: [
            {
              color: "#778088",
            },
          ],
        },
        {
          tags: "road",
          elements: "label.text.outline",
          types: "polyline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "road",
          elements: "geometry.fill.pattern",
          types: "polyline",
          stylers: [
            {
              scale: 1,
            },
            {
              color: "#adb3b8",
            },
          ],
        },
        {
          tags: "road",
          elements: "label.text.fill",
          types: "point",
          stylers: [
            {
              color: "#ffffff",
            },
          ],
        },
        {
          tags: "structure",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#5f666d",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "structure",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "entrance",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#5f666d",
            },
            {
              opacity: 1,
            },
          ],
        },
        {
          tags: "entrance",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "address",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#5f666d",
            },
            {
              zoom: 0,
              opacity: 0.9,
            },
            {
              zoom: 1,
              opacity: 0.9,
            },
            {
              zoom: 2,
              opacity: 0.9,
            },
            {
              zoom: 3,
              opacity: 0.9,
            },
            {
              zoom: 4,
              opacity: 0.9,
            },
            {
              zoom: 5,
              opacity: 0.9,
            },
            {
              zoom: 6,
              opacity: 0.9,
            },
            {
              zoom: 7,
              opacity: 0.9,
            },
            {
              zoom: 8,
              opacity: 0.9,
            },
            {
              zoom: 9,
              opacity: 0.9,
            },
            {
              zoom: 10,
              opacity: 0.9,
            },
            {
              zoom: 11,
              opacity: 0.9,
            },
            {
              zoom: 12,
              opacity: 0.9,
            },
            {
              zoom: 13,
              opacity: 0.9,
            },
            {
              zoom: 14,
              opacity: 0.9,
            },
            {
              zoom: 15,
              opacity: 0.9,
            },
            {
              zoom: 16,
              opacity: 0.9,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: "address",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "landscape",
          elements: "label.text.fill",
          stylers: [
            {
              zoom: 0,
              color: "#8f969e",
              opacity: 1,
            },
            {
              zoom: 1,
              color: "#8f969e",
              opacity: 1,
            },
            {
              zoom: 2,
              color: "#8f969e",
              opacity: 1,
            },
            {
              zoom: 3,
              color: "#8f969e",
              opacity: 1,
            },
            {
              zoom: 4,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 5,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 6,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 7,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 8,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 9,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 10,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 11,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 12,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 13,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 14,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 15,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 16,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 17,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 18,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 19,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 20,
              color: "#5f666d",
              opacity: 0.5,
            },
            {
              zoom: 21,
              color: "#5f666d",
              opacity: 0.5,
            },
          ],
        },
        {
          tags: "landscape",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              opacity: 0.5,
            },
            {
              zoom: 1,
              opacity: 0.5,
            },
            {
              zoom: 2,
              opacity: 0.5,
            },
            {
              zoom: 3,
              opacity: 0.5,
            },
            {
              zoom: 4,
              opacity: 0,
            },
            {
              zoom: 5,
              opacity: 0,
            },
            {
              zoom: 6,
              opacity: 0,
            },
            {
              zoom: 7,
              opacity: 0,
            },
            {
              zoom: 8,
              opacity: 0,
            },
            {
              zoom: 9,
              opacity: 0,
            },
            {
              zoom: 10,
              opacity: 0,
            },
            {
              zoom: 11,
              opacity: 0,
            },
            {
              zoom: 12,
              opacity: 0,
            },
            {
              zoom: 13,
              opacity: 0,
            },
            {
              zoom: 14,
              opacity: 0,
            },
            {
              zoom: 15,
              opacity: 0,
            },
            {
              zoom: 16,
              opacity: 0,
            },
            {
              zoom: 17,
              opacity: 0,
            },
            {
              zoom: 18,
              opacity: 0,
            },
            {
              zoom: 19,
              opacity: 0,
            },
            {
              zoom: 20,
              opacity: 0,
            },
            {
              zoom: 21,
              opacity: 0,
            },
          ],
        },
        {
          tags: "water",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#5e6871",
            },
            {
              opacity: 0.8,
            },
          ],
        },
        {
          tags: "water",
          elements: "label.text.outline",
          types: "polyline",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              opacity: 0.2,
            },
          ],
        },
        {
          tags: {
            any: "road_1",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 3.3,
            },
            {
              zoom: 7,
              scale: 3.55,
            },
            {
              zoom: 8,
              scale: 3.92,
            },
            {
              zoom: 9,
              scale: 4.44,
            },
            {
              zoom: 10,
              scale: 4.01,
            },
            {
              zoom: 11,
              scale: 3.39,
            },
            {
              zoom: 12,
              scale: 2.94,
            },
            {
              zoom: 13,
              scale: 2.53,
            },
            {
              zoom: 14,
              scale: 2.26,
            },
            {
              zoom: 15,
              scale: 2.11,
            },
            {
              zoom: 16,
              scale: 2.07,
            },
            {
              zoom: 17,
              scale: 1.64,
            },
            {
              zoom: 18,
              scale: 1.35,
            },
            {
              zoom: 19,
              scale: 1.16,
            },
            {
              zoom: 20,
              scale: 1.05,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: {
            any: "road_1",
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 1,
            },
            {
              zoom: 1,
              scale: 1,
            },
            {
              zoom: 2,
              scale: 1,
            },
            {
              zoom: 3,
              scale: 1,
            },
            {
              zoom: 4,
              scale: 1,
            },
            {
              zoom: 5,
              scale: 1,
            },
            {
              zoom: 6,
              scale: 2.18,
            },
            {
              zoom: 7,
              scale: 2.18,
            },
            {
              zoom: 8,
              scale: 2.25,
            },
            {
              zoom: 9,
              scale: 2.4,
            },
            {
              zoom: 10,
              scale: 2.4,
            },
            {
              zoom: 11,
              scale: 2.26,
            },
            {
              zoom: 12,
              scale: 2.15,
            },
            {
              zoom: 13,
              scale: 2,
            },
            {
              zoom: 14,
              scale: 1.9,
            },
            {
              zoom: 15,
              scale: 1.86,
            },
            {
              zoom: 16,
              scale: 1.88,
            },
            {
              zoom: 17,
              scale: 1.53,
            },
            {
              zoom: 18,
              scale: 1.28,
            },
            {
              zoom: 19,
              scale: 1.11,
            },
            {
              zoom: 20,
              scale: 1.01,
            },
            {
              zoom: 21,
              scale: 0.96,
            },
          ],
        },
        {
          tags: {
            any: "road_2",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 3.3,
            },
            {
              zoom: 7,
              scale: 3.55,
            },
            {
              zoom: 8,
              scale: 3.92,
            },
            {
              zoom: 9,
              scale: 4.44,
            },
            {
              zoom: 10,
              scale: 4.01,
            },
            {
              zoom: 11,
              scale: 3.39,
            },
            {
              zoom: 12,
              scale: 2.94,
            },
            {
              zoom: 13,
              scale: 2.53,
            },
            {
              zoom: 14,
              scale: 2.26,
            },
            {
              zoom: 15,
              scale: 2.11,
            },
            {
              zoom: 16,
              scale: 2.07,
            },
            {
              zoom: 17,
              scale: 1.64,
            },
            {
              zoom: 18,
              scale: 1.35,
            },
            {
              zoom: 19,
              scale: 1.16,
            },
            {
              zoom: 20,
              scale: 1.05,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: {
            any: "road_2",
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 1,
            },
            {
              zoom: 1,
              scale: 1,
            },
            {
              zoom: 2,
              scale: 1,
            },
            {
              zoom: 3,
              scale: 1,
            },
            {
              zoom: 4,
              scale: 1,
            },
            {
              zoom: 5,
              scale: 1,
            },
            {
              zoom: 6,
              scale: 2.18,
            },
            {
              zoom: 7,
              scale: 2.18,
            },
            {
              zoom: 8,
              scale: 2.25,
            },
            {
              zoom: 9,
              scale: 2.4,
            },
            {
              zoom: 10,
              scale: 2.4,
            },
            {
              zoom: 11,
              scale: 2.26,
            },
            {
              zoom: 12,
              scale: 2.15,
            },
            {
              zoom: 13,
              scale: 2,
            },
            {
              zoom: 14,
              scale: 1.9,
            },
            {
              zoom: 15,
              scale: 1.86,
            },
            {
              zoom: 16,
              scale: 1.88,
            },
            {
              zoom: 17,
              scale: 1.53,
            },
            {
              zoom: 18,
              scale: 1.28,
            },
            {
              zoom: 19,
              scale: 1.11,
            },
            {
              zoom: 20,
              scale: 1.01,
            },
            {
              zoom: 21,
              scale: 0.96,
            },
          ],
        },
        {
          tags: {
            any: "road_3",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 0,
            },
            {
              zoom: 7,
              scale: 0,
            },
            {
              zoom: 8,
              scale: 0,
            },
            {
              zoom: 9,
              scale: 2.79,
            },
            {
              zoom: 10,
              scale: 2.91,
            },
            {
              zoom: 11,
              scale: 1.86,
            },
            {
              zoom: 12,
              scale: 1.86,
            },
            {
              zoom: 13,
              scale: 1.54,
            },
            {
              zoom: 14,
              scale: 1.32,
            },
            {
              zoom: 15,
              scale: 1.2,
            },
            {
              zoom: 16,
              scale: 1.15,
            },
            {
              zoom: 17,
              scale: 1.01,
            },
            {
              zoom: 18,
              scale: 0.93,
            },
            {
              zoom: 19,
              scale: 0.91,
            },
            {
              zoom: 20,
              scale: 0.93,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: {
            any: "road_3",
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 1.14,
            },
            {
              zoom: 1,
              scale: 1.14,
            },
            {
              zoom: 2,
              scale: 1.14,
            },
            {
              zoom: 3,
              scale: 1.14,
            },
            {
              zoom: 4,
              scale: 1.14,
            },
            {
              zoom: 5,
              scale: 1.14,
            },
            {
              zoom: 6,
              scale: 1.14,
            },
            {
              zoom: 7,
              scale: 1.14,
            },
            {
              zoom: 8,
              scale: 0.92,
            },
            {
              zoom: 9,
              scale: 3.01,
            },
            {
              zoom: 10,
              scale: 1.95,
            },
            {
              zoom: 11,
              scale: 1.46,
            },
            {
              zoom: 12,
              scale: 1.52,
            },
            {
              zoom: 13,
              scale: 1.35,
            },
            {
              zoom: 14,
              scale: 1.22,
            },
            {
              zoom: 15,
              scale: 1.14,
            },
            {
              zoom: 16,
              scale: 1.11,
            },
            {
              zoom: 17,
              scale: 0.98,
            },
            {
              zoom: 18,
              scale: 0.9,
            },
            {
              zoom: 19,
              scale: 0.88,
            },
            {
              zoom: 20,
              scale: 0.9,
            },
            {
              zoom: 21,
              scale: 0.96,
            },
          ],
        },
        {
          tags: {
            any: "road_4",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 0,
            },
            {
              zoom: 7,
              scale: 0,
            },
            {
              zoom: 8,
              scale: 0,
            },
            {
              zoom: 9,
              scale: 0,
            },
            {
              zoom: 10,
              scale: 1.88,
            },
            {
              zoom: 11,
              scale: 1.4,
            },
            {
              zoom: 12,
              scale: 1.57,
            },
            {
              zoom: 13,
              scale: 1.32,
            },
            {
              zoom: 14,
              scale: 1.16,
            },
            {
              zoom: 15,
              scale: 1.07,
            },
            {
              zoom: 16,
              scale: 1.28,
            },
            {
              zoom: 17,
              scale: 1.1,
            },
            {
              zoom: 18,
              scale: 0.99,
            },
            {
              zoom: 19,
              scale: 0.94,
            },
            {
              zoom: 20,
              scale: 0.95,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: {
            any: "road_4",
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 1,
            },
            {
              zoom: 1,
              scale: 1,
            },
            {
              zoom: 2,
              scale: 1,
            },
            {
              zoom: 3,
              scale: 1,
            },
            {
              zoom: 4,
              scale: 1,
            },
            {
              zoom: 5,
              scale: 1,
            },
            {
              zoom: 6,
              scale: 1,
            },
            {
              zoom: 7,
              scale: 1,
            },
            {
              zoom: 8,
              scale: 1,
            },
            {
              zoom: 9,
              scale: 0.8,
            },
            {
              zoom: 10,
              scale: 1.36,
            },
            {
              zoom: 11,
              scale: 1.15,
            },
            {
              zoom: 12,
              scale: 1.3,
            },
            {
              zoom: 13,
              scale: 1.17,
            },
            {
              zoom: 14,
              scale: 1.08,
            },
            {
              zoom: 15,
              scale: 1.03,
            },
            {
              zoom: 16,
              scale: 1.21,
            },
            {
              zoom: 17,
              scale: 1.05,
            },
            {
              zoom: 18,
              scale: 0.96,
            },
            {
              zoom: 19,
              scale: 0.91,
            },
            {
              zoom: 20,
              scale: 0.91,
            },
            {
              zoom: 21,
              scale: 0.96,
            },
          ],
        },
        {
          tags: {
            any: "road_5",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 0,
            },
            {
              zoom: 7,
              scale: 0,
            },
            {
              zoom: 8,
              scale: 0,
            },
            {
              zoom: 9,
              scale: 0,
            },
            {
              zoom: 10,
              scale: 0,
            },
            {
              zoom: 11,
              scale: 0,
            },
            {
              zoom: 12,
              scale: 1.39,
            },
            {
              zoom: 13,
              scale: 1.05,
            },
            {
              zoom: 14,
              scale: 0.9,
            },
            {
              zoom: 15,
              scale: 1.05,
            },
            {
              zoom: 16,
              scale: 1.22,
            },
            {
              zoom: 17,
              scale: 1.04,
            },
            {
              zoom: 18,
              scale: 0.94,
            },
            {
              zoom: 19,
              scale: 0.91,
            },
            {
              zoom: 20,
              scale: 0.93,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: {
            any: "road_5",
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 1,
            },
            {
              zoom: 1,
              scale: 1,
            },
            {
              zoom: 2,
              scale: 1,
            },
            {
              zoom: 3,
              scale: 1,
            },
            {
              zoom: 4,
              scale: 1,
            },
            {
              zoom: 5,
              scale: 1,
            },
            {
              zoom: 6,
              scale: 1,
            },
            {
              zoom: 7,
              scale: 1,
            },
            {
              zoom: 8,
              scale: 1,
            },
            {
              zoom: 9,
              scale: 1,
            },
            {
              zoom: 10,
              scale: 1,
            },
            {
              zoom: 11,
              scale: 0.44,
            },
            {
              zoom: 12,
              scale: 1.15,
            },
            {
              zoom: 13,
              scale: 0.97,
            },
            {
              zoom: 14,
              scale: 0.87,
            },
            {
              zoom: 15,
              scale: 1.01,
            },
            {
              zoom: 16,
              scale: 1.16,
            },
            {
              zoom: 17,
              scale: 1,
            },
            {
              zoom: 18,
              scale: 0.91,
            },
            {
              zoom: 19,
              scale: 0.88,
            },
            {
              zoom: 20,
              scale: 0.89,
            },
            {
              zoom: 21,
              scale: 0.96,
            },
          ],
        },
        {
          tags: {
            any: "road_6",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 0,
            },
            {
              zoom: 7,
              scale: 0,
            },
            {
              zoom: 8,
              scale: 0,
            },
            {
              zoom: 9,
              scale: 0,
            },
            {
              zoom: 10,
              scale: 0,
            },
            {
              zoom: 11,
              scale: 0,
            },
            {
              zoom: 12,
              scale: 0,
            },
            {
              zoom: 13,
              scale: 2.5,
            },
            {
              zoom: 14,
              scale: 1.41,
            },
            {
              zoom: 15,
              scale: 1.39,
            },
            {
              zoom: 16,
              scale: 1.45,
            },
            {
              zoom: 17,
              scale: 1.16,
            },
            {
              zoom: 18,
              scale: 1,
            },
            {
              zoom: 19,
              scale: 0.94,
            },
            {
              zoom: 20,
              scale: 0.94,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: {
            any: "road_6",
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 1,
            },
            {
              zoom: 1,
              scale: 1,
            },
            {
              zoom: 2,
              scale: 1,
            },
            {
              zoom: 3,
              scale: 1,
            },
            {
              zoom: 4,
              scale: 1,
            },
            {
              zoom: 5,
              scale: 1,
            },
            {
              zoom: 6,
              scale: 1,
            },
            {
              zoom: 7,
              scale: 1,
            },
            {
              zoom: 8,
              scale: 1,
            },
            {
              zoom: 9,
              scale: 1,
            },
            {
              zoom: 10,
              scale: 1,
            },
            {
              zoom: 11,
              scale: 1,
            },
            {
              zoom: 12,
              scale: 1,
            },
            {
              zoom: 13,
              scale: 1.65,
            },
            {
              zoom: 14,
              scale: 1.21,
            },
            {
              zoom: 15,
              scale: 1.26,
            },
            {
              zoom: 16,
              scale: 1.35,
            },
            {
              zoom: 17,
              scale: 1.1,
            },
            {
              zoom: 18,
              scale: 0.97,
            },
            {
              zoom: 19,
              scale: 0.91,
            },
            {
              zoom: 20,
              scale: 0.91,
            },
            {
              zoom: 21,
              scale: 0.96,
            },
          ],
        },
        {
          tags: {
            any: "road_7",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 0,
            },
            {
              zoom: 7,
              scale: 0,
            },
            {
              zoom: 8,
              scale: 0,
            },
            {
              zoom: 9,
              scale: 0,
            },
            {
              zoom: 10,
              scale: 0,
            },
            {
              zoom: 11,
              scale: 0,
            },
            {
              zoom: 12,
              scale: 0,
            },
            {
              zoom: 13,
              scale: 0,
            },
            {
              zoom: 14,
              scale: 1,
            },
            {
              zoom: 15,
              scale: 0.87,
            },
            {
              zoom: 16,
              scale: 0.97,
            },
            {
              zoom: 17,
              scale: 0.89,
            },
            {
              zoom: 18,
              scale: 0.86,
            },
            {
              zoom: 19,
              scale: 0.88,
            },
            {
              zoom: 20,
              scale: 0.92,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: {
            any: "road_7",
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 1,
            },
            {
              zoom: 1,
              scale: 1,
            },
            {
              zoom: 2,
              scale: 1,
            },
            {
              zoom: 3,
              scale: 1,
            },
            {
              zoom: 4,
              scale: 1,
            },
            {
              zoom: 5,
              scale: 1,
            },
            {
              zoom: 6,
              scale: 1,
            },
            {
              zoom: 7,
              scale: 1,
            },
            {
              zoom: 8,
              scale: 1,
            },
            {
              zoom: 9,
              scale: 1,
            },
            {
              zoom: 10,
              scale: 1,
            },
            {
              zoom: 11,
              scale: 1,
            },
            {
              zoom: 12,
              scale: 1,
            },
            {
              zoom: 13,
              scale: 1,
            },
            {
              zoom: 14,
              scale: 0.93,
            },
            {
              zoom: 15,
              scale: 0.85,
            },
            {
              zoom: 16,
              scale: 0.94,
            },
            {
              zoom: 17,
              scale: 0.86,
            },
            {
              zoom: 18,
              scale: 0.83,
            },
            {
              zoom: 19,
              scale: 0.84,
            },
            {
              zoom: 20,
              scale: 0.88,
            },
            {
              zoom: 21,
              scale: 0.95,
            },
          ],
        },
        {
          tags: {
            any: "road_minor",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 0,
            },
            {
              zoom: 7,
              scale: 0,
            },
            {
              zoom: 8,
              scale: 0,
            },
            {
              zoom: 9,
              scale: 0,
            },
            {
              zoom: 10,
              scale: 0,
            },
            {
              zoom: 11,
              scale: 0,
            },
            {
              zoom: 12,
              scale: 0,
            },
            {
              zoom: 13,
              scale: 0,
            },
            {
              zoom: 14,
              scale: 0,
            },
            {
              zoom: 15,
              scale: 0,
            },
            {
              zoom: 16,
              scale: 1,
            },
            {
              zoom: 17,
              scale: 1,
            },
            {
              zoom: 18,
              scale: 1,
            },
            {
              zoom: 19,
              scale: 1,
            },
            {
              zoom: 20,
              scale: 1,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: {
            any: "road_minor",
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 0.29,
            },
            {
              zoom: 1,
              scale: 0.29,
            },
            {
              zoom: 2,
              scale: 0.29,
            },
            {
              zoom: 3,
              scale: 0.29,
            },
            {
              zoom: 4,
              scale: 0.29,
            },
            {
              zoom: 5,
              scale: 0.29,
            },
            {
              zoom: 6,
              scale: 0.29,
            },
            {
              zoom: 7,
              scale: 0.29,
            },
            {
              zoom: 8,
              scale: 0.29,
            },
            {
              zoom: 9,
              scale: 0.29,
            },
            {
              zoom: 10,
              scale: 0.29,
            },
            {
              zoom: 11,
              scale: 0.29,
            },
            {
              zoom: 12,
              scale: 0.29,
            },
            {
              zoom: 13,
              scale: 0.29,
            },
            {
              zoom: 14,
              scale: 0.29,
            },
            {
              zoom: 15,
              scale: 0.29,
            },
            {
              zoom: 16,
              scale: 1,
            },
            {
              zoom: 17,
              scale: 0.9,
            },
            {
              zoom: 18,
              scale: 0.91,
            },
            {
              zoom: 19,
              scale: 0.92,
            },
            {
              zoom: 20,
              scale: 0.93,
            },
            {
              zoom: 21,
              scale: 0.95,
            },
          ],
        },
        {
          tags: {
            any: "road_unclassified",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 0,
            },
            {
              zoom: 7,
              scale: 0,
            },
            {
              zoom: 8,
              scale: 0,
            },
            {
              zoom: 9,
              scale: 0,
            },
            {
              zoom: 10,
              scale: 0,
            },
            {
              zoom: 11,
              scale: 0,
            },
            {
              zoom: 12,
              scale: 0,
            },
            {
              zoom: 13,
              scale: 0,
            },
            {
              zoom: 14,
              scale: 0,
            },
            {
              zoom: 15,
              scale: 0,
            },
            {
              zoom: 16,
              scale: 1,
            },
            {
              zoom: 17,
              scale: 1,
            },
            {
              zoom: 18,
              scale: 1,
            },
            {
              zoom: 19,
              scale: 1,
            },
            {
              zoom: 20,
              scale: 1,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: {
            any: "road_unclassified",
          },
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 0.29,
            },
            {
              zoom: 1,
              scale: 0.29,
            },
            {
              zoom: 2,
              scale: 0.29,
            },
            {
              zoom: 3,
              scale: 0.29,
            },
            {
              zoom: 4,
              scale: 0.29,
            },
            {
              zoom: 5,
              scale: 0.29,
            },
            {
              zoom: 6,
              scale: 0.29,
            },
            {
              zoom: 7,
              scale: 0.29,
            },
            {
              zoom: 8,
              scale: 0.29,
            },
            {
              zoom: 9,
              scale: 0.29,
            },
            {
              zoom: 10,
              scale: 0.29,
            },
            {
              zoom: 11,
              scale: 0.29,
            },
            {
              zoom: 12,
              scale: 0.29,
            },
            {
              zoom: 13,
              scale: 0.29,
            },
            {
              zoom: 14,
              scale: 0.29,
            },
            {
              zoom: 15,
              scale: 0.29,
            },
            {
              zoom: 16,
              scale: 1,
            },
            {
              zoom: 17,
              scale: 0.9,
            },
            {
              zoom: 18,
              scale: 0.91,
            },
            {
              zoom: 19,
              scale: 0.92,
            },
            {
              zoom: 20,
              scale: 0.93,
            },
            {
              zoom: 21,
              scale: 0.95,
            },
          ],
        },
        {
          tags: {
            all: "is_tunnel",
            none: "path",
          },
          elements: "geometry.fill",
          stylers: [
            {
              zoom: 0,
              color: "#dcdee0",
            },
            {
              zoom: 1,
              color: "#dcdee0",
            },
            {
              zoom: 2,
              color: "#dcdee0",
            },
            {
              zoom: 3,
              color: "#dcdee0",
            },
            {
              zoom: 4,
              color: "#dcdee0",
            },
            {
              zoom: 5,
              color: "#dcdee0",
            },
            {
              zoom: 6,
              color: "#dcdee0",
            },
            {
              zoom: 7,
              color: "#dcdee0",
            },
            {
              zoom: 8,
              color: "#dcdee0",
            },
            {
              zoom: 9,
              color: "#dcdee0",
            },
            {
              zoom: 10,
              color: "#dcdee0",
            },
            {
              zoom: 11,
              color: "#dcdee0",
            },
            {
              zoom: 12,
              color: "#dcdee0",
            },
            {
              zoom: 13,
              color: "#dcdee0",
            },
            {
              zoom: 14,
              color: "#e1e3e5",
            },
            {
              zoom: 15,
              color: "#e6e8ea",
            },
            {
              zoom: 16,
              color: "#e7e9eb",
            },
            {
              zoom: 17,
              color: "#e8eaeb",
            },
            {
              zoom: 18,
              color: "#e9eaec",
            },
            {
              zoom: 19,
              color: "#eaebed",
            },
            {
              zoom: 20,
              color: "#ebeced",
            },
            {
              zoom: 21,
              color: "#ecedee",
            },
          ],
        },
        {
          tags: {
            all: "path",
            none: "is_tunnel",
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#c8ccd0",
            },
          ],
        },
        {
          tags: {
            all: "path",
            none: "is_tunnel",
          },
          elements: "geometry.outline",
          stylers: [
            {
              opacity: 0.7,
            },
            {
              zoom: 0,
              color: "#e1e3e5",
            },
            {
              zoom: 1,
              color: "#e1e3e5",
            },
            {
              zoom: 2,
              color: "#e1e3e5",
            },
            {
              zoom: 3,
              color: "#e1e3e5",
            },
            {
              zoom: 4,
              color: "#e1e3e5",
            },
            {
              zoom: 5,
              color: "#e1e3e5",
            },
            {
              zoom: 6,
              color: "#e1e3e5",
            },
            {
              zoom: 7,
              color: "#e1e3e5",
            },
            {
              zoom: 8,
              color: "#e1e3e5",
            },
            {
              zoom: 9,
              color: "#e1e3e5",
            },
            {
              zoom: 10,
              color: "#e1e3e5",
            },
            {
              zoom: 11,
              color: "#e1e3e5",
            },
            {
              zoom: 12,
              color: "#e1e3e5",
            },
            {
              zoom: 13,
              color: "#e1e3e5",
            },
            {
              zoom: 14,
              color: "#e6e8e9",
            },
            {
              zoom: 15,
              color: "#ecedee",
            },
            {
              zoom: 16,
              color: "#edeeef",
            },
            {
              zoom: 17,
              color: "#eeeff0",
            },
            {
              zoom: 18,
              color: "#eeeff0",
            },
            {
              zoom: 19,
              color: "#eff0f1",
            },
            {
              zoom: 20,
              color: "#f0f1f2",
            },
            {
              zoom: 21,
              color: "#f1f2f3",
            },
          ],
        },
        {
          tags: "road_construction",
          elements: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
          ],
        },
        {
          tags: "road_construction",
          elements: "geometry.outline",
          stylers: [
            {
              zoom: 0,
              color: "#e4e6e8",
            },
            {
              zoom: 1,
              color: "#e4e6e8",
            },
            {
              zoom: 2,
              color: "#e4e6e8",
            },
            {
              zoom: 3,
              color: "#e4e6e8",
            },
            {
              zoom: 4,
              color: "#e4e6e8",
            },
            {
              zoom: 5,
              color: "#e4e6e8",
            },
            {
              zoom: 6,
              color: "#e4e6e8",
            },
            {
              zoom: 7,
              color: "#e4e6e8",
            },
            {
              zoom: 8,
              color: "#e4e6e8",
            },
            {
              zoom: 9,
              color: "#e4e6e8",
            },
            {
              zoom: 10,
              color: "#e4e6e8",
            },
            {
              zoom: 11,
              color: "#e4e6e8",
            },
            {
              zoom: 12,
              color: "#e4e6e8",
            },
            {
              zoom: 13,
              color: "#e4e6e8",
            },
            {
              zoom: 14,
              color: "#c8ccd0",
            },
            {
              zoom: 15,
              color: "#e4e6e8",
            },
            {
              zoom: 16,
              color: "#e8eaec",
            },
            {
              zoom: 17,
              color: "#edeef0",
            },
            {
              zoom: 18,
              color: "#f1f2f3",
            },
            {
              zoom: 19,
              color: "#f6f7f7",
            },
            {
              zoom: 20,
              color: "#fafbfb",
            },
            {
              zoom: 21,
              color: "#ffffff",
            },
          ],
        },
        {
          tags: {
            any: "ferry",
          },
          stylers: [
            {
              color: "#919ba4",
            },
          ],
        },
        {
          tags: "transit_location",
          elements: "label.icon",
          stylers: [
            {
              saturation: -1,
            },
            {
              zoom: 0,
              opacity: 0,
            },
            {
              zoom: 1,
              opacity: 0,
            },
            {
              zoom: 2,
              opacity: 0,
            },
            {
              zoom: 3,
              opacity: 0,
            },
            {
              zoom: 4,
              opacity: 0,
            },
            {
              zoom: 5,
              opacity: 0,
            },
            {
              zoom: 6,
              opacity: 0,
            },
            {
              zoom: 7,
              opacity: 0,
            },
            {
              zoom: 8,
              opacity: 0,
            },
            {
              zoom: 9,
              opacity: 0,
            },
            {
              zoom: 10,
              opacity: 0,
            },
            {
              zoom: 11,
              opacity: 0,
            },
            {
              zoom: 12,
              opacity: 0,
            },
            {
              zoom: 13,
              opacity: 1,
            },
            {
              zoom: 14,
              opacity: 1,
            },
            {
              zoom: 15,
              opacity: 1,
            },
            {
              zoom: 16,
              opacity: 1,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: "transit_location",
          elements: "label.text",
          stylers: [
            {
              zoom: 0,
              opacity: 0,
            },
            {
              zoom: 1,
              opacity: 0,
            },
            {
              zoom: 2,
              opacity: 0,
            },
            {
              zoom: 3,
              opacity: 0,
            },
            {
              zoom: 4,
              opacity: 0,
            },
            {
              zoom: 5,
              opacity: 0,
            },
            {
              zoom: 6,
              opacity: 0,
            },
            {
              zoom: 7,
              opacity: 0,
            },
            {
              zoom: 8,
              opacity: 0,
            },
            {
              zoom: 9,
              opacity: 0,
            },
            {
              zoom: 10,
              opacity: 0,
            },
            {
              zoom: 11,
              opacity: 0,
            },
            {
              zoom: 12,
              opacity: 0,
            },
            {
              zoom: 13,
              opacity: 1,
            },
            {
              zoom: 14,
              opacity: 1,
            },
            {
              zoom: 15,
              opacity: 1,
            },
            {
              zoom: 16,
              opacity: 1,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: "transit_location",
          elements: "label.text.fill",
          stylers: [
            {
              color: "#6c8993",
            },
          ],
        },
        {
          tags: "transit_location",
          elements: "label.text.outline",
          stylers: [
            {
              color: "#ffffff",
            },
          ],
        },
        {
          tags: "transit_schema",
          elements: "geometry.fill",
          stylers: [
            {
              color: "#6c8993",
            },
            {
              scale: 0.7,
            },
            {
              zoom: 0,
              opacity: 0.6,
            },
            {
              zoom: 1,
              opacity: 0.6,
            },
            {
              zoom: 2,
              opacity: 0.6,
            },
            {
              zoom: 3,
              opacity: 0.6,
            },
            {
              zoom: 4,
              opacity: 0.6,
            },
            {
              zoom: 5,
              opacity: 0.6,
            },
            {
              zoom: 6,
              opacity: 0.6,
            },
            {
              zoom: 7,
              opacity: 0.6,
            },
            {
              zoom: 8,
              opacity: 0.6,
            },
            {
              zoom: 9,
              opacity: 0.6,
            },
            {
              zoom: 10,
              opacity: 0.6,
            },
            {
              zoom: 11,
              opacity: 0.6,
            },
            {
              zoom: 12,
              opacity: 0.6,
            },
            {
              zoom: 13,
              opacity: 0.6,
            },
            {
              zoom: 14,
              opacity: 0.6,
            },
            {
              zoom: 15,
              opacity: 0.5,
            },
            {
              zoom: 16,
              opacity: 0.4,
            },
            {
              zoom: 17,
              opacity: 0.4,
            },
            {
              zoom: 18,
              opacity: 0.4,
            },
            {
              zoom: 19,
              opacity: 0.4,
            },
            {
              zoom: 20,
              opacity: 0.4,
            },
            {
              zoom: 21,
              opacity: 0.4,
            },
          ],
        },
        {
          tags: "transit_schema",
          elements: "geometry.outline",
          stylers: [
            {
              opacity: 0,
            },
          ],
        },
        {
          tags: "transit_line",
          elements: "geometry.fill.pattern",
          stylers: [
            {
              color: "#949c9e",
            },
            {
              zoom: 0,
              opacity: 0,
            },
            {
              zoom: 1,
              opacity: 0,
            },
            {
              zoom: 2,
              opacity: 0,
            },
            {
              zoom: 3,
              opacity: 0,
            },
            {
              zoom: 4,
              opacity: 0,
            },
            {
              zoom: 5,
              opacity: 0,
            },
            {
              zoom: 6,
              opacity: 0,
            },
            {
              zoom: 7,
              opacity: 0,
            },
            {
              zoom: 8,
              opacity: 0,
            },
            {
              zoom: 9,
              opacity: 0,
            },
            {
              zoom: 10,
              opacity: 0,
            },
            {
              zoom: 11,
              opacity: 0,
            },
            {
              zoom: 12,
              opacity: 0,
            },
            {
              zoom: 13,
              opacity: 1,
            },
            {
              zoom: 14,
              opacity: 1,
            },
            {
              zoom: 15,
              opacity: 1,
            },
            {
              zoom: 16,
              opacity: 1,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: "transit_line",
          elements: "geometry.fill",
          stylers: [
            {
              color: "#949c9e",
            },
            {
              scale: 0.4,
            },
            {
              zoom: 0,
              opacity: 0,
            },
            {
              zoom: 1,
              opacity: 0,
            },
            {
              zoom: 2,
              opacity: 0,
            },
            {
              zoom: 3,
              opacity: 0,
            },
            {
              zoom: 4,
              opacity: 0,
            },
            {
              zoom: 5,
              opacity: 0,
            },
            {
              zoom: 6,
              opacity: 0,
            },
            {
              zoom: 7,
              opacity: 0,
            },
            {
              zoom: 8,
              opacity: 0,
            },
            {
              zoom: 9,
              opacity: 0,
            },
            {
              zoom: 10,
              opacity: 0,
            },
            {
              zoom: 11,
              opacity: 0,
            },
            {
              zoom: 12,
              opacity: 0,
            },
            {
              zoom: 13,
              opacity: 1,
            },
            {
              zoom: 14,
              opacity: 1,
            },
            {
              zoom: 15,
              opacity: 1,
            },
            {
              zoom: 16,
              opacity: 1,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: "water",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#adb4bb",
            },
            {
              zoom: 1,
              color: "#adb4bb",
            },
            {
              zoom: 2,
              color: "#adb4bb",
            },
            {
              zoom: 3,
              color: "#adb4bb",
            },
            {
              zoom: 4,
              color: "#adb4bb",
            },
            {
              zoom: 5,
              color: "#adb4bb",
            },
            {
              zoom: 6,
              color: "#adb4bb",
            },
            {
              zoom: 7,
              color: "#adb4bb",
            },
            {
              zoom: 8,
              color: "#afb6bd",
            },
            {
              zoom: 9,
              color: "#b1b7be",
            },
            {
              zoom: 10,
              color: "#b3b9c0",
            },
            {
              zoom: 11,
              color: "#b4bac1",
            },
            {
              zoom: 12,
              color: "#b4bbc1",
            },
            {
              zoom: 13,
              color: "#b5bcc2",
            },
            {
              zoom: 14,
              color: "#b6bdc3",
            },
            {
              zoom: 15,
              color: "#b8bec4",
            },
            {
              zoom: 16,
              color: "#b9c0c5",
            },
            {
              zoom: 17,
              color: "#bbc1c6",
            },
            {
              zoom: 18,
              color: "#bcc2c8",
            },
            {
              zoom: 19,
              color: "#bec3c9",
            },
            {
              zoom: 20,
              color: "#bfc5ca",
            },
            {
              zoom: 21,
              color: "#c1c6cb",
            },
          ],
        },
        {
          tags: "water",
          elements: "geometry",
          types: "polyline",
          stylers: [
            {
              zoom: 0,
              opacity: 0.4,
            },
            {
              zoom: 1,
              opacity: 0.4,
            },
            {
              zoom: 2,
              opacity: 0.4,
            },
            {
              zoom: 3,
              opacity: 0.4,
            },
            {
              zoom: 4,
              opacity: 0.6,
            },
            {
              zoom: 5,
              opacity: 0.8,
            },
            {
              zoom: 6,
              opacity: 1,
            },
            {
              zoom: 7,
              opacity: 1,
            },
            {
              zoom: 8,
              opacity: 1,
            },
            {
              zoom: 9,
              opacity: 1,
            },
            {
              zoom: 10,
              opacity: 1,
            },
            {
              zoom: 11,
              opacity: 1,
            },
            {
              zoom: 12,
              opacity: 1,
            },
            {
              zoom: 13,
              opacity: 1,
            },
            {
              zoom: 14,
              opacity: 1,
            },
            {
              zoom: 15,
              opacity: 1,
            },
            {
              zoom: 16,
              opacity: 1,
            },
            {
              zoom: 17,
              opacity: 1,
            },
            {
              zoom: 18,
              opacity: 1,
            },
            {
              zoom: 19,
              opacity: 1,
            },
            {
              zoom: 20,
              opacity: 1,
            },
            {
              zoom: 21,
              opacity: 1,
            },
          ],
        },
        {
          tags: "bathymetry",
          elements: "geometry",
          stylers: [
            {
              hue: "#adb4bb",
            },
          ],
        },
        {
          tags: {
            any: ["industrial", "construction_site"],
          },
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#dcdee0",
            },
            {
              zoom: 1,
              color: "#dcdee0",
            },
            {
              zoom: 2,
              color: "#dcdee0",
            },
            {
              zoom: 3,
              color: "#dcdee0",
            },
            {
              zoom: 4,
              color: "#dcdee0",
            },
            {
              zoom: 5,
              color: "#dcdee0",
            },
            {
              zoom: 6,
              color: "#dcdee0",
            },
            {
              zoom: 7,
              color: "#dcdee0",
            },
            {
              zoom: 8,
              color: "#dcdee0",
            },
            {
              zoom: 9,
              color: "#dcdee0",
            },
            {
              zoom: 10,
              color: "#dcdee0",
            },
            {
              zoom: 11,
              color: "#dcdee0",
            },
            {
              zoom: 12,
              color: "#dcdee0",
            },
            {
              zoom: 13,
              color: "#dcdee0",
            },
            {
              zoom: 14,
              color: "#e1e3e5",
            },
            {
              zoom: 15,
              color: "#e7e8ea",
            },
            {
              zoom: 16,
              color: "#e8e9eb",
            },
            {
              zoom: 17,
              color: "#e9eaeb",
            },
            {
              zoom: 18,
              color: "#e9eaec",
            },
            {
              zoom: 19,
              color: "#eaebed",
            },
            {
              zoom: 20,
              color: "#ebeced",
            },
            {
              zoom: 21,
              color: "#ecedee",
            },
          ],
        },
        {
          tags: {
            any: "transit",
            none: [
              "transit_location",
              "transit_line",
              "transit_schema",
              "is_unclassified_transit",
            ],
          },
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#dcdee0",
            },
            {
              zoom: 1,
              color: "#dcdee0",
            },
            {
              zoom: 2,
              color: "#dcdee0",
            },
            {
              zoom: 3,
              color: "#dcdee0",
            },
            {
              zoom: 4,
              color: "#dcdee0",
            },
            {
              zoom: 5,
              color: "#dcdee0",
            },
            {
              zoom: 6,
              color: "#dcdee0",
            },
            {
              zoom: 7,
              color: "#dcdee0",
            },
            {
              zoom: 8,
              color: "#dcdee0",
            },
            {
              zoom: 9,
              color: "#dcdee0",
            },
            {
              zoom: 10,
              color: "#dcdee0",
            },
            {
              zoom: 11,
              color: "#dcdee0",
            },
            {
              zoom: 12,
              color: "#dcdee0",
            },
            {
              zoom: 13,
              color: "#dcdee0",
            },
            {
              zoom: 14,
              color: "#e1e3e5",
            },
            {
              zoom: 15,
              color: "#e7e8ea",
            },
            {
              zoom: 16,
              color: "#e8e9eb",
            },
            {
              zoom: 17,
              color: "#e9eaeb",
            },
            {
              zoom: 18,
              color: "#e9eaec",
            },
            {
              zoom: 19,
              color: "#eaebed",
            },
            {
              zoom: 20,
              color: "#ebeced",
            },
            {
              zoom: 21,
              color: "#ecedee",
            },
          ],
        },
        {
          tags: "fence",
          elements: "geometry.fill",
          stylers: [
            {
              color: "#d1d4d6",
            },
            {
              zoom: 0,
              opacity: 0.75,
            },
            {
              zoom: 1,
              opacity: 0.75,
            },
            {
              zoom: 2,
              opacity: 0.75,
            },
            {
              zoom: 3,
              opacity: 0.75,
            },
            {
              zoom: 4,
              opacity: 0.75,
            },
            {
              zoom: 5,
              opacity: 0.75,
            },
            {
              zoom: 6,
              opacity: 0.75,
            },
            {
              zoom: 7,
              opacity: 0.75,
            },
            {
              zoom: 8,
              opacity: 0.75,
            },
            {
              zoom: 9,
              opacity: 0.75,
            },
            {
              zoom: 10,
              opacity: 0.75,
            },
            {
              zoom: 11,
              opacity: 0.75,
            },
            {
              zoom: 12,
              opacity: 0.75,
            },
            {
              zoom: 13,
              opacity: 0.75,
            },
            {
              zoom: 14,
              opacity: 0.75,
            },
            {
              zoom: 15,
              opacity: 0.75,
            },
            {
              zoom: 16,
              opacity: 0.75,
            },
            {
              zoom: 17,
              opacity: 0.45,
            },
            {
              zoom: 18,
              opacity: 0.45,
            },
            {
              zoom: 19,
              opacity: 0.45,
            },
            {
              zoom: 20,
              opacity: 0.45,
            },
            {
              zoom: 21,
              opacity: 0.45,
            },
          ],
        },
        {
          tags: "medical",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#dcdee0",
            },
            {
              zoom: 1,
              color: "#dcdee0",
            },
            {
              zoom: 2,
              color: "#dcdee0",
            },
            {
              zoom: 3,
              color: "#dcdee0",
            },
            {
              zoom: 4,
              color: "#dcdee0",
            },
            {
              zoom: 5,
              color: "#dcdee0",
            },
            {
              zoom: 6,
              color: "#dcdee0",
            },
            {
              zoom: 7,
              color: "#dcdee0",
            },
            {
              zoom: 8,
              color: "#dcdee0",
            },
            {
              zoom: 9,
              color: "#dcdee0",
            },
            {
              zoom: 10,
              color: "#dcdee0",
            },
            {
              zoom: 11,
              color: "#dcdee0",
            },
            {
              zoom: 12,
              color: "#dcdee0",
            },
            {
              zoom: 13,
              color: "#dcdee0",
            },
            {
              zoom: 14,
              color: "#e1e3e5",
            },
            {
              zoom: 15,
              color: "#e7e8ea",
            },
            {
              zoom: 16,
              color: "#e8e9eb",
            },
            {
              zoom: 17,
              color: "#e9eaeb",
            },
            {
              zoom: 18,
              color: "#e9eaec",
            },
            {
              zoom: 19,
              color: "#eaebed",
            },
            {
              zoom: 20,
              color: "#ebeced",
            },
            {
              zoom: 21,
              color: "#ecedee",
            },
          ],
        },
        {
          tags: "beach",
          elements: "geometry",
          stylers: [
            {
              zoom: 0,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 1,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 2,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 3,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 4,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 5,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 6,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 7,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 8,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 9,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 10,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 11,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 12,
              color: "#dcdee0",
              opacity: 0.3,
            },
            {
              zoom: 13,
              color: "#dcdee0",
              opacity: 0.65,
            },
            {
              zoom: 14,
              color: "#e1e3e5",
              opacity: 1,
            },
            {
              zoom: 15,
              color: "#e7e8ea",
              opacity: 1,
            },
            {
              zoom: 16,
              color: "#e8e9eb",
              opacity: 1,
            },
            {
              zoom: 17,
              color: "#e9eaeb",
              opacity: 1,
            },
            {
              zoom: 18,
              color: "#e9eaec",
              opacity: 1,
            },
            {
              zoom: 19,
              color: "#eaebed",
              opacity: 1,
            },
            {
              zoom: 20,
              color: "#ebeced",
              opacity: 1,
            },
            {
              zoom: 21,
              color: "#ecedee",
              opacity: 1,
            },
          ],
        },
        {
          tags: {
            all: ["is_tunnel", "path"],
          },
          elements: "geometry.fill",
          stylers: [
            {
              color: "#c3c7cb",
            },
            {
              opacity: 0.3,
            },
          ],
        },
        {
          tags: {
            all: ["is_tunnel", "path"],
          },
          elements: "geometry.outline",
          stylers: [
            {
              opacity: 0,
            },
          ],
        },
        {
          tags: "road_limited",
          elements: "geometry.fill",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 0,
            },
            {
              zoom: 1,
              scale: 0,
            },
            {
              zoom: 2,
              scale: 0,
            },
            {
              zoom: 3,
              scale: 0,
            },
            {
              zoom: 4,
              scale: 0,
            },
            {
              zoom: 5,
              scale: 0,
            },
            {
              zoom: 6,
              scale: 0,
            },
            {
              zoom: 7,
              scale: 0,
            },
            {
              zoom: 8,
              scale: 0,
            },
            {
              zoom: 9,
              scale: 0,
            },
            {
              zoom: 10,
              scale: 0,
            },
            {
              zoom: 11,
              scale: 0,
            },
            {
              zoom: 12,
              scale: 0,
            },
            {
              zoom: 13,
              scale: 0.1,
            },
            {
              zoom: 14,
              scale: 0.2,
            },
            {
              zoom: 15,
              scale: 0.3,
            },
            {
              zoom: 16,
              scale: 0.5,
            },
            {
              zoom: 17,
              scale: 0.6,
            },
            {
              zoom: 18,
              scale: 0.7,
            },
            {
              zoom: 19,
              scale: 0.88,
            },
            {
              zoom: 20,
              scale: 0.92,
            },
            {
              zoom: 21,
              scale: 1,
            },
          ],
        },
        {
          tags: "road_limited",
          elements: "geometry.outline",
          stylers: [
            {
              color: "#c8ccd0",
            },
            {
              zoom: 0,
              scale: 1,
            },
            {
              zoom: 1,
              scale: 1,
            },
            {
              zoom: 2,
              scale: 1,
            },
            {
              zoom: 3,
              scale: 1,
            },
            {
              zoom: 4,
              scale: 1,
            },
            {
              zoom: 5,
              scale: 1,
            },
            {
              zoom: 6,
              scale: 1,
            },
            {
              zoom: 7,
              scale: 1,
            },
            {
              zoom: 8,
              scale: 1,
            },
            {
              zoom: 9,
              scale: 1,
            },
            {
              zoom: 10,
              scale: 1,
            },
            {
              zoom: 11,
              scale: 1,
            },
            {
              zoom: 12,
              scale: 1,
            },
            {
              zoom: 13,
              scale: 0.1,
            },
            {
              zoom: 14,
              scale: 0.2,
            },
            {
              zoom: 15,
              scale: 0.3,
            },
            {
              zoom: 16,
              scale: 0.5,
            },
            {
              zoom: 17,
              scale: 0.6,
            },
            {
              zoom: 18,
              scale: 0.7,
            },
            {
              zoom: 19,
              scale: 0.84,
            },
            {
              zoom: 20,
              scale: 0.88,
            },
            {
              zoom: 21,
              scale: 0.95,
            },
          ],
        },
        {
          tags: {
            any: "landcover",
            none: "vegetation",
          },
          stylers: {
            visibility: "off",
          },
        },
      ],
    })
  );
  map.addChild(new YMapDefaultFeaturesLayer());

  // --- маркер ---
  const markerElement = document.createElement("div");
  markerElement.className = "map-marker";

  const markerImage = document.createElement("img");
  markerImage.src = "img/marker.svg";
  markerImage.classList.add("map-icon");

  markerElement.appendChild(markerImage);

  const marker = new YMapMarker(
    {
      coordinates: [44.014637, 56.325315],
      draggable: false,
      mapFollowsOnDrag: true,
      layout: "default#image",
    },
    markerElement
  );

  map.addChild(marker);
}

const fileForms = document.querySelectorAll(".request-form");
if (fileForms.length) {
  fileForms.forEach((item) => {
    const fileInput = item.querySelector(".form-file");

    const filePreview = item.querySelector(".file-preview");
    const fileNameBlock = filePreview.querySelector(".file__name");
    const fileClose = filePreview.querySelector(".file__close");

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        fileNameBlock.textContent = `${file.name}`;
        filePreview.classList.add("active");
      } else {
        fileNameBlock.textContent = "";
        filePreview.classList.remove("active");
      }
    });

    fileClose.addEventListener("click", () => {
      fileInput.value = null;
      fileNameBlock.textContent = "";
      filePreview.classList.remove("active");
    });
  });
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

const banner = document.getElementById("cookiesBanner");
if (banner) {
  const btn = document.getElementById("cookiesOk");

  // проверка localStorage
  if (localStorage.getItem("cookiesAccepted") !== "true") {
    banner.classList.add("visible");
  }

  btn.addEventListener("click", () => {
    banner.classList.remove("visible");
    localStorage.setItem("cookiesAccepted", "true");
  });
}

const customSelectWraps = document.querySelectorAll(".custom-select-wrap");

customSelectWraps.forEach((wrap) => {
  const select = wrap.querySelector(".custom-select");
  const selectBox = select.querySelector(".select-box");
  const selectOptions = select.querySelector(".select-options");
  const selectedOption = select.querySelector(".selected-option");
  const options = select.querySelectorAll(".option");
  const arrow = select.querySelector(".arrow");
  const clearBtn = wrap.querySelector(".custom-select__clear");

  // Запоминаем начальную метку (сброс к ней)
  const defaultLabel = selectedOption.textContent.trim();

  // Обновление видимости кнопки очистки
  const updateClearVisibility = () => {
    const current = selectedOption.textContent.trim();
    if (current !== defaultLabel) {
      clearBtn.classList.add("show");
    } else {
      clearBtn.classList.remove("show");
    }
  };

  // Открыть/закрыть выпадашку
  selectBox.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = selectOptions.classList.contains("open");

    // закрыть другие селекты
    document
      .querySelectorAll(".custom-select .select-options.open")
      .forEach((list) => {
        list.classList.remove("open");
      });
    document.querySelectorAll(".custom-select .arrow.open").forEach((a) => {
      a.classList.remove("open");
    });

    if (!isOpen) {
      selectOptions.classList.add("open");
      arrow.classList.add("open");
    }
  });

  // Выбор пункта
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedOption.textContent = option.textContent;
      selectOptions.classList.remove("open");
      arrow.classList.remove("open");
      updateClearVisibility();
    });
  });

  // Очистка выбора
  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedOption.textContent = defaultLabel; // сброс
    selectOptions.classList.remove("open");
    arrow.classList.remove("open");
    updateClearVisibility(); // скроет кнопку
  });

  // Клик вне — закрыть
  document.addEventListener("click", () => {
    selectOptions.classList.remove("open");
    arrow.classList.remove("open");
  });

  // Изначально скрыть кнопку (на всякий случай)
  updateClearVisibility();
});

// Анимация для текста
function animateText() {
  const animTexts = document.querySelectorAll(".animated-text-page");
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

      item.style.visibility = "visible";
    });
  }
}

animateText();

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("page-overlay");
  const fadeDuration = 1000; // должен совпадать с CSS

  // fade-out при загрузке страницы
  window.addEventListener("load", () => {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
    }, fadeDuration);
  });

  // fade-in при клике на ссылки
  const links = document.querySelectorAll("a.fade-link");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = link.href;

      // overlay всегда display:block при переходе
      overlay.style.display = "block";
      overlay.style.pointerEvents = "all";

      // небольшая задержка чтобы браузер отрисовал overlay
      requestAnimationFrame(() => {
        overlay.style.opacity = "1";

        // после завершения анимации переходим
        setTimeout(() => {
          window.location.href = url;
        }, fadeDuration);
      });
    });
  });
});
