// ============================================
// HostelHub - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  injectSidebar();
  initSidebar();
  initMobileMenu();
  initDropdowns();
  initAuthState();
  initSearch();
  initNotifications();
});

// ============================================
// Theme Management
// ============================================

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  showToast('Theme updated', `Switched to ${newTheme} mode`, 'info');
}

// ============================================
// Sidebar Injection (unified nav)
// ============================================

function injectSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const nav = sidebar.querySelector('.sidebar-nav ul');
  if (!nav) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const brand = sidebar.querySelector('.sidebar-brand');
  if (brand) brand.id = 'sidebar-brand';

  const links = Array.from(nav.querySelectorAll('a')).map(a => a.getAttribute('href'));
  const needsFinance = !links.includes('finance.html');
  const needsPayments = !links.includes('payments.html');

  if (!needsFinance && !needsPayments) return;

  nav.innerHTML = '';
  const items = [
    { href: 'dashboard.html', icon: 'fa-th-large', label: 'Dashboard' },
    { href: 'rooms.html', icon: 'fa-bed', label: 'Rooms' },
    { href: 'students.html', icon: 'fa-users', label: 'Students' },
    { href: 'payments.html', icon: 'fa-credit-card', label: 'Payments' },
    { href: 'finance.html', icon: 'fa-dollar-sign', label: 'Finance' },
    { href: 'complaints.html', icon: 'fa-wrench', label: 'Complaints' },
    { href: 'notices.html', icon: 'fa-bullhorn', label: 'Notices' },
    { href: 'settings.html', icon: 'fa-cog', label: 'Settings' }
  ];

  items.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    if (item.href === currentPage) a.classList.add('active');
    a.innerHTML = '<i class="fas ' + item.icon + '"></i><span>' + item.label + '</span>';
    li.appendChild(a);
    nav.appendChild(li);
  });
}

// ============================================
// Sidebar Management
// ============================================

function initSidebar() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
    });
    
    if (localStorage.getItem('sidebar-collapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }
  }
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// ============================================
// Mobile Menu
// ============================================

function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  
  if (mobileToggle && sidebar && overlay) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('active');
    });
    
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
  }
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  }
}

// ============================================
// Dropdowns
// ============================================

function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
      });
    }
  });
  
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
  });
}

// ============================================
// Authentication
// ============================================

function initAuthState() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const profileName = document.getElementById('header-profile-name');
  const profileRole = document.getElementById('header-profile-role');
  const profileImg = document.getElementById('header-profile-img');
  
  if (profileName && user.name) profileName.textContent = user.name;
  if (profileRole && user.role) profileRole.textContent = user.role;
  if (profileImg && user.avatar) profileImg.src = user.avatar;

  const hostelSettings = JSON.parse(localStorage.getItem('hostelSettings') || '{}');
  const sidebarBrand = document.getElementById('sidebar-brand');
  if (sidebarBrand && hostelSettings.name) {
    sidebarBrand.textContent = hostelSettings.name;
  }
}

function login(email, password) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => (u.email === email || u.name === email) && u.password === password);

  if (user || (email === 'admin@hostelhub.com' && password === 'admin123') || (email === 'admin' && password === 'admin123')) {
    const userData = user || {
      id: 1,
      name: 'Admin User',
      email: 'admin@hostelhub.com',
      role: 'Administrator',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=1e3a5f&color=fff'
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    showToast('Welcome back!', 'Logged in as ' + userData.name, 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
    return true;
  }

  showToast('Login failed', 'Invalid email or password', 'danger');
  return false;
}

function register(name, email, password, role) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.find(u => u.email === email)) {
    showToast('Registration failed', 'Email already exists', 'danger');
    return false;
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: role || 'Student',
    avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=4f46e5&color=fff'
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  showToast('Account created!', 'Please log in with your credentials', 'success');
  setTimeout(() => window.location.href = 'login.html', 1500);
  return true;
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
  showToast('Logged out', 'You have been logged out successfully', 'info');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

function requireAuth() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
  }
}

// ============================================
// Toast Notifications
// ============================================

function showToast(title, message, type) {
  type = type || 'info';
  const container = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  
  const icons = {
    success: 'fa-check-circle',
    danger: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  toast.innerHTML = '<i class="fas ' + icons[type] + ' toast-icon"></i>' +
    '<div class="toast-content"><div class="toast-title">' + title + '</div>' +
    '<div class="toast-message">' + message + '</div>' +
    '<button class="toast-close" onclick="this.parentElement.remove()">' +
    '<i class="fas fa-times"></i></button>';
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ============================================
// Modal Management
// ============================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ============================================
// Search
// ============================================

function initSearch() {
  const searchInputs = document.querySelectorAll('[data-search]');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const target = input.getAttribute('data-search');
      const query = e.target.value.toLowerCase();
      filterItems(target, query);
    });
  });
}

function filterItems(target, query) {
  const items = document.querySelectorAll('[data-search-target="' + target + '"]');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? '' : 'none';
  });
}

// ============================================
// Notifications
// ============================================

function initNotifications() {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const badge = document.getElementById('notification-badge');
  
  if (badge) {
    const unread = notifications.filter(n => !n.read).length;
    badge.style.display = unread > 0 ? 'block' : 'none';
    badge.textContent = unread;
  }
}

function addNotification(title, message, type) {
  type = type || 'info';
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.unshift({
    id: Date.now(),
    title,
    message,
    type,
    read: false,
    time: new Date().toISOString()
  });
  localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 50)));
  initNotifications();
}

// ============================================
// Form Validation
// ============================================

function validateForm(form) {
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = 'var(--danger)';
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      }, { once: true });
    }
  });
  
  return isValid;
}

// ============================================
// Data Export
// ============================================

function exportToCSV(data, filename) {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => '"' + (row[h] || '').toString().replace(/"/g, '""') + '"').join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================
// Utility Functions
// ============================================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

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

function animateValue(element, start, end, duration) {
  const startTime = performance.now();
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    element.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-slide-up');
      animateOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
  animateOnScroll.observe(el);
});
