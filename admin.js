// ==================== ЗАГРУЗКА ВСЕХ ЗАКАЗОВ ====================
function loadAllOrders() {
    const orders = JSON.parse(localStorage.getItem("s-l-e-n-g-orders")) || [];
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
        const orderId = index + 1;
        const hasDiscount = order.discount && order.discount.amount > 0;

        return `
            <div class="order-card" data-order-index="${index}">
                <div class="order-header">
                    <div class="order-id">Заказ №${orderId}</div>
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
                ` : ''}

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
                    ${hasDiscount ? `<br><span style="color:#2a7f2a;">Скидка (${order.discount.code}): -${order.discount.amount} ₽</span>` : ''}
                    <br><strong>ИТОГО: ${order.total} ₽</strong>
                </div>

                <button class="delete-order-btn" data-order-index="${index}">🗑 Удалить заказ</button>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".delete-order-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.orderIndex);
            deleteOrder(index);
        });
    });
}

// ==================== УДАЛИТЬ ЗАКАЗ ====================
function deleteOrder(index) {
    if (confirm("Удалить этот заказ?")) {
        let orders = JSON.parse(localStorage.getItem("s-l-e-n-g-orders")) || [];
        orders.splice(index, 1);
        localStorage.setItem("s-l-e-n-g-orders", JSON.stringify(orders));
        loadAllOrders();
        alert("Заказ удалён");
    }
}

// ==================== ОЧИСТИТЬ ВСЕ ЗАКАЗЫ ====================
function clearAllOrders() {
    if (confirm("⚠️ ВНИМАНИЕ! Это удалит ВСЕ заказы без возможности восстановления. Продолжить?")) {
        localStorage.removeItem("s-l-e-n-g-orders");
        loadAllOrders();
        alert("Все заказы удалены");
    }
}

// ==================== ЭКСПОРТ CSV ====================
function exportToCSV() {
    const orders = JSON.parse(localStorage.getItem("s-l-e-n-g-orders")) || [];
    if (orders.length === 0) {
        alert("Нет заказов для экспорта");
        return;
    }

    const rows = [];
    rows.push(["№", "Дата", "ФИО", "Телефон", "Email", "Адрес", "Telegram", "Промокод", "Скидка", "Товар", "Размер", "Кол-во", "Цена", "Сумма", "Итог заказа"]);

    orders.forEach((order, orderIndex) => {
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

// ==================== ЭКСПОРТ EXCEL ====================
function exportToXLS() {
    const orders = JSON.parse(localStorage.getItem("s-l-e-n-g-orders")) || [];
    if (orders.length === 0) {
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

    orders.forEach((order, orderIndex) => {
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

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    loadAllOrders();

    const exportCSV = document.getElementById("exportCSVBtn");
    const exportExcel = document.getElementById("exportExcelBtn");
    const clearAll = document.getElementById("clearAllOrdersBtn");

    if (exportCSV) exportCSV.addEventListener("click", exportToCSV);
    if (exportExcel) exportExcel.addEventListener("click", exportToXLS);
    if (clearAll) clearAll.addEventListener("click", clearAllOrders);
});