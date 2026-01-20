// ===================================
// DREAMKNOT WEDDINGS - MAIN JAVASCRIPT
// ===================================

// ===== GLOBAL VARIABLES =====
let currentSlide = 0;
let slideInterval;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initHeroSlideshow();
  initScrollEffects();
  initFormValidation();
  initSmoothScroll();
  initAnimations();
  initSearchFunctionality();
  initDestinationsSlider();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
      body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        body.style.overflow = '';
      }
    });

    // Handle dropdown in mobile
    const dropdowns = document.querySelectorAll('.nav-menu .dropdown');
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    });
  }
}

// ===== HERO SLIDESHOW =====
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');

  if (slides.length > 0) {
    // Show first slide
    slides[0].classList.add('active');

    // Auto-advance slides
    slideInterval = setInterval(() => {
      nextSlide(slides);
    }, 5000);

    // Add navigation dots if container exists
    const dotsContainer = document.querySelector('.slideshow-dots');
    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(slides, index));
        dotsContainer.appendChild(dot);
      });
    }
  }
}

function nextSlide(slides) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
  updateDots();
}

function goToSlide(slides, index) {
  slides[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  updateDots();

  // Reset interval
  clearInterval(slideInterval);
  slideInterval = setInterval(() => nextSlide(slides), 5000);
}

function updateDots() {
  const dots = document.querySelectorAll('.slideshow-dots .dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
  const header = document.querySelector('.top-header');
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    // Add scrolled class to header
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = document.querySelector('.top-header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          const mainNav = document.querySelector('.main-nav');
          const menuToggle = document.querySelector('.mobile-menu-toggle');
          if (mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
          }
        }
      }
    });
  });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (validateForm(this)) {
        handleFormSubmit(this);
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

  inputs.forEach(input => {
    const errorElement = input.parentElement.querySelector('.error-message');

    // Remove existing error
    if (errorElement) {
      errorElement.remove();
    }
    input.classList.remove('error');

    // Validate
    if (!input.value.trim()) {
      showError(input, 'This field is required');
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      showError(input, 'Please enter a valid email');
      isValid = false;
    } else if (input.type === 'tel' && !isValidPhone(input.value)) {
      showError(input, 'Please enter a valid phone number');
      isValid = false;
    }
  });

  return isValid;
}

function showError(input, message) {
  input.classList.add('error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = '#e91e63';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.marginTop = '5px';
  input.parentElement.appendChild(errorDiv);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
}

function handleFormSubmit(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  // Show loading state
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="loading"></span> Sending...';

  // Simulate form submission (replace with actual API call)
  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.textContent = originalText;

    // Show success message
    showNotification('Thank you! We will contact you soon.', 'success');
    form.reset();
  }, 2000);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== SEARCH FUNCTIONALITY =====
// ===== SEARCH FUNCTIONALITY =====
function initSearchFunctionality() {
  // Updated selectors for the new realistic search bar
  const searchInput = document.querySelector('.hero-search-container input[name="search"]');
  const searchButton = document.querySelector('.hero-search-container .search-btn');

  if (searchInput && searchButton) {
    searchButton.addEventListener('click', function (e) {
      e.preventDefault();
      const query = searchInput.value.trim();
      const typeSelect = document.getElementById('type-search');
      const typeValue = typeSelect ? typeSelect.value : '';

      if (query) {
        performSearch(query);
      } else if (typeValue) {
        // If only type is selected, go to destinations page filtered by type
        window.location.href = `destinations.html?type=${typeValue}`;
      }
    });

    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
          performSearch(query);
        }
      }
    });
  }
}

function performSearch(query) {
  // Normalize query
  const searchLower = query.toLowerCase().trim();

  // Check if query matches a destination in our data
  const destination = destinationsData.find(d =>
    d.id === searchLower ||
    d.title.toLowerCase() === searchLower ||
    d.location.toLowerCase().includes(searchLower)
  );

  if (destination) {
    // Redirect to that destination's detail page
    window.location.href = `destination-detail.html?location=${destination.id}`;
  } else {
    // Show alert and redirect to contact/general page
    showNotification(`We don't have "${query}" listed yet, but we will contact you soon!`, 'info');
    setTimeout(() => {
      window.location.href = 'contact.html';
    }, 2000);
  }
}

// ===== ANIMATIONS =====
function initAnimations() {
  // Add stagger animation to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img.lazy').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== ACTIVE NAVIGATION HIGHLIGHT =====
function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-menu a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

updateActiveNav();

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

initBackToTop();

// ===== DESTINATIONS SLIDER =====
const destinationsData = [
  {
    id: 'goa',
    title: 'Goa',
    image: 'image/d1.jpg',
    venueCount: '50+',
    description: 'Tropical paradise where your wedding becomes a celebration of sun, sand, and sea.',
    type: 'beach',
    budget: 'medium',
    location: 'West Coast, India',
    rating: '4.8',
    guests: '50-500',
    price: '₹5L'
  },
  {
    id: 'jaipur',
    title: 'Jaipur',
    image: 'image/d2.jpg',
    venueCount: '40+',
    description: 'Unveil royal grandeur in the majestic and culturally rich Pink City.',
    type: 'palace',
    budget: 'high',
    location: 'Rajasthan, India',
    rating: '4.9',
    guests: '100-1000',
    price: '₹10L'
  },
  {
    id: 'udaipur',
    title: 'Udaipur',
    image: 'image/d3.jpg',
    venueCount: '50+',
    description: 'Royal affair among the majestic palaces of the City of Lakes.',
    type: 'palace',
    budget: 'luxury',
    location: 'Rajasthan, India',
    rating: '5.0',
    guests: '100-800',
    price: '₹20L'
  },
  {
    id: 'lonavla',
    title: 'Lonavla',
    image: 'image/d4.jpg',
    venueCount: '30+',
    description: 'Celebrate your eternal bond in the breathtaking hills of Lonavla.',
    type: 'hill',
    budget: 'medium',
    location: 'Maharashtra, India',
    rating: '4.7',
    guests: '50-400',
    price: '₹4L'
  },
  {
    id: 'kerala',
    title: 'Kerala',
    image: 'image/Backwaters-Wedding-in-Kerala3.jpg',
    venueCount: '35+',
    description: 'Exchange vows in the serene backwaters and lush greenery of God\'s Own Country.',
    type: 'beach',
    budget: 'medium',
    location: 'South India',
    rating: '4.8',
    guests: '50-300',
    price: '₹6L'
  },
  {
    id: 'mussoorie',
    title: 'Mussoorie',
    image: 'image/mussorie.jpeg',
    venueCount: '25+',
    description: 'A romantic wedding amidst the misty hills and panoramic views of the Himalayas.',
    type: 'hill',
    budget: 'medium',
    location: 'Uttarakhand, India',
    rating: '4.7',
    guests: '50-300',
    price: '₹5L'
  },
  {
    id: 'rishikesh',
    title: 'Rishikesh',
    image: 'image/rishikesh.jpeg',
    venueCount: '20+',
    description: 'A spiritual and scenic destination by the holy Ganges for a unique wedding.',
    type: 'hill',
    budget: 'low',
    location: 'Uttarakhand, India',
    rating: '4.6',
    guests: '50-250',
    price: '₹3L'
  },
  {
    id: 'shimla',
    title: 'Shimla',
    image: 'image/shimla.jpeg',
    venueCount: '30+',
    description: 'Classic colonial charm and snow-capped peaks for a fairytale wedding.',
    type: 'hill',
    budget: 'medium',
    location: 'Himachal Pradesh, India',
    rating: '4.7',
    guests: '50-400',
    price: '₹6L'
  },
  {
    id: 'agra',
    title: 'Agra',
    image: 'image/agra.jpeg',
    venueCount: '15+',
    description: 'Celebrate love in the city of the Taj Mahal, the ultimate symbol of eternal devotion.',
    type: 'city',
    budget: 'medium',
    location: 'Uttar Pradesh, India',
    rating: '4.5',
    guests: '100-600',
    price: '₹7L'
  },
  {
    id: 'andaman',
    title: 'Andaman',
    image: 'image/Beach-Wedding3.jpeg',
    venueCount: '10+',
    description: 'Exotic island weddings with turquoise waters and white sandy beaches.',
    type: 'beach',
    budget: 'high',
    location: 'Andaman Islands, India',
    rating: '4.9',
    guests: '20-150',
    price: '₹12L'
  },
  {
    id: 'jodhpur',
    title: 'Jodhpur',
    image: 'image/s4.jpg',
    venueCount: '30+',
    description: 'The Blue City offers magnificent forts and palaces for a truly regal wedding experience.',
    type: 'palace',
    budget: 'luxury',
    location: 'Rajasthan, India',
    rating: '4.9',
    guests: '100-800',
    price: '₹15L'
  },
  {
    id: 'dubai',
    title: 'Dubai',
    image: 'image/dubai.jpg',
    venueCount: '60+',
    description: 'Modern luxury meets desert tradition in the cosmopolitan city of gold.',
    type: 'international',
    budget: 'luxury',
    location: 'UAE',
    rating: '5.0',
    guests: '100-2000',
    price: '₹50L'
  },
  {
    id: 'thailand',
    title: 'Thailand',
    image: 'image/thailand.jpg',
    venueCount: '80+',
    description: 'Perfect tropical escape with world-class hospitality and stunning sunset beaches.',
    type: 'international',
    budget: 'high',
    location: 'Southeast Asia',
    rating: '4.8',
    guests: '50-500',
    price: '₹25L'
  }
];

function initDestinationsSlider() {
  const wrapper = document.getElementById('destinations-wrapper');
  if (!wrapper) return;

  renderDestinations(wrapper);

  new Swiper('.destination-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    loop: true,
  });
}

// ===== VENUE MODAL FUNCTIONS =====
function openVenueModal(image, title, price, location) {
  const modal = document.getElementById('venueModal');
  if (!modal) return;

  // Populate Modal Data
  const modalImg = document.getElementById('modal-img');
  if (modalImg) modalImg.src = image;

  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) modalTitle.textContent = title;

  const modalPrice = document.getElementById('modal-price');
  if (modalPrice) modalPrice.textContent = price.includes('₹') ? price : `Starting from ₹${price} Lakhs`;

  const modalLocation = document.getElementById('modal-location');
  if (modalLocation) modalLocation.textContent = location || `Prime Location`;

  // Show Modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeVenueModal() {
  const modal = document.getElementById('venueModal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
  const modal = document.getElementById('venueModal');
  if (modal && e.target === modal) {
    closeVenueModal();
  }
});


function renderDestinations(container) {
  container.innerHTML = destinationsData.map(dest => `
    <div class="swiper-slide">
      <div class="card">
        <div class="card-image">
          <img src="${dest.image}" alt="${dest.title} Wedding">
          <span class="card-badge" style="position: absolute; top: 15px; left: 15px; background: var(--secondary-color); color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600;">${dest.type.toUpperCase()}</span>
        </div>
        <div class="card-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 class="card-title" style="margin-bottom: 0;">${dest.title}</h3>
            <span style="font-weight: 700; color: #ffc107;"><i class="fas fa-star"></i> ${dest.rating}</span>
          </div>
          <p style="color: var(--primary-color); font-weight: 600; margin-bottom: 12px; font-size: 14px;">${dest.venueCount} Destination Venues</p>
          <p class="card-text" style="font-size: 14px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${dest.description}</p>
          <a href="destination-detail.html?location=${dest.id}" class="card-link">Explore ${dest.title} <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== EXPORT FUNCTIONS FOR USE IN OTHER FILES =====
window.DreamKnot = {
  showNotification,
  formatCurrency,
  formatDate,
  debounce
};
