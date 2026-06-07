// ==================== ТОВАРЫ (УНИКАЛЬНЫЕ ID) ====================
const products = [
    {
        id: 601,
        name: "Футболка Emo great again",
        price: 2007,
        category: ["upper"],
        image: "NEWEMO/emogreatagain/1 фото.png",
        photos: ["NEWEMO/emogreatagain/1 фото.png", "NEWEMO/emogreatagain/фото 2.png","NEWEMO/emogreatagain/DSC_8492-Photoroom.png", "NEWEMO/emogreatagain/фото 3.png", "NEWEMO/emogreatagain/размерная сеткаа.png"],
        modelImage: "NEWEMO/emogreatagain/фото 2.png",
        size: "S/M/L/XL/2XL",
        desc: "100% хлопок, 210 г/м². Покрой: прямой. Печать: DTF. Необработанные швы на рукавах и подоле. Ручной дистресс. Индивидуальная нумерация: на бирке каждого изделия будет свой номер (акция продлится до 31 августа, после чего нумерация больше не будет). Маша - 170/60, на ней M. Серёга  - 180/65, на нём M. Отправка от 3–7 дней.",
        stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 },
        emo: true
    },
    {
        id: 602,
        name: "Серьги emoбоб",
        price: 2007,
        category: ["accessories"],
        image: "NEWEMO/emoбоб/11 фото.png",
        photos: ["NEWEMO/emoбоб/11 фото.png","NEWEMO/emoбоб/22 фото.png", "NEWEMO/emoбоб/фото 3.png","NEWEMO/emoбоб/DSC_8225.JPG"],
        modelImage: "NEWEMO/emoбоб/фото 3.png",
        size: "OS",
        desc: "Основа и заглужки выполнена из гипераллергенного, бижутерного сплава. Фигурка сделана из пластика. В комплекте 2 сережки. Отправка от 7-14 дней",
        stock: { OS: 2 },
        emo: true
    },
    {
        id: 603,
        name: "Серьги Ship1",
        price: 2007,
        category: ["accessories"],
        image: "NEWEMO/ship1/1 фото.png",
        photos: ["NEWEMO/ship1/1 фото.png","NEWEMO/ship1/2 фото.png", "NEWEMO/ship1/3 фото.png", "NEWEMO/ship1/DSC_8249.JPG"],
        modelImage: "NEWEMO/ship1/3 фото.png",
        size: "OS",
        desc: "Основа и заглушки выполнены из гипоаллергенного бижутерного сплава. В комплекте 2 серёжки. На тыльной стороне серьги нанесена гравировка с логотипом бренда. Отправка от 3–7 дней.",
        stock: { OS: 2 },
        emo: true
    },
    {
    id: 604,
    name: "Футболка ?",
    price: 2007,
    category: ["upper"],
    image: "NEWEMO/f/1 фото.png",
    photos: ["NEWEMO/f/1 фото.png", "NEWEMO/f/DSC_8510-Photoroom.png", "NEWEMO/f/DSC_8123.JPG", "NEWEMO/f/3 фото.png", "NEWEMO/emogreatagain/размерная сеткаа.png"],
    modelImage: "NEWEMO/f/DSC_8123.JPG",
    size: "S/M/L/XL/2XL",
    desc: "100% хлопок, 180 г/м². Покрой прямой. Печать DTF. Необработанные швы на рукавах и подоле. Индивидуальная нумерация: на бирке каждого изделия будет свой номер (акция действует до 31 августа, далее нумерация прекращается). Маша - 170/60, на ней M. Серёга  - 180/65, на нём M. Отправка от 3 до 7 дней.",
    stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 },
    emo: true
},
    {
        id: 605,
        name: "Футболка LV",
        price: 2007,
        category: ["upper"],
        image: "NEWEMO/LV/1 фото.png",
        photos: ["NEWEMO/LV/1 фото.png", "NEWEMO/LV/DSC_8625-Photoroom.png", "NEWEMO/LV/DSC_8101.JPG","NEWEMO/LV/DSC_8676-Photoroom.png","NEWEMO/LV/DSC_8107.JPG","NEWEMO/LV/размерная сеткаа.png"],
        size: "S/M/L/XL/2XL",
        modelImage: "NEWEMO/LV/DSC_8101.JPG",
        desc: "100% хлопок, 210 г/м². Покрой: прямой. Печать: DTF. Необработанные швы на рукавах и подоле. Ручной дистресс. Индивидуальная нумерация: на бирке каждого изделия будет свой номер (акция продлится до 31 августа, после чего нумерация больше не будет). Маша - 170/60, на ней M. Серёга  - 180/65, на нём M. Отправка от 3–7 дней.",
        stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 },
        emo: true
    },
    {
        id: 606,
        name: "Майка Е.Г.Э",
        price: 2007,
        category: ["upper"],
        image: "NEWEMO/Е.Г.Э/фото 1.png",
        photos: ["NEWEMO/Е.Г.Э/фото 1.png","NEWEMO/Е.Г.Э/DSC_8011.JPG", "NEWEMO/Е.Г.Э/DSC_8558-Photoroom.png", "NEWEMO/Е.Г.Э/DSC_8039.JPG","NEWEMO/Е.Г.Э/DSC_8043.JPG", "NEWEMO/Е.Г.Э/размерная сетка (для маяк).png"],
        modelImage: "NEWEMO/Е.Г.Э/DSC_8011.JPG",
        size: "S/M/L/XL/2XL",
        desc: "95% хлопок, 5% лайкра. Покрой: прямой. Печать: DTG. Индивидуальная нумерация: на бирке каждого изделия будет свой номер (акция продлится до 31 августа, после чего нумерация больше не будет). Маша - 170/60, на ней M. Серёга  - 180/65, на нём M. Отправка от 3–7 дней.",
        stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 },
        emo: true
    },
    {
        id: 607,
        name: "Серьги ship2",
        price: 2007,
        category: ["accessories"],
        image: "NEWEMO/ship2/1 фото.png",
        photos: ["NEWEMO/ship2/1 фото.png", "NEWEMO/ship2/2 фото.png","NEWEMO/ship2/DSC_8259.JPG"],
        modelImage:"NEWEMO/ship2/2 фото.png",
        size: "OS",
        desc: "Основа выполнена из гипоаллергенного бижутерного сплава. В комплекте 2 серёжки. На тыльной стороне серьги нанесена гравировка с логотипом бренда. Отправка от 3–7 дней.",
        stock: { OS: 2 },
        emo: true
    },
    {
        id: 608,
        name: "Майка kick-ass",
        price: 2007,
        category: ["upper"],
        image: "NEWEMO/kick-ass/1 фото.png",
        photos: ["NEWEMO/kick-ass/1 фото.png", "NEWEMO/kick-ass/2 фото.png", "NEWEMO/kick-ass/DSC_8549-Photoroom.png", "NEWEMO/kick-ass/DSC_8165.JPG","NEWEMO/kick-ass/DSC_8535-Photoroom.png", "NEWEMO/kick-ass/DSC_8149.JPG", "NEWEMO/kick-ass/размерная сетка (для маяк).png"],
        modelImage: "NEWEMO/kick-ass/DSC_8549-Photoroom.png",
        size: "S/M/L/XL/2XL",
        desc: "95% хлопок, 5% лайкра. Покрой: прямой. Печать: DTG. Индивидуальная нумерация: на бирке каждого изделия будет свой номер (акция продлится до 31 августа, после чего нумерация больше не будет). Маша - 170/60, на ней M. Серёга  - 180/65, на нём M. Отправка от 3–7 дней.",
        stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 },
        emo: true
    },
    {
        id: 609,
        name: "Майка Pleace love me",
        price: 2007,
        category: ["upper"],
        image: "NEWEMO/Please love me/1 фото.png",
        photos: ["NEWEMO/Please love me/1 фото.png", "NEWEMO/Please love me/22 фото.png", "NEWEMO/Please love me/DSC_8593-Photoroom.png", "NEWEMO/Please love me/DSC_8369.JPG","NEWEMO/Please love me/размерная сетка (для маяк).png"],
        modelImage: "NEWEMO/Please love me/DSC_8593-Photoroom.png",
        size: "S/M/L/XL/2XL",
        desc: "95% хлопок, 5% лайкра. Покрой: прямой. Печать: DTF. Индивидуальная нумерация: на бирке каждого изделия будет свой номер (акция продлится до 31 августа, после чего нумерация больше не будет). Маша - 170/60, на ней M. Серёга  - 180/65, на нём M. Отправка от 3–7 дней.",
        stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 },
        emo: true
    },
    {
        id: 610,
        name: "Кепка Что мне делать?",
        price: 2007,
        category: ["accessories"],
        image: "NEWEMO/2053/1 фото.png",
        photos: ["NEWEMO/2053/1 фото.png", "NEWEMO/2053/2 фото.png", "NEWEMO/2053/DSC_8267.JPG","NEWEMO/2053/DSC_8263.JPG","NEWEMO/2053/DSC_8274.JPG"],
        modelImage: "NEWEMO/2053/DSC_8267.JPG",
        size: "OS",
        desc: "Хлопок 100%. Печать: DTF. Ручной дистресс. Отправка от 3–7 дней.",
        stock: { OS: 2 },
        emo: true
    },
    {
        id: 611,
        name: "Майка NE VONAITE",
        price: 2007,
        category: ["upper"],
        image: "NEWEMO/NE VONAINE/1 фото.png",
        photos: ["NEWEMO/NE VONAINE/1 фото.png", "NEWEMO/NE VONAINE/DSC_7931.JPG","NEWEMO/NE VONAINE/DSC_7937.JPG","NEWEMO/NE VONAINE/размерная сетка (для маяк женских).png"],
        modelImage: "NEWEMO/NE VONAINE/DSC_7931.JPG",
        size: "S/M/L/XL/2XL",
        desc: "95% хлопок, 5% лайкра. Регулировка бретелей по длине. Печать: DTF. Ручной дистресс. Индивидуальная нумерация: на бирке каждого изделия будет свой номер (акция продлится до 31 августа, после чего нумерация больше не будет). Маша - 170/60, на ней M. Отправка от 3–7 дней.",
        stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 },
        emo: true
    },
    {
        id: 612,
        name: "Майка Pleace love me (жен.)",
        price: 2007,
        category: ["upper"],
        image: "NEWEMO/Please love me (жен)/1 фото.png",
        photos: ["NEWEMO/Please love me (жен)/1 фото.png","NEWEMO/Please love me (жен)/DSC_8301.JPG","NEWEMO/Please love me (жен)/DSC_8339.JPG", "NEWEMO/Please love me (жен)/DSC_8309.JPG", "NEWEMO/Please love me (жен)/размерная сетка (для маяк женских).png"],
        modelImage: "NEWEMO/Please love me (жен)/DSC_8301.JPG",
        size: "S/M/L/XL/2XL",
        desc: "95% хлопок, 5% лайкра. Регулировка бретелей по длине. Печать: DTF. Ручной дистресс. Индивидуальная нумерация: на бирке каждого изделия будет свой номер (акция продлится до 31 августа, после чего нумерация больше не будет). Маша - 170/60, на ней M. Отправка от 3–7 дней.",
        stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 },
        emo: true
    },
    {
        id: 613,
        name: "Серьги Зубы",
        price: 30.007,
        category: ["accessories"],
        image: "NEWEMO/ZUBI/1 фото.png",
        photos: ["NEWEMO/ZUBI/1 фото.png", "NEWEMO/ZUBI/DSC_8644-Photoroom.png", "NEWEMO/ZUBI/3 фото.png"],
        modelImage: "NEWEMO/ZUBI/DSC_8644-Photoroom.png",
        size: "OS",
        desc: "Основа выполнена из гипоаллергенного бижутерного сплава. Настоящие, обработанные зубы. В комплекте 2 серёжки. Продаётся в одном экземпляре. Отправка от 1–2 дней.",
        stock: { OS: 1 },
        emo: true
    },
    {
        id: 614,
        name: "Заколки forks",
        price: 577,
        category: ["accessories"],
        image: "NEWEMO/forks/1 фото.png",
        photos: ["NEWEMO/forks/1 фото.png", "NEWEMO/forks/DSC_8286.JPG","NEWEMO/forks/DSC_8283.JPG","NEWEMO/forks/DSC_8275.JPG"],
        modelImage: "NEWEMO/forks/DSC_8283.JPG",
        size: "OS",
        desc: "Металл. На лицевой стороне заколки нанесена гравировка с логотипом бренда. Отправка от 3–7 дней.",
        stock: { OS: 2 },
        emo: true
    },
    {
        id: 11,
        name: "Серьги PS4 (Red-Wine)",
        price: 2399,
        category: ["accessories", "slengitems"],
        image: "S.L.E.N.G ITEMS/PS4 (RED-WINE)/1 фото.png",
        photos: ["S.L.E.N.G ITEMS/PS4 (RED-WINE)/1 фото.png", "S.L.E.N.G ITEMS/PS4 (RED-WINE)/2 фото.png","S.L.E.N.G ITEMS/PS4 (RED-WINE)/3 фото.png","S.L.E.N.G ITEMS/PS4 (RED-WINE)/4 фото.png"],
        modelImage: "S.L.E.N.G ITEMS/PS4 (RED-WINE)/3 фото.png",
        size: "OS",
        desc: "Выполнено из оригинальных кнопок геймпада DualShock 4. Гипоаллергенный бижутерный сплав. Лимитированное количество — 10 шт. Отправка от 2–3 дней.",
        stock: { OS: 2 },
        emo: false
    },
    {
        id: 12,
        name: "Серьги PS4 (White)",
        price: 1555,
        category: ["accessories", "slengitems"],
        image: "S.L.E.N.G ITEMS/PS4 (WHITE)/1 фото.png",
        photos: ["S.L.E.N.G ITEMS/PS4 (WHITE)/1 фото.png", "S.L.E.N.G ITEMS/PS4 (WHITE)/2 фото.png","S.L.E.N.G ITEMS/PS4 (WHITE)/3 фото.png","S.L.E.N.G ITEMS/PS4 (WHITE)/4 фото.png"],
        modelImage: "S.L.E.N.G ITEMS/PS4 (WHITE)/4 фото.png",
        size: "OS",
        desc: "Выполнено из оригинальных кнопок геймпада DualShock 4. Гипоаллергенный бижутерный сплав. Отправка от 2–3 дней.",
        stock: { OS: 4 },
        emo: false
    },
    {
        id: 13,
        name: "Серьги PS4 (Black)",
        price: 1555,
        category: ["accessories", "slengitems"],
        image: "S.L.E.N.G ITEMS/PS4 (BLACK)/1 фото.png",
        photos: ["S.L.E.N.G ITEMS/PS4 (BLACK)/1 фото.png", "S.L.E.N.G ITEMS/PS4 (BLACK)/2 фото.png","S.L.E.N.G ITEMS/PS4 (BLACK)/3 фото.png","S.L.E.N.G ITEMS/PS4 (BLACK)/4 фото.png"],
        modelImage: "S.L.E.N.G ITEMS/PS4 (BLACK)/3 фото.png",
        size: "OS",
        desc: "Выполнено из оригинальных кнопок геймпада DualShock 4. Гипоаллергенный бижутерный сплав. Отправка от 3–7 дней.",
        stock: { OS: 0 },
        emo: false
    },
    {
        id: 100,
        name: "Лонгслив БИЧ",
        price: 1999,
        category: ["upper"],
        image: "2010/BISH/бич.png",
        photos: ["2010/BISH/бич.png", "2010/BISH/1 фото.png", "2010/BISH/2 фото.png", "2010/BISH/3 фото.png", "2010/BISH/БИЧ Фото с замерами.png"],
        modelImage: "2010/BISH/2 фото.png",
        size: "S/M/L/XL",
        desc: "100% хлопок, 180 г. Шелкография высшего качества. Отправка от 3–7 дней.",
        stock: { S: 5, M: 3, L: 0, XL: 2, "2XL": 1 },
        emo: false
    },
    {
        id: 102,
        name: "Футболка Shots",
        price: 1444,
        category: ["upper"],
        image: "2010/SHOTS/shots.png",
        photos: ["2010/SHOTS/shots.png", "2010/SHOTS/1 фото.png", "2010/SHOTS/2 фото.png", "2010/SHOTS/3 фото.png", "2010/SHOTS/SHOTS Фото с замерами.png"],
        modelImage: "2010/SHOTS/2 фото.png",
        size: "S/M/L/XL",
        desc: "100% хлопок, 180 г. Шелкография высшего качества. Отправка от 3–7 дней.",
        stock: { S: 3, M: 3, L: 3, XL: 2, "2XL": 1 },
        emo: false
    },
    {
        id: 103,
        name: "Серьги Xbox 360",
        price: 1555,
        category: ["accessories"],
        image: "2010/Xbox360/xbox.png",
        photos: ["2010/Xbox360/xbox.png", "2010/Xbox360/2 фото.png", "2010/Xbox360/3 фото.png"],
        modelImage: "2010/Xbox360/3 фото.png",
        size: "OS",
        desc: "Выполнено из оригинальных кнопок геймпада Xbox 360. Гипоаллергенный бижутерный сплав. Отправка от 3–7 дней.",
        stock: { OS: 4 },
        emo: false
    },
    {
        id: 104,
        name: "Жетон BIG BASS",
        price: 1333,
        category: ["accessories"],
        image: "2010/BIGBASS/1.png",
        photos: ["2010/BIGBASS/1.png", "2010/BIGBASS/2.png", "2010/BIGBASS/3.JPG"],
        modelImage: "2010/BIGBASS/3.JPG",
        size: "OS",
        desc: "Выполнено из нержавеющей стали. Двусторонний. Лазерная гравировка. Отправка от 1–2 дней.",
        stock: { OS: 4 },
        emo: false
    },
    {
        id: 105,
        name: "Серьги Lego (Белый)",
        price: 555,
        category: ["accessories"],
        image: "2010/legosergiii/1.png",
        photos: ["2010/legosergiii/1.png", "2010/Legosergiii/66.png"],
        modelImage: "2010/Legosergiii/66.png",
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Lego. Гипоаллергенный бижутерный сплав. Отправка от 3–7 дней.",
        stock: { OS: 0 },
        emo: false
    },
    {
        id: 106,
        name: "Футболка LL",
        price: 1444,
        category: ["upper"],
        image: "2010/LL/love.png",
        photos: ["2010/LL/love.png", "2010/LL/1.png", "2010/LL/2.JPG", "2010/LL/3.png", "2010/LL/Фото с замерами.png"],
        modelImage: "2010/LL/2.JPG",
        size: "S/M/L/XL/2XL",
        desc: "100% хлопок, 180 г. DTF-печать. Умеренный оверсайз. Срок изготовления — 3–7 дней.",
        stock: { S: 10, M: 5, L: 3, XL: 2, "2XL": 0 },
        emo: false
    },
    {
        id: 107,
        name: "Серьги Lego (Красный)",
        price: 555,
        category: ["accessories"],
        image: "2010/legosergiii/3.png",
        photos: ["2010/legosergiii/3.png", "2010/legosergiii/8.png"],
        modelImage: "2010/legosergiii/8.png",
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Lego. Гипоаллергенный бижутерный сплав. Отправка от 3–7 дней.",
        stock: { OS: 2 },
        emo: false
    },
    {
        id: 108,
        name: "Серьги Lego (Черный)",
        price: 555,
        category: ["accessories"],
        image: "2010/legosergiii/4.png",
        photos: ["2010/legosergiii/4.png", "2010/legosergiii/9.png"],
        modelImage: "2010/legosergiii/9.png",
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Lego. Гипоаллергенный бижутерный сплав. Отправка от 3–7 дней.",
        stock: { OS: 2 },
        emo: false
    },
    {
        id: 109,
        name: "Серьги Lego (Зеленый)",
        price: 555,
        category: ["accessories"],
        image: "2010/legosergiii/5.png",
        photos: ["2010/legosergiii/5.png", "2010/legosergiii/10.png"],
        modelImage: "2010/legosergiii/10.png",
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Lego. Гипоаллергенный бижутерный сплав. Отправка от 3–7 дней.",
        stock: { OS: 2 },
        emo: false
    },
    {
        id: 110,
        name: "Серьги Lego (Розовые)",
        price: 555,
        category: ["accessories"],
        image: "2010/legosergiii/2.png",
        photos: ["2010/legosergiii/2.png", "2010/legosergiii/7.png"],
        modelImage: "2010/legosergiii/7.png",
        size: "OS",
        desc: "Выполнено из оригинальных кнопок Lego. Гипоаллергенный бижутерный сплав. Отправка от 3–7 дней.",
        stock: { OS: 2 },
        emo: false
    }
];

// Делаем products доступным глобально для checkout.js
window.products = products;

// ==================== ЗАГРУЗКА ОБНОВЛЁННЫХ ОСТАТКОВ ====================
const savedProducts = localStorage.getItem("s-l-e-n-g-products");
if (savedProducts) {
    try {
        const saved = JSON.parse(savedProducts);
        saved.forEach(savedProduct => {
            const originalProduct = products.find(p => p.id === savedProduct.id);
            if (originalProduct && savedProduct.stock) {
                originalProduct.stock = savedProduct.stock;
            }
        });
    } catch(e) { 
        console.error("Ошибка загрузки остатков", e); 
    }
}

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

// ==================== ПЕРЕКЛЮЧЕНИЕ МОДЕЛИ / ТОВАРЫ ====================
let modelModeActive = false;
const modelSwitchBtn = document.getElementById('modelSwitchBtn');

// Функция обновления всех фото в каталоге
function updateAllProductImages() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card) => {
        const img = card.querySelector('.product-img img');
        if (img) {
            const productId = parseInt(card.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                if (modelModeActive && product.modelImage) {
                    img.src = product.modelImage;
                } else {
                    img.src = product.image;
                }
            }
        }
    });
}

// Обработчик кнопки переключения моделей
if (modelSwitchBtn) {
    modelSwitchBtn.addEventListener('click', () => {
        modelModeActive = !modelModeActive;
        
        if (modelModeActive) {
            modelSwitchBtn.classList.add('active');
            modelSwitchBtn.querySelector('.switch-text').innerHTML = 'ТОВАРЫ';
        } else {
            modelSwitchBtn.classList.remove('active');
            modelSwitchBtn.querySelector('.switch-text').innerHTML = 'МОДЕЛИ';
        }
        
        updateAllProductImages();
        localStorage.setItem('modelMode', modelModeActive);
    });
    
    // Восстанавливаем состояние при загрузке
    const savedModelMode = localStorage.getItem('modelMode') === 'true';
    if (savedModelMode) {
        modelModeActive = true;
        modelSwitchBtn.classList.add('active');
        modelSwitchBtn.querySelector('.switch-text').innerHTML = 'ТОВАРЫ';
    }
}

// ==================== КАТАЛОГ (С ПОДДЕРЖКОЙ МАССИВА КАТЕГОРИЙ И EMO-РЕЖИМА) ====================
function renderCatalog(category = "all") {
    const container = document.getElementById("catalog");
    if (!container) return;
    
    let filtered = products;
    
    // Проверяем, активен ли EMO-режим
    const isEmoMode = document.body.classList.contains('ugly-emo-mode');
    
    // Фильтр по категории
    if (category !== "all") {
        filtered = filtered.filter(product => {
            if (Array.isArray(product.category)) {
                return product.category.includes(category);
            }
            return product.category === category;
        });
    }
    
    // Фильтр по EMO-режиму (показываем только emo: true)
    if (isEmoMode) {
        filtered = filtered.filter(product => product.emo === true);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-products-message">
                <span>нет товаров</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(product => {
        const totalStock = Object.values(product.stock || {}).reduce((s, c) => s + c, 0);
        const priceHtml = totalStock <= 0 ? `<div class="product-price" style="color:#d00000;">Sold out</div>` : `<div class="product-price">${product.price} ₽</div>`;
        let imgSrc = product.image || "https://placehold.co/400x500/eeeeee/333333?text=No+Image";
        
        // Если включён режим моделей и есть фото модели
        if (modelModeActive && product.modelImage) {
            imgSrc = product.modelImage;
        }
        
        return `
            <div class="product-card" data-product-id="${product.id}" onclick="location.href='product.html?id=${product.id}'" style="cursor:pointer;">
                <div class="product-img"><img src="${imgSrc}" alt="${product.name}" onerror="this.src='https://placehold.co/400x500/eeeeee/333333?text=${encodeURIComponent(product.name)}'"></div>
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
    const aboutMenuBtn = document.getElementById("aboutMenuBtn");
    const archiveBtn = document.getElementById("archiveBtn");
    const collectionBtn = document.getElementById("collectionBtn");
    
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
    
    // Кнопка "Архив" — показывает уведомление
    if (archiveBtn) {
        archiveBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            alert("Скоро наверное");
            closeMenu();
        });
    }
    
    // Кнопка "S.L.E.N.G COLLECTION" — показывает уведомление
    if (collectionBtn) {
        collectionBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            alert("скоро наверное");
            closeMenu();
        });
    }
    
    // Кнопка "О нас" — ведёт на страницу about.html
    if (aboutMenuBtn) {
        aboutMenuBtn.addEventListener("click", () => {
            window.location.href = "about.html";
        });
    }
    
    // Обработка кнопок категорий (только с data-category)
    // Важно: коллекция и архив НЕ имеют data-category, поэтому они не попадут сюда
    document.querySelectorAll(".menu-list button[data-category]").forEach(btn => {
        btn.addEventListener("click", () => {
            // Не обрабатываем disabled кнопки
            if (btn.disabled) return;
            
            document.querySelectorAll(".menu-list button").forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
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
            <img class="cart-item-image" src="${item.image || 'https://placehold.co/70x70/eeeeee/333333?text=No+Image'}" alt="${item.name}">
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
        const newTrigger = socialTrigger.cloneNode(true);
        socialTrigger.parentNode.replaceChild(newTrigger, socialTrigger);
        
        newTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            socialMenu.classList.toggle('open');
        });
        
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

// ==================== UGLY EMO MODE COMPLETE ====================
const emoBtn = document.getElementById('emoModeBtn');
const uglyExitContainer = document.getElementById('uglyExitContainer');
let uglyModeActive = false;

function toggleUglyMode() {
    uglyModeActive = !uglyModeActive;
    
    if (uglyModeActive) {
        document.body.classList.add('ugly-emo-mode');
        if (emoBtn) emoBtn.classList.add('emo-active');
        
        // Меняем логотип
        const normalLogo = document.querySelector('.logo-normal');
        const emoLogo = document.querySelector('.logo-emo');
        if (normalLogo) normalLogo.style.display = 'none';
        if (emoLogo) emoLogo.style.display = 'block';
        
        // Показываем надпись выхода
        if (uglyExitContainer) uglyExitContainer.style.display = 'block';
        
        // Показываем всплывающее окно при первом включении
        if (!localStorage.getItem('popupShown')) {
            const popup = document.getElementById('uglyPopup');
            if (popup) popup.style.display = 'block';
            localStorage.setItem('popupShown', 'true');
        }
        
        // Перерисовываем каталог с учётом EMO-режима
        const currentCategory = document.querySelector('.menu-list button.active')?.dataset.category || 'all';
        renderCatalog(currentCategory);
        
        // Обновляем фото с учётом режима моделей после перерисовки
        setTimeout(() => {
            if (modelModeActive) updateAllProductImages();
        }, 50);
        
    } else {
        document.body.classList.remove('ugly-emo-mode');
        if (emoBtn) emoBtn.classList.remove('emo-active');
        
        // Возвращаем обычный логотип
        const normalLogo = document.querySelector('.logo-normal');
        const emoLogo = document.querySelector('.logo-emo');
        if (normalLogo) normalLogo.style.display = 'block';
        if (emoLogo) emoLogo.style.display = 'none';
        
        // Скрываем надпись выхода
        if (uglyExitContainer) uglyExitContainer.style.display = 'none';
        
        // Скрываем попап
        const popup = document.getElementById('uglyPopup');
        if (popup) popup.style.display = 'none';
        
        // Перерисовываем каталог в обычном режиме
        const currentCategory = document.querySelector('.menu-list button.active')?.dataset.category || 'all';
        renderCatalog(currentCategory);
        
        // Обновляем фото с учётом режима моделей после перерисовки
        setTimeout(() => {
            if (modelModeActive) updateAllProductImages();
        }, 50);
    }
    
    localStorage.setItem('uglyEmoMode', uglyModeActive);
}

// Обработчик для надписи выхода
const uglyExitText = document.getElementById('uglyExitText');
if (uglyExitText) {
    uglyExitText.addEventListener('click', function() {
        if (uglyModeActive) {
            toggleUglyMode();
        }
    });
}

// Закрытие попапа
const closePopup = document.getElementById('closePopup');
if (closePopup) {
    closePopup.addEventListener('click', () => {
        document.getElementById('uglyPopup').style.display = 'none';
    });
}

// Восстановление состояния при загрузке
if (emoBtn) {
    const savedMode = localStorage.getItem('uglyEmoMode') === 'true';
    if (savedMode) {
        uglyModeActive = true;
        document.body.classList.add('ugly-emo-mode');
        emoBtn.classList.add('emo-active');
        if (uglyExitContainer) uglyExitContainer.style.display = 'block';
        
        const normalLogo = document.querySelector('.logo-normal');
        const emoLogo = document.querySelector('.logo-emo');
        if (normalLogo) normalLogo.style.display = 'none';
        if (emoLogo) emoLogo.style.display = 'block';
    }
    emoBtn.addEventListener('click', toggleUglyMode);
}

// ==================== ЭМО-ГОРОСКОП ====================
const horoscopes = [
    { sign: "♈ ОВЕН", text: "ты сегодня будешь... повезло брух" },
    { sign: "♉ ТЕЛЕЦ", text: "тебе захочется съесть что-то сладкое... но ты понимаешь что ты жирный и ты будешь злиться на себя из за этого, но ты всё равно будешь жрать" },
    { sign: "♊ БЛИЗНЕЦЫ", text: "у тебя раздвоение личности... обе хотят в ум#####" },
    { sign: "♋ РАК", text: "ты будешь плакать... от счастья что ты new emo" },
    { sign: "♌ ЛЕВ", text: "ты DramaQueen... сегодня ты должен сделать каму то мозг и гордиться этим" },
    { sign: "♍ ДЕВА", text: "ты слишком идеальна для этого мира... уходи в закат" },
    { sign: "♎ ВЕСЫ", text: "не можешь выбрать между счастью и болью? Так уже сделала, разве нет?" },
    { sign: "♏ СКОРПИОН", text: "ты опасен... для себя. побереги вены" },
    { sign: "♐ СТРЕЛЕЦ", text: "больно" },
    { sign: "♑ КОЗЕРОГ", text: "ты упрямый как осёл... но ослы тоже грустные" },
    { sign: "♒ ВОДОЛЕЙ", text: "ты не такой как все... ты нисшевый хахаха мне грустно за тебя" },
    { sign: "♓ РЫБЫ", text: "сегодня ты утонешь в своей драме... не иди в ванну, не мойся больше" }
];

const zodiacSignEl = document.getElementById('zodiacSign');
const horoscopeTextEl = document.getElementById('horoscopeText');
const horoscopeBtn = document.getElementById('newHoroscope');

if (horoscopeBtn) {
    horoscopeBtn.addEventListener('click', function() {
        const random = Math.floor(Math.random() * horoscopes.length);
        const h = horoscopes[random];
        if (zodiacSignEl) zodiacSignEl.innerHTML = h.sign;
        if (horoscopeTextEl) horoscopeTextEl.innerHTML = h.text;
    });
}

// ==================== ЭМО-ТЕСТ ====================
const testQuestions = [
    {
        question: "что ты делаешь в 3 часа ночи?",
        options: [
            { text: "плачу под дождём... даже если дождя нет", points: 4 },
            { text: "слушаю deftones на повторе, я new emo понял да?", points: 8 },
            { text: "пишу реп", points: 0 },
            { text: "смотрю как хорошо было тогда с тобой. Я же правда тебя любил и хотел сделать лучшее для нас. Прости я был не прав но и ты пойми мои родители в разводе и я не видел как они люблят. Я вообще видимо не знаю какого ыть хорошим парнем бля тебя.", points: 7 },
            { text: "сосу", points: 3 }
        ]
    },
    {
        question: "твой любимый цвет?",
        options: [
            { text: "чёрный (он передаёт всю боль)", points: 6 },
            { text: "фиолетовый (потому что это мой любимый цвет)", points: 0 },
            { text: "красный (цвет моей крови)", points: 4 },
            { text: "розовый... но только с черепами", points: 4 },
            { text: "у меня нет друзей", points: 8 }
        ]
    },
    {
        question: "что ты носишь на руках?",
        options: [
            { text: "чёрные напульсники (чтобы скрыть... след от жырной которую я нёс вчера)", points: 10 },
            { text: "браслеты с шипами и черепами", points: 8 },
            { text: "резиночки для волос от бывшей", points: 6 },
            { text: "часы, чтобы знать когда плакать, хотя я так и так смотрю потом в телефон, потому что я не понимаю наручные часы", points: 6 },
            { text: "свою любимую девушку", points: 0 }
        ]
    },
    {
        question: "твоя любимая музыка?",
        options: [
            { text: "Бро ну понял иногда могу и ог буду послушать, ну елси прям ваще грустно маётика. Если поплакать очень очень то токсиса, всё по разному ваще", points: 6 },
            { text: "любой панк/рок/метал", points: 3 },
            { text: "грустный русский рэп типо такой да шаришь грустный короче", points: 5 },
            { text: "хз что, но знай что она меня бросила..", points: 6 },
            { text: "я слушаю только говно", points: 10 }
        ]
    },
    {
        question: "что ты делаешь в свободное время?",
        options: [
            { text: "сижу в углу и грущу по бывшей", points: 5 },
            { text: "Скучаю по бывшей", points: 3 },
            { text: "ищу смысл жизни (и нахожу в бывшей)", points: 10 },
            { text: "играю в комп, а мог бы быть с бышей", points: 3 },
            { text: "гуляю с друзьями а не с бывшей", points: 3 }
        ]
    }
];

let currentQuestion = 0;
let totalPoints = 0;

function loadQuestion() {
    if (currentQuestion >= testQuestions.length) {
        showResult();
        return;
    }
    
    const q = testQuestions[currentQuestion];
    const questionEl = document.getElementById('testQuestion');
    if (questionEl) questionEl.innerHTML = q.question;
    
    const optionsHtml = q.options.map((opt, index) => 
        `<button class="test-option" data-points="${opt.points}" data-index="${index}">${opt.text}</button>`
    ).join('');
    
    const optionsContainer = document.getElementById('testOptions');
    if (optionsContainer) optionsContainer.innerHTML = optionsHtml;
    
    const resultEl = document.getElementById('testResult');
    if (resultEl) resultEl.innerHTML = '';
    
    const resetContainer = document.getElementById('testReset');
    if (resetContainer) resetContainer.style.display = 'none';
    
    document.querySelectorAll('.test-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const points = parseInt(e.target.dataset.points);
            totalPoints += points;
            currentQuestion++;
            loadQuestion();
        });
    });
}

function showResult() {
    let resultText = '';
    let resultEmoji = '';
    
    if (totalPoints >= 40) {
        resultText = "ТЫ 100% ЭМО! 🖤 Твоя душа разбита на миллион осколков... Береги себя, тёмный принц!";
        resultEmoji = "🖤💀🖤";
    } else if (totalPoints >= 30) {
        resultText = "ТЫ ПОЧТИ ЭМО! Осталось только купить чёрные напульсники и начать плакать под дождём! xD";
        resultEmoji = "💀🖤";
    } else if (totalPoints >= 20) {
        resultText = "ТЫ НА ПОЛПУТИ! Твоя депрессия ещё не до конца сформировалась... Работай над собой!";
        resultEmoji = "🖤";
    } else if (totalPoints >= 10) {
        resultText = "ТЫ СЛАБАК, СОРРИ. Приходи, когда порежешься об острые углы своего существования...";
        resultEmoji = "😒";
    } else {
        resultText = "ТЫ НЕ ЭМО... Даже не пытайся! Иди радуйся солнышку, пока оно не зашло за горизонт твоей никчëмной жизни!";
        resultEmoji = "⭐";
    }
    
    const optionsContainer = document.getElementById('testOptions');
    if (optionsContainer) optionsContainer.innerHTML = '';
    
    const questionEl = document.getElementById('testQuestion');
    if (questionEl) questionEl.innerHTML = '🖤 РЕЗУЛЬТАТ 🖤';
    
    const resultEl = document.getElementById('testResult');
    if (resultEl) resultEl.innerHTML = `${resultEmoji} ${resultText} ${resultEmoji}<br><br>⭐ баллов: ${totalPoints} из 50 ⭐`;
    
    const resetContainer = document.getElementById('testReset');
    if (resetContainer) resetContainer.style.display = 'block';
}

const resetBtn = document.getElementById('testReset');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        currentQuestion = 0;
        totalPoints = 0;
        loadQuestion();
    });
}

// Запуск теста при загрузке страницы
if (document.querySelector('.ugly-test')) {
    loadQuestion();
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
    
    // Восстанавливаем режим моделей после загрузки
    if (modelModeActive) {
        setTimeout(updateAllProductImages, 100);
    }
});