/**
 * Облачное сохранение заказов (Supabase). Требуется config.js с window.SLENG_SUPABASE
 * и скрипт UMD @supabase/supabase-js на странице до этого файла.
 */
function slengSupabaseConfigured() {
    const c = window.SLENG_SUPABASE;
    return Boolean(c && c.url && c.anonKey);
}

function slengCreateSupabaseClient() {
    if (!slengSupabaseConfigured()) return null;
    const mod = window.supabase;
    if (!mod || typeof mod.createClient !== "function") {
        console.error("Подключите CDN: @supabase/supabase-js (dist/umd/supabase.js) перед orders-db.js");
        return null;
    }
    return mod.createClient(window.SLENG_SUPABASE.url, window.SLENG_SUPABASE.anonKey);
}

async function slengSaveOrderToCloud(orderData) {
    const client = slengCreateSupabaseClient();
    if (!client) throw new Error("Supabase не настроен");
    const { error } = await client.from("orders").insert({ payload: orderData });
    if (error) throw new Error(error.message || String(error));
}

function slengRowToOrder(row) {
    const p = row.payload;
    const payload = typeof p === "string" ? JSON.parse(p) : p;
    return {
        cloudId: row.id,
        date: row.created_at || payload.date,
        customer: payload.customer,
        items: payload.items,
        subtotal: payload.subtotal,
        delivery: payload.delivery,
        discount: payload.discount,
        total: payload.total,
    };
}
