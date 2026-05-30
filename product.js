// ==================== ПОЛУЧАЕМ ID ТОВАРА ИЗ URL ====================
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));

// ==================== НАХОДИМ ТОВАР ====================
const product = products.find(p => p.id === productId);

let selectedSize = "M";

// ==================== УСТАНАВЛИВАЕМ УНИКАЛЬНЫЙ TITLE ====================
if (product) {
    document.title = product.name + " — S.L.E.N.G";
} else {
    document.title = "Товар не найден | S.L.E.N.G";
}

// ==================== ЗАПОЛНЯЕМ КАРТОЧКУ ====================
if (product) {
    document.getElementById("productTitle").innerText = product.name;
    document.getElementById("productImg").src = product.image;
    document.getElementById("productImg").alt = product.name;

    const priceElement = document.getElementById("productPrice");
    const addToCartBtn = document.getElementById("addToCartBtn");

    // Подсчитываем общее количество товара на складе
    let totalStock = 0;
    if (product.stock) {
        totalStock = Object.values(product.stock).reduce((sum, count) => sum + count, 0);
    }
    
    console.log("Total stock:", totalStock, product.stock); // Для отладки

    // Если товара нет в наличии
    if (totalStock <= 0) {
        priceElement.innerHTML = `
            <span style="
                color: #d00000;
                font-family: 'Helvetica';
                font-size: 30px;
                font-weight: 500;
                letter-spacing: -0.6px;
                text-transform: uppercase;
            ">Sold out</span>
        `;
        addToCartBtn.disabled = true;
        addToCartBtn.innerText = "¯_(ツ)_/¯";
        addToCartBtn.classList.add("sold-out-btn");
    } else {
        priceElement.innerText = product.price + " ₽";
    }

    // ==================== ОПИСАНИЕ ====================
    const featuresContainer = document.getElementById("productFeatures");
    if (featuresContainer && product.desc) {
        const descLines = product.desc.split(".");
        featuresContainer.innerHTML = descLines
            .filter(line => line.trim())
            .map(line => `<li>${line.trim()}.</li>`)
            .join("");
    }

    // ==================== РАЗМЕРЫ ====================
    const sizeBtns = document.querySelectorAll(".size-btn");
    const sizeSelector = document.querySelector(".size-selector");
    const sizeInfo = document.getElementById("productSizeInfo");

    // Проверяем, есть ли размеры (не OS)
    const hasSizes = product.size && product.size !== "OS";
    
    if (!hasSizes) {
        // Товар с одним размером (OS)
        if (sizeSelector) sizeSelector.style.display = "none";
        selectedSize = "OS";

        if (sizeInfo) {
            sizeInfo.innerText = "Один размер (OS)";
            sizeInfo.style.display = "block";
        }
    } else if (sizeBtns.length > 0) {
        if (sizeSelector) sizeSelector.style.display = "flex";
        if (sizeInfo) sizeInfo.style.display = "none";

        sizeBtns.forEach(btn => {
            const size = btn.dataset.size;
            const stockCount = product.stock?.[size] || 0;

            if (stockCount === 0) {
                btn.classList.add("out-of-stock");
                btn.disabled = true;
            } else {
                btn.classList.remove("out-of-stock");
                btn.disabled = false;
            }
        });

        // Выбираем первый доступный размер
        let firstAvailableSize = null;

        for (let btn of sizeBtns) {
            if (!btn.disabled) {
                firstAvailableSize = btn.dataset.size;
                break;
            }
        }

        if (firstAvailableSize) {
            selectedSize = firstAvailableSize;

            const defaultBtn = document.querySelector(
                `.size-btn[data-size="${firstAvailableSize}"]`
            );

            if (defaultBtn) {
                defaultBtn.classList.add("active");
            }
        }
        
        // Обработчики выбора размеров
        sizeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                if (btn.disabled) return;

                sizeBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectedSize = btn.dataset.size;
            });
        });
    }

} else {
    document.getElementById("productContainer").innerHTML = `
        <h2>Товар не найден</h2>
        <a href="index.html">Вернуться</a>
    `;
    console.error("Ошибка: Товар с ID", productId, "не найден!");
}

// ==================== КНОПКА ДОБАВЛЕНИЯ В КОРЗИНУ ====================
const addToCartBtn = document.getElementById("addToCartBtn");

if (addToCartBtn && !addToCartBtn.disabled) {
    addToCartBtn.addEventListener("click", () => {
        if (addToCartBtn.disabled) return;

        if (product) {
            const stockCount = product.stock?.[selectedSize] || 0;

            if (stockCount === 0) {
                alert(`Извините, размер ${selectedSize} закончился`);
                return;
            }

            addToCart(product.id, selectedSize);
        }
    });
}

// ==================== ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ ====================
// Поддержка обоих вариантов: photos и фото
const photos = (product && product.photos) 
    ? product.photos 
    : (product && product.фото) 
        ? product.фото 
        : [product?.image].filter(Boolean);

let currentPhotoIndex = 0;

// Элементы
const productImg = document.getElementById("productImg");
const thumbnailsContainer = document.getElementById("productThumbnails");
const mainImage = document.getElementById("productMainImage");

// Обновление основного изображения
function updatePhoto() {
    if (!productImg || !photos[currentPhotoIndex]) return;
    productImg.src = photos[currentPhotoIndex];

    // Обновляем активную миниатюру (для десктопа)
    document.querySelectorAll(".product-thumbnail").forEach((thumb, index) => {
        thumb.classList.toggle("active", index === currentPhotoIndex);
    });
    
    // Обновляем мобильные точки
    updateMobileDots();
}

// Создание миниатюр для десктопа
function createThumbnails() {
    if (!thumbnailsContainer || photos.length <= 1) return;

    thumbnailsContainer.innerHTML = "";

    photos.forEach((photo, index) => {
        const img = document.createElement("img");
        img.src = photo;
        img.className = "product-thumbnail";
        img.alt = `Фото ${index + 1}`;

        img.addEventListener("click", () => {
            currentPhotoIndex = index;
            updatePhoto();
        });

        thumbnailsContainer.appendChild(img);
    });

    updatePhoto();
}

// Следующее фото
function nextPhoto() {
    if (currentPhotoIndex < photos.length - 1) {
        currentPhotoIndex++;
        updatePhoto();
    }
}

// Предыдущее фото
function prevPhoto() {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updatePhoto();
    }
}

// ==================== МОБИЛЬНАЯ НАВИГАЦИЯ (ТОЧКИ И СТРЕЛКИ) ====================
function updateMobileDots() {
    const dots = document.querySelectorAll('.mobile-gallery-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentPhotoIndex);
    });
}

function createMobileDots() {
    const dotsContainer = document.getElementById('mobileGalleryDots');
    if (!dotsContainer || photos.length <= 1) {
        const controls = document.getElementById('mobileGalleryControls');
        if (controls) controls.style.display = 'none';
        return;
    }
    
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < photos.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'mobile-gallery-dot';
        if (i === currentPhotoIndex) dot.classList.add('active');
        
        dot.addEventListener('click', (function(index) {
            return function() {
                currentPhotoIndex = index;
                updatePhoto();
            };
        })(i));
        
        dotsContainer.appendChild(dot);
    }
}

function initMobileGallery() {
    const prevBtn = document.getElementById('mobilePrevBtn');
    const nextBtn = document.getElementById('mobileNextBtn');
    
    if (prevBtn) {
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        newPrev.addEventListener('click', (e) => {
            e.preventDefault();
            prevPhoto();
        });
    }
    
    if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        newNext.addEventListener('click', (e) => {
            e.preventDefault();
            nextPhoto();
        });
    }
    
    createMobileDots();
}

// ==================== СВАЙП НА МОБИЛЬНЫХ ====================
let touchStartX = 0;
let touchEndX = 0;

if (mainImage) {
    mainImage.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    mainImage.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (diff > 50) nextPhoto();
        if (diff < -50) prevPhoto();
    });
}

// ==================== КНОПКА "НАЗАД" ====================
const backBtn = document.getElementById('backToCatalogBtn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Делаем переменные и функции глобальными для внешних скриптов
window.photos = photos;
window.currentPhotoIndex = currentPhotoIndex;
window.updatePhoto = updatePhoto;
window.prevPhoto = prevPhoto;
window.nextPhoto = nextPhoto;

// Инициализация
createThumbnails();
initMobileGallery();
