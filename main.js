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
