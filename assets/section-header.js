// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.contains('is-open');
      
      if (isOpen) {
        mobileMenu.classList.remove('is-open');
        document.body.classList.remove('mobile-menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.add('is-open');
        document.body.classList.add('mobile-menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }
});
