document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. MOBILE MENU TOGGLE
     ============================================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('primary-nav');

  const closeMenu = () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    siteNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when a nav link is clicked (mobile)
  siteNav.querySelectorAll('.site-nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ============================================================
     2. SMOOTH SCROLL FOR ANCHOR LINKS
     (CSS `scroll-behavior: smooth` + `scroll-margin-top` on
     sections already handle most of this; this JS adds a
     fallback for browsers without CSS smooth-scroll support
     and keeps focus management accessible.)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Move focus for keyboard/screen-reader users after scrolling
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ============================================================
     3. CONTACT FORM — CLIENT-SIDE VALIDATION
     ============================================================ */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (value) => {
        if (value.trim() === '') return 'Ad və Soyad boş buraxıla bilməz.';
        if (value.trim().length < 3) return 'Ad və Soyad ən azı 3 simvol olmalıdır.';
        return '';
      },
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim() === '') return 'Elektron poçt ünvanı boş buraxıla bilməz.';
        if (!emailRegex.test(value.trim())) return 'Zəhmət olmasa düzgün e-poçt ünvanı daxil edin.';
        return '';
      },
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (value) => {
        if (value.trim() === '') return 'Mesaj boş buraxıla bilməz.';
        if (value.trim().length < 10) return 'Mesajınız ən azı 10 simvol olmalıdır.';
        return '';
      },
    },
  };

  const validateField = (key) => {
    const { input, error, validate } = fields[key];
    const message = validate(input.value);

    if (message) {
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      error.textContent = message;
    } else {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      error.textContent = '';
    }

    return message === '';
  };

  // Validate on blur for immediate feedback
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload on empty/invalid submit

    const results = Object.keys(fields).map((key) => validateField(key));
    const isFormValid = results.every(Boolean);

    if (!isFormValid) {
      status.textContent = 'Zəhmət olmasa formdakı xətaları düzəldin.';
      status.classList.remove('is-success');
      // Move focus to the first invalid field
      const firstInvalidKey = Object.keys(fields).find(
        (key) => fields[key].input.classList.contains('is-invalid')
      );
      if (firstInvalidKey) fields[firstInvalidKey].input.focus();
      return;
    }

    // Simulated successful submission (no backend wired up here)
    status.textContent = 'Mesajınız uğurla göndərildi. Təşəkkür edirik!';
    status.classList.add('is-success');
    form.reset();
  });

});
