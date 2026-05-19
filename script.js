// ==================== ТОВАРЫ (УНИКАЛЬНЫЕ ID) ====================
const products = [
    {
        id: 1,
        name: "Лонгслив БИЧ",
        price: 1999,
        category: "upper",
        image: "BISH/бич.png",
        photos: ["BISH/бич.png", "BISH/1 фото.png", "BISH/2 фото.png", "BISH/3 фото.png", "BISH/БИЧ Фото с замерами.png"],
        size: "S/M/L/XL",
        desc: "100% хлопок, 180г. Шелкография высшего качества. Отправка от 3-7 дней.",
        stock: { S: 5, M: 3, L: 0, XL: 2, "2XL": 1 }
    },
    {
        id: 3,
        name: "Футболка Shots",
        price: 1444,
        category: "upper",
        image: "SHOTS/shots.png",
        photos: ["SHOTS/shots.png", "SHOTS/1 фото.png", "SHOTS/2 фото.png", "SHOTS/3 фото.png", "SHOTS/SHOTS Фото с замерами.png"],
        size: "S/M/L/XL",
        desc: "100% хлопок, 180г. Шелкография высшего качества. Отправка от 3-7 дней.",
        stock: { S: 3, M: 3, L: 3, XL: 2, "2XL": 1 }
    },
    {
        id: 4,
        name: "Серьги Xbox 360",
        price: 1555,
        category: "accessories",
        image: "Xbox360/xbox.png",
        photos: ["Xbox360/xbox.png", "Xbox360/2 фото.png", "Xbox360/3 фото.png"],
        size: "OS",
        desc: "Выполнено из оригинальных кнопок геймпада xbox360. Гипераллергенный, бижутерный сплав. Отправка от 3-5 дней",
        stock: { OS: 4 }
    },
    {
        id: 5,
        name: "Жетон BIG BASS",
        price: 1333,
        category: "accessories",
        image: "BIGBASS/1.png",
        photos: ["BIGBASS/1.png", "BIGBASS/2.png", "BIGBASS/3.JPG"],
        size: "OS",
        desc: "Выполнено из нержавеющей стали. Двухсторонний. Лазерная граверовка. Отправка от 1-2 дня",
        stock: { OS: 4 }
    },
    {
        id: 6,
        name: "Серьги Lego (Белый)",
        price: 555,
        category: "accessories",
        image: "legosergiii/1.png",
        photos: ["legosergiii/1.png", "Legosergiii/6.png"],
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Лего. Гипераллергенный, бижутерный сплав.",
        stock: { OS: 0 }
    },
    {
        id: 7,
        name: "Футболка LL",
        price: 1444,
        category: "upper",
        image: "LL/love.png",
        photos: ["LL/love.png", "LL/1.png", "LL/2.JPG", "LL/3.png", "LL/Фото с замерами.png"],
        size: "S/M/L/XL/2XL",
        desc: "100% хлопок, 180г. DTF печать. Умеренный оверсайз. Срок изготовления 3-10 дней.",
        stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 }
    },
    {
        id: 8,
        name: "Серьги Lego (Красный)",
        price: 555,
        category: "accessories",
        image: "legosergiii/3.png",
        photos: ["legosergiii/3.png", "legosergiii/8.png"],
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Лего. Гипераллергенный, бижутерный сплав.",
        stock: { OS: 2 }
    },
    {
        id: 9,
        name: "Серьги Lego (Черный)",
        price: 555,
        category: "accessories",
        image: "legosergiii/4.png",
        photos: ["legosergiii/4.png", "legosergiii/9.png"],
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Лего. Гипераллергенный, бижутерный сплав.",
        stock: { OS: 2 }
    },
    {
        id: 10,
        name: "Серьги Lego (Зеленый)",
        price: 555,
        category: "accessories",
        image: "legosergiii/5.png",
        photos: ["legosergiii/5.png", "legosergiii/10.png"],
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Лего. Гипераллергенный, бижутерный сплав.",
        stock: { OS: 2 }
    },
    {
        id: 11,
        name: "Серьги Lego (Розовые)",
        price: 555,
        category: "accessories",
        image: "legosergiii/2.png",
        photos: ["legosergiii/2.png", "legosergiii/7.png"],
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Лего. Гипераллергенный, бижутерный сплав.",
        stock: { OS: 2 }
    },
   
];

// ==================== КОРЗИНА ====================
let cart = JSON.parse(localStorage.getItem("s-l-e-n-g-cart")) || [];

function saveCart() {
    localStorage.setItem("s-l-e-n-g-cart", JSON.stringify(cart));
    updateCartCount();
    renderCartSidebar();
}

function updateCartCount() {
    const span = document.getElementById("cartCount");
    if (span) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        span.textContent = total;
    }
}

function addToCart(productId, size) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const stockCount = product.stock?.[size] || 0;
    if (stockCount <= 0) {
        alert(`Размер ${size} закончился`);
        return;
    }
    
    const existing = cart.find(item => item.id === productId && item.selectedSize === size);
    if (existing) {
        if (existing.quantity >= stockCount) {
            alert(`Доступно только ${stockCount} шт.`);
            return;
        }
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1, selectedSize: size });
    }
    
    saveCart();
    alert(`${product.name} (${size}) добавлен в корзину`);
}

// ==================== КАТАЛОГ ====================
function renderCatalog(category = "all") {
    const container = document.getElementById("catalog");
    if (!container) return;
    
    let filtered = products;
    if (category !== "all") {
        filtered = products.filter(p => p.category === category);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px;">Нет товаров</div>`;
        return;
    }
    
    container.innerHTML = filtered.map(product => {
        const totalStock = Object.values(product.stock || {}).reduce((s, c) => s + c, 0);
        const priceHtml = totalStock <= 0 ? `<div class="product-price" style="color:#d00000;">Sold out</div>` : `<div class="product-price">${product.price} ₽</div>`;
        return `
            <div class="product-card" onclick="location.href='product.html?id=${product.id}'" style="cursor:pointer;">
                <div class="product-img"><img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/400x500/eeeeee/333333?text=${encodeURIComponent(product.name)}'"></div>
                <div class="product-title">${product.name}</div>
                ${priceHtml}
            </div>
        `;
    }).join("");
}

// ==================== БУРГЕР ====================
function initBurgerMenu() {
    const burgerBtn = document.getElementById("burgerBtn");
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");
    const closeBtn = document.getElementById("closeMenuBtn");
    if (!burgerBtn || !sideMenu) return;
    
    function openMenu() { 
        sideMenu.classList.add("open"); 
        if (overlay) overlay.classList.add("open"); 
    }
    function closeMenu() { 
        sideMenu.classList.remove("open"); 
        if (overlay) overlay.classList.remove("open"); 
    }
    
    burgerBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);
    
    document.querySelectorAll(".menu-list button").forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.dataset.category;
            if (cat) renderCatalog(cat);
            closeMenu();
        });
    });
}

// ==================== КОРЗИНА (SIDEBAR) ====================
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");

function renderCartSidebar() {
    if (!cartItemsContainer || !cartTotalElement) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="cart-empty">тут ничего нет :(</div>`;
        cartTotalElement.textContent = "0 ₽";
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img class="cart-item-image" src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} ₽</div>
                <div class="cart-item-size">Размер: ${item.selectedSize || "OS"}</div>
                <div class="cart-qty">
                    <button onclick="changeQuantity(${item.id}, '${item.selectedSize}', -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, '${item.selectedSize}', 1)">+</button>
                </div>
            </div>
            <button class="cart-remove" onclick="removeItem(${item.id}, '${item.selectedSize}')">Удалить</button>
        </div>
    `).join("");
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalElement.textContent = `${total.toLocaleString("ru-RU")} ₽`;
}

function openCart() {
    if (!cartSidebar || !cartOverlay) return;
    renderCartSidebar();
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

// ==================== КНОПКА ОФОРМИТЬ ЗАКАЗ ====================
const checkoutBtn = document.getElementById("checkoutBtn");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Корзина пуста");
            return;
        }
        window.location.href = "checkout.html";
    });
}

window.changeQuantity = function(id, size, delta) {
    const index = cart.findIndex(item => item.id === id && item.selectedSize === size);
    if (index === -1) return;
    
    const newQty = cart[index].quantity + delta;
    if (newQty <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = newQty;
    }
    saveCart();
};

window.removeItem = function(id, size) {
    cart = cart.filter(item => !(item.id === id && item.selectedSize === size));
    saveCart();
};

// Инициализация кнопок корзины
document.querySelectorAll(".cart-link").forEach(btn => {
    btn.addEventListener("click", (e) => { 
        e.preventDefault(); 
        openCart(); 
    });
});
document.getElementById("closeCartBtn")?.addEventListener("click", closeCart);
document.getElementById("cartOverlay")?.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { 
    if (e.key === "Escape") closeCart(); 
});

// ==================== ФУТЕР ====================
function initFooter() {
    document.querySelectorAll(".footer-btn[data-footer]").forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.footer;
            if (page === "about") window.location.href = "about.html";
            if (page === "contact") window.location.href = "contact.html";
            if (page === "offer") window.location.href = "offer.html";
            if (page === "privacy") window.location.href = "privacy.html";
            if (page === "checkout") window.location.href = "checkout.html";
        });
    });
}

// ==================== СОЦСЕТИ ДЛЯ МОБИЛЬНЫХ ====================
function initMobileSocial() {
    const socialTrigger = document.getElementById('socialTrigger');
    const socialMenu = document.getElementById('socialMenu');
    
    if (socialTrigger && socialMenu) {
        // Убираем старые обработчики, чтобы не дублировать
        const newTrigger = socialTrigger.cloneNode(true);
        socialTrigger.parentNode.replaceChild(newTrigger, socialTrigger);
        
        newTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            socialMenu.classList.toggle('open');
        });
        
        // Закрываем при клике вне
        document.addEventListener('click', (e) => {
            if (!newTrigger.contains(e.target) && !socialMenu.contains(e.target)) {
                socialMenu.classList.remove('open');
            }
        });
    }
}

// ==================== СКРЫТЫЙ ПЕРЕХОД В АДМИНКУ ====================
function injectAdminGate() {
    if (document.getElementById("slengAdminGate")) return;
    const a = document.createElement("a");
    a.id = "slengAdminGate";
    a.href = "admin.html";
    a.className = "sleng-admin-gate";
    a.setAttribute("aria-hidden", "true");
    a.setAttribute("tabindex", "-1");
    a.textContent = "";
    document.body.appendChild(a);
}

// Простой обработчик для соцсетей (без ошибок)
const socialTrigger = document.getElementById('socialTrigger');
const socialMenu = document.getElementById('socialMenu');

if (socialTrigger && socialMenu) {
    socialTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        socialMenu.classList.toggle('open');
    });
}

// ==================== ЗАПУСК (ТОЛЬКО ОДИН РАЗ!) ====================
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM загружен");
    renderCatalog();
    updateCartCount();
    initBurgerMenu();
    initFooter();
    initMobileSocial();
    injectAdminGate();

});