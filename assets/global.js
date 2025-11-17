/**
 * Global JavaScript for Sloe Essence Theme
 */

class MobileMenu {
  constructor() {
    this.mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]');
    this.mobileMenu = document.querySelector('[data-mobile-menu]');
    this.overlay = document.querySelector('[data-mobile-menu-overlay]');
    
    if (this.mobileMenuButton) {
      this.init();
    }
  }

  init() {
    this.mobileMenuButton.addEventListener('click', this.toggle.bind(this));
    
    if (this.overlay) {
      this.overlay.addEventListener('click', this.close.bind(this));
    }

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.mobileMenu?.classList.add('is-open');
    this.mobileMenuButton?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-menu-open');
  }

  close() {
    this.mobileMenu?.classList.remove('is-open');
    this.mobileMenuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-menu-open');
  }

  isOpen() {
    return this.mobileMenu?.classList.contains('is-open');
  }
}

class NewsletterForm {
  constructor() {
    this.forms = document.querySelectorAll('[data-newsletter-form]');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('contact[email]');
    
    if (!this.isValidEmail(email)) {
      this.showMessage(form, 'Please enter a valid email address.', 'error');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      submitButton.textContent = 'Subscribing...';
      submitButton.disabled = true;

      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData)
      });

      if (response.ok) {
        this.showMessage(form, 'Thank you for subscribing!', 'success');
        form.reset();
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      this.showMessage(form, 'Something went wrong. Please try again.', 'error');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showMessage(form, message, type) {
    let messageEl = form.querySelector('.form-message');
    
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.className = 'form-message';
      form.appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `form-message form-message--${type}`;
    
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }
}

class SmoothScroll {
  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]');
    this.init();
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener('click', this.handleClick.bind(this));
    });
  }

  handleClick(event) {
    event.preventDefault();
    
    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

class CartDrawer {
  constructor() {
    this.drawer = document.querySelector('[data-cart-drawer]');
    this.overlay = document.querySelector('[data-cart-drawer-overlay]');
    this.openButtons = document.querySelectorAll('[data-cart-drawer-open]');
    this.closeButtons = document.querySelectorAll('[data-cart-drawer-close]');
    
    if (this.drawer) {
      this.init();
    }
  }

  init() {
    this.openButtons.forEach(button => {
      button.addEventListener('click', this.open.bind(this));
    });

    this.closeButtons.forEach(button => {
      button.addEventListener('click', this.close.bind(this));
    });

    if (this.overlay) {
      this.overlay.addEventListener('click', this.close.bind(this));
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open() {
    this.drawer?.classList.add('is-open');
    document.body.classList.add('cart-drawer-open');
  }

  close() {
    this.drawer?.classList.remove('is-open');
    document.body.classList.remove('cart-drawer-open');
  }

  isOpen() {
    return this.drawer?.classList.contains('is-open');
  }
}

class ProductCardActions {
  constructor() {
    this.cards = document.querySelectorAll('[data-product-card]');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      const button = card.querySelector('[data-add-to-cart]');
      if (button) {
        button.addEventListener('click', this.handleAddToCart.bind(this));
      }
    });
  }

  async handleAddToCart(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const productId = button.getAttribute('data-product-id');
    const variantId = button.getAttribute('data-variant-id');
    
    if (!variantId) {
      console.error('Variant ID not found');
      return;
    }

    const originalText = button.textContent;
    
    try {
      button.textContent = 'Adding...';
      button.disabled = true;

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: variantId,
            quantity: 1
          }]
        })
      });

      if (response.ok) {
        button.textContent = 'Added!';
        
        // Update cart count if exists
        this.updateCartCount();
        
        // Open cart drawer if it exists
        const cartDrawer = document.querySelector('[data-cart-drawer]');
        if (cartDrawer) {
          setTimeout(() => {
            cartDrawer.classList.add('is-open');
          }, 500);
        }
        
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      button.textContent = 'Error';
      console.error('Add to cart error:', error);
    } finally {
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    }
  }

  async updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      const countElements = document.querySelectorAll('[data-cart-count]');
      countElements.forEach(el => {
        el.textContent = cart.item_count;
      });
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
  new NewsletterForm();
  new SmoothScroll();
  new CartDrawer();
  new ProductCardActions();
});

// Shopify Theme Inspector for production debugging
if (window.Shopify && window.Shopify.designMode) {
  document.documentElement.classList.add('shopify-design-mode');
}