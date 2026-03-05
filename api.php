<?php
/**
 * Hardware E-commerce API
 * Handles database operations for products and stock management
 * Compatible with XAMPP MySQL
 */

// Database configuration
$host = '127.0.0.1';
$dbname = 'hardware_ecommerce';
$username = 'root';
$password = '';

header('Content-Type: application/json');

// Enable CORS for local development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Response helper function
function respond($success, $message = '', $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Connect to database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // If database doesn't exist, create it
    try {
        $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname");
        $pdo->exec("USE $dbname");
        
        // Create tables
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                name_en VARCHAR(100),
                description TEXT,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");
        
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                old_price DECIMAL(10, 2),
                category_id INT,
                category VARCHAR(50),
                image VARCHAR(255),
                images JSON,
                rating DECIMAL(3, 1),
                review_count INT DEFAULT 0,
                badge VARCHAR(50),
                stock INT DEFAULT 0,
                in_stock BOOLEAN DEFAULT TRUE,
                is_new BOOLEAN DEFAULT FALSE,
                is_featured BOOLEAN DEFAULT FALSE,
                free_shipping BOOLEAN DEFAULT FALSE,
                specs JSON,
                variants JSON,
                colors JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )
        ");
        
        // Insert sample categories
        $pdo->exec("
            INSERT INTO categories (id, name, name_en, description) VALUES
            (1, 'Tech & Gadgets', 'tech', 'Smartphones,ordinateurs,accessoires électroniques'),
            (2, 'Beauté & Soins', 'beauty', 'Produits de beauté,soins visage et cheveux'),
            (3, 'Maison & Décoration', 'goods', 'Décoration,mobilier,ustensiles cuisine'),
            (4, 'Mode & Vêtements', 'fashion', 'Vêtements,chaussures,accessoires mode'),
            (5, 'Accessoires', 'accessories', 'Montres,sacs,lunettes,parures')
        ");
        
        // Check if products exist
        $stmt = $pdo->query("SELECT COUNT(*) FROM products");
        $count = $stmt->fetchColumn();
        
        if ($count == 0) {
            // Insert sample products
            $products = [
                [1, 'iPhone 15 Pro Max', 'Smartphone premium avec écran Super Retina XDR 6.7 pouces, caméra 48MP, processeur A17 Pro.', 850000, 1000000, 1, 'tech', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=75', 5.0, 124, '-15%', 15, 1, 1, 1, 1],
                [2, 'Samsung Galaxy S24 Ultra', 'Smartphone Android haut de gamme avec S Pen intégré, écran Dynamic AMOLED 6.8 pouces.', 780000, 850000, 1, 'tech', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=500&q=75', 5.0, 89, 'Nouveau', 8, 1, 1, 0, 0],
                [3, 'MacBook Air M3', 'Ordinateur portable ultra-fin avec puce M3, autonomie jusqu\'à 18 heures.', 950000, 1100000, 1, 'tech', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=75', 5.0, 67, 'Populaire', 5, 1, 0, 1, 1],
                [4, 'AirPods Pro 2', 'Écouteurs sans fil avec réduction active du bruit, transparence adaptative.', 185000, 220000, 1, 'tech', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=75', 4.0, 203, NULL, 42, 1, 0, 0, 1],
                [5, 'Samsung Galaxy Tab S9', 'Tablette Android 11 pouces avec S Pen inclus, écran AMOLED 120Hz.', 420000, 480000, 1, 'tech', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=75', 4.0, 45, 'Pro', 12, 1, 0, 0, 1],
                [6, 'Chargeur Rapide 65W', 'Chargeur USB-C universel avec technologie GaN, compatible laptop et smartphone.', 35000, 45000, 1, 'tech', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=75', 4.0, 156, '-22%', 89, 1, 0, 0, 0],
                [7, 'Sérum Vitamine C', 'Sérum anti-âge brightening avec 20% Vitamine C, éclat immédiat.', 28000, 35000, 2, 'beauty', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=75', 5.0, 312, 'Best-seller', 67, 1, 0, 0, 0],
                [8, 'Crème Hydratante Premium', 'Crème hydratante intensive avec acide hyaluronique et céramides.', 22000, 28000, 2, 'beauty', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=75', 4.0, 187, NULL, 45, 1, 0, 0, 0],
                [9, 'Palette Maquillage 12 Couleurs', 'Palette yeux et joues avec finishes mates et shimmer, pigments longue tenue.', 18000, 22000, 2, 'beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=75', 5.0, 98, 'Nouveau', 23, 1, 1, 0, 0],
                [10, 'Parfum Femme Elegance', 'Eau de parfum florale et fruitée notes de rose, jasmin et bois de santal.', 45000, 55000, 2, 'beauty', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=75', 5.0, 234, 'Luxury', 18, 1, 0, 0, 1],
                [11, 'Rouge à Lèvres Mat', 'Rouge à lèvres longue tenue formule matte, hydratation 24h.', 12000, 15000, 2, 'beauty', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=75', 4.0, 167, '-20%', 56, 1, 0, 0, 0],
                [12, 'Shampooing Réparateur', 'Shampooing kératine pour cheveux endommagés, réparation en profondeur.', 15000, 18000, 2, 'beauty', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=75', 4.0, 89, NULL, 34, 1, 0, 0, 0],
                [13, 'Lampe Design Minimaliste', 'Lampe de table LED design scandinave, intensité adjustable, chargeur sans fil.', 38000, 45000, 3, 'goods', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=75', 4.0, 56, 'Design', 15, 1, 0, 0, 1],
                [14, 'Ensemble Ustensiles Cuisine', 'Set ustensiles cuisine professionnel 12 pièces, bois d\'olivier.', 42000, 55000, 3, 'goods', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=75', 5.0, 78, 'Pro', 9, 1, 0, 0, 1],
                [15, 'Mug Céramique Artisanal', 'Mug céramique artisanale idéal pour café et thé, capacité 350ml.', 8500, 10000, 3, 'goods', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=75', 4.0, 134, '-15%', 67, 1, 0, 0, 0],
                [16, 'Vase Décoratif Moderne', 'Vase en verre soufflé artisanal, design contemporain, hauteur 35cm.', 25000, 32000, 3, 'goods', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=500&q=75', 4.0, 45, NULL, 12, 1, 0, 0, 1],
                [17, 'Couverture Polaire Douce', 'Couverture polaire超柔软, idéale pour le canapé, 150x200cm.', 28000, 35000, 3, 'goods', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=75', 5.0, 189, 'Confort', 34, 1, 0, 0, 1],
                [18, 'Diffuseur Aromas', 'Diffuseur d\'huiles essentielles ultrasonique, LED ambient, minuterie.', 22000, 28000, 3, 'goods', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=75', 4.0, 112, '-21%', 28, 1, 0, 0, 0],
                [19, 'Robe Élégante Été', 'Robe légère fluide été, coton premium, coupe asymétrique élégante.', 35000, 42000, 4, 'fashion', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=75', 4.0, 67, 'Nouveau', 21, 1, 1, 0, 0],
                [20, 'Chemise Homme Classique', 'Chemise homme coton égyptien, coupe slim, col italien.', 28000, 32000, 4, 'fashion', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=75', 5.0, 145, NULL, 38, 1, 0, 0, 0],
                [21, 'Montre Connectée Sport', 'Montre connectée GPS, cardio, SpO2, waterproof 5ATM, autonomie 7 jours.', 95000, 120000, 5, 'accessories', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=75', 5.0, 267, 'Pro', 19, 1, 0, 0, 1],
                [22, 'Sac à Main Cuir', 'Sac à main cuir véritable,bandoulière调节, plusieurs compartiments.', 55000, 70000, 5, 'accessories', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=75', 4.0, 89, 'Luxury', 7, 1, 0, 0, 1],
                [23, 'Lunettes de Soleil Design', 'Lunettes soleil polarisées, monture acetate, protection UV400.', 32000, 40000, 5, 'accessories', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=75', 4.0, 123, '-20%', 42, 1, 0, 0, 0],
                [24, 'Ceinture Cuir Premium', 'Ceinture cuir pleine fleur, boucle металл antique, largeur 3.5cm.', 18000, 22000, 5, 'accessories', 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=500&q=75', 5.0, 78, NULL, 56, 1, 0, 0, 0],
                [25, 'iPhone 14', 'Smartphone performant avec écran Super Retina, caméra 12MP, vitesse 5G.', 650000, 750000, 1, 'tech', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=75', 4.0, 189, '-13%', 25, 1, 0, 0, 1]
            ];
            
            $stmt = $pdo->prepare("
                INSERT INTO products (id, name, description, price, old_price, category_id, category, image, rating, review_count, badge, stock, in_stock, is_new, is_featured, free_shipping) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            foreach ($products as $p) {
                $stmt->execute($p);
            }
        }
    } catch (PDOException $e) {
        respond(false, 'Database connection failed: ' . $e->getMessage());
    }
}

// Handle different actions
switch ($action) {
    case 'getProducts':
        // Get all products
        $stmt = $pdo->query("SELECT * FROM products ORDER BY id");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Process JSON fields
        foreach ($products as &$product) {
            $product['images'] = $product['images'] ? json_decode($product['images'], true) : [];
            $product['specs'] = $product['specs'] ? json_decode($product['specs'], true) : [];
            $product['variants'] = $product['variants'] ? json_decode($product['variants'], true) : [];
            $product['colors'] = $product['colors'] ? json_decode($product['colors'], true) : [];
            $product['inStock'] = (bool)$product['in_stock'];
            $product['isNew'] = (bool)$product['is_new'];
            $product['isFeatured'] = (bool)$product['is_featured'];
            $product['oldPrice'] = $product['old_price'] ? (float)$product['old_price'] : null;
            $product['price'] = (float)$product['price'];
            $product['rating'] = (float)$product['rating'];
        }
        
        respond(true, 'Products retrieved successfully', $products);
        break;
        
    case 'getProduct':
        // Get single product
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            respond(false, 'Product not found');
        }
        
        $product['images'] = $product['images'] ? json_decode($product['images'], true) : [];
        $product['specs'] = $product['specs'] ? json_decode($product['specs'], true) : [];
        $product['variants'] = $product['variants'] ? json_decode($product['variants'], true) : [];
        $product['colors'] = $product['colors'] ? json_decode($product['colors'], true) : [];
        $product['inStock'] = (bool)$product['in_stock'];
        $product['isNew'] = (bool)$product['is_new'];
        $product['isFeatured'] = (bool)$product['is_featured'];
        $product['oldPrice'] = $product['old_price'] ? (float)$product['old_price'] : null;
        $product['price'] = (float)$product['price'];
        $product['rating'] = (float)$product['rating'];
        
        respond(true, 'Product retrieved successfully', $product);
        break;
        
    case 'updateStock':
        // Update product stock
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id']) || !isset($data['stock'])) {
            respond(false, 'Missing required fields');
        }
        
        $id = (int)$data['id'];
        $stock = (int)$data['stock'];
        $inStock = $stock > 0 ? 1 : 0;
        
        $stmt = $pdo->prepare("UPDATE products SET stock = ?, in_stock = ? WHERE id = ?");
        $stmt->execute([$stock, $inStock, $id]);
        
        respond(true, 'Stock updated successfully');
        break;
        
    case 'updateProduct':
        // Update product details
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            respond(false, 'Product ID is required');
        }
        
        $id = (int)$data['id'];
        $updates = [];
        $params = [];
        
        $allowedFields = ['name', 'description', 'price', 'old_price', 'category', 'image', 'badge', 'stock', 'in_stock', 'is_new', 'is_featured', 'free_shipping'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updates[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        
        if (empty($updates)) {
            respond(false, 'No fields to update');
        }
        
        $params[] = $id;
        $sql = "UPDATE products SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        respond(true, 'Product updated successfully');
        break;
        
    case 'getStats':
        // Get stock statistics for dashboard
        $stats = [];
        
        // Total products
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM products");
        $stats['totalProducts'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total stock value
        $stmt = $pdo->query("SELECT SUM(price * stock) as total FROM products WHERE stock > 0");
        $stats['totalStockValue'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?: 0;
        
        // Out of stock count
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM products WHERE stock = 0");
        $stats['outOfStock'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Low stock count (less than 10)
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM products WHERE stock > 0 AND stock < 10");
        $stats['lowStock'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // In stock count
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM products WHERE stock > 0");
        $stats['inStock'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Category breakdown
        $stmt = $pdo->query("
            SELECT category, COUNT(*) as count, SUM(stock) as totalStock 
            FROM products 
            GROUP BY category
        ");
        $stats['byCategory'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Top products by stock
        $stmt = $pdo->query("SELECT id, name, stock FROM products ORDER BY stock DESC LIMIT 5");
        $stats['topStock'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Low stock products
        $stmt = $pdo->query("SELECT id, name, stock, category FROM products WHERE stock < 10 ORDER BY stock ASC LIMIT 10");
        $stats['lowStockProducts'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        respond(true, 'Stats retrieved successfully', $stats);
        break;
        
    case 'search':
        // Search products
        $query = isset($_GET['q']) ? $_GET['q'] : '';
        
        $stmt = $pdo->prepare("
            SELECT * FROM products 
            WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
            ORDER BY name
        ");
        $searchTerm = "%$query%";
        $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($products as &$product) {
            $product['images'] = $product['images'] ? json_decode($product['images'], true) : [];
            $product['specs'] = $product['specs'] ? json_decode($product['specs'], true) : [];
            $product['variants'] = $product['variants'] ? json_decode($product['variants'], true) : [];
            $product['colors'] = $product['colors'] ? json_decode($product['colors'], true) : [];
            $product['inStock'] = (bool)$product['in_stock'];
            $product['isNew'] = (bool)$product['is_new'];
            $product['isFeatured'] = (bool)$product['is_featured'];
            $product['oldPrice'] = $product['old_price'] ? (float)$product['old_price'] : null;
            $product['price'] = (float)$product['price'];
            $product['rating'] = (float)$product['rating'];
        }
        
        respond(true, 'Search completed', $products);
        break;
        
    case 'getCategories':
        // Get all categories
        $stmt = $pdo->query("SELECT * FROM categories ORDER BY id");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        respond(true, 'Categories retrieved successfully', $categories);
        break;
        
    case 'addCategory':
        // Add new category
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || empty($data['name'])) {
            respond(false, 'Category name is required');
        }
        
        $name = trim($data['name']);
        $nameEn = isset($data['name_en']) ? trim($data['name_en']) : strtolower(str_replace(' ', '_', $name));
        $description = isset($data['description']) ? trim($data['description']) : '';
        $image = isset($data['image']) ? trim($data['image']) : '';
        
        $stmt = $pdo->prepare("INSERT INTO categories (name, name_en, description, image) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $nameEn, $description, $image]);
        
        $categoryId = $pdo->lastInsertId();
        respond(true, 'Category added successfully', ['id' => $categoryId, 'name' => $name]);
        break;
        
case 'deleteCategory':
        // Delete category
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if ($id <= 0) {
            respond(false, 'Invalid category ID');
        }
        
        // Check if category has products
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM products WHERE category_id = ? OR category = ?");
        $stmt->execute([$id, $id]);
        $productCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        if ($productCount > 0) {
            respond(false, 'Cannot delete category with existing products. Move or delete products first.');
        }
        
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        
        respond(true, 'Category deleted successfully');
        break;
        
    case 'reduceStock':
        // Reduce stock when order is placed
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['items']) || !is_array($data['items'])) {
            respond(false, 'Items array is required');
        }
        
        $items = $data['items'];
        $updatedProducts = [];
        $errors = [];
        
        foreach ($items as $item) {
            $productId = (int)$item['id'];
            $quantity = (int)$item['quantity'];
            
            // Get current stock
            $stmt = $pdo->prepare("SELECT stock FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$product) {
                $errors[] = "Product ID $productId not found";
                continue;
            }
            
            $newStock = max(0, $product['stock'] - $quantity);
            $inStock = $newStock > 0 ? 1 : 0;
            
            $stmt = $pdo->prepare("UPDATE products SET stock = ?, in_stock = ? WHERE id = ?");
            $stmt->execute([$newStock, $inStock, $productId]);
            
            $updatedProducts[] = [
                'id' => $productId,
                'oldStock' => $product['stock'],
                'newStock' => $newStock
            ];
        }
        
        respond(true, 'Stock reduced successfully', [
            'updated' => $updatedProducts,
            'errors' => $errors
        ]);
        break;
        
    case 'register':
        // Register new user
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || empty($data['name'])) {
            respond(false, 'Name is required');
        }
        if (!isset($data['email']) || empty($data['email'])) {
            respond(false, 'Email is required');
        }
        if (!isset($data['password']) || empty($data['password'])) {
            respond(false, 'Password is required');
        }
        
        $name = trim($data['name']);
        $email = trim($data['email']);
        $phone = isset($data['phone']) ? trim($data['phone']) : '';
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            respond(false, 'Email already registered');
        }
        
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone, $password]);
        
        $userId = $pdo->lastInsertId();
        
        respond(true, 'Registration successful', [
            'id' => $userId,
            'name' => $name,
            'email' => $email
        ]);
        break;
        
    case 'login':
        // Login user
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['email']) || empty($data['email'])) {
            respond(false, 'Email is required');
        }
        if (!isset($data['password']) || empty($data['password'])) {
            respond(false, 'Password is required');
        }
        
        $email = trim($data['email']);
        $password = $data['password'];
        
        // Find user by email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !password_verify($password, $user['password'])) {
            respond(false, 'Invalid email or password');
        }
        
        // Return user data without password
        unset($user['password']);
        respond(true, 'Login successful', $user);
        break;
        
    case 'getUser':
        // Get user by ID
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if ($id <= 0) {
            respond(false, 'Invalid user ID');
        }
        
        $stmt = $pdo->prepare("SELECT id, name, email, phone, created_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            respond(false, 'User not found');
        }
        
        respond(true, 'User retrieved successfully', $user);
        break;
        
    case 'addProduct':
        // Add new product
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || empty($data['name'])) {
            respond(false, 'Product name is required');
        }
        if (!isset($data['price']) || empty($data['price'])) {
            respond(false, 'Product price is required');
        }
        if (!isset($data['category']) || empty($data['category'])) {
            respond(false, 'Product category is required');
        }
        
        $name = trim($data['name']);
        $description = isset($data['description']) ? trim($data['description']) : '';
        $price = (float)$data['price'];
        $oldPrice = isset($data['old_price']) ? (float)$data['old_price'] : null;
        $category = trim($data['category']);
        $stock = isset($data['stock']) ? (int)$data['stock'] : 0;
        $rating = isset($data['rating']) ? (float)$data['rating'] : 0;
        $image = isset($data['image']) ? trim($data['image']) : 'https://via.placeholder.com/150';
        $badge = isset($data['badge']) ? trim($data['badge']) : null;
        $isFeatured = isset($data['is_featured']) ? (int)$data['is_featured'] : 0;
        $inStock = $stock > 0 ? 1 : 0;
        
        // Get category_id from categories table
        $stmt = $pdo->prepare("SELECT id FROM categories WHERE name_en = ? OR name = ?");
        $stmt->execute([$category, $category]);
        $categoryRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $categoryId = $categoryRow ? $categoryRow['id'] : null;
        
        $stmt = $pdo->prepare("
            INSERT INTO products (name, description, price, old_price, category_id, category, image, rating, stock, in_stock, badge, is_featured, is_new, free_shipping) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
        ");
        $stmt->execute([$name, $description, $price, $oldPrice, $categoryId, $category, $image, $rating, $stock, $inStock, $badge, $isFeatured]);
        
        $productId = $pdo->lastInsertId();
        
        respond(true, 'Product added successfully', ['id' => $productId, 'name' => $name]);
        break;
        
    case 'deleteProduct':
        // Delete product
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if ($id <= 0) {
            respond(false, 'Invalid product ID');
        }
        
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        respond(true, 'Product deleted successfully');
        break;
        
    default:
        respond(false, 'Invalid action. Available actions: getProducts, getProduct, updateStock, updateProduct, getStats, search, getCategories, addCategory, deleteCategory, reduceStock, register, login, getUser');
}

