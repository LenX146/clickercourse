// ==================== СОСТОЯНИЕ ====================
let ordersCache = [];
let statsCache = { totalOrders: 0, totalRevenue: 0 };
let isAuthenticated = false;

const STATUS_LABELS = {
    new: "🆕 Новый",
    processing: "⏳ В обработке",
    shipped: "📦 Отправлен",
    completed: "✅ Выполнен",
    cancelled: "❌ Отменён",
};

function getUi() {
    return {
        hint: document.getElementById("adminCloudHint"),
        auth: document.getElementById("adminCloudAuth"),
        ordersContent: document.getElementById("adminOrdersContent"),
        loginErr: document.getElementById("adminLoginErr"),
        logoutBtn: document.getElementById("adminLogoutBtn"),
        searchInput: document.getElementById("adminSearchInput"),
        statusFilter: document.getElementById("adminStatusFilter"),
        revenueSpan: document.getElementById("totalRevenue"),
    };
}

function setAdminUi({ showLogin, showOrders }) {
    const { hint, auth, ordersContent, logoutBtn } = getUi();
    if (auth) auth.hidden = !showLogin;
    if (ordersContent) ordersContent.hidden = !showOrders;
    if (logoutBtn) logoutBtn.hidden = !showOrders;
    if (hint) {
        if (showLogin) {
            hint.textContent = "Войдите в админ-панель для просмотра заказов. Данные клиентов защищены и доступны только авторизованным пользователям.";
            hint.hidden = false;
        } else {
            hint.hidden = true;
        }
    }
}

// ==================== ОТРИСОВКА ====================
function renderOrdersList(orders) {
    ordersCache = orders;
    const container = document.getElementById("ordersList");
    const totalSpan = document.getElementById("totalOrders");
    const { revenueSpan } = getUi();

    if (!container) return;

    if (totalSpan) totalSpan.innerText = statsCache.totalOrders ?? orders.length;
    if (revenueSpan) {
        const rev = statsCache.totalRevenue || 0;
        revenueSpan.innerText = rev.toLocaleString("ru-RU") + " ₽";
    }

    if (orders.length === 0) {
        container.innerHTML = `<div class="no-orders">📭 Заказов не найдено</div>`;
        return;
    }

    container.innerHTML = orders.map((order) => {
        const date = new Date(order.date).toLocaleString("ru-RU");
        const hasDiscount = order.discount && order.discount.amount > 0;
        const status = order.status || "new";

        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-id">Заказ №${order.id}</div>
                    <div class="order-date">📅 ${slengEscapeHtml(date)}</div>
                    <div class="order-total">💰 ${order.total.toLocaleString("ru-RU")} ₽</div>
                </div>

                <div class="order-status-row">
                    <label>Статус:
                        <select class="order-status-select" data-order-id="${order.id}">
                            ${Object.entries(STATUS_LABELS).map(([val, label]) =>
                                `<option value="${val}" ${status === val ? "selected" : ""}>${label}</option>`
                            ).join("")}
                        </select>
                    </label>
                </div>

                <div class="order-customer">
                    <p>👤 <strong>${slengEscapeHtml(order.customer.fullName)}</strong></p>
                    <p>📞 ${slengEscapeHtml(order.customer.phone)} | ✉️ ${slengEscapeHtml(order.customer.email || "—")}</p>
                    <p>📍 ${slengEscapeHtml(order.customer.address || "—")} | 📱 ${slengEscapeHtml(order.customer.telegram || "—")}</p>
                </div>

                ${hasDiscount ? `
                <div class="order-discount-banner">
                    🏷️ Промокод: ${slengEscapeHtml(order.discount.code)} — скидка ${order.discount.percent}% (${order.discount.amount} ₽)
                </div>
                ` : ""}

                <table class="order-items-table">
                    <thead>
                        <tr><th>Товар</th><th>Размер</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${slengEscapeHtml(item.name)}</td>
                                <td>${slengEscapeHtml(item.size)}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price} ₽</td>
                                <td>${item.price * item.quantity} ₽</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <div class="order-summary-footer">
                    Сумма товаров: ${order.subtotal} ₽<br>
                    Доставка: ${order.delivery} ₽
                    ${hasDiscount ? `<br><span class="order-discount-text">Скидка (${slengEscapeHtml(order.discount.code)}): -${order.discount.amount} ₽</span>` : ""}
                    <br><strong>ИТОГО: ${order.total} ₽</strong>
                </div>

                <button type="button" class="delete-order-btn" data-order-id="${order.id}">🗑 Удалить заказ</button>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".delete-order-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const id = btn.getAttribute("data-order-id");
            if (id) await deleteOrder(id);
        });
    });

    document.querySelectorAll(".order-status-select").forEach(select => {
        select.addEventListener("change", async () => {
            const id = select.getAttribute("data-order-id");
            try {
                await slengUpdateOrderStatus(id, select.value);
            } catch (err) {
                alert("Не удалось обновить статус: " + err.message);
                await loadOrders();
            }
        });
    });
}

// ==================== API ====================
async function loadOrders() {
    const { searchInput, statusFilter } = getUi();
    const search = searchInput?.value.trim() || "";
    const status = statusFilter?.value || "all";

    try {
        const data = await slengFetchOrders({ search, status });
        statsCache = data.stats || statsCache;
        renderOrdersList(data.orders || []);
    } catch (err) {
        if (err.message.includes("авторизац")) {
            isAuthenticated = false;
            setAdminUi({ showLogin: true, showOrders: false });
            renderOrdersList([]);
        } else {
            alert("Не удалось загрузить заказы: " + err.message);
        }
    }
}

async function deleteOrder(id) {
    if (!confirm("Удалить этот заказ?")) return;
    try {
        await slengDeleteOrder(id);
        await loadOrders();
        alert("Заказ удалён");
    } catch (err) {
        alert("Ошибка удаления: " + err.message);
    }
}

async function clearAllOrders() {
    if (!confirm("⚠️ ВНИМАНИЕ! Это удалит ВСЕ заказы без возможности восстановления. Продолжить?")) return;
    try {
        await slengClearAllOrders();
        await loadOrders();
        alert("Все заказы удалены");
    } catch (err) {
        alert("Ошибка: " + err.message);
    }
}

async function adminLogin() {
    const email = document.getElementById("adminEmail")?.value.trim();
    const password = document.getElementById("adminPassword")?.value;
    const errEl = document.getElementById("adminLoginErr");
    if (errEl) errEl.textContent = "";

    if (!email || !password) {
        if (errEl) errEl.textContent = "Введите email и пароль";
        return;
    }

    try {
        await slengAdminLogin(email, password);
        isAuthenticated = true;
        setAdminUi({ showLogin: false, showOrders: true });
        await loadOrders();
    } catch (err) {
        if (errEl) errEl.textContent = err.message;
    }
}

async function adminLogout() {
    try {
        await slengAdminLogout();
    } catch { /* ignore */ }
    isAuthenticated = false;
    setAdminUi({ showLogin: true, showOrders: false });
    renderOrdersList([]);
}

async function initAdmin() {
    try {
        await slengAdminMe();
        isAuthenticated = true;
        setAdminUi({ showLogin: false, showOrders: true });
        await loadOrders();
    } catch {
        isAuthenticated = false;
        setAdminUi({ showLogin: true, showOrders: false });
        renderOrdersList([]);
    }

    document.getElementById("adminLoginBtn")?.addEventListener("click", adminLogin);
    document.getElementById("adminLogoutBtn")?.addEventListener("click", adminLogout);

    const { searchInput, statusFilter } = getUi();
    let searchTimer;
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                if (isAuthenticated) loadOrders();
            }, 300);
        });
    }
    if (statusFilter) {
        statusFilter.addEventListener("change", () => {
            if (isAuthenticated) loadOrders();
        });
    }
}

// ==================== ЭКСПОРТ ====================
function exportToCSV() {
    if (ordersCache.length === 0) {
        alert("Нет заказов для экспорта");
        return;
    }

    const rows = [];
    rows.push(["№", "Дата", "Статус", "ФИО", "Телефон", "Email", "Адрес", "Telegram", "Промокод", "Скидка", "Товар", "Размер", "Кол-во", "Цена", "Сумма", "Итог заказа"]);

    ordersCache.forEach((order) => {
        order.items.forEach(item => {
            rows.push([
                order.id,
                new Date(order.date).toLocaleString("ru-RU"),
                order.status || "new",
                order.customer.fullName,
                order.customer.phone,
                order.customer.email || "",
                order.customer.address || "",
                order.customer.telegram || "",
                order.discount?.code || "",
                order.discount?.amount || "",
                item.name,
                item.size,
                item.quantity,
                item.price,
                item.price * item.quantity,
                order.total
            ]);
        });
    });

    const csvContent = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "s-l-e-n-g-all-orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportToXLS() {
    if (ordersCache.length === 0) {
        alert("Нет заказов для экспорта");
        return;
    }

    let html = `
        <html>
        <head><meta charset="UTF-8"><title>S.L.E.N.G Все заказы</title></head>
        <body>
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>№</th><th>Дата</th><th>Статус</th><th>ФИО</th><th>Телефон</th><th>Email</th>
                        <th>Адрес</th><th>Telegram</th><th>Промокод</th><th>Скидка</th>
                        <th>Товар</th><th>Размер</th><th>Кол-во</th><th>Цена</th><th>Сумма</th><th>Итог заказа</th>
                    </tr>
                </thead>
                <tbody>
    `;

    ordersCache.forEach((order) => {
        order.items.forEach(item => {
            html += `
                <tr>
                    <td>${order.id}</td>
                    <td>${new Date(order.date).toLocaleString("ru-RU")}</td>
                    <td>${slengEscapeHtml(order.status || "new")}</td>
                    <td>${slengEscapeHtml(order.customer.fullName)}</td>
                    <td>${slengEscapeHtml(order.customer.phone)}</td>
                    <td>${slengEscapeHtml(order.customer.email || "")}</td>
                    <td>${slengEscapeHtml(order.customer.address || "")}</td>
                    <td>${slengEscapeHtml(order.customer.telegram || "")}</td>
                    <td>${slengEscapeHtml(order.discount?.code || "")}</td>
                    <td>${order.discount?.amount || ""}</td>
                    <td>${slengEscapeHtml(item.name)}</td>
                    <td>${slengEscapeHtml(item.size)}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price} ₽</td>
                    <td>${item.price * item.quantity} ₽</td>
                    <td>${order.total} ₽</td>
                </tr>
            `;
        });
    });

    html += `</tbody></table></body></html>`;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "s-l-e-n-g-all-orders.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", async () => {
    await initAdmin();

    document.getElementById("exportCSVBtn")?.addEventListener("click", exportToCSV);
    document.getElementById("exportExcelBtn")?.addEventListener("click", exportToXLS);
    document.getElementById("clearAllOrdersBtn")?.addEventListener("click", clearAllOrders);
});
