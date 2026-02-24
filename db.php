<?php
/**
 * Database Connection File for XAMPP
 * Hardware E-commerce Database
 */

// Database credentials - XAMPP default settings
$servername = "localhost";
$username = "root";
$password = "";
$database = "hardware_ecommerce";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to UTF-8
$conn->set_charset("utf8mb4");

/**
 * Function to get all products
 */
function getAllProducts() {
    global $conn;
    $sql = "SELECT * FROM products ORDER BY id ASC";
    $result = $conn->query($sql);
    
    $products = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Decode JSON fields
            $row['specs'] = json_decode($row['specs'], true);
            $row['variants'] = json_decode($row['variants'], true);
            $row['colors'] = json_decode($row['colors'], true);
            $row['images'] = json_decode($row['images'], true);
            $products[] = $row;
        }
    }
    return $products;
}

/**
 * Function to get all categories with product counts
 */
function getCategoriesWithCounts() {
    global $conn;
    $sql = "SELECT c.*, COUNT(p.id) as product_count 
            FROM categories c 
            LEFT JOIN products p ON c.id = p.category_id 
            GROUP BY c.id 
            ORDER BY c.id ASC";
    $result = $conn->query($sql);
    
    $categories = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
    }
    return $categories;
}

/**
 * Function to get products by category
 */
function getProductsByCategory($categoryId) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM products WHERE category_id = ? ORDER BY id ASC");
    $stmt->bind_param("i", $categoryId);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $products = [];
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['specs'] = json_decode($row['specs'], true);
            $row['variants'] = json_decode($row['variants'], true);
            $row['colors'] = json_decode($row['colors'], true);
            $row['images'] = json_decode($row['images'], true);
            $products[] = $row;
        }
    }
    
    $stmt->close();
    return $products;
}

/**
 * Function to get a single product by ID
 */
function getProductById($id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $product = null;
    
    if ($result && $result->num_rows > 0) {
        $product = $result->fetch_assoc();
        $product['specs'] = json_decode($product['specs'], true);
        $product['variants'] = json_decode($product['variants'], true);
        $product['colors'] = json_decode($product['colors'], true);
        $product['images'] = json_decode($product['images'], true);
    }
    
    $stmt->close();
    return $product;
}

/**
 * Function to search products
 */
function searchProducts($searchTerm) {
    global $conn;
    $searchTerm = "%" . $searchTerm . "%";
    $stmt = $conn->prepare("SELECT * FROM products WHERE name LIKE ? OR description LIKE ? ORDER BY id ASC");
    $stmt->bind_param("ss", $searchTerm, $searchTerm);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $products = [];
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['specs'] = json_decode($row['specs'], true);
            $row['variants'] = json_decode($row['variants'], true);
            $row['colors'] = json_decode($row['colors'], true);
            $row['images'] = json_decode($row['images'], true);
            $products[] = $row;
        }
    }
    
    $stmt->close();
    return $products;
}

/**
 * Function to get total product count
 */
function getTotalProductCount() {
    global $conn;
    $sql = "SELECT COUNT(*) as total FROM products";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['total'];
    }
    return 0;
}

/**
 * Function to get total stock count
 */
function getTotalStockCount() {
    global $conn;
    $sql = "SELECT SUM(stock) as total_stock FROM products";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['total_stock'] ? $row['total_stock'] : 0;
    }
    return 0;
}

/**
 * Function to delete a product
 */
function deleteProduct($id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

/**
 * Function to update product stock
 */
function updateProductStock($id, $newStock) {
    global $conn;
    $stmt = $conn->prepare("UPDATE products SET stock = ? WHERE id = ?");
    $stmt->bind_param("ii", $newStock, $id);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

/**
 * Function to add a new product
 */
function addProduct($name, $description, $price, $oldPrice, $categoryId, $category, $image, $stock) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO products (name, description, price, old_price, category_id, category, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdiissi", $name, $description, $price, $oldPrice, $categoryId, $category, $image, $stock);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

/**
 * API endpoint handler - returns JSON data for dashboard
 */
function handleAPIRequest() {
    header('Content-Type: application/json');
    
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'getProducts':
            $products = getAllProducts();
            echo json_encode(['success' => true, 'data' => $products]);
            break;
            
        case 'getCategories':
            $categories = getCategoriesWithCounts();
            echo json_encode(['success' => true, 'data' => $categories]);
            break;
            
        case 'getProduct':
            $id = $_GET['id'] ?? 0;
            $product = getProductById($id);
            echo json_encode(['success' => true, 'data' => $product]);
            break;
            
        case 'search':
            $term = $_GET['term'] ?? '';
            $products = searchProducts($term);
            echo json_encode(['success' => true, 'data' => $products]);
            break;
            
        case 'getStats':
            $totalProducts = getTotalProductCount();
            $totalStock = getTotalStockCount();
            $categories = getCategoriesWithCounts();
            echo json_encode([
                'success' => true, 
                'data' => [
                    'totalProducts' => $totalProducts,
                    'totalStock' => $totalStock,
                    'categories' => $categories
                ]
            ]);
            break;
            
        case 'deleteProduct':
            $id = $_GET['id'] ?? 0;
            $result = deleteProduct($id);
            echo json_encode(['success' => $result]);
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
    
    exit;
}

// Check if this is an API request
if (isset($_GET['api']) && $_GET['api'] === 'true') {
    handleAPIRequest();
}
?>
