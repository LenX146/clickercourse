/**
 * Клиент API магазина S.L.E.N.G (SQLite backend)
 */
const SLENG_API_BASE = "";

async function slengApiFetch(path, options = {}) {
    const res = await fetch(SLENG_API_BASE + path, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    let data = null;
    const text = await res.text();
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { error: text };
        }
    }

    if (!res.ok) {
        const msg = data?.error || `Ошибка ${res.status}`;
        throw new Error(msg);
    }
    return data;
}

let _productsPromise = null;

async function slengLoadProducts() {
    if (window._slengProductsLoaded) return window.products;

    if (!_productsPromise) {
        _productsPromise = slengApiFetch("/api/products")
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    window.products = data;
                    if (typeof window._slengSetProducts === "function") {
                        window._slengSetProducts(data);
                    }
                }
                window._slengProductsLoaded = true;
                return window.products;
            })
            .catch((err) => {
                console.warn("API товаров недоступен, используем локальный каталог:", err.message);
                window._slengProductsLoaded = true;
                return window.products;
            });
    }
    return _productsPromise;
}

async function slengCreateOrder(orderPayload) {
    return slengApiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderPayload),
    });
}

async function slengValidatePromo(code) {
    return slengApiFetch("/api/orders/validate-promo", {
        method: "POST",
        body: JSON.stringify({ code }),
    });
}

async function slengAdminLogin(email, password) {
    return slengApiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

async function slengAdminLogout() {
    return slengApiFetch("/api/admin/logout", { method: "POST" });
}

async function slengAdminMe() {
    return slengApiFetch("/api/admin/me");
}

async function slengFetchOrders(params = {}) {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.status) qs.set("status", params.status);
    const query = qs.toString();
    return slengApiFetch("/api/orders" + (query ? "?" + query : ""));
}

async function slengDeleteOrder(id) {
    return slengApiFetch(`/api/orders/${id}`, { method: "DELETE" });
}

async function slengClearAllOrders() {
    return slengApiFetch("/api/orders", { method: "DELETE" });
}

async function slengUpdateOrderStatus(id, status) {
    return slengApiFetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}

function slengEscapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
