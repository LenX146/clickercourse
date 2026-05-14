// ==================== СОСТОЯНИЕ ====================
let ordersCache = [];
let cloudClient = null;
let cloudMode = false;

function isCloudConfigured() {
    return typeof slengSupabaseConfigured === "function" && slengSupabaseConfigured();
}

function getUi() {
    return {
        hint: document.getElementById("adminCloudHint"),
        auth: document.getElementById("adminCloudAuth"),
        ordersContent: document.getElementById("adminOrdersContent"),
        loginErr: document.getElementById("adminLoginErr"),
        logoutBtn: document.getElementById("adminLogoutBtn"),
    };
}

function setCloudUi({ showLogin, showOrders }) {
    const { hint, auth, ordersContent, logoutBtn } = getUi();
    if (auth) auth.hidden = !showLogin;
    if (ordersContent) ordersContent.hidden = !showOrders;
    if (logoutBtn) logoutBtn.hidden = !showOrders || !isCloudConfigured();
    if (hint) {
        if (!isCloudConfigured()) {
            hint.textContent =
                "Облако не подключено: заказы только в этом браузере (localStorage). Для общей базы настройте Supabase — файл database/supabase-orders.sql и config.js.";
            hint.hidden = false;
        } else if (showLogin) {
            hint.textContent = "Заказы сохраняются в Supabase. Войдите, чтобы видеть заказы с любого устройства.";
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

    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `<div class="no-orders">📭 Заказов пока нет</div>`;
        if (totalSpan) totalSpan.innerText = "0";
        return;
    }

    if (totalSpan) totalSpan.innerText = orders.length;

    container.innerHTML = orders.map((order, index) => {
        const date = new Date(order.date).toLocaleString("ru-RU");
        const orderNo = index + 1;
        const hasDiscount = order.discount && order.discount.amount > 0;
        const delKey = order.cloudId ? `data-cloud-id="${order.cloudId}"` : `data-local-index="${index}"`;

        return `
            <div class="order-card" data-order-index="${index}">
                <div class="order-header">
                    <div class="order-id">Заказ №${orderNo}</div>
                    <div class="order-date">📅 ${date}</div>
                    <div class="order-total">💰 ${order.total.toLocaleString("ru-RU")} ₽</div>
                </div>

                <div class="order-customer">
                    <p>👤 <strong>${order.customer.fullName}</strong></p>
                    <p>📞 ${order.customer.phone} | ✉️ ${order.customer.email || "—"}</p>
                    <p>📍 ${order.customer.address || "—"} | 📱 ${order.customer.telegram || "—"}</p>
                </div>

                ${hasDiscount ? `
                <div style="background:#e8f5e9; padding:8px 12px; margin-bottom:15px; font-size:13px;">
                    🏷️ Промокод: ${order.discount.code} — скидка ${order.discount.percent}% (${order.discount.amount} ₽)
                </div>
                ` : ""}

                <table class="order-items-table">
                    <thead>
                        <tr><th>Товар</th><th>Размер</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.size}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price} ₽</td>
                                <td>${item.price * item.quantity} ₽</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <div style="margin-top:15px; text-align:right; font-size:14px;">
                    Сумма товаров: ${order.subtotal} ₽<br>
                    Доставка: ${order.delivery} ₽
                    ${hasDiscount ? `<br><span style="color:#2a7f2a;">Скидка (${order.discount.code}): -${order.discount.amount} ₽</span>` : ""}
                    <br><strong>ИТОГО: ${order.total} ₽</strong>
                </div>

                <button type="button" class="delete-order-btn" ${delKey}>🗑 Удалить заказ</button>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".delete-order-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const cid = btn.getAttribute("data-cloud-id");
            if (cid) deleteOrderCloud(cid);
            else {
                const idx = parseInt(btn.getAttribute("data-local-index"), 10);
                if (!Number.isNaN(idx)) deleteOrderLocal(idx);
            }
        });
    });
}

// ==================== LOCALSTORAGE ====================
function loadOrdersLocal() {
    cloudMode = false;
    const orders = JSON.parse(localStorage.getItem("s-l-e-n-g-orders")) || [];
    renderOrdersList(orders);
}

function deleteOrderLocal(index) {
    if (!confirm("Удалить этот заказ?")) return;
    const orders = JSON.parse(localStorage.getItem("s-l-e-n-g-orders")) || [];
    orders.splice(index, 1);
    localStorage.setItem("s-l-e-n-g-orders", JSON.stringify(orders));
    loadOrdersLocal();
    alert("Заказ удалён");
}

function clearAllOrdersLocal() {
    if (confirm("⚠️ ВНИМАНИЕ! Это удалит ВСЕ заказы без возможности восстановления. Продолжить?")) {
        localStorage.removeItem("s-l-e-n-g-orders");
        loadOrdersLocal();
        alert("Все заказы удалены");
    }
}

// ==================== SUPABASE ====================
async function loadOrdersFromCloud() {
    if (!cloudClient) return;
    const { data, error } = await cloudClient
        .from("orders")
        .select("id, created_at, payload")
        .order("created_at", { ascending: false });
    if (error) {
        alert("Не удалось загрузить заказы: " + error.message);
        return;
    }
    const orders = (data || []).map(slengRowToOrder);
    cloudMode = true;
    renderOrdersList(orders);
}

async function deleteOrderCloud(id) {
    if (!confirm("Удалить этот заказ?")) return;
    if (!cloudClient) return;
    const { error } = await cloudClient.from("orders").delete().eq("id", id);
    if (error) {
        alert("Ошибка удаления: " + error.message);
        return;
    }
    await loadOrdersFromCloud();
    alert("Заказ удалён");
}

async function clearAllOrdersCloud() {
    if (!confirm("⚠️ Удалить ВСЕ заказы в облаке?")) return;
    if (!cloudClient) return;
    if (ordersCache.length === 0) {
        alert("Нет заказов для удаления");
        return;
    }
    const ids = ordersCache.map(o => o.cloudId).filter(Boolean);
    const { error } = await cloudClient.from("orders").delete().in("id", ids);
    if (error) {
        alert("Ошибка: " + error.message);
        return;
    }
    await loadOrdersFromCloud();
    alert("Все заказы удалены");
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
    if (!cloudClient) return;
    const { error } = await cloudClient.auth.signInWithPassword({ email, password });
    if (error) {
        if (errEl) errEl.textContent = error.message;
        return;
    }
}

async function adminLogout() {
    if (cloudClient) await cloudClient.auth.signOut();
    setCloudUi({ showLogin: true, showOrders: false });
}

async function initCloudAdmin() {
    cloudClient = slengCreateSupabaseClient();
    if (!cloudClient) {
        alert("Проверьте config.js и загрузку Supabase CDN.");
        setCloudUi({ showLogin: false, showOrders: true });
        loadOrdersLocal();
        return;
    }

    cloudClient.auth.onAuthStateChange((_event, session) => {
        if (session) {
            setCloudUi({ showLogin: false, showOrders: true });
            loadOrdersFromCloud();
        } else {
            setCloudUi({ showLogin: true, showOrders: false });
            renderOrdersList([]);
        }
    });

    const { data: { session } } = await cloudClient.auth.getSession();
    if (session) {
        setCloudUi({ showLogin: false, showOrders: true });
        await loadOrdersFromCloud();
    } else {
        setCloudUi({ showLogin: true, showOrders: false });
        renderOrdersList([]);
    }

    document.getElementById("adminLoginBtn")?.addEventListener("click", adminLogin);
    document.getElementById("adminLogoutBtn")?.addEventListener("click", adminLogout);
}

// ==================== ЭКСПОРТ ====================
function exportToCSV() {
    if (ordersCache.length === 0) {
        alert("Нет заказов для экспорта");
        return;
    }

    const rows = [];
    rows.push(["№", "Дата", "ФИО", "Телефон", "Email", "Адрес", "Telegram", "Промокод", "Скидка", "Товар", "Размер", "Кол-во", "Цена", "Сумма", "Итог заказа"]);

    ordersCache.forEach((order, orderIndex) => {
        order.items.forEach(item => {
            rows.push([
                orderIndex + 1,
                new Date(order.date).toLocaleString("ru-RU"),
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
                        <th>№</th><th>Дата</th><th>ФИО</th><th>Телефон</th><th>Email</th>
                        <th>Адрес</th><th>Telegram</th><th>Промокод</th><th>Скидка</th>
                        <th>Товар</th><th>Размер</th><th>Кол-во</th><th>Цена</th><th>Сумма</th><th>Итог заказа</th>
                    </tr>
                </thead>
                <tbody>
    `;

    ordersCache.forEach((order, orderIndex) => {
        order.items.forEach(item => {
            html += `
                <tr>
                    <td>${orderIndex + 1}</td>
                    <td>${new Date(order.date).toLocaleString("ru-RU")}</td>
                    <td>${order.customer.fullName}</td>
                    <td>${order.customer.phone}</td>
                    <td>${order.customer.email || ""}</td>
                    <td>${order.customer.address || ""}</td>
                    <td>${order.customer.telegram || ""}</td>
                    <td>${order.discount?.code || ""}</td>
                    <td>${order.discount?.amount || ""}</td>
                    <td>${item.name}</td>
                    <td>${item.size}</td>
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

function clearAllOrders() {
    if (cloudMode) clearAllOrdersCloud();
    else clearAllOrdersLocal();
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", async () => {
    if (isCloudConfigured()) {
        await initCloudAdmin();
    } else {
        setCloudUi({ showLogin: false, showOrders: true });
        loadOrdersLocal();
    }

    const exportCSV = document.getElementById("exportCSVBtn");
    const exportExcel = document.getElementById("exportExcelBtn");
    const clearAll = document.getElementById("clearAllOrdersBtn");

    if (exportCSV) exportCSV.addEventListener("click", exportToCSV);
    if (exportExcel) exportExcel.addEventListener("click", exportToXLS);
    if (clearAll) clearAll.addEventListener("click", clearAllOrders);
});
