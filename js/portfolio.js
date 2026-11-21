(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const normalize = (value) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const workTools = document.querySelector('.work-tools');
  const cases = [...document.querySelectorAll('.case')];
  const status = document.querySelector('#result-status');
  if (workTools && cases.length && status) {
    const buttons = [...workTools.querySelectorAll('[data-filter]')];
    const search = workTools.querySelector('#case-search');
    const reset = workTools.querySelector('.reset-filters');
    const empty = document.querySelector('.no-results');
    const searchable = cases.map((item) => [
      item, normalize(item.textContent + ' ' + (item.dataset.keywords || '')),
    ]);
    let category = 'all';

    function showCases() {
      const terms = normalize(search.value).split(' ').filter(Boolean);
      let visible = 0;
      buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
      searchable.forEach(([item, text]) => {
        item.hidden = (category !== 'all' && item.dataset.category !== category) ||
          !terms.every((term) => text.includes(term));
        if (!item.hidden) visible += 1;
      });
      const message = `${visible} of ${cases.length} case studies`;
      if (status.textContent !== message) status.textContent = message;
      empty.hidden = visible > 0;
      reset.hidden = category === 'all' && !search.value;
    }
    function clearFilters() {
      category = 'all';
      search.value = '';
      showCases();
    }
    buttons.forEach((button) => button.addEventListener('click', () => {
      category = button.dataset.filter;
      showCases();
    }));
    search.addEventListener('input', showCases);
    reset.addEventListener('click', () => {
      search.focus();
      clearFilters();
    });
    workTools.hidden = false;
    showCases();

    function openLinkedCase(hash, focus = false) {
      const match = cases.find((item) => '#' + item.id === hash);
      if (!match) return;
      const wasHidden = match.hidden;
      if (wasHidden) clearFilters();
      const detail = match.querySelector('details');
      detail.open = true;
      if (focus) detail.querySelector('summary').focus({preventScroll: true});
      if (wasHidden || focus) match.scrollIntoView({block: 'start'});
    }
    window.addEventListener('hashchange', () => openLinkedCase(window.location.hash));
    document.querySelectorAll('a[href^="#case-"]').forEach((link) => link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      openLinkedCase(link.hash, true);
    }));
    openLinkedCase(window.location.hash);
  }

  const signal = document.querySelector('.signal');
  if (signal) {
    const controls = signal.querySelector('.response-controls');
    const reading = signal.querySelector('.signal-reading');
    const values = {
      no: ['45.2', 'said they wouldn’t.'],
      maybe: ['38.7', 'said they might.'],
      yes: ['16.1', 'said they would.'],
    };
    let animation;
    controls.hidden = false;
    signal.querySelector('.chart-hint').hidden = false;
    signal.querySelector('.legend').hidden = true;
    const buttons = [...controls.querySelectorAll('button')];
    buttons.forEach((button) => button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const selected = button.dataset.response;
      const [value, answer] = values[selected];
      signal.dataset.selected = selected;
      reading.querySelector('#response-value').textContent = value;
      reading.querySelector('#response-text').textContent = answer;
      buttons.forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
      if (animation) animation.cancel();
      if (!reduced.matches && reading.animate) {
        animation = reading.animate([{opacity: 0.62, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 230, easing: 'ease-out'});
      }
    }));
    if (reduced.addEventListener) reduced.addEventListener('change', () => {
      if (reduced.matches && animation) animation.cancel();
    });
  }

  const header = document.querySelector('.header');
  const nav = [...document.querySelectorAll('.masthead nav a[href^="#"]')];
  const sections = nav.map((link) => [link, document.getElementById(link.hash.slice(1))])
    .filter(([, section]) => section);
  let ticking = false;
  function updateNav() {
    const edge = header.offsetHeight + 35;
    let active = null;
    for (const [link, section] of sections) {
      if (section.getBoundingClientRect().top > edge) break;
      active = link;
    }
    if (window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
      active = sections.at(-1)?.[0];
    }
    sections.forEach(([link]) => {
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    ticking = false;
  }
  function queueNav() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateNav);
  }
  if (header && sections.length) {
    window.addEventListener('scroll', queueNav, {passive: true});
    window.addEventListener('resize', queueNav);
    queueNav();
  }

  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }), {threshold: 0.12});
    document.querySelectorAll('.case, .about, .skill, .contact-grid').forEach((item) => observer.observe(item));
  }
})();
