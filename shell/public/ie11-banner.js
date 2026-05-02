(function () {
  var isLegacy =
    typeof document.documentMode !== 'undefined' ||
    /Trident\/|MSIE /.test(navigator.userAgent);
  if (isLegacy) {
    var banner = document.getElementById('cap-legacy-banner');
    if (banner) banner.removeAttribute('hidden');
  }
})();
