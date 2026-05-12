(function () {
  var isLegacy =
    typeof document.documentMode !== 'undefined' ||
    /Trident\/|MSIE /.test(navigator.userAgent);
  if (!isLegacy) return;
  var modal = document.getElementById('cap-modal-legacy');
  if (!modal) return;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
})();
