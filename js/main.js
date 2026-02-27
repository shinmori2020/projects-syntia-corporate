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
  // 資格画像モーダル
  // ============================================================
  var certModal = document.getElementById('js-cert-modal');
  var certModalImg = document.getElementById('js-cert-modal-img');
  var certModalCaption = document.getElementById('js-cert-modal-caption');
  var certModalClose = document.getElementById('js-cert-modal-close');
  var certModalOverlay = document.getElementById('js-cert-modal-overlay');
  var certModalPlaceholder = document.getElementById('js-cert-modal-placeholder');
  var certModalPrev = document.getElementById('js-cert-modal-prev');
  var certModalNext = document.getElementById('js-cert-modal-next');
  var certModalCount = document.getElementById('js-cert-modal-count');

  var certItems = [];
  var certCurrentIndex = 0;

  function buildCertItems() {
    var buttons = document.querySelectorAll('.js-cert-open');
    certItems = [];
    buttons.forEach(function (btn) {
      var card = btn.closest('.p-company-cert__card');
      var imgEl = btn.querySelector('img');
      var imgWrapEl = btn.querySelector('.p-company-cert__img-wrap');
      var nameEl = card ? card.querySelector('.p-company-cert__name') : null;
      var numberEl = card ? card.querySelector('.p-company-cert__number') : null;
      var caption = '';
      if (nameEl) caption = nameEl.textContent.trim();
      if (numberEl) caption += '\u3000' + numberEl.textContent.trim();
      var orient = (imgWrapEl && imgWrapEl.classList.contains('p-company-cert__img-wrap--landscape'))
        ? 'landscape' : 'portrait';
      certItems.push({
        src: imgEl ? imgEl.src : '',
        alt: imgEl ? imgEl.alt : '',
        caption: caption,
        orient: orient
      });
    });
  }

  function renderCertModal(index) {
    var item = certItems[index];
    if (!item) return;
    if (item.src) {
      certModalImg.src = item.src;
      certModalImg.alt = item.alt;
      certModalImg.style.display = '';
      if (certModalPlaceholder) certModalPlaceholder.style.display = 'none';
    } else {
      certModalImg.style.display = 'none';
      if (certModalPlaceholder) {
        certModalPlaceholder.style.display = '';
        certModalPlaceholder.textContent = item.caption || '画像未設定';
        if (item.orient === 'landscape') {
          certModalPlaceholder.style.aspectRatio = '16 / 10';
          certModalPlaceholder.style.width = 'min(560px, 80vw)';
          certModalPlaceholder.style.height = 'auto';
        } else {
          certModalPlaceholder.style.aspectRatio = '3 / 4';
          certModalPlaceholder.style.width = 'min(460px, 60vw)';
          certModalPlaceholder.style.height = 'auto';
        }
      }
    }
    certModalCaption.textContent = item.caption;
    if (certModalCount) {
      certModalCount.textContent = (index + 1) + ' / ' + certItems.length;
    }
    // 1枚のみの場合はナビを非表示
    var showNav = certItems.length > 1;
    if (certModalPrev) certModalPrev.style.display = showNav ? '' : 'none';
    if (certModalNext) certModalNext.style.display = showNav ? '' : 'none';
    if (certModalCount) certModalCount.style.display = showNav ? '' : 'none';
  }

  function openCertModal(index) {
    if (!certModal) return;
    certCurrentIndex = index;
    renderCertModal(certCurrentIndex);
    certModal.classList.add('is-open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    certModalClose.focus();
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('is-open');
    certModal.setAttribute('aria-hidden', 'true');
    certModalImg.src = '';
    certModalImg.style.display = '';
    if (certModalPlaceholder) certModalPlaceholder.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showPrev() {
    certCurrentIndex = (certCurrentIndex - 1 + certItems.length) % certItems.length;
    renderCertModal(certCurrentIndex);
  }

  function showNext() {
    certCurrentIndex = (certCurrentIndex + 1) % certItems.length;
    renderCertModal(certCurrentIndex);
  }

  if (certModal) {
    buildCertItems();

    // 各カードのクリックイベント
    var certButtons = document.querySelectorAll('.js-cert-open');
    certButtons.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        openCertModal(i);
      });
    });

    // 前後ボタン
    if (certModalPrev) certModalPrev.addEventListener('click', showPrev);
    if (certModalNext) certModalNext.addEventListener('click', showNext);

    // 閉じるボタン
    certModalClose.addEventListener('click', closeCertModal);

    // オーバーレイクリックで閉じる
    certModalOverlay.addEventListener('click', closeCertModal);

    // キーボード操作
    document.addEventListener('keydown', function (e) {
      if (!certModal.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        closeCertModal();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      }
    });
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
