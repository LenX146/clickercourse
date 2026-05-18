// ==================== ОБНОВЛЕНИЕ СЧЁТЧИКА КОРЗИНЫ ====================
function updateCartCountDisplay() {
    const cartCountSpan = document.getElementById("cartCount");
    if (cartCountSpan) {
        const cart = JSON.parse(localStorage.getItem("s-l-e-n-g-cart")) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.innerText = total;
    }
}

// ==================== КНОПКА НАЗАД ====================
const backBtn = document.getElementById('backBtn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// ==================== НАВИГАЦИЯ В ФУТЕРЕ ====================
function initFooter() {
    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.footer;
            if (type === 'about') window.location.href = 'about.html';
            if (type === 'contact') window.location.href = 'contact.html';
            if (type === 'offer') window.location.href = 'offer.html';
            if (type === 'privacy') window.location.href = 'privacy.html';
        });
    });
}

// ==================== ПЕРЕХОД В КОРЗИНУ (СТАРАЯ ВЕРСИЯ, ДЛЯ СОВМЕСТИМОСТИ) ====================
function initCartButton() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('s-l-e-n-g-cart')) || [];

            if (cart.length === 0) {
                alert('Корзина пуста');
                return;
            }

            const items = cart
                .map(i => `${i.name} (${i.selectedSize}) x${i.quantity} — ${i.price * i.quantity}₽`)
                .join('\n');

            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            alert(`Корзина:\n${items}\n\nИТОГО: ${total}₽`);
        });
    }
}

// ==================== ОТКРЫТИЕ КОРЗИНЫ (SIDEBAR) ====================
function openCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    if (!cartSidebar || !cartOverlay) return;
    
    // Обновляем содержимое корзины перед открытием
    if (typeof renderCartSidebar === 'function') {
        renderCartSidebar();
    }
    
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==================== ЗАКРЫТИЕ КОРЗИНЫ (SIDEBAR) ====================
function closeCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    if (!cartSidebar || !cartOverlay) return;
    
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== ИНИЦИАЛИЗАЦИЯ КОРЗИНЫ (SIDEBAR) ====================
function initCartSidebar() {
    const cartBtn = document.getElementById('cartBtn');
    const closeBtn = document.getElementById('closeCartBtn');
    const overlay = document.getElementById('cartOverlay');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartSidebar();
        });
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeCartSidebar);
    if (overlay) overlay.addEventListener('click', closeCartSidebar);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCartSidebar();
    });
}

// ==================== СОЦСЕТИ ДЛЯ МОБИЛЬНЫХ (КЛИК) ====================
function initMobileSocial() {
    const socialTrigger = document.getElementById('socialTrigger');
    const socialMenu = document.getElementById('socialMenu');
    if (socialTrigger && socialMenu) {
        socialTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            socialMenu.classList.toggle('open');
        });
    }
}

// ==================== ЗАПУСК ====================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCountDisplay();
    initFooter();
    initCartButton();      // старая версия (для алерта)
    initCartSidebar();     // новая версия (выезжающая корзина)
    initMobileSocial();    // соц сети на мобильных
});
