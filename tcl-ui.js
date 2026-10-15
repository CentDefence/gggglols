/* TRS CIS League shared UI: Terms & Privacy sheet, island back button, verified players in search */
(function () {
  'use strict';
  var esc = function (v) { var e = document.createElement('span'); e.textContent = String(v == null ? '' : v); return e.innerHTML; };
  var NAMES = { home: 'Home', s7: 'Season 7', s8: 'Season 8', s9: 'Season 9', s10: 'Season 10', about: 'About' };

  var css = [
    '#tcl-legal{position:fixed;inset:0;z-index:400;visibility:hidden;pointer-events:none}',
    '#tcl-legal.open{visibility:visible;pointer-events:auto}',
    '#tcl-legal .bd{position:absolute;inset:0;background:rgba(6,4,16,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transition:opacity .35s ease}',
    '#tcl-legal.open .bd{opacity:1}',
    '#tcl-legal .sh{position:absolute;left:50%;bottom:0;width:min(720px,100%);max-height:84vh;display:flex;flex-direction:column;border:1px solid rgba(205,184,255,.22);border-bottom:0;border-radius:24px 24px 0 0;background:linear-gradient(160deg,#211a35,#12111c 70%);box-shadow:0 -24px 80px #000a;color:#f2effa;transform:translate(-50%,105%);transition:transform .5s cubic-bezier(.22,1,.36,1);font-family:Inter,Montserrat,system-ui,sans-serif;padding-bottom:env(safe-area-inset-bottom,0px)}',
    '#tcl-legal.open .sh{transform:translate(-50%,0)}',
    '#tcl-legal .gr{padding:12px 0 6px;cursor:grab;touch-action:none;display:grid;place-items:center}',
    '#tcl-legal .gr i{width:42px;height:5px;border-radius:9px;background:#ffffff33}',
    '#tcl-legal .hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 24px 14px}',
    '#tcl-legal .tabs{display:flex;gap:6px;padding:4px;border:1px solid #ffffff18;border-radius:999px;background:#0d0c14}',
    '#tcl-legal .tabs button{border:0;padding:8px 16px;border-radius:999px;background:transparent;color:#aaa5bd;font-weight:700;font-size:12px;font-family:inherit;cursor:pointer}',
    '#tcl-legal .tabs button.on{background:#6f55cc;color:#fff}',
    '#tcl-legal .x{width:34px;height:34px;border:1px solid #ffffff1f;border-radius:10px;background:#ffffff0a;color:#ddd8ec;cursor:pointer;font-size:18px;line-height:1}',
    '#tcl-legal .bd2{overflow:auto;padding:4px 24px 28px;font-size:13px;line-height:1.75;color:#bdb8cc;overscroll-behavior:contain}',
    '#tcl-legal h3{margin:20px 0 6px;font-size:14px;color:#fff;letter-spacing:-.01em}',
    '#tcl-legal h3:first-child{margin-top:4px}',
    '#tcl-legal p,#tcl-legal li{margin:0 0 8px}',
    '#tcl-legal ul{padding-left:18px;margin:0 0 8px}',
    '#tcl-legal .pn{display:none}#tcl-legal .pn.on{display:block}',
    '#tcl-legal .up{margin-top:18px;font-size:11px;color:#7f7a92}',
    /* island */
    '#tcl-island{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 92px);z-index:60;display:flex;align-items:center;gap:10px;height:44px;padding:0 18px 0 6px;border:1px solid #ffffff1c;border-radius:999px;background:#07060c;color:#fff;font-family:Inter,Montserrat,system-ui,sans-serif;cursor:pointer;box-shadow:0 14px 40px #000a,0 0 0 1px #000;transform:translate(-50%,-30px) scale(.3);opacity:0;visibility:hidden;transform-origin:50% 0;transition:transform .55s cubic-bezier(.34,1.56,.64,1),opacity .25s ease,visibility 0s .55s,padding .4s ease}',
    '#tcl-island.on{transform:translate(-50%,0) scale(1);opacity:1;visibility:visible;transition:transform .55s cubic-bezier(.34,1.56,.64,1),opacity .25s ease,visibility 0s}',
    '#tcl-island:hover{background:#0f0d18}',
    '#tcl-island:active{transform:translate(-50%,0) scale(.96)}',
    '#tcl-island .ar{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#8a6cf0,#5f4ec7)}',
    '#tcl-island .ar svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
    '#tcl-island .tx{display:flex;flex-direction:column;text-align:left;line-height:1.15}',
    '#tcl-island small{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#9a94b1;font-weight:700}',
    '#tcl-island b{font-size:12px;font-weight:800;white-space:nowrap}',
    '@media(max-width:700px){#tcl-island{top:calc(env(safe-area-inset-top,0px) + 86px)}}',
    /* verified search */
    '.vf-chip{display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:2px 8px;border-radius:999px;background:#39d99a1c;border:1px solid #39d99a55;color:#55e2ad;font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;vertical-align:middle;cursor:pointer}',
    '.vf-chip:hover{background:#39d99a33}',
    '.vf-sec{padding:6px 0 8px;border-bottom:1px solid rgba(255,255,255,.08)}',
    '.vf-h{padding:10px 16px 4px;font-size:10px;letter-spacing:.16em;font-weight:800;text-transform:uppercase;color:#bda7ff}',
    '.vf-row{display:flex;align-items:center;gap:12px;padding:9px 16px;color:#f2effa;text-decoration:none}',
    '.vf-row:hover{background:#ffffff0a}',
    '.vf-row img{width:34px;height:34px;border-radius:50%;object-fit:cover;background:#2a2736}',
    '.vf-row span{display:block;font-size:13px;font-weight:700}',
    '.vf-row small{display:block;margin-top:2px;font-size:11px;color:#9a94b1;font-weight:500}',
    '.account-link.me{display:inline-flex;align-items:center;gap:8px}',
    '.account-link.me img{width:20px;height:20px;border-radius:50%;object-fit:cover}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- Terms & Privacy sheet ---------- */
  var legal = document.createElement('div');
  legal.id = 'tcl-legal';
  legal.setAttribute('aria-hidden', 'true');
  legal.innerHTML =
    '<div class="bd" data-legal-close></div>' +
    '<section class="sh" role="dialog" aria-modal="true" aria-label="Terms and Privacy">' +
    '<div class="gr" id="tcl-legal-grab"><i></i></div>' +
    '<div class="hd"><div class="tabs"><button type="button" data-tab="terms" class="on">Terms</button><button type="button" data-tab="privacy">Privacy</button></div><button class="x" type="button" data-legal-close aria-label="Close">&times;</button></div>' +
    '<div class="bd2">' +
    '<div class="pn on" data-pn="terms">' +
    '<h3>1. About this site</h3><p>TRS CIS League is a community-run football league. This website shows league seasons, results and verified player profiles. It is not affiliated with Roblox Corporation or Discord Inc.</p>' +
    '<h3>2. Verification</h3><p>Verification links one Discord account and one Roblox account to a single league profile. One Discord account and one Roblox account can belong to only one profile. Do not link accounts that are not yours.</p>' +
    '<h3>3. Your conduct</h3><ul><li>Follow the rules of the league Discord server.</li><li>Do not impersonate other players or staff.</li><li>Do not abuse the site, its sign-in flow or its bot.</li></ul>' +
    '<h3>4. Changes and removal</h3><p>League staff may remove a verified role or profile for rule violations. We may update these terms as the site evolves; continuing to use the site means you accept the current version.</p>' +
    '<p class="up">Community-written summary, not legal advice.</p></div>' +
    '<div class="pn" data-pn="privacy">' +
    '<h3>What we receive</h3><p>When you verify, Discord and Roblox send us only public identity details: user ID, username, display name and avatar. We never see or store your passwords.</p>' +
    '<h3>What is public</h3><p>Once verified, your Roblox username, display name and avatar, your Discord username and avatar, and your verification date appear on your player profile. Anyone can find it through player search. Discord and Roblox IDs are not shown to other visitors.</p>' +
    '<h3>What we store</h3><ul><li>Your linked account details and verification date, in the league database.</li><li>A signed, HttpOnly session cookie that keeps you logged in for up to 30 days.</li><li>Short-lived sign-in data, deleted automatically within minutes.</li></ul>' +
    '<h3>Discord server changes</h3><p>Verification lets the league bot add you to the server, give you the verified role and set your server nickname to your Roblox username.</p>' +
    '<h3>Removing your data</h3><p>Log out any time from your profile. To delete your profile and unlink your accounts, contact league staff on Discord.</p>' +
    '<p class="up">Community-written summary, not legal advice.</p></div>' +
    '</div></section>';
  document.body.appendChild(legal);

  var returnFocus = null;
  function openLegal(tab) {
    returnFocus = document.activeElement;
    setTab(tab === 'privacy' ? 'privacy' : 'terms');
    legal.classList.add('open'); legal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    legal.querySelector('.sh').style.transform = '';
  }
  function closeLegal() {
    legal.classList.remove('open'); legal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    var sh = legal.querySelector('.sh'); sh.style.transition = ''; sh.style.transform = '';
    if (returnFocus && returnFocus.focus) returnFocus.focus();
  }
  function setTab(t) {
    [].forEach.call(legal.querySelectorAll('[data-tab]'), function (b) { b.classList.toggle('on', b.dataset.tab === t); });
    [].forEach.call(legal.querySelectorAll('[data-pn]'), function (p) { p.classList.toggle('on', p.dataset.pn === t); });
    legal.querySelector('.bd2').scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-legal]');
    if (a) { e.preventDefault(); openLegal(a.dataset.legal); return; }
    var t = e.target.closest('#tcl-legal [data-tab]');
    if (t) { setTab(t.dataset.tab); return; }
    if (e.target.closest('[data-legal-close]')) closeLegal();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && legal.classList.contains('open')) closeLegal(); });
  (function swipe() {
    var grab = document.getElementById('tcl-legal-grab'), sh = legal.querySelector('.sh'), y0 = null;
    grab.addEventListener('pointerdown', function (e) { y0 = e.clientY; sh.style.transition = 'none'; grab.setPointerCapture(e.pointerId); });
    grab.addEventListener('pointermove', function (e) { if (y0 === null) return; var d = Math.max(0, e.clientY - y0); sh.style.transform = 'translate(-50%,' + d + 'px)'; });
    function end(e) { if (y0 === null) return; var d = e.clientY - y0; y0 = null; sh.style.transition = ''; if (d > 90) closeLegal(); else sh.style.transform = ''; }
    grab.addEventListener('pointerup', end); grab.addEventListener('pointercancel', end);
  })();
  window.openLegal = openLegal;

  /* ---------- Island back button ---------- */
  var isl = document.createElement('button');
  isl.id = 'tcl-island'; isl.type = 'button'; isl.setAttribute('aria-label', 'Go back');
  isl.innerHTML = '<span class="ar"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></span><span class="tx"><small>Back to</small><b id="tcl-island-t">Home</b></span>';
  document.body.appendChild(isl);
  var islT = document.getElementById('tcl-island-t');
  function showIsland(label) { islT.textContent = label; isl.classList.add('on'); }
  function hideIsland() { isl.classList.remove('on'); }

  var sameOriginRef = '';
  try { var r = new URL(document.referrer); if (r.origin === location.origin) sameOriginRef = r.pathname + r.hash; } catch (e) {}
  function labelFromRef(p) {
    if (/profile/.test(p)) return 'Profile';
    if (/verify/.test(p)) return 'Verification';
    var h = (p.split('#')[1] || ''); return NAMES[h] || 'Home';
  }

  var onIndex = typeof window.draw === 'function' && typeof window.go === 'function' && document.getElementById('app');
  if (onIndex) {
    var od = window.draw, og = window.go, cur = 'home', stack = [];
    if (sameOriginRef && !/(^\/$|index\.html)/.test(sameOriginRef.split('#')[0] || '/') && /\.html/.test(sameOriginRef)) stack.push('EXT:' + labelFromRef(sameOriginRef));
    var labelOf = function (item) { return item.indexOf('EXT:') === 0 ? item.slice(4) : (NAMES[item] || 'Home'); };
    var sync = function () { if (stack.length) showIsland(labelOf(stack[stack.length - 1])); else hideIsland(); };
    window.draw = function (id) { cur = id; try { history.replaceState(history.state, '', '#' + id); } catch (e) {} var out = od.apply(this, arguments); sync(); return out; };
    window.go = function (id) { if (id !== cur) { stack.push(cur); sync(); } return og(id); };
    isl.addEventListener('click', function () {
      var prev = stack.pop();
      if (!prev) return;
      if (prev.indexOf('EXT:') === 0) { stack.push(prev); if (history.length > 1) history.back(); else location.href = '/profile.html'; return; }
      sync(); og(prev);
    });
    /* deep links from other pages: /#s8, /#about, /#search */
    var h = location.hash.slice(1);
    if (NAMES[h] || h === 'search') {
      var enter = document.getElementById('go'); if (enter) enter.click();
      if (NAMES[h] && h !== 'home') window.draw(h);
      if (h === 'search') setTimeout(function () { var b = document.getElementById('search-open'); if (b) b.click(); }, 900);
    }
    sync();
  } else if (sameOriginRef) {
    showIsland(labelFromRef(sameOriginRef));
    isl.addEventListener('click', function () { if (history.length > 1) history.back(); else location.href = '/'; });
  }

  /* ---------- Index only: logged-in link + verified players in search ---------- */
  if (onIndex) {
    fetch('/api/profile', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (p) {
      if (!p) return;
      var name = (p.roblox && (p.roblox.displayName || p.roblox.username)) || 'Profile';
      [].forEach.call(document.querySelectorAll('.account-link, #links a[href="/verify.html"]'), function (a) {
        a.setAttribute('href', '/profile.html');
        if (a.classList.contains('account-link')) {
          a.classList.add('me');
          a.innerHTML = (p.roblox && p.roblox.avatar ? '<img alt="" src="' + esc(p.roblox.avatar) + '">' : '') + esc(name);
        } else a.textContent = 'My profile';
      });
    }).catch(function () {});

    var verified = {};
    fetch('/api/players').then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
      (list || []).forEach(function (m) { if (m && m.u) verified[String(m.u).toLowerCase()] = m; });
      decorate();
    }).catch(function () {});

    var out = document.getElementById('global-results'), q = document.getElementById('global-q'), busy = false;
    function decorate() {
      if (!out || busy) return;
      busy = true;
      var old = out.querySelector('.vf-sec'); if (old) old.remove();
      var seen = {};
      [].forEach.call(out.querySelectorAll('.result-row'), function (row) {
        var n = (row.getAttribute('data-name') || '').toLowerCase();
        var tag = row.querySelector('.result-name');
        if (n && verified[n] && tag) {
          seen[n] = 1;
          var chip = tag.querySelector('.vf-chip');
          if (!chip) {
            chip = document.createElement('span'); chip.className = 'vf-chip'; chip.setAttribute('data-profile', verified[n].u);
            chip.textContent = '\u2713 Profile'; chip.title = 'Open verified profile';
            var small = tag.querySelector('small'); tag.insertBefore(chip, small || null);
          }
        }
      });
      var term = q ? q.value.trim().toLowerCase().replace(/^@/, '') : '';
      if (term) {
        var hits = Object.keys(verified).filter(function (k) { return k.indexOf(term) > -1 || String(verified[k].d || '').toLowerCase().indexOf(term) > -1; }).slice(0, 6);
        if (hits.length) {
          var sec = document.createElement('div'); sec.className = 'vf-sec';
          sec.innerHTML = '<div class="vf-h">Verified members</div>' + hits.map(function (k) {
            var m = verified[k];
            return '<a class="vf-row" href="/profile.html?u=' + encodeURIComponent(m.u) + '">' + (m.a ? '<img alt="" src="' + esc(m.a) + '">' : '<img alt="">') + '<div><span>' + esc(m.d || m.u) + '</span><small>@' + esc(m.u) + ' \u00b7 Verified profile</small></div></a>';
          }).join('');
          out.insertBefore(sec, out.firstChild);
        }
      }
      if (obs) obs.takeRecords();
      busy = false;
    }
    var obs = null;
    if (out && 'MutationObserver' in window) { obs = new MutationObserver(decorate); obs.observe(out, { childList: true }); }
    if (out) out.addEventListener('click', function (e) {
      var c = e.target.closest('[data-profile]');
      if (c) { e.preventDefault(); e.stopPropagation(); location.href = '/profile.html?u=' + encodeURIComponent(c.getAttribute('data-profile')); }
    }, true);
  }
})();
