// Landing page — copy CA, nav, dexscreener embed
(function () {
  'use strict';

  const cfg = typeof TOKEN_CONFIG !== 'undefined' ? TOKEN_CONFIG : {
    ticker: 'SOCCERBRO', ca: 'soccerpump', dexscreener: 'https://dexscreener.com/solana/soccerpump',
    twitter: 'https://x.com/worldsoccerbro', telegram: 'https://t.me/worldsoccerbro'
  };

  function initTokenUI() {
    const caEl = document.getElementById('tokenCa');
    const tickerEl = document.getElementById('tokenTicker');
    if (caEl) caEl.textContent = cfg.ca;
    if (tickerEl) tickerEl.textContent = '$' + cfg.ticker;

    document.querySelectorAll('[data-ca-display]').forEach(el => { el.textContent = cfg.ca; });
    document.querySelectorAll('[data-ticker]').forEach(el => { el.textContent = '$' + cfg.ticker; });

    const tw = document.getElementById('linkTwitter');
    const tg = document.getElementById('linkTelegram');
    const tw2 = document.getElementById('linkTwitter2');
    const tg2 = document.getElementById('linkTelegram2');
    if (tw) tw.href = cfg.twitter;
    if (tg) tg.href = cfg.telegram;
    if (tw2) tw2.href = cfg.twitter;
    if (tg2) tg2.href = cfg.telegram;

    const iframe = document.getElementById('dexscreenerChart');
    if (iframe && cfg.ca) {
      iframe.src = cfg.dexscreener + '?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15';
    }
  }

  function copyCa() {
    const text = cfg.ca;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyCaBtn');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'COPIED!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
      }
    }).catch(() => {
      prompt('Copy contract address:', text);
    });
  }

  document.getElementById('copyCaBtn')?.addEventListener('click', copyCa);

  // Smooth scroll nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('navToggle')?.classList.remove('open');
        document.getElementById('siteNav')?.classList.remove('nav-open');
      }
    });
  });

  document.getElementById('navToggle')?.addEventListener('click', () => {
    document.getElementById('siteNav')?.classList.toggle('nav-open');
    document.getElementById('navToggle')?.classList.toggle('open');
  });

  // Nav highlight on scroll
  const sections = document.querySelectorAll('.landing-section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  initTokenUI();
})();
