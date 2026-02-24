(function () {
  'use strict';

  // ============================================================
  // ヘッダースクロール制御
  // ============================================================
  var header = document.getElementById('js-header');

  function handleHeaderScroll() {
    if (window.scrollY > 80) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ============================================================
  // ハンバーガーメニュー / ドロワー
  // ============================================================
  var hamburger = document.getElementById('js-hamburger');
  var drawer = document.getElementById('js-drawer');
  var drawerOverlay = document.getElementById('js-drawer-overlay');
  var drawerClose = document.getElementById('js-drawer-close');

  function openDrawer() {
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerOverlay.addEventListener('click', closeDrawer);
  drawerClose.addEventListener('click', closeDrawer);

  // ドロワー内リンククリックで閉じる
  var drawerLinks = drawer.querySelectorAll('.p-drawer__link');
  drawerLinks.forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  // Escキーでドロワーを閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
      hamburger.focus();
    }
  });

  // ============================================================
  // スクロールアニメーション（Intersection Observer）
  // ============================================================
  var fadeElements = document.querySelectorAll('.js-fade-in');

  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Intersection Observer 非対応ブラウザ: 即座に表示
    fadeElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  // ============================================================
  // SP固定CTAバーの表示制御
  // ============================================================
  var fixedCta = document.getElementById('js-fixed-cta');
  var heroSection = document.querySelector('.p-hero');

  if (fixedCta && heroSection) {
    var ctaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          fixedCta.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.1
    });

    ctaObserver.observe(heroSection);
  }

  // ============================================================
  // スムーススクロール（ページ内アンカー補助）
  // ============================================================
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href === '#main-content') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
