// --- Wait for the DOM to be fully loaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- DATA ---
    const products = [
      {
        id: 1,
        name: 'Kamera Mirrorless ProX',
        description: 'Kamera mirrorless profesional dengan sensor full-frame 45MP. Mampu merekam video 8K. Cocok untuk fotografer dan videografer profesional yang menuntut kualitas tertinggi.',
        price: 32500000,
        images: [
          'https://placehold.co/600x600/1a1a1a/ffffff?text=Kamera+Depan',
          'https://placehold.co/600x600/1a1a1a/ffffff?text=Kamera+Samping',
          'https://placehold.co/600x600/1a1a1a/ffffff?text=Kamera+Belakang',
          'https://placehold.co/600x600/1a1a1a/ffffff?text=Lensa+Kit'
        ],
        videoYoutubeId: 'l_a59h8a-0k'
      },
      {
        id: 2,
        name: 'Drone DJI Air 3',
        description: 'Drone lipat dengan kamera ganda, sensor 1/1.3-inch CMOS, dan kemampuan merekam video 4K/100fps. Waktu terbang maksimal 46 menit.',
        price: 17800000,
        images: [
          'https://placehold.co/600x600/2a2a2a/ffffff?text=Drone+Terbang',
          'https://placehold.co/600x600/2a2a2a/ffffff?text=Drone+Terlipat',
          'https://placehold.co/600x600/2a2a2a/ffffff?text=Remote+Control'
        ],
        videoYoutubeId: 'r_T-nC2wR9c'
      },
      {
        id: 3,
        name: 'Laptop Gaming ROG Strix',
        description: 'Ditenagai oleh prosesor Intel Core i9 Generasi ke-13 dan GPU NVIDIA GeForce RTX 4080. Layar QHD 240Hz untuk pengalaman gaming yang imersif.',
        price: 45999000,
        images: [
          'https://placehold.co/600x600/1c1c1c/ffffff?text=Laptop+Depan',
          'https://placehold.co/600x600/1c1c1c/ffffff?text=Keyboard+RGB',
          'https://placehold.co/600x600/1c1c1c/ffffff?text=Port+Samping'
        ],
        videoYoutubeId: 'AbkUda2m6_0'
      },
      {
        id: 4,
        name: 'Sepatu Lari Ultraboost',
        description: 'Sepatu lari dengan teknologi bantalan Boost yang responsif, memberikan kenyamanan maksimal untuk lari jarak jauh maupun penggunaan sehari-hari.',
        price: 2800000,
        images: [
          'https://placehold.co/600x600/2b2b2b/ffffff?text=Sepatu+Samping',
          'https://placehold.co/600x600/2b2b2b/ffffff?text=Sepatu+Atas',
          'https://placehold.co/600x600/2b2b2b/ffffff?text=Sol+Sepatu'
        ],
        videoYoutubeId: null
      },
        {
        id: 5,
        name: 'Smartwatch Titan Pro',
        description: 'Smartwatch tangguh dengan GPS, monitor detak jantung, SpO2, dan lebih dari 100 mode olahraga. Baterai tahan hingga 14 hari.',
        price: 3500000,
        images: [
          'https://placehold.co/600x600/3a3a3a/ffffff?text=Watch+Face',
          'https://placehold.co/600x600/3a3a3a/ffffff?text=Watch+Samping'
        ],
        videoYoutubeId: null
      },
      {
        id: 6,
        name: 'Mechanical Keyboard K8 Pro',
        description: 'Keyboard mekanikal nirkabel dengan layout TKL. Switch Gateron Pro yang sudah di-lubed, PBT keycaps, dan hot-swappable.',
        price: 1650000,
        images: [
          'https://placehold.co/600x600/1e1e1e/ffffff?text=Keyboard+Atas',
          'https://placehold.co/600x600/1e1e1e/ffffff?text=Detail+Switch',
          'https://placehold.co/600x600/1e1e1e/ffffff?text=Lampu+RGB'
        ],
        videoYoutubeId: 'kUy31G36d24'
      },
    ];

    // --- STATE MANAGEMENT ---
    let cart = [];
    let currentView = 'catalog';
    let historyStack = ['catalog']; // For back button functionality

    // --- DOM Elements ---
    const views = {
        catalog: document.getElementById('catalog-view'),
        productDetail: document.getElementById('product-detail-view'),
        cart: document.getElementById('cart-view'),
        checkout: document.getElementById('checkout-view'),
    };
    const productGrid = document.getElementById('product-grid');
    const noProductsMessage = document.getElementById('no-products-message');
    const searchInput = document.getElementById('search-input');
    const cartItemCount = document.getElementById('cart-item-count');
    const backButton = document.getElementById('back-button');
    const cartButton = document.getElementById('cart-button');

    // --- UTILITY FUNCTIONS ---
    const formatCurrency = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    // --- RENDER FUNCTIONS ---
    const renderCatalog = (filteredProducts) => {
        productGrid.innerHTML = '';
        const productsToRender = filteredProducts || products;

        if (productsToRender.length === 0) {
            noProductsMessage.style.display = 'block';
        } else {
            noProductsMessage.style.display = 'none';
        }

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.productId = product.id;
            card.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-card-info">
                    <h3>${product.name}</h3>
                    <p>${formatCurrency(product.price)}</p>
                </div>
            `;
            card.addEventListener('click', () => {
                renderProductDetail(product.id);
                switchView('productDetail');
            });
            productGrid.appendChild(card);
        });
    };

    const renderProductDetail = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        let thumbnailHTML = product.images.map((img, index) => 
            <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}" alt="thumbnail">
        ).join('');

        if (product.videoYoutubeId) {
            thumbnailHTML += `
                <div class="video-thumbnail" data-video-id="${product.videoYoutubeId}">
                    <i data-lucide="video"></i>
                </div>
            `;
        }
        
        views.productDetail.innerHTML = `
            <div class="detail-container">
                <div class="detail-gallery">
                    <div class="detail-main-media">
                        <img src="${product.images[0]}" alt="${product.name}">
                        <button class="gallery-nav prev"><i data-lucide="chevron-left"></i></button>
                        <button class="gallery-nav next"><i data-lucide="chevron-right"></i></button>
                    </div>
                    <div class="detail-thumbnails">${thumbnailHTML}</div>
                </div>
                <div class="detail-info">
                    <h2>${product.name}</h2>
                    <p class="price">${formatCurrency(product.price)}</p>
                    <p class="description">${product.description}</p>
                    <button class="btn btn-primary btn-full add-to-cart-detail"><i data-lucide="shopping-cart"></i> Tambah ke Keranjang</button>
                </div>
            </div>
        `;
        lucide.createIcons(); // Re-initialize icons

        // Add event listeners for the new elements
        let currentImageIndex = 0;
        const mainMediaContainer = views.productDetail.querySelector('.detail-main-media');
        const thumbnails = views.productDetail.querySelectorAll('.thumbnail, .video-thumbnail');

        const updateMedia = (index, isVideo = false) => {
            thumbnails.forEach(t => t.classList.remove('active'));
            if (isVideo) {
                 mainMediaContainer.innerHTML = <iframe src="https://www.youtube.com/embed/${product.videoYoutubeId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>;
                 views.productDetail.querySelector('.video-thumbnail').classList.add('active');
            } else {
                currentImageIndex = index;
                mainMediaContainer.innerHTML = `
                    <img src="${product.images[index]}" alt="${product.name}">
                    <button class="gallery-nav prev"><i data-lucide="chevron-left"></i></button>
                    <button class="gallery-nav next"><i data-lucide="chevron-right"></i></button>
                `;
                views.productDetail.querySelector(.thumbnail[data-index="${index}"]).classList.add('active');
                 // Re-add nav button listeners
                views.productDetail.querySelector('.gallery-nav.prev').addEventListener('click', navigateGallery.bind(null, -1));
                views.productDetail.querySelector('.gallery-nav.next').addEventListener('click', navigateGallery.bind(null, 1));
            }
             lucide.createIcons();
        };

        const navigateGallery = (direction) => {
            let newIndex = (currentImageIndex + direction + product.images.length) % product.images.length;
            updateMedia(newIndex);
        }
        
        views.productDetail.querySelector('.gallery-nav.prev').addEventListener('click', navigateGallery.bind(null, -1));
        views.productDetail.querySelector('.gallery-nav.next').addEventListener('click', navigateGallery.bind(null, 1));
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                if (thumb.dataset.videoId) {
                    updateMedia(null, true);
                } else {
                    updateMedia(parseInt(thumb.dataset.index));
                }
            });
        });
        
        views.productDetail.querySelector('.add-to-cart-detail').addEventListener('click', () => {
            addToCart(product.id);
        });
    };

    const renderCart = () => {
        const container = document.getElementById('cart-items-container');
        const emptyMessage = document.getElementById('cart-empty-message');
        const summary = document.getElementById('cart-summary');

        if (cart.length === 0) {
            container.innerHTML = '';
            emptyMessage.style.display = 'block';
            summary.style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            summary.style.display = 'block';
            container.innerHTML = cart.map(item => `
                <div class="cart-item" data-product-id="${item.id}">
                    <img src="${item.images[0]}" alt="${item.name}">
                    <div class="cart-item-info">
                        <p>${item.name}</p>
                        <span>${formatCurrency(item.price)}</span>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-change" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-change" data-change="1">+</button>
                    </div>
                    <button class="remove-item"><i data-lucide="x"></i></button>
                </div>
            `).join('');
            
            const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
            document.getElementById('cart-total-price').textContent = formatCurrency(totalPrice);
        }
        updateCartCount();
        lucide.createIcons();
    };
    
    const renderCheckout = () => {
        const summaryList = document.getElementById('summary-items-list');
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

        summaryList.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span class="name">${item.name} x${item.quantity}</span>
                <span class="price">${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `).join('');

        document.getElementById('summary-total-price').textContent = formatCurrency(totalPrice);
    };

    // --- VIEW MANAGEMENT ---
    const switchView = (viewName) => {
        currentView = viewName;
        Object.values(views).forEach(view => view.style.display = 'none');
        views[viewName].style.display = 'block';
        
        if (viewName !== 'catalog' && historyStack[historyStack.length - 1] !== viewName) {
            historyStack.push(viewName);
        }

        backButton.style.display = historyStack.length > 1 ? 'block' : 'none';
        
        // Render content for the new view
        if(viewName === 'cart') renderCart();
        if(viewName === 'checkout') renderCheckout();
    };

    // --- LOGIC FUNCTIONS ---
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartItemCount.textContent = totalItems;
            cartItemCount.style.display = 'flex';
        } else {
            cartItemCount.style.display = 'none';
        }
    };
    
    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        alert(${product.name} telah ditambahkan ke keranjang!);
        updateCartCount();
    };
    
    const updateCartQuantity = (productId, change) => {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== productId);
            }
        }
        renderCart();
    };
    
    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert("Keranjang Anda kosong!");
            return;
        }

        const formData = new FormData(e.target);
        const customerName = document.getElementById('customer-name').value;
        const paymentMethod = formData.get('payment');
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

        alert(Pesanan atas nama ${customerName} berhasil dibuat! \nTotal: ${formatCurrency(totalPrice)} \nMetode Pembayaran: ${paymentMethod.replace('_', ' ').toUpperCase()});
        
        cart = [];
        updateCartCount();
        historyStack = ['catalog'];
        switchView('catalog');
        e.target.reset();
    };


    // --- EVENT LISTENERS ---
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(query));
        renderCatalog(filtered);
        if (currentView !== 'catalog') switchView('catalog');
    });

    backButton.addEventListener('click', () => {
        historyStack.pop();
        const previousView = historyStack[historyStack.length - 1] || 'catalog';
        switchView(previousView);
    });
    
    cartButton.addEventListener('click', () => switchView('cart'));
    
    document.getElementById('start-shopping-button').addEventListener('click', () => switchView('catalog'));
    document.getElementById('checkout-button').addEventListener('click', () => switchView('checkout'));
    
    document.getElementById('cart-items-container').addEventListener('click', (e) => {
        const target = e.target.closest('.quantity-change, .remove-item');
        if (!target) return;
        
        const cartItemElement = target.closest('.cart-item');
        const productId = parseInt(cartItemElement.dataset.productId);

        if (target.classList.contains('quantity-change')) {
            const change = parseInt(target.dataset.change);
            updateCartQuantity(productId, change);
        } else if (target.classList.contains('remove-item')) {
            cart = cart.filter(i => i.id !== productId);
            renderCart();
        }
    });
    
    document.getElementById('checkout-form').addEventListener('submit', handleCheckoutSubmit);


    // --- INITIALIZATION ---
    lucide.createIcons();
    renderCatalog();
});