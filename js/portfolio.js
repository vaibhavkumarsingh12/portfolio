(() => {
  const controls = document.querySelector('.filters');
  const cases = [...document.querySelectorAll('.case')];
  const status = document.querySelector('#result-status');
  if (!controls || !cases.length || !status) return;

  const buttons = [...controls.querySelectorAll('button[data-filter]')];
  function showCases(selected) {
    const category = selected.dataset.filter;
    let visible = 0;
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === selected)));
    cases.forEach((item) => {
      item.hidden = category !== 'all' && item.dataset.category !== category;
      if (!item.hidden) visible += 1;
    });
    status.textContent = `${visible} case ${visible === 1 ? 'study' : 'studies'} shown.`;
  }
  controls.hidden = false;
  buttons.forEach((button) => button.addEventListener('click', () => showCases(button)));

  function openFeaturedCase() {
    if (window.location.hash !== '#case-commerce') return;
    const featured = document.querySelector('#case-commerce');
    const wasHidden = featured.hidden;
    if (wasHidden) showCases(buttons[0]);
    featured.querySelector('details').open = true;
    if (wasHidden) featured.scrollIntoView({block: 'start'});
  }
  window.addEventListener('hashchange', openFeaturedCase);
  document.querySelector('.signal-footer a').addEventListener('click', () => {
    if (window.location.hash === '#case-commerce') openFeaturedCase();
  });
  openFeaturedCase();
})();
