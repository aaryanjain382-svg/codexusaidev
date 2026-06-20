// ══════════════════════════════════════════
//  CODEXUS — app.js
//  Each feature is wrapped in try/catch so a
//  failure in one block cannot break the rest
//  of the page (this was the cause of sections
//  appearing to "disappear").
// ══════════════════════════════════════════

// ── NAVBAR scroll effect ──────────────────
try {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }
} catch (err) { console.error('Navbar scroll error:', err); }

// ── HAMBURGER mobile menu ─────────────────
try {
  const hamburger = document.getElementById('hamburger');
  let mobileNav = null;

  function createMobileNav() {
    const links = ['#about', '#portfolio', '#projects', '#packages', '#contact'];
    const labels = ['About', 'Team', 'Projects', 'Packages', 'Contact'];
    const nav = document.createElement('div');
    nav.className = 'nav-mobile';
    nav.id = 'mobileNav';
    links.forEach((href, i) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = labels[i];
      a.addEventListener('click', closeMobileMenu);
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
    return nav;
  }

  function closeMobileMenu() {
    if (mobileNav) mobileNav.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (!mobileNav) mobileNav = createMobileNav();
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
    });
  }
} catch (err) { console.error('Hamburger menu error:', err); }

// ── PROJECT TABS ──────────────────────────
try {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(tab + '-tab');
      if (target) target.classList.add('active');
    });
  });
} catch (err) { console.error('Project tabs error:', err); }

// ── SCROLL REVEAL ──────────────────────────
// Note: CSS also has a 1.2s forced-visible fallback animation,
// so even if this block fails, content still appears.
try {
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
      '.about-card, .team-card, .project-card, .package-card, .contact-card'
    ).forEach((el) => {
      el.classList.add('reveal');
      const siblings = el.parentElement.querySelectorAll(':scope > *');
      const idx = Array.from(siblings).indexOf(el);
      if (idx === 1) el.classList.add('reveal-delay-1');
      if (idx === 2) el.classList.add('reveal-delay-2');
      if (idx === 3) el.classList.add('reveal-delay-3');
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(
      '.about-card, .team-card, .project-card, .package-card, .contact-card'
    ).forEach(el => el.classList.add('visible'));
  }
} catch (err) {
  console.error('Scroll reveal error:', err);
  document.querySelectorAll(
    '.about-card, .team-card, .project-card, .package-card, .contact-card'
  ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
}

// ── CONTACT FORM ──────────────────────────
try {
  const orderForm = document.getElementById('orderForm');
  const formSuccess = document.getElementById('formSuccess');

  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = orderForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const data = {
        name: orderForm.name.value,
        email: orderForm.email.value,
        package: orderForm.package.value,
        message: orderForm.message.value
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          orderForm.classList.add('hidden');
          if (formSuccess) formSuccess.classList.remove('hidden');
        } else {
          btn.textContent = 'Error — Try again';
          btn.disabled = false;
        }
      } catch {
        const msg = `Hello Codexus!\n\nName: ${data.name}\nEmail: ${data.email}\nPackage: ${data.package}\n\nProject: ${data.message}`;
        // ✏️ EDIT: Replace with your WhatsApp number
        window.open(`https://wa.me/254700000000?text=${encodeURIComponent(msg)}`, '_blank');
        btn.textContent = 'Send Request';
        btn.disabled = false;
      }
    });
  }
} catch (err) { console.error('Contact form error:', err); }

// ── ACTIVE NAV LINK on scroll ─────────────
try {
  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinksAll.forEach(a => {
            a.classList.toggle('active-nav', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));
  }
} catch (err) { console.error('Active nav link error:', err); }
