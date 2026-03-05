/**
 * Debug Version - Simple Product Loading Test
 */

// Simple initialization that loads products
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Debug: Page loaded');
    
    // Wait for products.js to load
    setTimeout(function() {
        console.log('🔍 Debug: Checking products');
        
        // Check if productsData exists
        if (typeof productsData !== 'undefined' && productsData.length > 0) {
            console.log('✅ Products found:', productsData.length);
            renderProductsDirect(productsData);
        } else if (window.productsData && window.productsData.length > 0) {
            console.log('✅ Products found in window:', window.productsData.length);
            renderProductsDirect(window.productsData);
        } else {
            console.log('❌ No products found');
            document.getElementById('productsGrid').innerHTML = '<p style="text-align:center;padding:20px;">Aucun produit trouvé</p>';
        }
    }, 500);
});

// Simple render function
function renderProductsDirect(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.log('❌ productsGrid not found');
        return;
    }
    
    console.log('🎨 Rendering', products.length, 'products');
    
    grid.innerHTML = products.map(function(p) {
        return '<div class="product" style="border:1px solid #ccc;padding:10px;margin:10px;">' +
            '<h3>' + p.name + '</h3>' +
            '<p>' + p.price + ' FCFA</p>' +
            '<img src="' + p.image + '" style="width:100px;">' +
            '</div>';
    }).join('');
    
    console.log('✅ Rendering complete');
}
