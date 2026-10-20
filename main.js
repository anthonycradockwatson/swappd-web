const MIXPANEL_TOKEN = 'd540da55c4255232e1d58d6fe3ee3ad4';

// Mixpanel browser SDK bootstrap from its installation docs.
(function (f, b) {
  if (!b.__SV) {
    var e, g, i, h;
    window.mixpanel = b;
    b._i = [];
    b.init = function (e, f, c) {
      function g(a, d) {
        var b = d.split(".");
        2 == b.length && ((a = a[b[0]]), (d = b[1]));
        a[d] = function () {
          a.push([d].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      var a = b;
      "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel");
      a.people = a.people || [];
      a.toString = function (a) {
        var d = "mixpanel";
        "mixpanel" !== c && (d += "." + c);
        a || (d += " (stub)");
        return d;
      };
      a.people.toString = function () {
        return a.toString(1) + ".people (stub)";
      };
      i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
      for (h = 0; h < i.length; h++) g(a, i[h]);
      var j = "set set_once union unset remove delete".split(" ");
      a.get_group = function () {
        function b(c) {
          d[c] = function () {
            call2_args = arguments;
            call2 = [c].concat(Array.prototype.slice.call(call2_args, 0));
            a.push([e, call2]);
          };
        }
        for (var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]);
        return d;
      };
      b._i.push([e, f, c]);
    };
    b.__SV = 1.2;
    e = f.createElement("script");
    e.type = "text/javascript";
    e.async = true;
    e.src = typeof MIXPANEL_CUSTOM_LIB_URL !== "undefined"
      ? MIXPANEL_CUSTOM_LIB_URL
      : "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
    g = f.getElementsByTagName("script")[0];
    g.parentNode.insertBefore(e, g);
  }
})(document, window.mixpanel || []);

window.mixpanel.init(MIXPANEL_TOKEN, {
  track_pageview: false,
  autocapture: false,
});
window.mixpanel.track('Page Viewed', {
  page_path: window.location.pathname,
  page_title: document.title,
});

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
