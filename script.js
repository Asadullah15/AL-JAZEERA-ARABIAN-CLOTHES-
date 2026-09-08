document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mainNav.classList.toggle('open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header shadow on scroll
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Wishlist toggle (saved per-browser, no backend)
  const WISHLIST_KEY = 'aljazeera-wishlist';
  const getWishlist = () => {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
    catch { return []; }
  };
  const setWishlist = (list) => {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(list)); }
    catch { /* storage unavailable, ignore */ }
  };
  const savedWishlist = getWishlist();

  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.getAttribute('data-id');
    if (!id) return;
    if (savedWishlist.includes(id)) btn.classList.add('active');

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const list = getWishlist();
      const idx = list.indexOf(id);
      if (idx === -1) {
        list.push(id);
        btn.classList.add('active');
      } else {
        list.splice(idx, 1);
        btn.classList.remove('active');
      }
      setWishlist(list);
    });
  });

  // Hero slideshow (Home page only)
  const slideshow = document.getElementById('hero-slideshow');
  if (slideshow) {
    const slides = Array.from(slideshow.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    let current = 0;
    let timer;

    const goTo = (index) => {
      slides[current]?.classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current]?.classList.add('active');
      dots[current]?.classList.add('active');
    };

    const startAuto = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 5000);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        startAuto();
      });
    });

    if (slides.length > 1) startAuto();
  }

  // Gallery lightbox (Gallery page only)
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const openLightbox = (src, caption) => {
      lightboxImg.setAttribute('src', src);
      lightboxImg.setAttribute('alt', caption || '');
      lightboxCaption.textContent = caption || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
      });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
});
