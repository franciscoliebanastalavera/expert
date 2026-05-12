(function () {
  var isLegacy =
    typeof document.documentMode !== 'undefined' ||
    /Trident\/|MSIE /.test(navigator.userAgent);
  if (!isLegacy) return;
  var banner = document.getElementById('cap-legacy-banner');
  if (!banner) return;
  banner.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
})();
