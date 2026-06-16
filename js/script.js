/* ============================================
   DIGI-FIN LITERACY AFRICA — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. DARK MODE TOGGLE ───────────────────────────────────────────
  const darkToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Load saved preference
  if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    if (darkToggle) darkToggle.innerHTML = '☀️ Light';
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const isDark = body.classList.contains('dark-mode');
      darkToggle.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
      localStorage.setItem('darkMode', isDark);
    });
  }

  // ─── 2. SCROLL REVEAL ─────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ─── 3. CONTACT FORM VALIDATION ───────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const successMsg = document.getElementById('formSuccess');

    function validateField(input) {
      const feedback = input.parentElement.querySelector('.invalid-feedback-custom');
      let valid = true;
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        if (feedback) { feedback.textContent = 'This field is required.'; feedback.classList.add('visible'); }
        valid = false;
      } else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
          if (feedback) { feedback.textContent = 'Please enter a valid email address.'; feedback.classList.add('visible'); }
          valid = false;
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
          if (feedback) feedback.classList.remove('visible');
        }
      } else if (input.name === 'phone' && input.value.trim()) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
        if (!phoneRegex.test(input.value.trim())) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
          if (feedback) { feedback.textContent = 'Please enter a valid phone number.'; feedback.classList.add('visible'); }
          valid = false;
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
          if (feedback) feedback.classList.remove('visible');
        }
      } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (feedback) feedback.classList.remove('visible');
      }
      return valid;
    }

    // Real-time validation
    contactForm.querySelectorAll('.form-control-custom').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      contactForm.querySelectorAll('.form-control-custom[required]').forEach(input => {
        if (!validateField(input)) allValid = false;
      });

      if (allValid) {
        // Simulate form submission
        const btn = contactForm.querySelector('[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Sending...';
        btn.disabled = true;

        setTimeout(() => {
          contactForm.reset();
          contactForm.querySelectorAll('.form-control-custom').forEach(i => {
            i.classList.remove('is-valid', 'is-invalid');
          });
          btn.innerHTML = originalText;
          btn.disabled = false;
          if (successMsg) {
            successMsg.style.display = 'block';
            setTimeout(() => successMsg.style.display = 'none', 5000);
          }
        }, 1500);
      }
    });
  }

  // ─── 4. GALLERY FILTER ────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
          const category = item.dataset.category;
          if (filter === 'all' || category === filter) {
            item.style.opacity = '0';
            item.style.display = 'flex';
            setTimeout(() => { item.style.opacity = '1'; item.style.transition = 'opacity 0.35s ease'; }, 30);
          } else {
            item.style.opacity = '0';
            setTimeout(() => { item.style.display = 'none'; }, 350);
          }
        });
      });
    });
  }

  // ─── 5. LIVE RESOURCE SEARCH ──────────────────────────────────────
  const resourceSearch = document.getElementById('resourceSearch');
  const resourceCards = document.querySelectorAll('.blog-card-searchable');

  if (resourceSearch && resourceCards.length > 0) {
    resourceSearch.addEventListener('input', () => {
      const query = resourceSearch.value.toLowerCase().trim();
      let visibleCount = 0;

      resourceCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const text = card.querySelector('p')?.textContent.toLowerCase() || '';
        const tags = card.dataset.tags?.toLowerCase() || '';

        if (!query || title.includes(query) || text.includes(query) || tags.includes(query)) {
          card.parentElement.style.display = '';
          visibleCount++;
        } else {
          card.parentElement.style.display = 'none';
        }
      });

      const noResults = document.getElementById('noSearchResults');
      if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  }

  // ─── 6. SMOOTH ACTIVE NAV ─────────────────────────────────────────
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ─── 7. STAT COUNTER ANIMATION ────────────────────────────────────
  const counters = document.querySelectorAll('.count-up');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // ─── 8. NEWSLETTER SUBSCRIBE ──────────────────────────────────────
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && emailRegex.test(emailInput.value.trim())) {
        const btn = newsletterForm.querySelector('button');
        btn.textContent = '✅ Subscribed!';
        btn.style.background = '#12894F';
        emailInput.value = '';
        setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
      } else if (emailInput) {
        emailInput.style.borderColor = '#dc3545';
        setTimeout(() => { emailInput.style.borderColor = ''; }, 2000);
      }
    });
  }

  // ─── 9. NAVBAR SCROLL SHADOW ──────────────────────────────────────
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 20px rgba(10,107,62,0.15)';
      } else {
        navbar.style.boxShadow = '0 2px 12px rgba(10,107,62,0.08)';
      }
    }, { passive: true });
  }

  // ─── 10. BACK TO TOP ──────────────────────────────────────────────
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
      backToTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

});