// =============================================================================
// challenge.js: the Sprout Challenge page. A countdown to the deadline,
// copy buttons on the commands, and a share button.
// =============================================================================
(function () {
  'use strict';

  // 30 November 2026, 23:59 IST (UTC+5:30) is 18:29 UTC.
  const DEADLINE = Date.UTC(2026, 10, 30, 18, 29, 0);

  const box = document.getElementById('countdown');
  const parts = {};
  box.querySelectorAll('[data-unit]').forEach((b) => { parts[b.dataset.unit] = b; });
  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const left = Math.max(0, DEADLINE - Date.now());
    if (left === 0) {
      box.classList.add('closed');
      box.querySelector('.countdown-label').textContent = 'Entries are closed. Results by 3 December on Instagram.';
      return;
    }
    const s = Math.floor(left / 1000);
    parts.d.textContent = Math.floor(s / 86400);
    parts.h.textContent = pad(Math.floor(s / 3600) % 24);
    parts.m.textContent = pad(Math.floor(s / 60) % 60);
    parts.s.textContent = pad(s % 60);
    setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  tick();

  // Copy buttons: copy the command next to the button.
  document.querySelectorAll('.copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.previousElementSibling.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied';
        btn.classList.add('done');
      } catch (e) {
        // Instagram's in-app browser may block the clipboard: select the text so a long press copies it.
        const range = document.createRange();
        range.selectNodeContents(btn.previousElementSibling);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = 'Selected';
      }
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
    });
  });

  // Rulebook links (#7-scoring) point into folded sections: open the section, then scroll to the target.
  function openTarget() {
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const rule = target && target.closest('details.rule');
    if (rule && !rule.open) {
      rule.open = true;
      target.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', openTarget);
  openTarget();

  // Share: the system share sheet where there is one, else copy the link.
  const share = document.getElementById('share');
  share.addEventListener('click', async () => {
    const data = { title: 'The Sprout Challenge', text: "My robot won't jump this wall. Can your code?", url: location.href.split('#')[0] };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        share.textContent = 'Link copied';
      }
    } catch (e) { /* the share sheet was dismissed */ }
  });
})();
