// trying out tracking
const MIXPANEL_TOKEN = 'd540da55c4255232e1d58d6fe3ee3ad4';

const mixpanelScript = document.createElement('script');
mixpanelScript.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
mixpanelScript.onload = () => {
  window.mixpanel.init(MIXPANEL_TOKEN, {
    track_pageview: false,
    autocapture: false,
  });

  window.mixpanel.track('Page Viewed', {
    page_path: window.location.pathname,
    page_title: document.title,
  });
};
mixpanelScript.onerror = () => {
  console.error('Failed to load Mixpanel.');
};
document.head.appendChild(mixpanelScript);

// Use the compact navigation only when the full header links no longer fit.
const navLinks = document.querySelector('.nav__links');
if (navLinks) {
  const header = navLinks.closest('.nav');
  const brand = header?.querySelector('.nav__brand');
  if (header && brand && navLinks.querySelector('.nav__dropdown')) {
    const updateNavigation = () => {
      navLinks.classList.remove('nav__links--compact');
      const headerStyle = getComputedStyle(header);
      const availableWidth =
        header.clientWidth -
        parseFloat(headerStyle.paddingLeft) -
        parseFloat(headerStyle.paddingRight) -
        brand.getBoundingClientRect().width;
      navLinks.classList.toggle('nav__links--compact', navLinks.scrollWidth > availableWidth);
    };

    new ResizeObserver(updateNavigation).observe(header);
    window.addEventListener('resize', updateNavigation);
    document.fonts.ready.then(updateNavigation);
    updateNavigation();
  }
}

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Video slots: if the file named in data-video exists, swap the placeholder for it.
// Drop MP4s into website/videos/ using the names in index.html and refresh.
document.querySelectorAll('.phone[data-video]').forEach(async (slot) => {
  try {
    const res = await fetch(slot.dataset.video, { method: 'HEAD' });
    if (!res.ok) return;
  } catch { return; }

  const video = document.createElement('video');
  video.src = slot.dataset.video;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  slot.classList.add('has-video');
  slot.querySelector('.phone__label')?.remove();
  slot.appendChild(video);

  // Play only while on screen
  new IntersectionObserver(([entry]) => {
    entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
  }, { threshold: 0.4 }).observe(slot);
});

// Legal pages: highlight the sidebar entry for the section being read
(() => {
  const links = document.querySelectorAll('.legal__sections a');
  if (!links.length) return;
  const byId = new Map([...links].map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove('is-active'));
      byId.get(e.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-15% 0px -75% 0px' });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
})();
