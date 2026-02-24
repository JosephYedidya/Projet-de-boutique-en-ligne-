-- Hardware E-commerce Database
-- Created for XAMPP MySQL
-- Execute this file in phpMyAdmin to create the database

-- Create database
CREATE DATABASE IF NOT EXISTS hardware_ecommerce;
USE hardware_ecommerce;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
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
);

-- Insert Categories
INSERT INTO categories (id, name, name_en, description) VALUES
(1, 'Tech & Gadgets', 'tech', 'Smartphones,ordinateurs,accessoires électroniques'),
(2, 'Beauté & Soins', 'beauty', 'Produits de beauté,soins visage et cheveux'),
(3, 'Maison & Décoration', 'goods', 'Décoration,mobilier,ustensiles cuisine'),
(4, 'Mode & Vêtements', 'fashion', 'Vêtements,chaussures,accessoires mode'),
(5, 'Accessoires', 'accessories', 'Montres,sacs,lunettes,parures');

-- Insert Products
INSERT INTO products (id, name, description, price, old_price, category_id, category, image, rating, review_count, badge, stock, in_stock, is_new, is_featured, free_shipping, specs, variants, colors) VALUES
(1, 'iPhone 15 Pro Max', 'Smartphone premium avec écran Super Retina XDR 6.7 pouces, caméra 48MP, processeur A17 Pro.', 850000, 1000000, 1, 'tech', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=75', 5.0, 124, '-15%', 15, TRUE, TRUE, TRUE, '{"storage":"256GB","screen":"6.7 pouces","camera":"48MP","battery":"5000mAh"}', '[{"name":"256GB","price":850000},{"name":"512GB","price":950000},{"name":"1TB","price":1100000}]', '["Titanium","Black","White","Blue"]'),

(2, 'Samsung Galaxy S24 Ultra', 'Smartphone Android haut de gamme avec S Pen intégré, écran Dynamic AMOLED 6.8 pouces.', 780000, 850000, 1, 'tech', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=500&q=75', 5.0, 89, 'Nouveau', 8, TRUE, TRUE, FALSE, '{"storage":"512GB","screen":"6.8 pouces","camera":"200MP","battery":"5000mAh"}', '[{"name":"512GB","price":780000},{"name":"1TB","price":920000}]', '["Titanium Black","Titanium Gray","Titanium Violet"]'),

(3, 'MacBook Air M3', 'Ordinateur portable ultra-fin avec puce M3, autonomie jusqu''à 18 heures.', 950000, 1100000, 1, 'tech', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=75', 5.0, 67, 'Populaire', 5, TRUE, FALSE, TRUE, '{"processor":"Apple M3","ram":"16GB","storage":"512GB SSD","screen":"13.6 pouces"}', '[{"name":"8GB/256GB","price":850000},{"name":"16GB/512GB","price":950000},{"name":"24GB/1TB","price":1250000}]', '["Space Gray","Silver","Starlight","Midnight"]'),

(4, 'AirPods Pro 2', 'Écouteurs sans fil avec réduction active du bruit, transparence adaptative.', 185000, 220000, 1, 'tech', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=75', 4.0, 203, NULL, 42, TRUE, FALSE, TRUE, '{"noiseCancel":"Active","battery":"6h","charging":"USB-C"}', '[{"name":"Standard","price":185000},{"name":"USB-C","price":195000}]', '["White"]'),

(5, 'Samsung Galaxy Tab S9', 'Tablette Android 11 pouces avec S Pen inclus, écran AMOLED 120Hz.', 420000, 480000, 1, 'tech', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=75', 4.0, 45, 'Pro', 12, TRUE, FALSE, TRUE, '{"storage":"256GB","screen":"11 pouces","battery":"8400mAh","ram":"8GB"}', '[{"name":"8GB/256GB","price":420000},{"name":"12GB/512GB","price":520000}]', '["Graphite","Beige"]'),

(6, 'Chargeur Rapide 65W', 'Chargeur USB-C universel avec technologie GaN, compatible laptop et smartphone.', 35000, 45000, 1, 'tech', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=75', 4.0, 156, '-22%', 89, TRUE, FALSE, FALSE, '{"power":"65W","ports":"2x USB-C","technology":"GaN"}', NULL, '["White","Black"]'),

(7, 'Sérum Vitamine C', 'Sérum anti-âge brightening avec 20% Vitamine C, éclat immédiat.', 28000, 35000, 2, 'beauty', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=75', 5.0, 312, 'Best-seller', 67, TRUE, FALSE, FALSE, '{"volume":"30ml","ingredient":"Vitamine C 20%","skinType":"Tous types"}', '[{"name":"30ml","price":28000},{"name":"50ml","price":42000}]', NULL),

(8, 'Crème Hydratante Premium', 'Crème hydratante intensive avec acide hyaluronique et céramides.', 22000, 28000, 2, 'beauty', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=75', 4.0, 187, NULL, 45, TRUE, FALSE, FALSE, '{"volume":"50ml","ingredient":"Acide Hyaluronique","skinType":"Tous types"}', NULL, NULL),

(9, 'Palette Maquillage 12 Couleurs', 'Palette yeux et joues avec finishes mates et shimmer, pigments longue tenue.', 18000, 22000, 2, 'beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=75', 5.0, 98, 'Nouveau', 23, TRUE, TRUE, FALSE, '{"colors":"12","finish":"Mat & Shimmer","lasting":"24h"}', NULL, NULL),

(10, 'Parfum Femme Elegance', 'Eau de parfum florale et fruitée notes de rose, jasmin et bois de santal.', 45000, 55000, 2, 'beauty', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=75', 5.0, 234, 'Luxury', 18, TRUE, FALSE, TRUE, '{"volume":"100ml","type":"Eau de Parfum","notes":"Florales"}', '[{"name":"50ml","price":28000},{"name":"100ml","price":45000}]', NULL),

(11, 'Rouge à Lèvres Mat', 'Rouge à lèvres longue tenue formule matte, hydratation 24h.', 12000, 15000, 2, 'beauty', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=75', 4.0, 167, '-20%', 56, TRUE, FALSE, FALSE, '{"finish":"Mat","lasting":"24h","shade":"Rouge Classic"}', '[{"name":"Rouge Classic","price":12000},{"name":"Rose Naturel","price":12000},{"name":"Bordeaux","price":12000}]', NULL),

(12, 'Shampooing Réparateur', 'Shampooing kératine pour cheveux endommagés, réparation en profondeur.', 15000, 18000, 2, 'beauty', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=75', 4.0, 89, NULL, 34, TRUE, FALSE, FALSE, '{"volume":"400ml","ingredient":"Kératine","hairType":"Cheveux endommagés"}', NULL, NULL),

(13, 'Lampe Design Minimaliste', 'Lampe de table LED design scandinave, intensité adjustable, chargeur sans fil.', 38000, 45000, 3, 'goods', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=75', 4.0, 56, 'Design', 15, TRUE, FALSE, TRUE, '{"light":"LED","features":"Chargeur sans fil","material":"Métal & Bois"}', NULL, '["White","Black","Wood"]'),

(14, 'Ensemble Ustensiles Cuisine', 'Set ustensiles cuisine professionnel 12 pièces, bois d''olivier.', 42000, 55000, 3, 'goods', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=75', 5.0, 78, 'Pro', 9, TRUE, FALSE, TRUE, '{"pieces":"12","material":"Bois d''olivier","dishwasher":"Non"}', NULL, NULL),

(15, 'Mug Céramique Artisanal', 'Mug céramique artisanale idéal pour café et thé, capacité 350ml.', 8500, 10000, 3, 'goods', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=75', 4.0, 134, '-15%', 67, TRUE, FALSE, FALSE, '{"volume":"350ml","material":"Céramique","style":"Artisanal"}', NULL, '["White","Blue","Green"]'),

(16, 'Vase Décoratif Moderne', 'Vase en verre soufflé artisanal, design contemporain, hauteur 35cm.', 25000, 32000, 3, 'goods', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=500&q=75', 4.0, 45, NULL, 12, TRUE, FALSE, TRUE, '{"height":"35cm","material":"Verre soufflé","style":"Moderne"}', NULL, '["Clear","Smoke","Amber"]'),

(17, 'Couverture Polaire Douce', 'Couverture polaire超柔软, idéale pour le canapé, 150x200cm.', 28000, 35000, 3, 'goods', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=75', 5.0, 189, 'Confort', 34, TRUE, FALSE, TRUE, '{"size":"150x200cm","material":"Polaire","color":"Gris chiné"}', '[{"name":"150x200cm","price":28000},{"name":"200x240cm","price":42000}]', '["Gris chiné","Bleu marine","Crème"]'),

(18, 'Diffuseur Aromas', 'Diffuseur d''huiles essentielles ultrasonique, LED ambient, minuterie.', 22000, 28000, 3, 'goods', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=75', 4.0, 112, '-21%', 28, TRUE, FALSE, FALSE, '{"capacity":"400ml","technology":"Ultrasonique","features":"LED + Minuterie"}', NULL, '["White","Wood","Black"]'),

(19, 'Robe Élégante Été', 'Robe légère fluide été, coton premium, coupe asymétrique élégante.', 35000, 42000, 4, 'fashion', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=75', 4.0, 67, 'Nouveau', 21, TRUE, TRUE, FALSE, '{"material":"Coton premium","size":"S-XL","season":"Été"}', '[{"name":"S","price":35000},{"name":"M","price":35000},{"name":"L","price":35000},{"name":"XL","price":35000}]', '["White","Pink","Navy"]'),

(20, 'Chemise Homme Classique', 'Chemise homme coton égyptien, coupe slim, col italien.', 28000, 32000, 4, 'fashion', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=75', 5.0, 145, NULL, 38, TRUE, FALSE, FALSE, '{"material":"Coton égyptien","fit":"Slim","collar":"Italien"}', '[{"name":"S","price":28000},{"name":"M","price":28000},{"name":"L","price":28000},{"name":"XL","price":28000},{"name":"XXL","price":28000}]', '["White","Light Blue","Pink"]'),

(21, 'Montre Connectée Sport', 'Montre connectée GPS, cardio, SpO2, waterproof 5ATM, autonomie 7 jours.', 95000, 120000, 5, 'accessories', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=75', 5.0, 267, 'Pro', 19, TRUE, FALSE, TRUE, '{"waterproof":"5ATM","battery":"7 jours","features":"GPS, Cardio, SpO2"}', '[{"name":"42mm","price":95000},{"name":"46mm","price":105000}]', '["Black","Silver","Rose Gold"]'),

(22, 'Sac à Main Cuir', 'Sac à main cuir véritable,bandoulière调节, plusieurs compartiments.', 55000, 70000, 5, 'accessories', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=75', 4.0, 89, 'Luxury', 7, TRUE, FALSE, TRUE, '{"material":"Cuir véritable","compartments":"Multiples","strap":"Bandoulière"}', NULL, '["Black","Brown","Tan"]'),

(23, 'Lunettes de Soleil Design', 'Lunettes soleil polarisées, monture acetate, protection UV400.', 32000, 40000, 5, 'accessories', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=75', 4.0, 123, '-20%', 42, TRUE, FALSE, FALSE, '{"lens":"Polarisée","protection":"UV400","frame":"Acétate"}', NULL, '["Black","Tortoise","Clear"]'),

(24, 'Ceinture Cuir Premium', 'Ceinture cuir pleine fleur, boucle металл antique, largeur 3.5cm.', 18000, 22000, 5, 'accessories', 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=500&q=75', 5.0, 78, NULL, 56, TRUE, FALSE, FALSE, '{"material":"Cuir pleine fleur","width":"3.5cm","buckle":"Laiton antique"}', '[{"name":"80cm","price":18000},{"name":"90cm","price":18000},{"name":"100cm","price":18000}]', '["Black","Brown"]'),

(25, 'iPhone 14', 'Smartphone performant avec écran Super Retina, caméra 12MP, vitesse 5G.', 650000, 750000, 1, 'tech', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=75', 4.0, 189, '-13%', 25, TRUE, FALSE, TRUE, '{"storage":"128GB","screen":"6.1 pouces","camera":"12MP","battery":"3279mAh"}', '[{"name":"128GB","price":650000},{"name":"256GB","price":750000}]', '["Midnight","Blue","Purple","Red"]'),

(26, 'Sony WH-1000XM5', 'Casque audio premium avec réduction active du bruit, autonomie 30h, son haute résolution.', 165000, 200000, 1, 'tech', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=75', 5.0, 189, 'Pro', 18, TRUE, TRUE, TRUE, '{"noiseCancel":"ANC","battery":"30h","driver":"30mm","connectivity":"Bluetooth 5.2"}', '[{"name":"Noir","price":165000},{"name":"Argent","price":165000}]', '["Black","Silver"]'),

(27, 'Dell XPS 15', 'PC portable 15.6 pouces OLED, Intel Core i7, 16GB RAM, RTX 4050.', 980000, 1150000, 1, 'tech', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=500&q=75', 5.0, 78, 'Nouveau', 6, TRUE, TRUE, TRUE, '{"processor":"Intel Core i7","ram":"16GB","storage":"512GB SSD","screen":"15.6 OLED"}', '[{"name":"16GB/512GB","price":980000},{"name":"32GB/1TB","price":1200000}]', '["Silver","Black"]'),

(28, 'Nintendo Switch OLED', 'Console de jeux portable avec écran OLED 7 pouces, manettes Joy-Con incluses.', 285000, 320000, 1, 'tech', 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=500&q=75', 5.0, 234, 'Gaming', 12, TRUE, FALSE, TRUE, '{"screen":"7 pouces OLED","storage":"64GB","battery":"4.5-9h","controllers":"Joy-Con"}', '[{"name":"Standard","price":285000},{"name":"Neon Red/Blue","price":295000}]', '["White","Neon Red/Blue","Black"]'),

(29, 'Canon EOS R50', 'Appareil photo mirrorless 24.2MP, vidéo 4K, autofocus intelligent.', 450000, 520000, 1, 'tech', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=75', 4.0, 56, '-13%', 8, TRUE, TRUE, TRUE, '{"sensor":"24.2MP APS-C","video":"4K 30fps","screen":"3 pouces tactile","iso":"100-32000"}', '[{"name":"Boîtier nu","price":450000},{"name":"Kit 18-45mm","price":520000}]', '["Black","White"]'),

(30, 'Google Pixel 8 Pro', 'Smartphone Android avec Tensor G3, caméra 50MP, 7 ans de mises à jour.', 620000, 750000, 1, 'tech', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500&q=75', 4.0, 89, 'Nouveau', 15, TRUE, TRUE, TRUE, '{"processor":"Tensor G3","storage":"128GB","screen":"6.7 pouces","camera":"50MP"}', '[{"name":"128GB","price":620000},{"name":"256GB","price":720000}]', '["Obsidian","Porcelain","Bay"]'),

(31, 'Masque Visage Hydratant', 'Masque en tissu hydratant profond, aloe vera et collagène, 25ml.', 8500, 12000, 2, 'beauty', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=500&q=75', 5.0, 234, 'Best-seller', 145, TRUE, FALSE, FALSE, '{"volume":"25ml x 5","ingredient":"Aloe Vera, Collagène","skinType":"Tous types"}', '[{"name":"5 pièces","price":8500},{"name":"10 pièces","price":15000}]', NULL),

(32, 'Fond de Teint Longue Tenue', 'Fond de teint matifiant couverture totale, tenue 24h, SPF 20.', 22000, 28000, 2, 'beauty', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=500&q=75', 4.0, 167, '-21%', 67, TRUE, FALSE, FALSE, '{"volume":"30ml","finish":"Mat","lasting":"24h","spf":"20"}', '[{"name":"Beige Clair","price":22000},{"name":"Beige Moyen","price":22000},{"name":"Beige Foncé","price":22000}]', NULL),

(33, 'Gel Douche Luxe', 'Gel douche crémeux enrichi en miel et amande douce, parfum enivrant.', 12000, 15000, 2, 'beauty', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=75', 4.0, 189, NULL, 89, TRUE, FALSE, FALSE, '{"volume":"500ml","ingredient":"Miel, Amande douce","skinType":"Tous types"}', NULL, '["Original","Fleur de Lys","Bois de Rose"]'),

(34, 'Essence Anti-âge Premium', 'Sérum concentré rétinol 0.5%, efficacité prouvée contre les rides.', 35000, 45000, 2, 'beauty', 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=500&q=75', 5.0, 123, 'Pro', 34, TRUE, TRUE, TRUE, '{"volume":"30ml","ingredient":"Rétinol 0.5%","skinType":"Peau mature"}', '[{"name":"30ml","price":35000},{"name":"50ml","price":48000}]', NULL),

(35, 'Vernis à Ongles Professionnel', 'Vernis gel longue tenue sans lampe, séchage rapide, 72h tenue.', 6500, 8000, 2, 'beauty', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=500&q=75', 4.0, 267, '-18%', 234, TRUE, FALSE, FALSE, '{"volume":"15ml","finish":"Brillant","lasting":"72h"}', '[{"name":"Rouge Passion","price":6500},{"name":"Rose Nude","price":6500},{"name":"Noir Onyx","price":6500},{"name":"Bleu Marine","price":6500}]', NULL),

(36, 'Rideaux Occultants Thermiques', 'Rideaux noirs occultants, isolation thermique, 140x260cm, lot de 2.', 28000, 35000, 3, 'goods', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=500&q=75', 4.0, 145, '-20%', 45, TRUE, FALSE, TRUE, '{"size":"140x260cm","material":"Polyester","thermal":"Oui","pieces":2}', '[{"name":"Gris","price":28000},{"name":"Bleu nuit","price":28000},{"name":"Ivoire","price":28000}]', '["Gris","Bleu nuit","Ivoire"]'),

(37, 'Tapis Design Moderne', 'Tapis contemporain géométrique, anti-taches, doux au toucher, 160x230cm.', 45000, 58000, 3, 'goods', 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=500&q=75', 5.0, 78, 'Design', 12, TRUE, FALSE, TRUE, '{"size":"160x230cm","material":"Polypropylène","style":"Moderne","antiStain":true}', '[{"name":"160x230cm","price":45000},{"name":"200x300cm","price":65000}]', '["Beige","Gris","Bleu"]'),

(38, 'Horloge Murale Silencieuse', 'Horloge murale quartz silencieux, design minimaliste, diamètre 40cm.', 15000, 20000, 3, 'goods', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=500&q=75', 4.0, 112, '-25%', 67, TRUE, FALSE, FALSE, '{"diameter":"40cm","movement":"Quartz silencieux","material":"Métal","style":"Minimaliste"}', NULL, '["Noir","Blanc","Or Rose"]'),

(39, 'Boîte à Bijoux Velours', 'Coffret bijoux en velours luxe, compartiments multiples, miroir intégré.', 18000, 25000, 3, 'goods', 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=500&q=75', 5.0, 89, 'Luxury', 23, TRUE, FALSE, FALSE, '{"material":"Velours","compartments":"Multiples","mirror":"Intégré","size":"25x18x12cm"}', '[{"name":"Noir","price":18000},{"name":"Rose","price":18000},{"name":"Bleu royal","price":18000}]', '["Noir","Rose","Bleu royal"]'),

(40, 'Panier à Linge Bambou', 'Panier à linge en Bambou écologique, sac inclus, 60L, Design ajouré.', 12000, 16000, 3, 'goods', 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=500&q=75', 4.0, 156, '-25%', 34, TRUE, FALSE, FALSE, '{"capacity":"60L","material":"Bambou","bag":"Inclus","style":"Ajouré"}', NULL, '["Naturel","Blanc","Brun"]'),

(41, 'Jean Slim Fit Premium', 'Jean slim stretch confort, coton premium, lavage foncé, taille réelle.', 22000, 28000, 4, 'fashion', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500&q=75', 4.0, 189, '-21%', 78, TRUE, FALSE, FALSE, '{"material":"Coton stretch","fit":"Slim","wash":"Foncé","stretch":"Confort"}', '[{"name":"30","price":22000},{"name":"32","price":22000},{"name":"34","price":22000},{"name":"36","price":22000}]', '["Bleu foncé","Noir","Gris"]'),

(42, 'Sneakers Urbaines Running', 'Sneakers sport légères, amorti Gel, dessus mesh respirant.', 28000, 35000, 4, 'fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=75', 5.0, 234, 'Sport', 45, TRUE, FALSE, TRUE, '{"type":"Running","cushioning":"Gel","upper":"Mesh respirant","sole":"Caoutchouc"}', '[{"name":"40","price":28000},{"name":"41","price":28000},{"name":"42","price":28000},{"name":"43","price":28000},{"name":"44","price":28000}]', '["Blanc/Noir","Rouge","Bleu"]'),

(43, 'Veste en Jean Délavée', 'Veste jean vintage délavée, coupe Regular, boutons métalliques.', 32000, 40000, 4, 'fashion', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=75', 4.0, 123, '-20%', 23, TRUE, FALSE, FALSE, '{"material":"Denim","fit":"Regular","wash":"Délavé vintage","buttons":"Métal"}', '[{"name":"S","price":32000},{"name":"M","price":32000},{"name":"L","price":32000},{"name":"XL","price":32000}]', '["Bleu clair","Bleu moyen","Noir"]'),

(44, 'Short Été Coton', 'Short homme coton léger, coupe Regular, poches latérales, parfait pour l''été.', 12000, 15000, 4, 'fashion', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=500&q=75', 4.0, 167, '-20%', 89, TRUE, FALSE, FALSE, '{"material":"Coton léger","fit":"Regular","pockets":"Latérales","length":"Au-dessus du genou"}', '[{"name":"M","price":12000},{"name":"L","price":12000},{"name":"XL","price":12000}]', '["Kaki","Blanc","Marine"]'),

(45, 'Robe de Soirée Élégante', 'Robe longue fluide, dentelle et satin, dos nu, idéale pour événements.', 55000, 70000, 4, 'fashion', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=75', 5.0, 78, 'Luxury', 12, TRUE, TRUE, TRUE, '{"material":"Dentelle & Satin","length":"Longue","back":"Nu","occasion":"Soirée"}', '[{"name":"S","price":55000},{"name":"M","price":55000},{"name":"L","price":55000}]', '["Noir","Rouge","Bleu nuit"]'),

(46, 'Portefeuille Cuir Minimaliste', 'Portefeuille cuir pleine fleur, design fin, RFID protégé.', 15000, 20000, 5, 'accessories', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=75', 4.0, 145, '-25%', 67, TRUE, FALSE, FALSE, '{"material":"Cuir pleine fleur","protection":"RFID","slots":"6","style":"Minimaliste"}', NULL, '["Noir","Marron","Bordeaux"]'),

(47, 'Écharpe en Soie Premium', 'Écharpe soie 100%, imprimé floral exclusif, 90x90cm.', 25000, 32000, 5, 'accessories', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=500&q=75', 5.0, 89, 'Luxury', 23, TRUE, FALSE, TRUE, '{"material":"Soie 100%","size":"90x90cm","pattern":"Floral","edges":"Roulotté main"}', NULL, '["Multicolore","Bleu","Rose"]'),

(48, 'Casquette Baseball Cuir', 'Casquette baseball cuir premium, ajustable, visière incurvée.', 18000, 25000, 5, 'accessories', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=75', 4.0, 112, '-28%', 45, TRUE, FALSE, FALSE, '{"material":"Cuir premium","closure":"Ajustable","visor":"Incurvée","style":"Baseball"}', NULL, '["Noir","Marron","Blanc"]'),

(49, 'Gants en Cuir Souple', 'Gants cuir d''agneau, doublure polaire, taille réelle, écran tactile.', 22000, 28000, 5, 'accessories', 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?auto=format&fit=crop&w=500&q=75', 4.0, 67, '-21%', 34, TRUE, FALSE, FALSE, '{"material":"Cuir d''agneau","lining":"Polaire","features":"Écran tactile","season":"Hiver"}', '[{"name":"S","price":22000},{"name":"M","price":22000},{"name":"L","price":22000},{"name":"XL","price":22000}]', '["Noir","Marron","Gris"]'),

(50, 'Collier Argent 925', 'Collier argent sterling 925, chaîne 45cm, pendentif moderne.', 28000, 35000, 5, 'accessories', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=75', 5.0, 156, '-20%', 28, TRUE, FALSE, TRUE, '{"material":"Argent 925","length":"45cm","pendant":"Moderne","weight":"3.5g"}', '[{"name":"45cm","price":28000},{"name":"50cm","price":32000}]', '["Argent","Or Rose"]');
