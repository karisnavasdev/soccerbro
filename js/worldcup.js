// World Cup 2026 — day-by-day schedule with live status
(function () {
  'use strict';

  const MATCH_DURATION_MS = 105 * 60 * 1000; // 90 min + extra time buffer
  const STATUS = { upcoming: 'UPCOMING', live: 'LIVE', finished: 'FT' };

  let selectedDay = null;
  let tickTimer = null;

  function getMatchStatus(match, now) {
    const start = new Date(match.kickoff).getTime();
    const end = start + MATCH_DURATION_MS;
    const t = now.getTime();
    if (t < start) return STATUS.upcoming;
    if (t <= end) return STATUS.live;
    return STATUS.finished;
  }

  function formatKickoff(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function formatDayLabel(dayStr) {
    const d = new Date(dayStr + 'T12:00:00');
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function getTodayStr() {
    const n = new Date();
    const y = n.getFullYear();
    const m = String(n.getMonth() + 1).padStart(2, '0');
    const d = String(n.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getUniqueDays() {
    const days = [];
    const seen = new Set();
    WC2026_MATCHES.forEach(m => {
      if (!seen.has(m.day)) {
        seen.add(m.day);
        days.push(m.day);
      }
    });
    return days;
  }

  function getMatchesForDay(day) {
    return WC2026_MATCHES.filter(m => m.day === day);
  }

  function getDaySummary(day, now) {
    const matches = getMatchesForDay(day);
    let upcoming = 0, live = 0, finished = 0;
    matches.forEach(m => {
      const s = getMatchStatus(m, now);
      if (s === STATUS.upcoming) upcoming++;
      else if (s === STATUS.live) live++;
      else finished++;
    });
    return { total: matches.length, upcoming, live, finished };
  }

  function getDefaultDay(days) {
    const today = getTodayStr();
    if (days.includes(today)) return today;
    if (today < days[0]) return days[0];
    if (today > days[days.length - 1]) return days[days.length - 1];
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i] <= today) return days[i];
    }
    return days[0];
  }

  function renderDayTabs(days, now) {
    const strip = document.getElementById('wcDayStrip');
    if (!strip) return;
    strip.innerHTML = '';
    const today = getTodayStr();

    days.forEach(day => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wc-day-btn' + (day === selectedDay ? ' active' : '') + (day === today ? ' is-today' : '');
      const summary = getDaySummary(day, now);

      btn.innerHTML =
        `<span class="wc-day-label">${formatDayLabel(day)}</span>` +
        `<span class="wc-day-counts">` +
          (summary.live ? `<span class="wc-count live">${summary.live} LIVE</span>` : '') +
          (summary.finished ? `<span class="wc-count ft">${summary.finished} FT</span>` : '') +
          (summary.upcoming ? `<span class="wc-count up">${summary.upcoming} NEXT</span>` : '') +
        `</span>`;

      btn.addEventListener('click', () => {
        selectedDay = day;
        render();
      });
      strip.appendChild(btn);
    });

    requestAnimationFrame(() => {
      const active = strip.querySelector('.wc-day-btn.active');
      if (active) active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  }

  function renderMatchCard(match, now) {
    const status = getMatchStatus(match, now);
    const card = document.createElement('article');
    card.className = 'wc-match' + (status === STATUS.live ? ' is-live' : '');

    const homeFlag = wcGetFlag(match.home);
    const awayFlag = wcGetFlag(match.away);

    card.innerHTML =
      `<div class="wc-match-top">` +
        `<span class="wc-match-time">${formatKickoff(match.kickoff)}</span>` +
        `<span class="wc-match-stage">${match.stage}</span>` +
        `<span class="wc-status wc-status-${status.toLowerCase().replace(' ', '-')}">${status}</span>` +
      `</div>` +
      `<div class="wc-match-teams">` +
        `<span class="wc-team"><span class="wc-flag">${homeFlag}</span>${match.home}</span>` +
        `<span class="wc-vs">VS</span>` +
        `<span class="wc-team"><span class="wc-flag">${awayFlag}</span>${match.away}</span>` +
      `</div>` +
      `<div class="wc-match-venue">📍 ${match.venue}</div>`;

    return card;
  }

  function renderDayHeader(day, now) {
    const header = document.getElementById('wcDayHeader');
    if (!header) return;
    const summary = getDaySummary(day, now);
    const today = getTodayStr();
    const isToday = day === today;

    const parts = [];
    if (summary.live) parts.push(`<span class="wc-summary-live">${summary.live} LIVE</span>`);
    if (summary.finished) parts.push(`<span class="wc-summary-ft">${summary.finished} finished</span>`);
    if (summary.upcoming) parts.push(`<span class="wc-summary-up">${summary.upcoming} upcoming</span>`);

    header.innerHTML =
      `<h3 class="wc-day-title">${formatDayLabel(day)}${isToday ? ' <span class="wc-today-badge">TODAY</span>' : ''}</h3>` +
      `<p class="wc-day-summary">${summary.total} matches · ${parts.join(' · ')}</p>`;
  }

  function renderMatchList(day, now) {
    const list = document.getElementById('wcMatchList');
    if (!list) return;
    list.innerHTML = '';
    const matches = getMatchesForDay(day);
    if (!matches.length) {
      list.innerHTML = '<p class="wc-empty">No matches scheduled.</p>';
      return;
    }
    matches.forEach(m => list.appendChild(renderMatchCard(m, now)));
  }

  function renderTournamentOverview(now) {
    const el = document.getElementById('wcOverview');
    if (!el) return;
    let live = 0, upcoming = 0, finished = 0;
    WC2026_MATCHES.forEach(m => {
      const s = getMatchStatus(m, now);
      if (s === STATUS.live) live++;
      else if (s === STATUS.finished) finished++;
      else upcoming++;
    });
    el.innerHTML =
      `<div class="wc-stat"><span class="wc-stat-val live">${live}</span><span class="wc-stat-lbl">LIVE NOW</span></div>` +
      `<div class="wc-stat"><span class="wc-stat-val up">${upcoming}</span><span class="wc-stat-lbl">UPCOMING</span></div>` +
      `<div class="wc-stat"><span class="wc-stat-val ft">${finished}</span><span class="wc-stat-lbl">FINISHED</span></div>` +
      `<div class="wc-stat"><span class="wc-stat-val">${WC2026_MATCHES.length}</span><span class="wc-stat-lbl">TOTAL</span></div>`;
  }

  function render() {
    const now = new Date();
    const days = getUniqueDays();
    if (!selectedDay) selectedDay = getDefaultDay(days);
    renderTournamentOverview(now);
    renderDayTabs(days, now);
    renderDayHeader(selectedDay, now);
    renderMatchList(selectedDay, now);
  }

  function startTick() {
    if (tickTimer) clearInterval(tickTimer);
    tickTimer = setInterval(render, 30000);
  }

  function init() {
    const section = document.getElementById('worldcup');
    if (!section || typeof WC2026_MATCHES === 'undefined') return;
    render();
    startTick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
