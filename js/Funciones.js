document.addEventListener('DOMContentLoaded', function() {
    // ---------- SLIDER AUTOMÁTICO ----------
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const totalSlides = slides.length;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Cambio automático cada 5 segundos
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Navegación por puntos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
    
    // ---------- MENÚ MOBILE ----------
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // ---------- FILTRADO DE MENÚ ----------
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir active al botón clickeado
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                } else if (item.classList.contains(filterValue.replace('.', ''))) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // ---------- SISTEMA DE PEDIDOS ----------
    const orderPanel = document.getElementById('orderPanel');
    const orderHeader = document.getElementById('orderHeader');
    const orderItems = document.getElementById('orderItems');
    const orderCount = document.querySelector('.order-count');
    const orderTotal = document.getElementById('orderTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    let cart = [];
    let total = 0;
    
    // Añadir al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('.menu-item-title').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.menu-item-price').textContent.replace('$', '').replace('.', ''));
            const itemImg = menuItem.querySelector('.menu-item-img').src;
            
            // Verificar si el item ya está en el carrito
            const existingItem = cart.find(item => item.name === itemName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: 1,
                    img: itemImg
                });
            }
            
            updateCart();
            orderPanel.classList.add('open');
        });
    });
    
    // Actualizar carrito
    function updateCart() {
        orderItems.innerHTML = '';
        total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <img src="${item.img}" alt="${item.name}" class="order-item-img">
                    <div>
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">$${(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                </div>
                <div>
                    <button class="order-item-remove" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            orderItems.appendChild(orderItem);
        });
        
        orderCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        orderTotal.textContent = `$${total.toLocaleString()}`;
        
        // Añadir eventos a los botones de eliminar
        document.querySelectorAll('.order-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
    
    // Toggle panel de pedidos
    orderHeader.addEventListener('click', () => {
        orderPanel.classList.toggle('open');
    });
    
    // Pedir por WhatsApp
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        
        let message = '¡Hola! Quiero hacer el siguiente pedido:%0A%0A';
        cart.forEach(item => {
            message += `- ${item.name} x${item.quantity} - $${item.price.toLocaleString()}%0A`;
        });
        message += `%0ATotal: $${total.toLocaleString()}%0A%0AMi nombre es: [TU_NOMBRE]%0AMi dirección es: [TU_DIRECCIÓN]`;
        
        window.open(`https://wa.me/6694492207?text=${message}`, '_blank');
    });
    
    // ---------- LIGHTBOX IMÁGENES ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const menuImages = document.querySelectorAll('.menu-item-img');
    
    menuImages.forEach(image => {
        image.addEventListener('click', () => {
            lightboxImg.src = image.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ---------- SISTEMA DE VALORACIÓN ----------
    const ratings = document.querySelectorAll('.rating');
    
    ratings.forEach(rating => {
        const stars = rating.querySelectorAll('.rating-star');
        const initialRating = parseInt(rating.getAttribute('data-rating'));
        
        // Establecer valoración inicial
        stars.forEach((star, index) => {
            if (index < initialRating) {
                star.classList.add('active');
            }
        });
        
        // Valoración interactiva
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    });
    
    // ---------- SCROLL SUAVE ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Cerrar menú mobile si está abierto
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Botón "Ver Menú" en el slider
    document.querySelectorAll('.scroll-to-menu').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('#menu').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // ---------- NAVBAR SCROLL EFFECT ----------
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'var(--primary)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.boxShadow = 'none';
        }
    });
});