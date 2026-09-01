document.addEventListener('DOMContentLoaded', function() {
  var headerEl = document.getElementById('site-header');
  var footerEl = document.getElementById('site-footer');

  if (headerEl) {
    fetch('/includes/header.html')
      .then(function(r) { return r.text(); })
      .then(function(html) {
        headerEl.innerHTML = html;
        var burger = document.querySelector('.ics-burger');
        var menu = document.getElementById('mobileMenu');
        if (burger && menu) {
          burger.addEventListener('click', function() { menu.classList.add('is-open'); });
          var closeBtn = menu.querySelector('.ics-mobile-menu__close');
          if (closeBtn) {
            closeBtn.addEventListener('click', function() { menu.classList.remove('is-open'); });
          }
        }
        document.querySelectorAll('.ics-nav__item button').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
          });
        });
      });
  }

  if (footerEl) {
    fetch('/includes/footer.html')
      .then(function(r) { return r.text(); })
      .then(function(html) { footerEl.innerHTML = html; });
  }
});
