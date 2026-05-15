// ==================== ПРОМОКОДЫ ====================
const promoCodes = [
    { code: "SLENG10", discount: 10 },
    { code: "SSS8", discount: 8 },
    { code: "WELCOME", discount: 5 }
];

let appliedPromo = null;

// ==================== ОТОБРАЖЕНИЕ ЗАКАЗА ====================
function renderOrderSummary() {
    const cart = JSON.parse(localStorage.getItem("s-l-e-n-g-cart")) || [];
    const container = document.getElementById("orderItems");
    const subtotalSpan = document.getElementById("subtotal");
    const totalSpan = document.getElementById("totalPrice");
    const deliveryCost = 240;

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px;">Корзина пуста</div>`;
        subtotalSpan.innerText = "0 ₽";
        totalSpan.innerText = "0 ₽";
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="order-item">
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-details">размер: ${item.selectedSize || "OS"} • ${item.quantity} x ${item.price} ₽</div>
                </div>
                <div class="order-item-price">${itemTotal} ₽</div>
            </div>
        `;
    }).join("");

    let discountAmount = 0;
    if (appliedPromo) {
        discountAmount = (subtotal * appliedPromo.discount) / 100;
    }

    const total = subtotal + deliveryCost - discountAmount;

    subtotalSpan.innerText = `${subtotal} ₽`;

    const existingDiscountRow = document.querySelector(".order-discount");
    if (appliedPromo && discountAmount > 0) {
        if (existingDiscountRow) {
            existingDiscountRow.querySelector("span:last-child").innerText = `- ${discountAmount} ₽ (${appliedPromo.code})`;
        } else {
            const discountRow = document.createElement("div");
            discountRow.className = "order-discount";
            discountRow.style.display = "flex";
            discountRow.style.justifyContent = "space-between";
            discountRow.style.padding = "8px 0";
            discountRow.style.fontSize = "14px";
            discountRow.style.color = "#2a7f2a";
            discountRow.innerHTML = `<span>Промокод (${appliedPromo.code}):</span><span>- ${discountAmount} ₽</span>`;
            const deliveryRow = document.querySelector(".order-delivery");
            if (deliveryRow) deliveryRow.insertAdjacentElement("afterend", discountRow);
        }
    } else if (existingDiscountRow) {
        existingDiscountRow.remove();
    }

    totalSpan.innerText = `${Math.round(total)} ₽`;
}

// ==================== ОТПРАВКА ЗАКАЗА ====================
async function submitOrder() {
    const submitBtn = document.getElementById("submitOrderBtn");
    const fullName = document.getElementById("fullName")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    let telegram = document.getElementById("telegram")?.value.trim();

    // ===== ВАЛИДАЦИЯ =====
    if (!fullName || !phone) {
        alert("Заполните обязательные поля: ФИО и телефон");
        return;
    }

    // Проверка ФИО (только буквы, дефис, пробел)
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(fullName)) {
        alert("ФИО может содержать только буквы, пробелы и дефисы");
        return;
    }

    // Проверка телефона (минимум 10 цифр)
    const phoneDigits = phone?.replace(/\D/g, "") || "";
    if (phoneDigits.length < 10) {
        alert("Введите корректный номер телефона (минимум 10 цифр)");
        return;
    }

    // Проверка email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Введите корректный email адрес");
        return;
    }

    // Проверка Telegram (обязательно с @, минимум 4 символа после @)
    if (telegram) {
        if (!telegram.startsWith("@")) {
            alert("Telegram username должен начинаться с символа @");
            return;
        }
        const username = telegram.substring(1);
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            alert("После @ могут быть только буквы, цифры и подчёркивание");
            return;
        }
        if (username.length < 4) {
            alert("Telegram username должен содержать минимум 4 символа после @");
            return;
        }
    }
    // ===== КОНЕЦ ВАЛИДАЦИИ =====

    const cart = JSON.parse(localStorage.getItem("s-l-e-n-g-cart")) || [];
    if (cart.length === 0) {
        alert("Корзина пуста");
        return;
    }

    const deliveryCost = 240;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let discountAmount = 0;
    if (appliedPromo) {
        discountAmount = (subtotal * appliedPromo.discount) / 100;
    }
    
    const total = subtotal + deliveryCost - discountAmount;

    const orderData = {
        customer: { fullName, phone, email, address, telegram },
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            size: item.selectedSize || "OS",
            quantity: item.quantity,
            price: item.price
        })),
        subtotal: subtotal,
        delivery: deliveryCost,
        discount: appliedPromo ? {
            code: appliedPromo.code,
            amount: discountAmount,
            percent: appliedPromo.discount
        } : null,
        total: Math.round(total),
        date: new Date().toISOString()
    };

    if (submitBtn) submitBtn.disabled = true;

    try {
        if (typeof slengSupabaseConfigured === "function" && slengSupabaseConfigured()) {
            await slengSaveOrderToCloud(orderData);
        } else {
            const orders = JSON.parse(localStorage.getItem("s-l-e-n-g-orders")) || [];
            orders.push(orderData);
            localStorage.setItem("s-l-e-n-g-orders", JSON.stringify(orders));
        }
    } catch (err) {
        alert("Не удалось сохранить заказ: " + (err && err.message ? err.message : String(err)));
        if (submitBtn) submitBtn.disabled = false;
        return;
    }

    localStorage.removeItem("s-l-e-n-g-cart");

    document.body.innerHTML = `
        <div style="max-width: 600px; margin: 100px auto; text-align: center; font-family: Helvetica, sans-serif; letter-spacing: -0.6px;">
            <h1 style="font-weight: 500; font-size: 28px; margin-bottom: 20px;">Спасибо за заказ!</h1>
            <p style="font-size: 16px; margin-bottom: 20px;">За статусом товара следите в приложении СДЭК.</p>
            <p style="font-size: 16px;">По любым вопросам пишите: <a href="https://t.me/slengsupport" target="_blank" style="color: #111; text-decoration: underline;">@slengsupport</a></p>
            <a href="index.html" style="display: inline-block; margin-top: 40px; color: #888; text-decoration: none;">← Вернуться на главную</a>
        </div>
    `;
}

// ==================== ПРИМЕНЕНИЕ ПРОМОКОДА ====================
const applyPromoBtn = document.getElementById("applyPromoBtn");
const promoInput = document.getElementById("promocode");

if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        const found = promoCodes.find(p => p.code === code);
        if (found) {
            appliedPromo = found;
            alert(`Промокод ${code} применён! Скидка ${found.discount}%`);
            renderOrderSummary();
        } else {
            alert("Неверный промокод");
        }
    });
}

// ==================== ВАЛИДАЦИЯ ПОЛЕЙ ПРИ ВВОДЕ ====================

// 1. Телефон — только цифры, +, -, пробелы, скобки
const phoneInput = document.getElementById("phone");
if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9+\-()\s]/g, "");
        e.target.value = value;
    });
}

// 2. ФИО — только буквы, пробелы, дефисы
const nameInput = document.getElementById("fullName");
if (nameInput) {
    nameInput.addEventListener("input", (e) => {
        let value = e.target.value;
        value = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, "");
        e.target.value = value;
    });
}

// 3. Email — без пробелов
const emailInput = document.getElementById("email");
if (emailInput) {
    emailInput.addEventListener("input", (e) => {
        let value = e.target.value;
        value = value.replace(/\s/g, "");
        e.target.value = value;
    });
}

// 4. Telegram — обязательно начинается с @, затем буквы, цифры, подчёркивание
const telegramInput = document.getElementById("telegram");
if (telegramInput) {
    telegramInput.addEventListener("input", (e) => {
        let value = e.target.value;
        
        if (value.length > 0 && !value.startsWith("@")) {
            value = "@" + value.replace(/^@+/, "");
        }
        
        value = value.replace(/[^a-zA-Z0-9_@]/g, "");
        
        const parts = value.split("@");
        if (parts.length > 1) {
            value = "@" + parts.slice(1).join("").replace(/[^a-zA-Z0-9_]/g, "");
        }
        
        value = value.replace(/\s/g, "");
        
        e.target.value = value;
    });
}

// 5. Адрес — убираем лишние пробелы
const addressInput = document.getElementById("address");
if (addressInput) {
    addressInput.addEventListener("input", (e) => {
        let value = e.target.value;
        value = value.replace(/\s+/g, " ").trim();
        e.target.value = value;
    });
}

// 6. Промокод — только буквы и цифры, без пробелов, в верхний регистр
const promoInputField = document.getElementById("promocode");
if (promoInputField) {
    promoInputField.addEventListener("input", (e) => {
        let value = e.target.value;
        value = value.replace(/[^a-zA-Z0-9]/g, "");
        value = value.toUpperCase();
        e.target.value = value;
    });
}

// ==================== ЗАПУСК ====================
document.addEventListener("DOMContentLoaded", () => {
    renderOrderSummary();
    const submitBtn = document.getElementById("submitOrderBtn");
    if (submitBtn) submitBtn.addEventListener("click", submitOrder);
});