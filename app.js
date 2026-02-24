/**
 * Main Application Logic
 * Handles all e-commerce functionality
 * Now with database integration for real-time stock status
 */

// ===== STATE =====
// Note: productsData will be set from products.js or loaded via API
// Declare it here so it can be referenced
let productsData = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let comparison = JSON.parse(localStorage.getItem('comparison')) || [];
let currentFilter = 'all';
let searchQuery = '';
let isUsingAPI = false; // Track if we're using API data

// Category labels - fallback in case products.js hasn't loaded yet
const categoryLabels = {
  tech: 'Tech & Gadgets',
  beauty: 'Beauté & Soins',
  goods: 'Maison & Décoration',
  fashion: 'Mode & Vêtements',
  accessories: 'Accessoires'
};

// ===== API CONFIG =====
const API_URL = './api.php';

// ===== INITIALIZE ON LOAD =====
async function initializeApp() {
  console.log('🚀 Initializing app...');
  
  // PRIORITY 1: Try to load from API (database) first
  console.log('📡 Attempting to load products from database API...');
  try {
    const response = await fetch(`${API_URL}?action=getProducts`);
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        productsData = result.data;
        isUsingAPI = true;
        console.log('✅ Products loaded from DATABASE API, count:', productsData.length);
        
        // Cache for offline use
        localStorage.setItem('cachedProducts', JSON.stringify(productsData));
        
        renderProducts();
        return;
      }
    }
  } catch (e) {
    console.warn('⚠️ API not available:', e.message);
  }
  
  // PRIORITY 2: Try to get from window.productsDataStatic (products.js)
  if (typeof window.productsDataStatic !== 'undefined' && window.productsDataStatic && window.productsDataStatic.length > 0) {
    productsData = window.productsDataStatic;
    isUsingAPI = false;
    console.log('✅ Products loaded from products.js (fallback), count:', productsData.length);
    renderProducts();
    return;
  }
  
  // PRIORITY 3: Try window.productsData (alternative)
  if (typeof window.productsData !== 'undefined' && window.productsData && window.productsData.length > 0) {
    productsData = window.productsData;
    isUsingAPI = false;
    console.log('✅ Products loaded from window.productsData (fallback), count:', productsData.length);
    renderProducts();
    return;
  }
  
  // PRIORITY 4: Try localStorage cache
  const cachedProducts = localStorage.getItem('cachedProducts');
  if (cachedProducts) {
    try {
      productsData = JSON.parse(cachedProducts);
      isUsingAPI = false;
      console.log('✅ Products loaded from cache (fallback), count:', productsData.length);
      renderProducts();
      return;
    } catch (e) {
      console.warn('Cache parse error:', e);
    }
  }
  
  // PRIORITY 5: Try direct productsData variable
  if (typeof productsData !== 'undefined' && productsData && productsData.length > 0) {
    isUsingAPI = false;
    console.log('✅ Products loaded from variable, count:', productsData.length);
    renderProducts();
    return;
  }
  
  // Final fallback - render empty message
  console.log('❌ No products found anywhere');
  const grid = document.getElementById('productsGrid');
  if (grid) grid.innerHTML = '<p style="text-align:center;padding:20px;">Aucun produit disponible. Veuillez vérifier la connexion à la base de données.</p>';
}

// Run initialization immediately when script loads
// Also wait for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Try immediately
  initializeApp();
  
  // Then set up other features
  updateCartBadge();
  updateWishlistCount();
  updateComparisonBar();
  setupEventListeners();
  setupMobileNav();
  initializeNewFeatures();

  // Show promo banner after delay (only on weekends)
  if (!sessionStorage.getItem('promoShown') && isWeekend()) {
    setTimeout(() => {
      document.getElementById('promoBanner').classList.add('visible');
    }, 3000);
  }

  // Show bottom overlay after delay
  if (!sessionStorage.getItem('bottomOverlayShown')) {
    setTimeout(() => {
      showBottomOverlay();
    }, 5000);
  }
});

// Listen for products loaded event from products.js
window.addEventListener('productsLoaded', () => {
  console.log('📦 ProductsLoaded event received');
  if (productsData.length === 0 && window.productsDataStatic) {
    productsData = window.productsDataStatic;
  }
  if (productsData.length > 0) {
    renderProducts();
  }
});

// Also try to render on window load as a safety measure
window.addEventListener('load', () => {
  const grid = document.getElementById('productsGrid');
  if (!grid || grid.innerHTML.trim() === '') {
    console.log('⚠️ Products grid empty on window load, retrying...');
    initializeApp();
  }
});

// ===== API FUNCTIONS =====
async function loadProductsFromAPI() {
  let apiLoaded = false;
  
  try {
    const response = await fetch(`${API_URL}?action=getProducts`);
    if (!response.ok) throw new Error('API request failed');
    
    const result = await response.json();
    
    if (result.success && result.data && result.data.length > 0) {
      productsData = result.data;
      isUsingAPI = true;
      apiLoaded = true;
      console.log('✅ Products loaded from database');
      
      // Update inStock based on stock quantity
      productsData.forEach(product => {
        product.inStock = product.stock > 0;
      });
      return;
    }
  } catch (error) {
    console.warn('⚠️ API not available:', error.message);
  }
  
  // Fallback: try to get from window.productsDataStatic
  if (!apiLoaded && typeof window.productsDataStatic !== 'undefined' && window.productsDataStatic.length > 0) {
    productsData = window.productsDataStatic;
    isUsingAPI = false;
    console.log('✅ Products loaded from static data (products.js)');
    return;
  }
  
  // Fallback: check if productsData was loaded from products.js directly
  if (!apiLoaded && typeof productsData !== 'undefined' && productsData.length > 0) {
    isUsingAPI = false;
    console.log('✅ Products already loaded from products.js');
    return;
  }
  
  // Fallback: try localStorage cache
  if (!apiLoaded) {
    const cachedProducts = localStorage.getItem('cachedProducts');
    if (cachedProducts) {
      try {
        productsData = JSON.parse(cachedProducts);
        isUsingAPI = false;
        console.log('✅ Products loaded from cache');
        return;
      } catch (e) {}
    }
  }
  
  // Last resort: retry API after delay
  if (!apiLoaded) {
    console.warn('⚠️ Retrying API in 2 seconds...');
    setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}?action=getProducts`);
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          productsData = result.data;
          isUsingAPI = true;
          localStorage.setItem('cachedProducts', JSON.stringify(productsData));
          renderProducts();
          console.log('✅ Products loaded after retry');
        }
      } catch (e) {
        console.error('Retry failed:', e);
      }
    }, 2000);
  }
}

async function fetchProductStock(productId) {
  if (!isUsingAPI) return null;
  
  try {
    const response = await fetch(`${API_URL}?action=getProduct&id=${productId}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      return {
        stock: result.data.stock,
        inStock: result.data.in_stock > 0
      };
    }
  } catch (error) {
    console.error('Error fetching stock:', error);
  }
  
  return null;
}

async function updateProductStock(productId, newStock) {
  if (!isUsingAPI) {
    showToast('❌ Cannot update stock: Database not connected', 'error');
    return false;
  }
  
  try {
    const response = await fetch(`${API_URL}?action=updateStock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: productId,
        stock: newStock
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Update local data
      const product = productsData.find(p => p.id === productId);
      if (product) {
        product.stock = newStock;
        product.inStock = newStock > 0;
      }
      return true;
    }
  } catch (error) {
    console.error('Error updating stock:', error);
  }
  
  return false;
}

async function getStats() {
  if (!isUsingAPI) return null;
  
  try {
    const response = await fetch(`${API_URL}?action=getStats`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
  
  return null;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Search functionality (desktop)
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderProducts();
    });
  }
  
  // Search functionality (mobile)
  const mobileSearchBar = document.getElementById('mobileSearchBar');
  if (mobileSearchBar) {
    mobileSearchBar.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderProducts();
    });
  }

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchBar = document.getElementById('searchBar');
      if (searchBar) {
        searchBar.focus();
        searchBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    // Also support '/' key for quick search
    if (e.key === '/' && !isInputFocused()) {
      e.preventDefault();
      const searchBar = document.getElementById('searchBar');
      if (searchBar) {
        searchBar.focus();
        searchBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProducts();
    });
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    document.querySelector('header').classList.toggle('scrolled', window.scrollY > 100);
  });

  // Contact form submission
  document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);

  // Close modals on outside click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close other modals
      document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // Remove error on input
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });
}

// ===== PRODUCT RENDERING =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  
  // Map API field names to expected field names
  productsData = productsData.map(p => ({
    ...p,
    desc: p.desc || p.description || '', // Handle both 'desc' and 'description' fields
    oldPrice: p.oldPrice || p.old_price || null
  }));
  
  const filtered = productsData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                         (p.desc || '').toLowerCase().includes(searchQuery);
    const matchesFilter = currentFilter === 'all' || p.category === currentFilter;
    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';
  grid.innerHTML = filtered.map(p => {
    // Ensure we have the correct field values
    const desc = p.desc || p.description || '';
    const oldPrice = p.oldPrice || p.old_price || null;
    const inStock = p.inStock !== undefined ? p.inStock : (p.stock > 0);
    const rating = p.rating || 0;
    const stock = p.stock || 0;
    
    return `
    <article class="product" data-id="${p.id}" data-category="${p.category}">
      <div class="product-rating">${'⭐'.repeat(Math.round(rating))}${'☆'.repeat(5-Math.round(rating))}</div>
      ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
      ${!inStock ? `<div class="product-badge out-of-stock-badge">❌ Rupture de stock</div>` : ''}
      <button class="wishlist-btn ${isInWishlist(p.id) ? 'active' : ''}" 
              onclick="toggleWishlist(${p.id})"
              aria-label="${isInWishlist(p.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
        ${isInWishlist(p.id) ? '❤️' : '🤍'}
      </button>
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" ${!inStock ? 'style="opacity:0.5"' : ''}>
      </div>
      <h3>${p.name}</h3>
      <p class="product-desc">${desc}</p>
      <div class="product-footer">
        <div class="product-footer-top">
          <p class="price">${formatPrice(p.price)}</p>
          <span class="category-label">${categoryLabels[p.category] || p.category}</span>
        </div>
        <div class="stock-info ${inStock ? 'in-stock' : 'out-of-stock'}">
          ${inStock ? `📦 ${stock} en stock` : '❌ Indisponible'}
        </div>
        <div class="product-actions">
          <button class="add-cart-btn ${!inStock ? 'disabled' : ''}" 
                  id="addBtn-${p.id}" 
                  onclick="${inStock ? `addToCart(${p.id}, this)` : ''}"
                  ${!inStock ? 'disabled' : ''}>
            ${inStock ? '🛒 Ajouter' : '❌ Indisponible'}
          </button>
          <button class="compare-btn-small ${isInComparison(p.id) ? 'active' : ''}" 
                  onclick="toggleComparison(${p.id})" 
                  aria-label="${isInComparison(p.id) ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}"
                  title="${isInComparison(p.id) ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}">
            📊
          </button>
        </div>
      </div>
    </article>
  `;
  }).join('');
}

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
  return price.toLocaleString('fr-FR') + ' FCFA';
}

function sanitizeInput(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function isInputFocused() {
  const activeElement = document.activeElement;
  return activeElement.tagName === 'INPUT' || 
         activeElement.tagName === 'TEXTAREA' || 
         activeElement.tagName === 'SELECT' ||
         activeElement.isContentEditable;
}

function isWeekend() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  return dayOfWeek === 0 || dayOfWeek === 6;
}

// ===== CART FUNCTIONS =====
function addToCart(id, btn) {
  const product = productsData.find(p => p.id === id);
  if (!product) return;
  
  const existing = cart.find(item => item.id === id);
  
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart();
  updateCartBadge();
  
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '✓ Ajouté';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '🛒 Ajouter';
    }, 1500);
  }
  
  showToast('✅ Ajouté au panier!', 'success');
}

function updateQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart();
    updateCartBadge();
    renderCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
  showToast('🗑️ Produit retiré', 'info');
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const desktopBadge = document.getElementById('cartBadge');
  const mobileBadge = document.getElementById('mobileCartBadge');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (desktopBadge) {
    desktopBadge.textContent = count;
    desktopBadge.style.display = count > 0 ? 'flex' : 'none';
  }
  
  if (mobileBadge) {
    mobileBadge.textContent = count;
    mobileBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <p>Votre panier est vide</p>
      </div>
    `;
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  container.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${sanitizeInput(item.name)}" class="cart-item-image">
          <div class="cart-item-info">
            <h4>${sanitizeInput(item.name)}</h4>
            <p class="cart-item-price">${formatPrice(item.price)}</p>
          </div>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Diminuer la quantité">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Augmenter la quantité">+</button>
          </div>
          <button class="remove-item" onclick="removeFromCart(${item.id})" aria-label="Retirer du panier">🗑️</button>
        </div>
      `).join('')}
    </div>
    <div class="cart-total">
      <div class="cart-total-row">
        <span>Total:</span>
        <span>${formatPrice(total)}</span>
      </div>
      <button class="checkout-btn" onclick="checkout()">
        💳 Procéder au paiement
      </button>
    </div>
  `;
}

function openCart() {
  renderCart();
  document.getElementById('cartModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
  document.body.style.overflow = '';
}

function checkout() {
  if (cart.length === 0) return;
  openPayment();
}

// ===== WISHLIST FUNCTIONS =====
function isInWishlist(id) {
  return wishlist.some(item => item.id === id);
}

function toggleWishlist(id) {
  const product = productsData.find(p => p.id === id);
  if (!product) return;
  
  if (isInWishlist(id)) {
    wishlist = wishlist.filter(item => item.id !== id);
    showToast('💔 Retiré des favoris', 'info');
  } else {
    wishlist.push(product);
    showToast('❤️ Ajouté aux favoris!', 'success');
  }
  
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
  renderProducts();
}

function updateWishlistCount() {
  document.getElementById('wishlistCount').textContent = wishlist.length;
}

function renderWishlist() {
  const container = document.getElementById('wishlistItemsContainer');
  
  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">❤️</div>
        <p>Votre liste de souhaits est vide</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="cart-items">
      ${wishlist.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${sanitizeInput(item.name)}" class="cart-item-image">
          <div class="cart-item-info">
            <h4>${sanitizeInput(item.name)}</h4>
            <p class="cart-item-price">${formatPrice(item.price)}</p>
          </div>
          <button class="add-cart-btn" onclick="addFromWishlist(${item.id})">
            🛒 Ajouter
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function addFromWishlist(id) {
  addToCart(id, null);
  closeWishlist();
}

function openWishlist() {
  renderWishlist();
  document.getElementById('wishlistModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeWishlist() {
  document.getElementById('wishlistModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== COMPARISON FUNCTIONS =====
function isInComparison(id) {
  return comparison.some(item => item.id === id);
}

function toggleComparison(id) {
  const product = productsData.find(p => p.id === id);
  if (!product) return;
  
  if (isInComparison(id)) {
    comparison = comparison.filter(item => item.id !== id);
    showToast('📊 Retiré de la comparaison', 'info');
  } else {
    if (comparison.length >= 3) {
      showToast('⚠️ Maximum 3 produits à comparer', 'error');
      return;
    }
    comparison.push(product);
    showToast('📊 Ajouté à la comparaison', 'success');
  }
  
  localStorage.setItem('comparison', JSON.stringify(comparison));
  updateComparisonBar();
  renderProducts();
}

function updateComparisonBar() {
  const bar = document.getElementById('comparisonBar');
  const itemsContainer = document.getElementById('comparisonItems');
  const compareBtn = document.getElementById('compareNowBtn');
  
  if (comparison.length === 0) {
    bar.classList.remove('visible');
    return;
  }
  
  bar.classList.add('visible');
  
  let html = comparison.map(p => `
    <div class="comparison-item">
      <img src="${p.image}" alt="${sanitizeInput(p.name)}">
    </div>
  `).join('');
  
  // Empty slots
  for (let i = comparison.length; i < 3; i++) {
    html += '<div class="comparison-item empty">+</div>';
  }
  
  itemsContainer.innerHTML = html;
  compareBtn.textContent = `Comparer (${comparison.length})`;
  compareBtn.disabled = comparison.length < 2;
}

function clearComparison() {
  comparison = [];
  localStorage.setItem('comparison', JSON.stringify(comparison));
  updateComparisonBar();
  renderProducts();
}

function openComparison() {
  if (comparison.length < 2) {
    showToast('⚠️ Sélectionnez au moins 2 produits', 'error');
    return;
  }
  
  renderComparison();
  document.getElementById('comparisonModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeComparison() {
  document.getElementById('comparisonModal').classList.remove('active');
  document.body.style.overflow = '';
}

function renderComparison() {
  const container = document.getElementById('comparisonContent');
  
  container.innerHTML = `
    <table class="comparison-table">
      <thead>
        <tr>
          <th>Caractéristique</th>
          ${comparison.map(p => `<th>${sanitizeInput(p.name)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Image</strong></td>
          ${comparison.map(p => `<td><img src="${p.image}" alt="${sanitizeInput(p.name)}"></td>`).join('')}
        </tr>
        <tr>
          <td><strong>Prix</strong></td>
          ${comparison.map(p => `<td><strong style="color:var(--primary)">${formatPrice(p.price)}</strong></td>`).join('')}
        </tr>
        <tr>
          <td><strong>Catégorie</strong></td>
          ${comparison.map(p => `<td>${categoryLabels[p.category] || p.category}</td>`).join('')}
        </tr>
        <tr>
          <td><strong>Description</strong></td>
          ${comparison.map(p => `<td>${sanitizeInput(p.desc)}</td>`).join('')}
        </tr>
        <tr>
          <td><strong>Note</strong></td>
          ${comparison.map(p => `<td>${'⭐'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</td>`).join('')}
        </tr>
      </tbody>
    </table>
  `;
}

// ===== FILTER BY CATEGORY =====
function filterByCategory(category, navItem = null) {
  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`[data-filter="${category}"]`);
  if (btn) btn.classList.add('active');
  
  // Update category navbar items
  document.querySelectorAll('.category-nav-item').forEach(item => item.classList.remove('active'));
  if (navItem) {
    navItem.classList.add('active');
  } else {
    const navItemElement = document.querySelector(`.category-nav-item[data-category="${category}"]`);
    if (navItemElement) navItemElement.classList.add('active');
  }
  
  currentFilter = category;
  renderProducts();
  document.getElementById('produits').scrollIntoView({ behavior: 'smooth' });
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  const icon = document.getElementById('themeIcon');
  icon.textContent = isDarkMode ? '☀️' : '🌙';
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  
  // Add smooth transition to all elements
  document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  
  // Remove transition after animation
  setTimeout(() => {
    document.documentElement.style.transition = '';
    document.body.style.transition = '';
  }, 300);
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  document.getElementById('themeIcon').textContent = '☀️';
}

// ===== CONTACT FORM =====
function handleContactSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('contactName');
  const email = document.getElementById('contactEmail');
  const phone = document.getElementById('contactPhone');
  const message = document.getElementById('contactMessage');
  const submitBtn = document.getElementById('submitBtn');
  
  let isValid = true;

  // Reset errors
  [name, email, phone, message].forEach(el => el.classList.remove('error'));

  // Validation
  const nameValue = name.value.trim();
  if (!nameValue || nameValue.length > 100) {
    name.classList.add('error');
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValue = email.value.trim();
  if (!emailValue || !emailRegex.test(emailValue) || emailValue.length > 255) {
    email.classList.add('error');
    isValid = false;
  }

  const phoneValue = phone.value.trim();
  if (phoneValue && !/^[0-9+\s\-()]{0,20}$/.test(phoneValue)) {
    phone.classList.add('error');
    isValid = false;
  }

  const messageValue = message.value.trim();
  if (!messageValue || messageValue.length > 1000) {
    message.classList.add('error');
    isValid = false;
  }

  if (isValid) {
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Envoi en cours...';
    
    // Simulate form submission
    setTimeout(() => {
      showToast('✅ Message envoyé avec succès!', 'success');
      document.getElementById('contactForm').reset();
      submitBtn.disabled = false;
      submitBtn.textContent = '📧 Envoyer le message';
    }, 1500);
  } else {
    showToast('❌ Veuillez corriger les erreurs', 'error');
  }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = sanitizeInput(message);
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// ===== PROMO BANNER =====
function closePromo() {
  document.getElementById('promoBanner').classList.remove('visible');
  sessionStorage.setItem('promoShown', 'true');
}

// ===== PAYMENT FUNCTIONS =====
function openPayment() {
  renderPaymentSummary();
  renderPaymentItems();
  document.getElementById('paymentModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Setup payment option selection
  setupPaymentOptions();
}

function closePayment() {
  document.getElementById('paymentModal').classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset form
  resetPaymentForm();
}

function renderPaymentSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 2500; // Frais de livraison fixe
  const total = subtotal + shipping;
  
  document.getElementById('paymentSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('paymentShipping').textContent = formatPrice(shipping);
  document.getElementById('paymentTotal').textContent = formatPrice(total);
}

function renderPaymentItems() {
  const container = document.getElementById('paymentItems');
  
  container.innerHTML = cart.map(item => `
    <div class="payment-item">
      <div class="payment-item-info">
        <img src="${item.image}" alt="${sanitizeInput(item.name)}" class="payment-item-image">
        <div class="payment-item-details">
          <h4>${sanitizeInput(item.name)}</h4>
          <p>Qty: ${item.quantity}</p>
        </div>
      </div>
      <div class="payment-item-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');
}

function setupPaymentOptions() {
  const paymentOptions = document.querySelectorAll('.payment-option');
  
  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from all options
      paymentOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Add selected class to clicked option
      option.classList.add('selected');
      
      // Update confirm button state
      updateConfirmButtonState();
    });
  });
  
  // Setup form inputs (excluding customer info fields that were removed)
  const formInputs = document.querySelectorAll('#paymentModal input:not([id^="customer"]), #paymentModal textarea:not([id^="customer"])');
  formInputs.forEach(input => {
    input.addEventListener('input', updateConfirmButtonState);
  });
}

function updateConfirmButtonState() {
  const selectedOption = document.querySelector('.payment-option.selected');
  const confirmBtn = document.getElementById('confirmPaymentBtn');
  
  if (!selectedOption) {
    confirmBtn.disabled = true;
    return;
  }
  
  const method = selectedOption.dataset.method;
  let isValid = true;
  
  // Check method-specific validation
  if (method === 'orange-money') {
    const phone = document.getElementById('orangeNumber').value.trim();
    isValid = phone.length === 9 && phone.startsWith('6');
  } else if (method === 'mtn-mobile') {
    const phone = document.getElementById('mtnNumber').value.trim();
    isValid = phone.length === 9 && phone.startsWith('6');
  } else if (method === 'bank-transfer' || method === 'cash-delivery') {
    isValid = true; // No additional validation needed
  }
  
  // Customer info validation removed - no longer required
  
  confirmBtn.disabled = !isValid;
}

function resetPaymentForm() {
  // Reset payment options
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Reset form inputs (excluding customer info fields that were removed)
  document.querySelectorAll('#paymentModal input:not([id^="customer"]), #paymentModal textarea:not([id^="customer"])').forEach(input => {
    input.value = '';
  });
  
  // Reset confirm button
  document.getElementById('confirmPaymentBtn').disabled = true;
}

function confirmPayment() {
  const selectedOption = document.querySelector('.payment-option.selected');
  const method = selectedOption.dataset.method;
  
  // Show loading state
  const btn = document.getElementById('confirmPaymentBtn');
  const btnText = btn.querySelector('.btn-text');
  const btnLoading = btn.querySelector('.btn-loading');
  
  btn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  
  // Customer info removed - no longer required
  
  // Get payment method specific info
  let paymentInfo = {};
  if (method === 'orange-money') {
    paymentInfo.phone = document.getElementById('orangeNumber').value.trim();
  } else if (method === 'mtn-mobile') {
    paymentInfo.phone = document.getElementById('mtnNumber').value.trim();
  }
  
  // Simulate payment processing
  setTimeout(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2500;
    
    // Create order object
    const order = {
      id: Date.now(),
      items: [...cart],
      total: total,
      method: method,
      customer: customerInfo,
      payment: paymentInfo,
      date: new Date().toISOString(),
      status: 'confirmed'
    };
    
    // Save order (in real app, this would go to backend)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartBadge();
    
    // Show success message
    let message = '';
    switch(method) {
      case 'orange-money':
        message = `🎉 Paiement Orange Money réussi! Commande #${order.id} confirmée.`;
        break;
      case 'mtn-mobile':
        message = `🎉 Paiement MTN Mobile Money réussi! Commande #${order.id} confirmée.`;
        break;
      case 'bank-transfer':
        message = `🏦 Virement bancaire enregistré! Commande #${order.id} en attente de validation.`;
        break;
      case 'cash-delivery':
        message = `💵 Commande #${order.id} enregistrée! Paiement à la livraison.`;
        break;
    }
    
    showToast(message, 'success');
    
    // Close payment modal
    closePayment();
    closeCart();
    
    // Reset button state
    btn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    
  }, 3000); // Simulate 3 second processing time
}

// ===== MOBILE NAVIGATION =====
function setupMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavContent = document.getElementById('mobileNavContent');
  
  // Toggle mobile navigation when clicking hamburger button
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileNav();
  });
  
  // Close mobile navigation when clicking outside the sidebar content
  mobileNavOverlay.addEventListener('click', (e) => {
    // Only close if clicking on the overlay area (not the content)
    if (e.target === mobileNavOverlay) {
      closeMobileNav();
    }
  });
  
  // Close mobile navigation when clicking on navigation links
  const mobileNavLinks = mobileNavContent.querySelectorAll('a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });
  
  // Close mobile navigation on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });
}

function toggleMobileNav() {
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const isActive = mobileNavOverlay.classList.contains('active');
  
  if (isActive) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}

function openMobileNav() {
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  
  mobileNavOverlay.classList.add('active');
  hamburgerBtn.classList.add('active');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  
  // Prevent body scroll when menu is open
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  
  mobileNavOverlay.classList.remove('active');
  hamburgerBtn.classList.remove('active');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  
  // Restore body scroll
  document.body.style.overflow = '';
}

// ===== BOTTOM OVERLAY FUNCTIONS =====
/**
 * Affiche l'overlay en bas de page
 */
function showBottomOverlay() {
  const overlay = document.getElementById('bottomOverlay');
  if (overlay) {
    overlay.classList.add('visible');
    sessionStorage.setItem('bottomOverlayShown', 'true');
  }
}

/**
 * Cache l'overlay en bas de page
 */
function closeBottomOverlay() {
  const overlay = document.getElementById('bottomOverlay');
  if (overlay) {
    overlay.classList.remove('visible');
  }
}

/**
 * Action personnalisée pour l'overlay
 */
function actionOverlay() {
  // Vous pouvez personnaliser cette fonction selon vos besoins
  showToast('🎯 Action de l\'overlay exécutée!', 'success');
  
  // Exemple d'actions possibles :
  // - Ouvrir un modal
  // - Rediriger vers une page
  // - Déclencher une fonction
  // - Etc.
  
  // Fermer l'overlay après l'action
  closeBottomOverlay();
}

/**
 * Met à jour le contenu de l'overlay
 * @param {string} title - Le titre de l'overlay
 * @param {string} message - Le message de l'overlay
 * @param {Array} actions - Les actions disponibles (boutons)
 */
function updateBottomOverlay(title, message, actions = []) {
  const overlay = document.getElementById('bottomOverlay');
  if (!overlay) return;
  
  const textContainer = overlay.querySelector('.bottom-overlay-text');
  const actionsContainer = overlay.querySelector('.bottom-overlay-actions');
  
  if (textContainer) {
    textContainer.innerHTML = `
      <h3>${sanitizeInput(title)}</h3>
      <p>${sanitizeInput(message)}</p>
    `;
  }
  
  if (actionsContainer && actions.length > 0) {
    actionsContainer.innerHTML = actions.map(action => `
      <button class="btn ${action.type || 'btn-outline'}" onclick="${action.onclick}">
        ${action.text}
      </button>
    `).join('');
  }
}

/**
 * Programme l'affichage automatique de l'overlay
 * @param {number} delay - Délai en millisecondes
 * @param {string} title - Titre personnalisé
 * @param {string} message - Message personnalisé
 */
function scheduleBottomOverlay(delay = 10000, title = null, message = null) {
  setTimeout(() => {
    if (title && message) {
      updateBottomOverlay(title, message);
    }
    showBottomOverlay();
  }, delay);
}

/**
 * Fonction pour remonter en haut de la page
 */
function scrollToTop() {
  // Détecter si on est sur mobile (petits écrans)
  const isMobile = window.innerWidth <= 768;
  const duration = isMobile ? 15000 : 800; // Ultra lent sur mobile (15 secondes)
  
  // Animation personnalisée ultra lente sur mobile
  if (isMobile) {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    
    function animate(currentTime) {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Courbe d'animation ease-out ultra-lente et extrêmement douce
      const easeOutSine = Math.cos((progress * Math.PI) / 2);
      const currentPosition = startPosition * (1 - easeOutSine);
      
      window.scrollTo(0, currentPosition);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  } else {
    // Animation standard pour desktop
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }
}

// ===== USER AUTHENTICATION =====
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

function isLoggedIn() {
  return currentUser !== null;
}

function register(name, email, password, phone) {
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Cet email est déjà utilisé' };
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password, // In real app, hash this!
    phone: phone,
    addresses: [],
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Auto login
  currentUser = newUser;
  delete currentUser.password;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  return { success: true, message: 'Compte créé avec succès!' };
}

function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, message: 'Email ou mot de passe incorrect' };
  }
  
  currentUser = { ...user };
  delete currentUser.password;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  return { success: true, message: 'Connexion réussie!' };
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showToast('👋 Déconnexion réussie', 'success');
  updateUserUI();
}

function updateUserProfile(updates) {
  if (!currentUser) return { success: false, message: 'Vous devez être connecté' };
  
  // Update user in users array
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user
    currentUser = { ...currentUser, ...updates };
    delete currentUser.password;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return { success: true, message: 'Profil mis à jour!' };
  }
  
  return { success: false, message: 'Erreur lors de la mise à jour' };
}

function updateUserUI() {
  const userBtn = document.getElementById('userBtn');
  const mobileUserBtn = document.getElementById('mobileUserBtn');
  
  if (isLoggedIn()) {
    const userIcon = '👤';
    if (userBtn) {
      userBtn.innerHTML = `${userIcon} ${currentUser.name.split(' ')[0]}`;
      userBtn.onclick = openProfile;
    }
    if (mobileUserBtn) {
      mobileUserBtn.innerHTML = `👤 ${currentUser.name}`;
      mobileUserBtn.onclick = () => { openProfile(); closeMobileNav(); };
    }
  } else {
    if (userBtn) {
      userBtn.innerHTML = '👤 Connexion';
      userBtn.onclick = openLoginModal;
    }
    if (mobileUserBtn) {
      mobileUserBtn.innerHTML = '👤 Connexion';
      mobileUserBtn.onclick = () => { openLoginModal(); closeMobileNav(); };
    }
  }
}

function openLoginModal() {
  document.getElementById('loginModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  closeMobileNav();
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
  document.body.style.overflow = '';
}

function openRegisterModal() {
  closeLoginModal();
  document.getElementById('registerModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
  document.getElementById('registerModal').classList.remove('active');
  document.body.style.overflow = '';
}

function openProfile() {
  if (!isLoggedIn()) {
    openLoginModal();
    return;
  }
  document.getElementById('profileModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  renderProfile();
}

function closeProfile() {
  document.getElementById('profileModal').classList.remove('active');
  document.body.style.overflow = '';
}

function renderProfile() {
  const container = document.getElementById('profileContent');
  if (!container) return;
  
  container.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
      <div class="profile-info">
        <h3>${sanitizeInput(currentUser.name)}</h3>
        <p>${sanitizeInput(currentUser.email)}</p>
        <p>${currentUser.phone || 'Pas de téléphone'}</p>
      </div>
    </div>
    <div class="profile-menu">
      <button class="profile-menu-item" onclick="openOrders()">
        📦 Mes commandes
      </button>
      <button class="profile-menu-item" onclick="openAddresses()">
        📍 Mes adresses
      </button>
      <button class="profile-menu-item" onclick="openEditProfile()">
        ✏️ Modifier le profil
      </button>
      <button class="profile-menu-item logout" onclick="logout()">
        🚪 Déconnexion
      </button>
    </div>
  `;
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  const result = login(email, password);
  
  if (result.success) {
    showToast(result.message, 'success');
    closeLoginModal();
    updateUserUI();
  } else {
    showToast(result.message, 'error');
  }
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const phone = document.getElementById('registerPhone').value.trim();
  
  if (password.length < 6) {
    showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
    return;
  }
  
  const result = register(name, email, password, phone);
  
  if (result.success) {
    showToast(result.message, 'success');
    closeRegisterModal();
    updateUserUI();
  } else {
    showToast(result.message, 'error');
  }
}

// ===== ORDER HISTORY =====
function openOrders() {
  document.getElementById('profileModal').classList.remove('active');
  document.getElementById('ordersModal').classList.add('active');
  renderOrders();
}

function closeOrders() {
  document.getElementById('ordersModal').classList.remove('active');
  document.body.style.overflow = '';
}

function renderOrders() {
  const container = document.getElementById('ordersContent');
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 50px; opacity: 0.3;">📦</div>
        <p>Vous n'avez pas encore de commandes</p>
        <button class="btn btn-primary" onclick="closeOrders(); document.getElementById('produits').scrollIntoView({behavior: 'smooth'})">
          Découvrir les produits
        </button>
      </div>
    `;
    return;
  }
  
  // Sort by date (newest first)
  orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div class="order-id">Commande #${order.id}</div>
        <div class="order-status status-${order.status}">${getStatusLabel(order.status)}</div>
      </div>
      <div class="order-date">${formatDate(order.date)}</div>
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item">
            <img src="${item.image}" alt="${sanitizeInput(item.name)}">
            <div>
              <p>${sanitizeInput(item.name)}</p>
              <p class="order-item-qty">Qty: ${item.quantity}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="order-footer">
        <div class="order-total">
          <span>Total:</span>
          <strong>${formatPrice(order.total)}</strong>
        </div>
        <button class="btn btn-outline" onclick="trackOrder(${order.id})">
          📍 Suivre
        </button>
      </div>
    </div>
  `).join('');
}

function getStatusLabel(status) {
  const labels = {
    'confirmed': 'Confirmée',
    'processing': 'En cours',
    'shipped': 'Expédiée',
    'delivered': 'Livrée',
    'cancelled': 'Annulée'
  };
  return labels[status] || status;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function trackOrder(orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = orders.find(o => o.id === orderId);
  
  if (order) {
    showToast(`📦 Commande #${orderId} - Status: ${getStatusLabel(order.status)}`, 'info');
  }
}

// ===== RECENTLY VIEWED =====
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

function addToRecentlyViewed(productId) {
  // Remove if already exists
  recentlyViewed = recentlyViewed.filter(id => id !== productId);
  // Add to beginning
  recentlyViewed.unshift(productId);
  // Keep only last 10
  recentlyViewed = recentlyViewed.slice(0, 10);
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

function getRecentlyViewedProducts() {
  return recentlyViewed.map(id => productsData.find(p => p.id === id)).filter(p => p !== undefined);
}

function renderRecentlyViewed() {
  const container = document.getElementById('recentlyViewedContainer');
  if (!container) return;
  
  const products = getRecentlyViewedProducts();
  
  if (products.length === 0) {
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">👁️ Vus Récemment</h2>
    </div>
    <div class="products recently-viewed-grid">
      ${products.map(p => `
        <article class="product" data-id="${p.id}">
          <div class="product-image">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </div>
          <h3>${p.name}</h3>
          <p class="price">${formatPrice(p.price)}</p>
        </article>
      `).join('')}
    </div>
  `;
}

// ===== COUPON SYSTEM =====
let appliedCoupon = null;

function applyCoupon(code) {
  const coupon = couponCodes.find(c => c.code.toUpperCase() === code.toUpperCase());
  
  if (!coupon) {
    return { success: false, message: 'Code promo invalide' };
  }
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (subtotal < coupon.minOrder) {
    return { success: false, message: `Montant minimum: ${formatPrice(coupon.minOrder)}` };
  }
  
  appliedCoupon = coupon;
  return { success: true, message: `Code promo appliqué: ${coupon.description}` };
}

function removeCoupon() {
  appliedCoupon = null;
  showToast('Code promo supprimé', 'info');
}

function calculateDiscount(subtotal) {
  if (!appliedCoupon) return 0;
  
  if (appliedCoupon.type === 'percent') {
    return Math.floor(subtotal * (appliedCoupon.discount / 100));
  } else {
    return appliedCoupon.discount;
  }
}

function renderCouponInput() {
  const container = document.getElementById('couponContainer');
  if (!container) return;
  
  if (appliedCoupon) {
    container.innerHTML = `
      <div class="applied-coupon">
        <span>🏷️ ${appliedCoupon.code}</span>
        <button onclick="removeCoupon()">✕</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="coupon-input">
        <input type="text" id="couponCode" placeholder="Code promo">
        <button class="btn btn-outline" onclick="handleCouponApply()">Appliquer</button>
      </div>
    `;
  }
}

function handleCouponApply() {
  const code = document.getElementById('couponCode').value.trim();
  if (!code) {
    showToast('Veuillez entrer un code promo', 'error');
    return;
  }
  
  const result = applyCoupon(code);
  showToast(result.message, result.success ? 'success' : 'error');
  
  if (result.success) {
    renderCouponInput();
    renderCart();
  }
}

// ===== PRICE FILTER & SORT =====
let priceRange = { min: 0, max: 1000000 };
let sortBy = 'default';

function filterByPrice(min, max) {
  priceRange = { min, max };
  renderProducts();
}

function sortProducts(products) {
  switch (sortBy) {
    case 'price-asc':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...products].sort((a, b) => b.price - a.price);
    case 'rating':
      return [...products].sort((a, b) => b.rating - a.rating);
    case 'newest':
      return [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    default:
      return products;
  }
}

function changeSort(sort) {
  sortBy = sort;
  renderProducts();
}

// ===== PRODUCT QUICK VIEW =====
function openQuickView(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;
  
  // Add to recently viewed
  addToRecentlyViewed(productId);
  
  const container = document.getElementById('quickViewContent');
  container.innerHTML = `
    <div class="quick-view-grid">
      <div class="quick-view-images">
        <img src="${product.image}" alt="${product.name}" id="quickViewMainImage">
        ${product.images && product.images.length > 1 ? `
          <div class="quick-view-thumbnails">
            ${product.images.map((img, i) => `
              <img src="${img}" alt="${product.name}" onclick="changeQuickViewImage('${img}')" class="${i === 0 ? 'active' : ''}">
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div class="quick-view-info">
        <h2>${product.name}</h2>
        <div class="quick-view-rating">
          ${'⭐'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}
          <span>(${product.reviewCount || 0} avis)</span>
        </div>
        <div class="quick-view-price">
          ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
          <span class="current-price">${formatPrice(product.price)}</span>
        </div>
        <p class="quick-view-desc">${product.desc}</p>
        
        ${product.colors && product.colors.length > 0 ? `
          <div class="quick-view-colors">
            <label>Couleur:</label>
            <div class="color-options">
              ${product.colors.map((color, i) => `
                <button class="color-btn ${i === 0 ? 'active' : ''}" onclick="selectColor(this)">${color}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${product.variants && product.variants.length > 0 ? `
          <div class="quick-view-variants">
            <label>Variante:</label>
            <div class="variant-options">
              ${product.variants.map((variant, i) => `
                <button class="variant-btn ${i === 0 ? 'active' : ''}" onclick="selectVariant(this, ${variant.price})">
                  ${variant.name}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="quick-view-stock">
          ${product.inStock ? `
            <span class="in-stock">✅ En stock (${product.stock} disponibles)</span>
          ` : `
            <span class="out-of-stock">❌ Rupture de stock</span>
          `}
        </div>
        
        <div class="quick-view-actions">
          <div class="qty-selector">
            <button onclick="quickViewQty(-1)">−</button>
            <input type="number" id="quickViewQty" value="1" min="1" max="${product.stock || 1}">
            <button onclick="quickViewQty(1)">+</button>
          </div>
          <button class="btn btn-primary" onclick="addToCartFromQuickView(${product.id})">
            🛒 Ajouter au panier
          </button>
        </div>
        
        <div class="quick-view-shipping">
          ${product.freeShipping ? `
            <p>🚚 Livraison gratuite</p>
          ` : `
            <p>📦 Frais de livraison: ${formatPrice(standardShippingCost)}</p>
          `}
        </div>
      </div>
    </div>
    
    <div class="quick-view-tabs">
      <button class="tab-btn active" onclick="switchQuickViewTab('specs')">Spécifications</button>
      <button class="tab-btn" onclick="switchQuickViewTab('reviews')">Avis</button>
    </div>
    
    <div id="quickViewTabContent">
      <div class="specs-content">
        <table class="specs-table">
          ${Object.entries(product.specs || {}).map(([key, value]) => `
            <tr>
              <td>${key}</td>
              <td>${value}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
  
  document.getElementById('quickViewModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  document.getElementById('quickViewModal').classList.remove('active');
  document.body.style.overflow = '';
}

function changeQuickViewImage(src) {
  document.getElementById('quickViewMainImage').src = src;
}

function selectColor(btn) {
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectVariant(btn, price) {
  document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function quickViewQty(delta) {
  const input = document.getElementById('quickViewQty');
  let value = parseInt(input.value) + delta;
  value = Math.max(1, Math.min(value, parseInt(input.max)));
  input.value = value;
}

function addToCartFromQuickView(productId) {
  const qty = parseInt(document.getElementById('quickViewQty').value) || 1;
  const product = productsData.find(p => p.id === productId);
  
  for (let i = 0; i < qty; i++) {
    addToCart(productId, null);
  }
  
  closeQuickView();
  openCart();
}

function switchQuickViewTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  
  // For now just show specs again - reviews would need more implementation
}

// ===== RELATED PRODUCTS =====
function getRelatedProducts(productId, category, limit = 4) {
  return productsData
    .filter(p => p.category === category && p.id !== productId)
    .slice(0, limit);
}

function renderRelatedProducts(productId, category) {
  const container = document.getElementById('relatedProductsContainer');
  if (!container) return;
  
  const related = getRelatedProducts(productId, category);
  
  if (related.length === 0) {
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Produits Similaires</h2>
    </div>
    <div class="products">
      ${related.map(p => `
        <article class="product" data-id="${p.id}">
          <div class="product-rating">${'⭐'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</div>
          ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
          <div class="product-image">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </div>
          <h3>${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-footer">
            <div class="product-footer-top">
              <p class="price">${formatPrice(p.price)}</p>
            </div>
            <div class="product-actions">
              <button class="add-cart-btn" onclick="addToCart(${p.id}, this)">🛒 Ajouter</button>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

// ===== CURRENCY CONVERTER =====
let currentCurrency = localStorage.getItem('currency') || 'XAF';

function convertPrice(price, fromCurrency = 'XAF', toCurrency = currentCurrency) {
  if (fromCurrency === toCurrency) return price;
  
  // Convert to XAF first, then to target currency
  const priceInXAF = price / exchangeRates[fromCurrency];
  return priceInXAF * exchangeRates[toCurrency];
}

function formatCurrency(price, currency = currentCurrency) {
  const converted = convertPrice(price, 'XAF', currency);
  const symbol = currencySymbols[currency];
  
  if (currency === 'XAF') {
    return converted.toLocaleString('fr-FR') + ' ' + symbol;
  } else {
    return symbol + ' ' + converted.toFixed(2);
  }
}

function changeCurrency(currency) {
  currentCurrency = currency;
  localStorage.setItem('currency', currency);
  renderProducts();
  renderCart();
  showToast(`Devise changée: ${currency}`, 'success');
}

// ===== FREE SHIPPING CALCULATOR =====
function getFreeShippingProgress() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const remaining = freeShippingThreshold - subtotal;
  
  return {
    subtotal,
    threshold: freeShippingThreshold,
    remaining: Math.max(0, remaining),
    progress: Math.min(100, (subtotal / freeShippingThreshold) * 100),
    eligible: subtotal >= freeShippingThreshold
  };
}

function renderFreeShippingProgress() {
  const container = document.getElementById('freeShippingProgress');
  if (!container) return;
  
  const { subtotal, threshold, remaining, progress, eligible } = getFreeShippingProgress();
  
  if (eligible) {
    container.innerHTML = `
      <div class="free-shipping-eligible">
        🚚 Livraison gratuite appliquée!
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="free-shipping-progress">
        <p>🚚 Ajoutez ${formatPrice(remaining)} pour la livraison gratuite!</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <small>${Math.round(progress)}% atteint</small>
      </div>
    `;
  }
}

// ===== FAQ SECTION =====
function renderFAQ() {
  const container = document.getElementById('faqContainer');
  if (!container || !faqData) return;
  
  container.innerHTML = faqData.map((item, index) => `
    <div class="faq-item">
      <button class="faq-question" onclick="toggleFAQ(${index})">
        ${item.question}
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer" id="faq-${index}">
        <p>${item.answer}</p>
      </div>
    </div>
  `).join('');
}

function toggleFAQ(index) {
  const answer = document.getElementById(`faq-${index}`);
  const question = answer.previousElementSibling;
  const icon = question.querySelector('.faq-icon');
  
  answer.classList.toggle('active');
  icon.textContent = answer.classList.contains('active') ? '−' : '+';
}

// ===== NEWSLETTER =====
function subscribeNewsletter(email) {
  // In a real app, this would send to backend
  const subscribers = JSON.parse(localStorage.getItem('newsletter')) || [];
  
  if (subscribers.includes(email)) {
    return { success: false, message: 'Vous êtes déjà abonné!' };
  }
  
  subscribers.push(email);
  localStorage.setItem('newsletter', JSON.stringify(subscribers));
  
  return { success: true, message: 'Merci de votre inscription!' };
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value.trim();
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Veuillez entrer un email valide', 'error');
    return;
  }
  
  const result = subscribeNewsletter(email);
  showToast(result.message, result.success ? 'success' : 'error');
  
  if (result.success) {
    document.getElementById('newsletterForm').reset();
  }
}

// ===== SOCIAL SHARE =====
function shareProduct(productName, productId) {
  const url = window.location.href;
  const text = `Découvrez ${productName} sur MultiShop!`;
  
  if (navigator.share) {
    navigator.share({
      title: productName,
      text: text,
      url: url
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${text} ${url}`);
    showToast('Lien copié dans le presse-papiers!', 'success');
  }
}

// ===== INITIALIZE NEW FEATURES =====
function initializeNewFeatures() {
  // Update user UI
  updateUserUI();
  
  // Render recently viewed
  renderRecentlyViewed();
  
  // Render FAQ
  renderFAQ();
  
  // Render free shipping progress
  renderFreeShippingProgress();
  
  // Add event listeners for new modals
  document.getElementById('loginForm')?.addEventListener('submit', handleLoginSubmit);
  document.getElementById('registerForm')?.addEventListener('submit', handleRegisterSubmit);
  document.getElementById('newsletterForm')?.addEventListener('submit', handleNewsletterSubmit);
}

// Add to initialization
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...
  initializeNewFeatures();
});
