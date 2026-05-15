function updateCartCountDisplay() {
    const cartCountSpan = document.getElementById("cartCount");
    if (cartCountSpan) {
        const cart = JSON.parse(localStorage.getItem("s-l-e-n-g-cart")) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.innerText = total;
    }
}

// Кнопка назад
const backBtn = document.getElementById('backBtn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Навигация в футере
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

// Переход в корзину
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

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    updateCartCountDisplay();
    initFooter();
    initCartButton();
});