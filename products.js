/**
 * Product Data Module
 * Contains all product information for the e-commerce store
 * Tech, Beauty & Goods E-commerce
 * Enhanced with variants, reviews, stock status
 */

// Make productsData available globally so app.js can access it
window.productsData = window.productsData || [
    // TECH PRODUCTS
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      desc: "Smartphone premium avec écran Super Retina XDR 6.7 pouces, caméra 48MP, processeur A17 Pro.",
      price: 850000,
      oldPrice: 1000000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=75",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=75",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 124,
      badge: "-15%",
      stock: 15,
      inStock: true,
      isNew: true,
      isFeatured: true,
      freeShipping: true,
      specs: {
        storage: "256GB",
        screen: "6.7 pouces",
        camera: "48MP",
        battery: "5000mAh"
      },
      variants: [
        { name: "256GB", price: 850000 },
        { name: "512GB", price: 950000 },
        { name: "1TB", price: 1100000 }
      ],
      colors: ["Titanium", "Black", "White", "Blue"],
      reviews: [
        { user: "Jean M.", rating: 5, date: "2024-01-15", comment: "Excellent produit, livraison rapide!", helpful: 45 },
        { user: "Marie K.", rating: 5, date: "2024-01-10", comment: "Très satisfait, je recommande.", helpful: 32 }
      ]
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      desc: "Smartphone Android haut de gamme avec S Pen intégré, écran Dynamic AMOLED 6.8 pouces.",
      price: 780000,
      oldPrice: 850000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 89,
      badge: "Nouveau",
      stock: 8,
      inStock: true,
      isNew: true,
      isFeatured: false,
      freeShipping: true,
      specs: {
        storage: "512GB",
        screen: "6.8 pouces",
        camera: "200MP",
        battery: "5000mAh"
      },
      variants: [
        { name: "512GB", price: 780000 },
        { name: "1TB", price: 920000 }
      ],
      colors: ["Titanium Black", "Titanium Gray", "Titanium Violet"],
      reviews: [
        { user: "Paul T.", rating: 5, date: "2024-01-18", comment: "Le meilleur Samsung à ce jour!", helpful: 28 }
      ]
    },
    {
      id: 3,
      name: "MacBook Air M3",
      desc: "Ordinateur portable ultra-fin avec puce M3, autonomie jusqu'à 18 heures.",
      price: 950000,
      oldPrice: 1100000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=75",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 67,
      badge: "Populaire",
      stock: 5,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: {
        processor: "Apple M3",
        ram: "16GB",
        storage: "512GB SSD",
        screen: "13.6 pouces"
      },
      variants: [
        { name: "8GB/256GB", price: 850000 },
        { name: "16GB/512GB", price: 950000 },
        { name: "24GB/1TB", price: 1250000 }
      ],
      colors: ["Space Gray", "Silver", "Starlight", "Midnight"],
      reviews: [
        { user: "Sophie L.", rating: 5, date: "2024-01-12", comment: "Parfait pour mon travail!", helpful: 51 }
      ]
    },
    {
      id: 4,
      name: "AirPods Pro 2",
      desc: "Écouteurs sans fil avec réduction active du bruit, transparence adaptative.",
      price: 185000,
      oldPrice: 220000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 203,
      badge: null,
      stock: 42,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: false,
      specs: {
        noiseCancel: "Active",
        battery: "6h",
        charging: "USB-C"
      },
      variants: [
        { name: "Standard", price: 185000 },
        { name: "USB-C", price: 195000 }
      ],
      colors: ["White"],
      reviews: [
        { user: "Alain B.", rating: 4, date: "2024-01-08", comment: "Bon son, cancelación parfaite.", helpful: 67 }
      ]
    },
    {
      id: 5,
      name: "Samsung Galaxy Tab S9",
      desc: "Tablette Android 11 pouces avec S Pen inclus, écran AMOLED 120Hz.",
      price: 420000,
      oldPrice: 480000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 45,
      badge: "Pro",
      stock: 12,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: true,
      specs: {
        storage: "256GB",
        screen: "11 pouces",
        battery: "8400mAh",
        ram: "8GB"
      },
      variants: [
        { name: "8GB/256GB", price: 420000 },
        { name: "12GB/512GB", price: 520000 }
      ],
      colors: ["Graphite", "Beige"],
      reviews: []
    },
    {
      id: 6,
      name: "Chargeur Rapide 65W",
      desc: "Chargeur USB-C universel avec technologie GaN, compatible laptop et smartphone.",
      price: 35000,
      oldPrice: 45000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 156,
      badge: "-22%",
      stock: 89,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: {
        power: "65W",
        ports: "2x USB-C",
        technology: "GaN"
      },
      variants: [],
      colors: ["White", "Black"],
      reviews: [
        { user: "Marc D.", rating: 5, date: "2024-01-05", comment: "Charge très vite!", helpful: 23 }
      ]
    },
    
    // BEAUTY PRODUCTS
    {
      id: 7,
      name: "Sérum Vitamine C",
      desc: "Sérum anti-âge brightening avec 20% Vitamine C, éclat immédiat.",
      price: 28000,
      oldPrice: 35000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 312,
      badge: "Best-seller",
      stock: 67,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: false,
      specs: {
        volume: "30ml",
        ingredient: "Vitamine C 20%",
        skinType: "Tous types"
      },
      variants: [
        { name: "30ml", price: 28000 },
        { name: "50ml", price: 42000 }
      ],
      reviews: [
        { user: "Claire P.", rating: 5, date: "2024-01-20", comment: "Ma peau est éclatante!", helpful: 89 }
      ]
    },
    {
      id: 8,
      name: "Crème Hydratante Premium",
      desc: "Crème hydratante intensive avec acide hyaluronique et céramides.",
      price: 22000,
      oldPrice: 28000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 187,
      badge: null,
      stock: 45,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: {
        volume: "50ml",
        ingredient: "Acide Hyaluronique",
        skinType: "Tous types"
      },
      variants: [],
      reviews: [
        { user: "Nadia R.", rating: 4, date: "2024-01-15", comment: "Très hydratante, peau douce.", helpful: 34 }
      ]
    },
    {
      id: 9,
      name: "Palette Maquillage 12 Couleurs",
      desc: "Palette yeux et joues avec finishes mates et shimmer, pigments longue tenue.",
      price: 18000,
      oldPrice: 22000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 98,
      badge: "Nouveau",
      stock: 23,
      inStock: true,
      isNew: true,
      isFeatured: true,
      freeShipping: false,
      specs: {
        colors: "12",
        finish: "Mat & Shimmer",
        lasting: "24h"
      },
      variants: [],
      reviews: [
        { user: "Fatou S.", rating: 5, date: "2024-01-22", comment: "Pigments magnifiques!", helpful: 56 }
      ]
    },
    {
      id: 10,
      name: "Parfum Femme Elegance",
      desc: "Eau de parfum florale et fruitée notes de rose, jasmin et bois de santal.",
      price: 45000,
      oldPrice: 55000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 234,
      badge: "Luxury",
      stock: 18,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: {
        volume: "100ml",
        type: "Eau de Parfum",
        notes: "Florales"
      },
      variants: [
        { name: "50ml", price: 28000 },
        { name: "100ml", price: 45000 }
      ],
      reviews: [
        { user: "Aminata K.", rating: 5, date: "2024-01-18", comment: "Odeur adorable, longue tenue!", helpful: 78 }
      ]
    },
    {
      id: 11,
      name: "Rouge à Lèvres Mat",
      desc: "Rouge à lèvres longue tenue formule matte, hydratation 24h.",
      price: 12000,
      oldPrice: 15000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 167,
      badge: "-20%",
      stock: 56,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: {
        finish: "Mat",
        lasting: "24h",
        shade: "Rouge Classic"
      },
      variants: [
        { name: "Rouge Classic", price: 12000 },
        { name: "Rose Naturel", price: 12000 },
        { name: "Bordeaux", price: 12000 }
      ],
      reviews: [
        { user: "Mariam T.", rating: 4, date: "2024-01-10", comment: "Tenue parfaite!", helpful: 45 }
      ]
    },
    {
      id: 12,
      name: "Shampooing Réparateur",
      desc: "Shampooing kératine pour cheveux endommagés, réparation en profondeur.",
      price: 15000,
      oldPrice: 18000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 89,
      badge: null,
      stock: 34,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: {
        volume: "400ml",
        ingredient: "Kératine",
        hairType: "Cheveux endommagés"
      },
      variants: [],
      reviews: []
    },

    // GOODS / MAISON PRODUCTS
    {
      id: 13,
      name: "Lampe Design Minimaliste",
      desc: "Lampe de table LED design scandinave, intensité adjustable, chargeur sans fil.",
      price: 38000,
      oldPrice: 45000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 56,
      badge: "Design",
      stock: 15,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: {
        light: "LED",
        features: "Chargeur sans fil",
        material: "Métal & Bois"
      },
      variants: [],
      colors: ["White", "Black", "Wood"],
      reviews: [
        { user: "Pierre L.", rating: 5, date: "2024-01-12", comment: "Super design et fonctionnel!", helpful: 23 }
      ]
    },
    {
      id: 14,
      name: "Ensemble Ustensiles Cuisine",
      desc: "Set ustensiles cuisine professionnel 12 pièces, bois d'olivier.",
      price: 42000,
      oldPrice: 55000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 78,
      badge: "Pro",
      stock: 9,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: {
        pieces: "12",
        material: "Bois d'olivier",
        dishwasher: "Non"
      },
      variants: [],
      reviews: [
        { user: "Catherine M.", rating: 5, date: "2024-01-08", comment: "Qualité professionnelle!", helpful: 41 }
      ]
    },
    {
      id: 15,
      name: "Mug Céramique Artisanal",
      desc: "Mug céramique artisanale idéal pour café et thé, capacité 350ml.",
      price: 8500,
      oldPrice: 10000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 134,
      badge: "-15%",
      stock: 67,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: {
        volume: "350ml",
        material: "Céramique",
        style: "Artisanal"
      },
      variants: [],
      colors: ["White", "Blue", "Green"],
      reviews: [
        { user: "Thomas B.", rating: 4, date: "2024-01-05", comment: "Magnifique mug!", helpful: 18 }
      ]
    },
    {
      id: 16,
      name: "Vase Décoratif Moderne",
      desc: "Vase en verre soufflé artisanal, design contemporain, hauteur 35cm.",
      price: 25000,
      oldPrice: 32000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 45,
      badge: null,
      stock: 12,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: true,
      specs: {
        height: "35cm",
        material: "Verre soufflé",
        style: "Moderne"
      },
      variants: [],
      colors: ["Clear", "Smoke", "Amber"],
      reviews: []
    },
    {
      id: 17,
      name: "Couverture Polaire Douce",
      desc: "Couverture polaire超柔软, idéale pour le canapé, 150x200cm.",
      price: 28000,
      oldPrice: 35000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 189,
      badge: "Confort",
      stock: 34,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: {
        size: "150x200cm",
        material: "Polaire",
        color: "Gris chiné"
      },
      variants: [
        { name: "150x200cm", price: 28000 },
        { name: "200x240cm", price: 42000 }
      ],
      colors: ["Gris chiné", "Bleu marine", "Crème"],
      reviews: [
        { user: "Julie R.", rating: 5, date: "2024-01-14", comment: "Si douce et warm!", helpful: 67 }
      ]
    },
    {
      id: 18,
      name: "Diffuseur Aromas",
      desc: "Diffuseur d'huiles essentielles ultrasonique, LED ambient, minuterie.",
      price: 22000,
      oldPrice: 28000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 112,
      badge: "-21%",
      stock: 28,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: {
        capacity: "400ml",
        technology: "Ultrasonique",
        features: "LED + Minuterie"
      },
      variants: [],
      colors: ["White", "Wood", "Black"],
      reviews: [
        { user: "Olivier T.", rating: 4, date: "2024-01-11", comment: "Parfait pour la détente!", helpful: 34 }
      ]
    },

    // FASHION PRODUCTS
    {
      id: 19,
      name: "Robe Élégante Été",
      desc: "Robe légère fluide été, coton premium, coupe asymétrique élégante.",
      price: 35000,
      oldPrice: 42000,
      category: "fashion",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 67,
      badge: "Nouveau",
      stock: 21,
      inStock: true,
      isNew: true,
      isFeatured: true,
      freeShipping: false,
      specs: {
        material: "Coton premium",
        size: "S-XL",
        season: "Été"
      },
      variants: [
        { name: "S", price: 35000 },
        { name: "M", price: 35000 },
        { name: "L", price: 35000 },
        { name: "XL", price: 35000 }
      ],
      colors: ["White", "Pink", "Navy"],
      reviews: [
        { user: "Chloé D.", rating: 5, date: "2024-01-19", comment: "Magnifique robe!", helpful: 45 }
      ]
    },
    {
      id: 20,
      name: "Chemise Homme Classique",
      desc: "Chemise homme coton égyptien, coupe slim, col italien.",
      price: 28000,
      oldPrice: 32000,
      category: "fashion",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 145,
      badge: null,
      stock: 38,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: {
        material: "Coton égyptien",
        fit: "Slim",
        collar: "Italien"
      },
      variants: [
        { name: "S", price: 28000 },
        { name: "M", price: 28000 },
        { name: "L", price: 28000 },
        { name: "XL", price: 28000 },
        { name: "XXL", price: 28000 }
      ],
      colors: ["White", "Light Blue", "Pink"],
      reviews: [
        { user: "Michel K.", rating: 5, date: "2024-01-07", comment: "Qualité exceptionnelle!", helpful: 56 }
      ]
    },

    // ACCESSORIES PRODUCTS
    {
      id: 21,
      name: "Montre Connectée Sport",
      desc: "Montre connectée GPS, cardio, SpO2, waterproof 5ATM, autonomie 7 jours.",
      price: 95000,
      oldPrice: 120000,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 267,
      badge: "Pro",
      stock: 19,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: {
        waterproof: "5ATM",
        battery: "7 jours",
        features: "GPS, Cardio, SpO2"
      },
      variants: [
        { name: "42mm", price: 95000 },
        { name: "46mm", price: 105000 }
      ],
      colors: ["Black", "Silver", "Rose Gold"],
      reviews: [
        { user: "David M.", rating: 5, date: "2024-01-16", comment: "Parfait pour le sport!", helpful: 89 }
      ]
    },
    {
      id: 22,
      name: "Sac à Main Cuir",
      desc: "Sac à main cuir véritable,bandoulière调节, plusieurs compartiments.",
      price: 55000,
      oldPrice: 70000,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 89,
      badge: "Luxury",
      stock: 7,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: {
        material: "Cuir véritable",
        compartments: "Multiples",
        strap: "Bandoulière"
      },
      variants: [],
      colors: ["Black", "Brown", "Tan"],
      reviews: [
        { user: "Isabelle P.", rating: 5, date: "2024-01-13", comment: "Très élégant!", helpful: 34 }
      ]
    },
    {
      id: 23,
      name: "Lunettes de Soleil Design",
      desc: "Lunettes soleil polarisées, monture acetate, protection UV400.",
      price: 32000,
      oldPrice: 40000,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 4,
      reviewCount: 123,
      badge: "-20%",
      stock: 42,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: {
        lens: "Polarisée",
        protection: "UV400",
        frame: "Acétate"
      },
      variants: [],
      colors: ["Black", "Tortoise", "Clear"],
      reviews: [
        { user: "Antoine L.", rating: 4, date: "2024-01-09", comment: "Style super!", helpful: 28 }
      ]
    },
    {
      id: 24,
      name: "Ceinture Cuir Premium",
      desc: "Ceinture cuir pleine fleur, boucle металл antique, largeur 3.5cm.",
      price: 18000,
      oldPrice: 22000,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=500&q=75",
      images: [
        "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=500&q=75"
      ],
      rating: 5,
      reviewCount: 78,
      badge: null,
      stock: 56,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: {
        material: "Cuir pleine fleur",
        width: "3.5cm",
        buckle: "Laiton antique"
      },
      variants: [
        { name: "80cm", price: 18000 },
        { name: "90cm", price: 18000 },
        { name: "100cm", price: 18000 }
      ],
      colors: ["Black", "Brown"],
      reviews: [
        { user: "François B.", rating: 5, date: "2024-01-06", comment: "Super qualité!", helpful: 41 }
      ]
    },

    // ADDITIONAL TECH PRODUCTS
    {
      id: 25,
      name: "iPhone 14",
      desc: "Smartphone performant avec écran Super Retina, caméra 12MP, vitesse 5G.",
      price: 650000,
      oldPrice: 750000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 189,
      badge: "-13%",
      stock: 25,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: { storage: "128GB", screen: "6.1 pouces", camera: "12MP", battery: "3279mAh" },
      variants: [{ name: "128GB", price: 650000 }, { name: "256GB", price: 750000 }],
      colors: ["Midnight", "Blue", "Purple", "Red"],
      reviews: [{ user: "Marc T.", rating: 4, date: "2024-01-04", comment: "Excellent rapport qualité-prix!", helpful: 56 }]
    },

    // ADDITIONAL TECH PRODUCTS - 5 more (IDs 26-30)
    {
      id: 26,
      name: "Sony WH-1000XM5",
      desc: "Casque audio premium avec réduction active du bruit, autonomie 30h, son haute résolution.",
      price: 165000,
      oldPrice: 200000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 189,
      badge: "Pro",
      stock: 18,
      inStock: true,
      isNew: true,
      isFeatured: true,
      freeShipping: true,
      specs: { noiseCancel: "ANC", battery: "30h", driver: "30mm", connectivity: "Bluetooth 5.2" },
      variants: [{ name: "Noir", price: 165000 }, { name: "Argent", price: 165000 }],
      colors: ["Black", "Silver"],
      reviews: [{ user: "Kevin R.", rating: 5, date: "2024-01-20", comment: "Meilleur casque que j'ai eu!", helpful: 67 }]
    },
    {
      id: 27,
      name: "Dell XPS 15",
      desc: "PC portable 15.6 pouces OLED, Intel Core i7, 16GB RAM, RTX 4050.",
      price: 980000,
      oldPrice: 1150000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 78,
      badge: "Nouveau",
      stock: 6,
      inStock: true,
      isNew: true,
      isFeatured: true,
      freeShipping: true,
      specs: { processor: "Intel Core i7", ram: "16GB", storage: "512GB SSD", screen: "15.6 OLED" },
      variants: [{ name: "16GB/512GB", price: 980000 }, { name: "32GB/1TB", price: 1200000 }],
      colors: ["Silver", "Black"],
      reviews: [{ user: "Paul S.", rating: 5, date: "2024-01-18", comment: "Parfait pour le travail!", helpful: 34 }]
    },
    {
      id: 28,
      name: "Nintendo Switch OLED",
      desc: "Console de jeux portable avec écran OLED 7 pouces, manettes Joy-Con incluses.",
      price: 285000,
      oldPrice: 320000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 234,
      badge: "Gaming",
      stock: 12,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: { screen: "7 pouces OLED", storage: "64GB", battery: "4.5-9h", controllers: "Joy-Con" },
      variants: [{ name: "Standard", price: 285000 }, { name: "Neon Red/Blue", price: 295000 }],
      colors: ["White", "Neon Red/Blue", "Black"],
      reviews: [{ user: "Hugo M.", rating: 5, date: "2024-01-15", comment: "Super console!", helpful: 89 }]
    },
    {
      id: 29,
      name: "Canon EOS R50",
      desc: "Appareil photo mirrorless 24.2MP, vidéo 4K, autofocus intelligent.",
      price: 450000,
      oldPrice: 520000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 56,
      badge: "-13%",
      stock: 8,
      inStock: true,
      isNew: true,
      isFeatured: false,
      freeShipping: true,
      specs: { sensor: "24.2MP APS-C", video: "4K 30fps", screen: "3 pouces tactile", iso: "100-32000" },
      variants: [{ name: "Boîtier nu", price: 450000 }, { name: "Kit 18-45mm", price: 520000 }],
      colors: ["Black", "White"],
      reviews: [{ user: "Nico L.", rating: 4, date: "2024-01-12", comment: "Excellent appareil photo!", helpful: 23 }]
    },
    {
      id: 30,
      name: "Google Pixel 8 Pro",
      desc: "Smartphone Android avec Tensor G3, caméra 50MP, 7 ans de mises à jour.",
      price: 620000,
      oldPrice: 750000,
      category: "tech",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 89,
      badge: "Nouveau",
      stock: 15,
      inStock: true,
      isNew: true,
      isFeatured: false,
      freeShipping: true,
      specs: { processor: "Tensor G3", storage: "128GB", screen: "6.7 pouces", camera: "50MP" },
      variants: [{ name: "128GB", price: 620000 }, { name: "256GB", price: 720000 }],
      colors: ["Obsidian", "Porcelain", "Bay"],
      reviews: [{ user: "Alex D.", rating: 4, date: "2024-01-22", comment: "Meilleur Pixel!", helpful: 45 }]
    },

    // ADDITIONAL BEAUTY PRODUCTS - 5 more (IDs 31-35)
    {
      id: 31,
      name: "Masque Visage Hydratant",
      desc: "Masque en tissu hydratant profond, aloe vera et collagène, 25ml.",
      price: 8500,
      oldPrice: 12000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 234,
      badge: "Best-seller",
      stock: 145,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: false,
      specs: { volume: "25ml x 5", ingredient: "Aloe Vera, Collagène", skinType: "Tous types" },
      variants: [{ name: "5 pièces", price: 8500 }, { name: "10 pièces", price: 15000 }],
      reviews: [{ user: "Marie L.", rating: 5, date: "2024-01-19", comment: "Ma peau est hydratée!", helpful: 78 }]
    },
    {
      id: 32,
      name: "Fond de Teint Longue Tenue",
      desc: "Fond de teint matifiant couverture totale, tenue 24h, SPF 20.",
      price: 22000,
      oldPrice: 28000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 167,
      badge: "-21%",
      stock: 67,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: false,
      specs: { volume: "30ml", finish: "Mat", lasting: "24h", spf: "20" },
      variants: [
        { name: "Beige Clair", price: 22000 },
        { name: "Beige Moyen", price: 22000 },
        { name: "Beige Foncé", price: 22000 }
      ],
      reviews: [{ user: "Sarah K.", rating: 4, date: "2024-01-16", comment: "Tenue parfaite!", helpful: 56 }]
    },
    {
      id: 33,
      name: "Gel Douche Luxe",
      desc: "Gel douche crémeux enrichi en miel et amande douce, parfum enivrant.",
      price: 12000,
      oldPrice: 15000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 189,
      badge: null,
      stock: 89,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: { volume: "500ml", ingredient: "Miel, Amande douce", skinType: "Tous types" },
      variants: [],
      colors: ["Original", "Fleur de Lys", "Bois de Rose"],
      reviews: [{ user: "Emma R.", rating: 5, date: "2024-01-14", comment: "Parfum délicieux!", helpful: 67 }]
    },
    {
      id: 34,
      name: "Essence Anti-âge Premium",
      desc: "Sérum concentré rétinol 0.5%, efficacité prouvée contre les rides.",
      price: 35000,
      oldPrice: 45000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 123,
      badge: "Pro",
      stock: 34,
      inStock: true,
      isNew: true,
      isFeatured: true,
      freeShipping: true,
      specs: { volume: "30ml", ingredient: "Rétinol 0.5%", skinType: "Peau mature" },
      variants: [{ name: "30ml", price: 35000 }, { name: "50ml", price: 48000 }],
      reviews: [{ user: "Catherine B.", rating: 5, date: "2024-01-21", comment: "Résultats visibles!", helpful: 45 }]
    },
    {
      id: 35,
      name: "Vernis à Ongles Professionnel",
      desc: "Vernis gel longue tenue sans lampe, séchage rapide, 72h tenue.",
      price: 6500,
      oldPrice: 8000,
      category: "beauty",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 267,
      badge: "-18%",
      stock: 234,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: { volume: "15ml", finish: "Brillant", lasting: "72h" },
      variants: [
        { name: "Rouge Passion", price: 6500 },
        { name: "Rose Nude", price: 6500 },
        { name: "Noir Onyx", price: 6500 },
        { name: "Bleu Marine", price: 6500 }
      ],
      reviews: [{ user: "Julie M.", rating: 4, date: "2024-01-11", comment: "Séchage rapide!", helpful: 89 }]
    },

    // ADDITIONAL GOODS PRODUCTS - 5 more (IDs 36-40)
    {
      id: 36,
      name: "Rideaux Occultants Thermiques",
      desc: "Rideaux noirs occultants, isolation thermique, 140x260cm, lot de 2.",
      price: 28000,
      oldPrice: 35000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 145,
      badge: "-20%",
      stock: 45,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: { size: "140x260cm", material: "Polyester", thermal: "Oui", pieces: 2 },
      variants: [{ name: "Gris", price: 28000 }, { name: "Bleu nuit", price: 28000 }, { name: "Ivoire", price: 28000 }],
      colors: ["Gris", "Bleu nuit", "Ivoire"],
      reviews: [{ user: "Michel T.", rating: 4, date: "2024-01-13", comment: "Sommeil tranquille!", helpful: 56 }]
    },
    {
      id: 37,
      name: "Tapis Design Moderne",
      desc: "Tapis contemporain géométrique, anti-taches, doux au toucher, 160x230cm.",
      price: 45000,
      oldPrice: 58000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 78,
      badge: "Design",
      stock: 12,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: { size: "160x230cm", material: "Polypropylène", style: "Moderne", antiStain: true },
      variants: [{ name: "160x230cm", price: 45000 }, { name: "200x300cm", price: 65000 }],
      colors: ["Beige", "Gris", "Bleu"],
      reviews: [{ user: "Sophie L.", rating: 5, date: "2024-01-10", comment: "Super diseño!", helpful: 34 }]
    },
    {
      id: 38,
      name: "Horloge Murale Silencieuse",
      desc: "Horloge murale quartz silencieux, design minimaliste, diamètre 40cm.",
      price: 15000,
      oldPrice: 20000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 112,
      badge: "-25%",
      stock: 67,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: { diameter: "40cm", movement: "Quartz silencieux", material: "Métal", style: "Minimaliste" },
      variants: [],
      colors: ["Noir", "Blanc", "Or Rose"],
      reviews: [{ user: "Laurent P.", rating: 4, date: "2024-01-08", comment: "Silencieuse et belle!", helpful: 28 }]
    },
    {
      id: 39,
      name: "Boîte à Bijoux Velours",
      desc: "Coffret bijoux en velours luxe, compartiments multiples, miroir intégré.",
      price: 18000,
      oldPrice: 25000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 89,
      badge: "Luxury",
      stock: 23,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: false,
      specs: { material: "Velours", compartments: "Multiples", mirror: "Intégré", size: "25x18x12cm" },
      variants: [{ name: "Noir", price: 18000 }, { name: "Rose", price: 18000 }, { name: "Bleu royal", price: 18000 }],
      colors: ["Noir", "Rose", "Bleu royal"],
      reviews: [{ user: "Isabelle K.", rating: 5, date: "2024-01-06", comment: "Parfait pour mes bijoux!", helpful: 45 }]
    },
    {
      id: 40,
      name: "Panier à Linge Bambou",
      desc: "Panier à linge en Bambou écologique, sac inclus, 60L, Design ajouré.",
      price: 12000,
      oldPrice: 16000,
      category: "goods",
      image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 156,
      badge: "-25%",
      stock: 34,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: { capacity: "60L", material: "Bambou", bag: "Inclus", style: "Ajouré" },
      variants: [],
      colors: ["Naturel", "Blanc", "Brun"],
      reviews: [{ user: "Pierre M.", rating: 4, date: "2024-01-04", comment: "Écolo et pratique!", helpful: 23 }]
    },

    // ADDITIONAL FASHION PRODUCTS - 5 more (IDs 41-45)
    {
      id: 41,
      name: "Jean Slim Fit Premium",
      desc: "Jean slim stretch confort, coton premium, lavage foncé, taille réelle.",
      price: 22000,
      oldPrice: 28000,
      category: "fashion",
      image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 189,
      badge: "-21%",
      stock: 78,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: false,
      specs: { material: "Coton stretch", fit: "Slim", wash: "Foncé", stretch: "Confort" },
      variants: [
        { name: "30", price: 22000 },
        { name: "32", price: 22000 },
        { name: "34", price: 22000 },
        { name: "36", price: 22000 }
      ],
      colors: ["Bleu foncé", "Noir", "Gris"],
      reviews: [{ user: "Thomas B.", rating: 4, date: "2024-01-17", comment: "Confortable!", helpful: 67 }]
    },
    {
      id: 42,
      name: "Sneakers Urbaines Running",
      desc: "Sneakers sport légères, amorti Gel, dessus mesh respirant.",
      price: 28000,
      oldPrice: 35000,
      category: "fashion",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 234,
      badge: "Sport",
      stock: 45,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: { type: "Running", cushioning: "Gel", upper: "Mesh respirant", sole: "Caoutchouc" },
      variants: [
        { name: "40", price: 28000 },
        { name: "41", price: 28000 },
        { name: "42", price: 28000 },
        { name: "43", price: 28000 },
        { name: "44", price: 28000 }
      ],
      colors: ["Blanc/Noir", "Rouge", "Bleu"],
      reviews: [{ user: "Kevin R.", rating: 5, date: "2024-01-15", comment: "Parfaites pour le sport!", helpful: 89 }]
    },
    {
      id: 43,
      name: "Veste en Jean Délavée",
      desc: "Veste jean vintage délavée, coupe Regular, boutons métalliques.",
      price: 32000,
      oldPrice: 40000,
      category: "fashion",
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 123,
      badge: "-20%",
      stock: 23,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: { material: "Denim", fit: "Regular", wash: "Délavé vintage", buttons: "Métal" },
      variants: [
        { name: "S", price: 32000 },
        { name: "M", price: 32000 },
        { name: "L", price: 32000 },
        { name: "XL", price: 32000 }
      ],
      colors: ["Bleu clair", "Bleu moyen", "Noir"],
      reviews: [{ user: "Marc D.", rating: 4, date: "2024-01-12", comment: "Style vintage cool!", helpful: 45 }]
    },
    {
      id: 44,
      name: "Short Été Coton",
      desc: "Short homme coton léger, coupe Regular, poches latérales, parfait pour l'été.",
      price: 12000,
      oldPrice: 15000,
      category: "fashion",
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 167,
      badge: "-20%",
      stock: 89,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: { material: "Coton léger", fit: "Regular", pockets: "Latérales", length: "Au-dessus du genou" },
      variants: [
        { name: "M", price: 12000 },
        { name: "L", price: 12000 },
        { name: "XL", price: 12000 }
      ],
      colors: ["Kaki", "Blanc", "Marine"],
      reviews: [{ user: "Paul S.", rating: 4, date: "2024-01-09", comment: "Parfait pour l'été!", helpful: 56 }]
    },
    {
      id: 45,
      name: "Robe de Soirée Élégante",
      desc: "Robe longue fluide, dentelle et satin, dos nu, idéale pour événements.",
      price: 55000,
      oldPrice: 70000,
      category: "fashion",
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 78,
      badge: "Luxury",
      stock: 12,
      inStock: true,
      isNew: true,
      isFeatured: true,
      freeShipping: true,
      specs: { material: "Dentelle & Satin", length: "Longue", back: "Nu", occasion: "Soirée" },
      variants: [
        { name: "S", price: 55000 },
        { name: "M", price: 55000 },
        { name: "L", price: 55000 }
      ],
      colors: ["Noir", "Rouge", "Bleu nuit"],
      reviews: [{ user: "Chloé M.", rating: 5, date: "2024-01-21", comment: "Magnifique pour mon mariage!", helpful: 34 }]
    },

    // ADDITIONAL ACCESSORIES PRODUCTS - 5 more (IDs 46-50)
    {
      id: 46,
      name: "Portefeuille Cuir Minimaliste",
      desc: "Portefeuille cuir pleine fleur, design fin, RFID protégé.",
      price: 15000,
      oldPrice: 20000,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 145,
      badge: "-25%",
      stock: 67,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: { material: "Cuir pleine fleur", protection: "RFID", slots: "6", style: "Minimaliste" },
      variants: [],
      colors: ["Noir", "Marron", "Bordeaux"],
      reviews: [{ user: "Jean-Luc P.", rating: 4, date: "2024-01-14", comment: "Pratique et élégant!", helpful: 45 }]
    },
    {
      id: 47,
      name: "Écharpe en Soie Premium",
      desc: "Écharpe soie 100%, imprimé floral exclusif, 90x90cm.",
      price: 25000,
      oldPrice: 32000,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 89,
      badge: "Luxury",
      stock: 23,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: { material: "Soie 100%", size: "90x90cm", pattern: "Floral", edges: "Roulotté main" },
      variants: [],
      colors: ["Multicolore", "Bleu", "Rose"],
      reviews: [{ user: "Sophie K.", rating: 5, date: "2024-01-11", comment: "Soie magnifique!", helpful: 34 }]
    },
    {
      id: 48,
      name: "Casquette Baseball Cuir",
      desc: "Casquette baseball cuir premium, ajustable, visière incurvée.",
      price: 18000,
      oldPrice: 25000,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 112,
      badge: "-28%",
      stock: 45,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: { material: "Cuir premium", closure: "Ajustable", visor: "Incurvée", style: "Baseball" },
      variants: [],
      colors: ["Noir", "Marron", "Blanc"],
      reviews: [{ user: "Antoine M.", rating: 4, date: "2024-01-08", comment: "Super qualité!", helpful: 28 }]
    },
    {
      id: 49,
      name: "Gants en Cuir Souple",
      desc: "Gants cuir d'agneau, doublure polaire, taille réelle, écran tactile.",
      price: 22000,
      oldPrice: 28000,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1531168556467-80aace0d0144?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1531168556467-80aace0d0144?auto=format&fit=crop&w=500&q=75"],
      rating: 4,
      reviewCount: 67,
      badge: "-21%",
      stock: 34,
      inStock: true,
      isNew: false,
      isFeatured: false,
      freeShipping: false,
      specs: { material: "Cuir d'agneau", lining: "Polaire", features: "Écran tactile", season: "Hiver" },
      variants: [
        { name: "S", price: 22000 },
        { name: "M", price: 22000 },
        { name: "L", price: 22000 },
        { name: "XL", price: 22000 }
      ],
      colors: ["Noir", "Marron", "Gris"],
      reviews: [{ user: "Laurent B.", rating: 4, date: "2024-01-05", comment: "Chauds et pratiques!", helpful: 23 }]
    },
    {
      id: 50,
      name: "Collier Argent 925",
      desc: "Collier argent sterling 925, chaîne 45cm, pendentif moderne.",
      price: 28000,
      oldPrice: 35000,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=75",
      images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=75"],
      rating: 5,
      reviewCount: 156,
      badge: "-20%",
      stock: 28,
      inStock: true,
      isNew: false,
      isFeatured: true,
      freeShipping: true,
      specs: { material: "Argent 925", length: "45cm", pendant: "Moderne", weight: "3.5g" },
      variants: [{ name: "45cm", price: 28000 }, { name: "50cm", price: 32000 }],
      colors: ["Argent", "Or Rose"],
      reviews: [{ user: "Marie L.", rating: 5, date: "2024-01-18", comment: "Super brillant!", helpful: 67 }]
    }
  ];
  
  // Category labels for display
  const categoryLabels = {
    tech: 'Tech & Gadgets',
    beauty: 'Beauté & Soins',
    goods: 'Maison & Décoration',
    fashion: 'Mode & Vêtements',
    accessories: 'Accessoires'
  };

  // Coupon codes
  const couponCodes = [
    { code: 'WELCOME10', discount: 10, type: 'percent', minOrder: 50000, description: '10% de réduction pour nouveaux clients' },
    { code: 'BIENVENUE15', discount: 15, type: 'percent', minOrder: 75000, description: '15% de réduction sur votre première commande' },
    { code: 'FLASH20', discount: 20, type: 'percent', minOrder: 100000, description: '20% de réduction flash!' },
    { code: 'REDUCTION5000', discount: 5000, type: 'fixed', minOrder: 30000, description: '5000FCFA de réduction' },
    { code: 'LIVRAISON', discount: 100, type: 'percent', minOrder: 0, description: 'Livraison gratuite (100% de réduction sur la livraison)' }
  ];

  // FAQ Data
  const faqData = [
    {
      question: "Comment passer une commande?",
      answer: "Parcourez nos produits, ajoutez vos articles au panier, puis cliquez sur 'Procéder au paiement'. Suivez les étapes pour saisir vos informations et choisir votre mode de paiement."
    },
    {
      question: "Quels sont les modes de paiement disponibles?",
      answer: "Nous acceptons: Orange Money, MTN Mobile Money, virement bancaire et paiement à la livraison."
    },
    {
      question: "Quels sont les délais de livraison?",
      answer: "Les délais de livraison sont de 2 à 5 jours ouvrables à Douala et 5 à 10 jours pour les autres villes du Cameroun."
    },
    {
      question: "Quelle est la politique de retour?",
      answer: "Vous pouvez retourner un produit dans les 7 jours suivant la réception s'il n'est pas utilisé et dans son état original. Contactez notre service client pour initier un retour."
    },
    {
      question: "Comment puis-je suivre ma commande?",
      answer: "Connectez-vous à votre compte et accédez à 'Mes commandes' pour suivre le statut de votre commande. Vous recevrez également des notifications par SMS."
    },
    {
      question: "Les produits ont-ils une garantie?",
      answer: "Oui, tous nos produits électroniques bénéficient d'une garantie minimale de 12 mois. Les autres produits ont une garantie de 3 mois."
    },
    {
      question: "Comment contacter le service client?",
      answer: "Vous pouvez nous contacter via le formulaire de contact, par téléphone au +237 6XX XXX XXX, ou par email à contact@multishop.cm."
    }
  ];

  // Exchange rates
  const exchangeRates = {
    XAF: 1,
    USD: 0.0016,
    EUR: 0.0015
  };

  const currencySymbols = {
    XAF: 'FCFA',
    USD: '$',
    EUR: '€'
  };

  // Shipping thresholds
  const freeShippingThreshold = 150000;
  const standardShippingCost = 2500;

  // Export for use in app.js
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { productsData, categoryLabels, couponCodes, faqData, exchangeRates, currencySymbols, freeShippingThreshold, standardShippingCost };
  }

