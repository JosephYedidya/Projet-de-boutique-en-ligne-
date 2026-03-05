/**
 * Main Application Logic
 * E-commerce functionality with test purchase feature
 */

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let comparison = JSON.parse(localStorage.getItem('comparison')) || [];
let currentFilter = 'all';
let searchQuery = '';
let isUsingAPI = false;

// ===== API CONFIG =====
const API_URL = './api.php';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  // First, try to use products directly from products.js if available
  if (typeof productsData !== 'undefined' && productsData.length > 0) {
    console.log('✅ Products loaded from products.js, count:', productsData.length);
  } else if (typeof window.productsDataStatic !== 'undefined' && window.productsDataStatic.length > 0) {
    productsData = window.productsDataStatic;
    console.log('✅ Products loaded from window.productsDataStatic, count:', productsData.length);
  } else {
    await loadProductsFromAPI();
  }

  console.log('Products to render:', productsData ? productsData.length : 0);
  
  if (productsData && productsData.length > 0) {
    renderProducts();
  } else {
    setTimeout(() => {
      if (typeof productsData !== 'undefined' && productsData && productsData.length > 0) {
        renderProducts();
      } else if (typeof window.productsDataStatic !== 'undefined') {
        productsData = window.productsDataStatic;
        renderProducts();
      } else {
        const grid = document.getElementById('productsGrid');
        if (grid) grid.innerHTML = '<p style="text-align:center;padding:20px;">Aucun produit disponible</p>';
      }
    }, 500);
  }
  
  updateCartBadge();
  updateWishlistCount();
  updateComparisonBar();
  setupEventListeners();
  setupMobileNav();
  initializeNewFeatures();
  
  // Listen for product updates from admin dashboard
  window.addEventListener('storage', (e) => {
    if (e.key === 'adminProductStats') {
      console.log('🔄 Product update detected from admin dashboard');
      loadProductsFromAPI().then(() => {
        if (productsData && productsData.length > 0) {
          renderProducts();
        }
      });
    }
  });
  
  // Also listen for custom event
  window.addEventListener('adminStatsUpdate', async () => {
    console.log('🔄 Custom event: Product update detected');
    await loadProductsFromAPI();
    if (productsData && productsData.length > 0) {
      renderProducts();
    }
  });
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
      
      productsData.forEach(product => {
        product.inStock = product.stock > 0;
      });
      return;
    }
  } catch (error) {
    console.warn('⚠️ API not available:', error.message);
  }
  
  if (!apiLoaded && typeof window.productsDataStatic !== 'undefined' && window.productsDataStatic.length > 0) {
    productsData = window.productsDataStatic;
    isUsingAPI = false;
    console.log('✅ Products loaded from static data (products.js)');
    return;
  }
  
  if (!apiLoaded && typeof productsData !== 'undefined' && productsData.length > 0) {
    isUsingAPI = false;
    console.log('✅ Products already loaded from products.js');
    return;
  }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderProducts();
    });
  }
  
  const mobileSearchBar = document.getElementById('mobileSearchBar');
  if (mobileSearchBar) {
    mobileSearchBar.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderProducts();
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProducts();
    });
  });

  window.addEventListener('scroll', () => {
    document.querySelector('header').classList.toggle('scrolled', window.scrollY > 100);
  });

  document.getElementById('contactForm')?.addEventListener('submit', handleContactSubmit);

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
}

// ===== PRODUCT RENDERING =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  
  const filtered = productsData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                         p.desc.toLowerCase().includes(searchQuery);
    const matchesFilter = currentFilter === 'all' || p.category === currentFilter;
    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';
  grid.innerHTML = filtered.map(p => `
    <article class="product" data-id="${p.id}" data-category="${p.category}">
      <div class="product-rating">${'⭐'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</div>
      ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
      ${!p.inStock ? `<div class="product-badge out-of-stock-badge">❌ Rupture de stock</div>` : ''}
      <button class="wishlist-btn ${isInWishlist(p.id) ? 'active' : ''}" 
              onclick="toggleWishlist(${p.id})"
              aria-label="${isInWishlist(p.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
        ${isInWishlist(p.id) ? '❤️' : '🤍'}
      </button>
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" ${!p.inStock ? 'style="opacity:0.5"' : ''}>
      </div>
      <h3>${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <div class="product-footer">
        <div class="product-footer-top">
          <p class="price">${formatPrice(p.price)}</p>
          <span class="category-label">${categoryLabels[p.category] || p.category}</span>
        </div>
        <div class="stock-info ${p.inStock ? 'in-stock' : 'out-of-stock'}">
          ${p.inStock ? `📦 ${p.stock} en stock` : '❌ Indisponible'}
        </div>
        <div class="product-actions">
          <button class="add-cart-btn ${!p.inStock ? 'disabled' : ''}" 
                  id="addBtn-${p.id}" 
                  onclick="${p.inStock ? `addToCart(${p.id}, this)` : ''}"
                  ${!p.inStock ? 'disabled' : ''}>
            ${p.inStock ? '🛒 Ajouter' : '❌ Indisponible'}
          </button>
          <button class="compare-btn-small ${isInComparison(p.id) ? 'active' : ''}" 
                  onclick="toggleComparison(${p.id})" 
                  aria-label="${isInComparison(p.id) ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}">
            📊
          </button>
        </div>
      </div>
    </article>
  `).join('');
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
            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
          <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      `).join('')}
    </div>
    <div class="cart-total">
      <div class="cart-total-row">
        <span>Total:</span>
        <span>${formatPrice(total)}</span>
      </div>
      <button class="checkout-btn" onclick="openTestPayment()" style="background: #28a745;">
        🧪 Acheter sans payer (TEST)
      </button>
      <button class="checkout-btn" onclick="checkout()" style="margin-top: 10px;">
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
      </tbody>
    </table>
  `;
}

// ===== FILTER BY CATEGORY =====
function filterByCategory(category, navItem = null) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`[data-filter="${category}"]`);
  if (btn) btn.classList.add('active');
  
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
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  document.getElementById('themeIcon').textContent = '☀️';
}

// ===== CONTACT FORM =====
function handleContactSubmit(e) {
  e.preventDefault();
  showToast('✅ Message envoyé avec succès!', 'success');
  document.getElementById('contactForm').reset();
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = sanitizeInput(message);
  toast.setAttribute('role', 'alert');
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// ===== PAYMENT FUNCTIONS =====
// Function to reduce stock in database when order is placed
async function reduceStockInDatabase(items) {
  try {
    const response = await fetch(`${API_URL}?action=reduceStock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items })
    });
    const result = await response.json();
    if (result.success) {
      console.log('✅ Stock reduced in database:', result.data);
      // Update local productsData with new stock values
      if (result.data && result.data.updated) {
        result.data.updated.forEach(update => {
          const product = productsData.find(p => p.id === update.id);
          if (product) {
            product.stock = update.newStock;
            product.inStock = update.newStock > 0;
          }
        });
      }
      return true;
    } else {
      console.warn('⚠️ Failed to reduce stock:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Error reducing stock:', error);
    return false;
  }
}

function openPayment() {
  renderPaymentSummary();
  renderPaymentItems();
  document.getElementById('paymentModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  setupPaymentOptions();
}

function closePayment() {
  document.getElementById('paymentModal').classList.remove('active');
  document.body.style.overflow = '';
  resetPaymentForm();
}

function renderPaymentSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 2500;
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
      paymentOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      updateConfirmButtonState();
    });
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
  
  if (method === 'orange-money') {
    const phone = document.getElementById('orangeNumber').value.trim();
    isValid = phone.length === 9 && phone.startsWith('6');
  } else if (method === 'mtn-mobile') {
    const phone = document.getElementById('mtnNumber').value.trim();
    isValid = phone.length === 9 && phone.startsWith('6');
  }
  
  confirmBtn.disabled = !isValid;
}

function resetPaymentForm() {
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  document.querySelectorAll('#paymentModal input').forEach(input => {
    input.value = '';
  });
  
  document.getElementById('confirmPaymentBtn').disabled = true;
}

function confirmPayment() {
  const selectedOption = document.querySelector('.payment-option.selected');
  const method = selectedOption.dataset.method;
  
  const btn = document.getElementById('confirmPaymentBtn');
  const btnText = btn.querySelector('.btn-text');
  const btnLoading = btn.querySelector('.btn-loading');
  
  btn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  
  let paymentInfo = {};
  if (method === 'orange-money') {
    paymentInfo.phone = document.getElementById('orangeNumber').value.trim();
  } else if (method === 'mtn-mobile') {
    paymentInfo.phone = document.getElementById('mtnNumber').value.trim();
  }

  // Prepare items for stock reduction
  const itemsToReduce = cart.map(item => ({ id: item.id, quantity: item.quantity }));

  setTimeout(async () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2500;
    
    const order = {
      id: Date.now(),
      items: [...cart],
      total: total,
      method: method,
      customer: {},
      payment: paymentInfo,
      date: new Date().toISOString(),
      status: 'confirmed'
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Reduce stock in database
    await reduceStockInDatabase(itemsToReduce);
    
    cart = [];
    saveCart();
    updateCartBadge();
    
    showToast('🎉 Commande #' + order.id + ' confirmée!', 'success');
    
    closePayment();
    closeCart();
    
    btn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    
  }, 3000);
}

// ===== TEST PURCHASE (No Payment Required) =====
function openTestPayment() {
  renderPaymentItems();
  renderPaymentSummary();
  
  document.getElementById('paymentModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Add test payment button if not already added
  const paymentContent = document.querySelector('.payment-content');
  if (paymentContent && !document.getElementById('testPaymentBtn')) {
    const testBtn = document.createElement('button');
    testBtn.id = 'testPaymentBtn';
    testBtn.className = 'btn btn-success btn-block';
    testBtn.style.cssText = 'margin-top: 15px; background: #28a745; color: white; padding: 12px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;';
    testBtn.innerHTML = '🧪 TEST: Acheter sans payer (Gratuit)';
    testBtn.onclick = confirmTestPayment;
    
    const paymentActions = document.querySelector('.payment-actions');
    if (paymentActions) {
      paymentActions.parentNode.insertBefore(testBtn, paymentActions);
    }
  }
}

function confirmTestPayment() {
  const btn = document.getElementById('testPaymentBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Traitement en cours...';
  }
  
  // Prepare items for stock reduction
  const itemsToReduce = cart.map(item => ({ id: item.id, quantity: item.quantity }));
  
  setTimeout(async () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2500;
    
    const order = {
      id: Date.now(),
      items: [...cart],
      total: total,
      method: 'TEST_PURCHASE',
      customer: { name: 'Test Client', email: 'test@test.com' },
      payment: {},
      date: new Date().toISOString(),
      status: 'confirmed',
      isTest: true
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Reduce stock in database
    await reduceStockInDatabase(itemsToReduce);
    
    cart = [];
    saveCart();
    updateCartBadge();
    
    showToast('🧪 TEST: Commande créée avec succès! Commande #' + order.id, 'success');
    
    closePayment();
    closeCart();
    
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '🧪 TEST: Acheter sans payer (Gratuit)';
    }
    
  }, 1500);
}

// ===== MOBILE NAVIGATION =====
function setupMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  
  if (!hamburgerBtn || !mobileNavOverlay) return;
  
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileNav();
  });
  
  mobileNavOverlay.addEventListener('click', (e) => {
    if (e.target === mobileNavOverlay) {
      closeMobileNav();
    }
  });
}

function toggleMobileNav() {
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  
  if (mobileNavOverlay.classList.contains('active')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}

function openMobileNav() {
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  
  if (mobileNavOverlay) mobileNavOverlay.classList.add('active');
  if (hamburgerBtn) hamburgerBtn.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  
  if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
  if (hamburgerBtn) hamburgerBtn.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== USER AUTHENTICATION =====
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function isLoggedIn() {
  return currentUser !== null;
}

function updateUserUI() {
  const userBtn = document.getElementById('userBtn');
  
  if (isLoggedIn()) {
    if (userBtn) {
      userBtn.innerHTML = `👤 ${currentUser.name.split(' ')[0]}`;
      userBtn.onclick = openProfile;
    }
  } else {
    if (userBtn) {
      userBtn.innerHTML = '👤 Connexion';
      userBtn.onclick = openLoginModal;
    }
  }
}

function openLoginModal() {
  document.getElementById('loginModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== REGISTRATION FUNCTIONS =====
function openRegisterModal() {
  document.getElementById('registerModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
  document.getElementById('registerModal').classList.remove('active');
  document.body.style.overflow = '';
}

async function register(name, email, phone, password) {
  try {
    const response = await fetch(`${API_URL}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true, message: 'Compte créé avec succès!', user: result.data };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error('Registration error:', error);
    // Fallback to localStorage if API fails
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Cet email est déjà utilisé' };
    }
    
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone || '',
      password: password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Compte créé avec succès!', user: newUser };
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const password = document.getElementById('registerPassword').value;
  
  const result = await register(name, email, phone, password);
  
  if (result.success) {
    showToast(result.message, 'success');
    closeRegisterModal();
    // Auto login after registration
    const loginResult = await login(email, password);
    if (loginResult.success) {
      updateUserUI();
    }
    document.getElementById('registerForm').reset();
  } else {
    showToast(result.message, 'error');
  }
}

function openProfile() {
  if (!isLoggedIn()) {
    openLoginModal();
    return;
  }
  document.getElementById('profileModal').classList.add('active');
  document.body.style.overflow = 'hidden';
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
      </div>
    </div>
    <div class="profile-menu">
      <button class="profile-menu-item" onclick="openOrders()">
        📦 Mes commandes
      </button>
      <button class="profile-menu-item logout" onclick="logout()">
        🚪 Déconnexion
      </button>
    </div>
  `;
}

function login(email, password) {
  return fetch(`${API_URL}?action=login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      currentUser = result.data;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return { success: true, message: 'Connexion réussie!' };
    } else {
      return { success: false, message: result.message };
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }
    
    currentUser = { ...user };
    delete currentUser.password;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return { success: true, message: 'Connexion réussie!' };
  });
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showToast('👋 Déconnexion réussie', 'success');
  updateUserUI();
  closeProfile();
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  login(email, password).then(result => {
    if (result.success) {
      showToast(result.message, 'success');
      closeLoginModal();
      updateUserUI();
    } else {
      showToast(result.message, 'error');
    }
  });
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
      </div>
    `;
    return;
  }
  
  orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div class="order-id">Commande #${order.id}</div>
        <div class="order-status status-${order.status}">${order.status === 'confirmed' ? 'Confirmée' : order.status}</div>
      </div>
      <div class="order-date">${new Date(order.date).toLocaleDateString('fr-FR')}</div>
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
        ${order.isTest ? '<span style="color:#28a745;">🧪 Test</span>' : ''}
      </div>
    </div>
  `).join('');
}

// ===== INITIALIZE NEW FEATURES =====
function initializeNewFeatures() {
  updateUserUI();
  document.getElementById('loginForm')?.addEventListener('submit', handleLoginSubmit);
  document.getElementById('registerForm')?.addEventListener('submit', handleRegisterSubmit);
}
