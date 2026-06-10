const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));

let product = null;
let selectedSize = "M";
let photos = [];
let currentPhotoIndex = 0;
let lightboxActive = false;
let currentLightboxIndex = 0;

function initProductPage() {
    product = products.find(p => p.id === productId);

    if (product) {
        document.title = product.name + " — S.L.E.N.G";
    } else {
        document.title = "Товар не найден | S.L.E.N.G";
    }

    if (!product) {
        document.getElementById("productContainer").innerHTML = `
            <h2>Товар не найден</h2>
            <a href="index.html">Вернуться</a>
        `;
        console.error("Ошибка: Товар с ID", productId, "не найден!");
        return;
    }

    document.getElementById("productTitle").innerText = product.name;
    document.getElementById("productImg").src = product.image;
    document.getElementById("productImg").alt = product.name;

    const priceElement = document.getElementById("productPrice");
    const addToCartBtn = document.getElementById("addToCartBtn");

    let totalStock = 0;
    if (product.stock) {
        totalStock = Object.values(product.stock).reduce((sum, count) => sum + count, 0);
    }

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

    const featuresContainer = document.getElementById("productFeatures");
    if (featuresContainer && product.desc) {
        const descLines = product.desc.split(".");
        featuresContainer.innerHTML = descLines
            .filter(line => line.trim())
            .map(line => `<li>${line.trim()}.</li>`)
            .join("");
    }

    const sizeBtns = document.querySelectorAll(".size-btn");
    const sizeSelector = document.querySelector(".size-selector");
    const sizeInfo = document.getElementById("productSizeInfo");
    const hasSizes = product.size && product.size !== "OS";

    if (!hasSizes) {
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

        let firstAvailableSize = null;
        for (const btn of sizeBtns) {
            if (!btn.disabled) {
                firstAvailableSize = btn.dataset.size;
                break;
            }
        }

        if (firstAvailableSize) {
            selectedSize = firstAvailableSize;
            const defaultBtn = document.querySelector(`.size-btn[data-size="${firstAvailableSize}"]`);
            if (defaultBtn) defaultBtn.classList.add("active");
        }

        sizeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                if (btn.disabled) return;
                sizeBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectedSize = btn.dataset.size;
            });
        });
    }

    if (addToCartBtn && !addToCartBtn.disabled) {
        addToCartBtn.addEventListener("click", () => {
            if (addToCartBtn.disabled) return;
            const stockCount = product.stock?.[selectedSize] || 0;
            if (stockCount === 0) {
                alert(`Извините, размер ${selectedSize} закончился`);
                return;
            }
            addToCart(product.id, selectedSize);
        });
    }

    initProductGallery();
    initLightbox();
    initMainImageClick();
}

function initProductGallery() {
    photos = product.photos
        ? product.photos
        : product.фото
            ? product.фото
            : [product.image].filter(Boolean);

    currentPhotoIndex = 0;

    window.photos = photos;
    window.currentPhotoIndex = currentPhotoIndex;
    window.updatePhoto = updatePhoto;
    window.prevPhoto = prevPhoto;
    window.nextPhoto = nextPhoto;

    createThumbnails();
    initMobileGallery();

    const mainImage = document.getElementById("productMainImage");
    if (mainImage) {
        mainImage.addEventListener("touchstart", (e) => {
            mainImage._touchStartX = e.changedTouches[0].screenX;
        });
        mainImage.addEventListener("touchend", (e) => {
            const diff = mainImage._touchStartX - e.changedTouches[0].screenX;
            if (diff > 50) nextPhoto();
            if (diff < -50) prevPhoto();
        });
    }
}

function updatePhoto() {
    const productImg = document.getElementById("productImg");
    if (!productImg || !photos[currentPhotoIndex]) return;
    productImg.src = photos[currentPhotoIndex];
    document.querySelectorAll(".product-thumbnail").forEach((thumb, index) => {
        thumb.classList.toggle("active", index === currentPhotoIndex);
    });
    updateMobileDots();
}

function createThumbnails() {
    const thumbnailsContainer = document.getElementById("productThumbnails");
    if (!thumbnailsContainer || photos.length <= 1) return;

    thumbnailsContainer.innerHTML = "";
    photos.forEach((photo, index) => {
        const img = document.createElement("img");
        img.src = photo;
        img.className = "product-thumbnail";
        img.alt = `Фото ${index + 1}`;
        img.addEventListener("click", (e) => {
            e.stopPropagation();
            currentPhotoIndex = index;
            updatePhoto();
        });
        thumbnailsContainer.appendChild(img);
    });
    updatePhoto();
}

function nextPhoto() {
    if (currentPhotoIndex < photos.length - 1) {
        currentPhotoIndex++;
        updatePhoto();
    }
}

function prevPhoto() {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updatePhoto();
    }
}

function updateMobileDots() {
    document.querySelectorAll(".mobile-gallery-dot").forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentPhotoIndex);
    });
}

function createMobileDots() {
    const dotsContainer = document.getElementById("mobileGalleryDots");
    if (!dotsContainer || photos.length <= 1) {
        const controls = document.getElementById("mobileGalleryControls");
        if (controls) controls.style.display = "none";
        return;
    }

    dotsContainer.innerHTML = "";
    for (let i = 0; i < photos.length; i++) {
        const dot = document.createElement("span");
        dot.className = "mobile-gallery-dot";
        if (i === currentPhotoIndex) dot.classList.add("active");
        dot.addEventListener("click", (e) => {
            e.stopPropagation();
            currentPhotoIndex = i;
            updatePhoto();
        });
        dotsContainer.appendChild(dot);
    }
}

function initMobileGallery() {
    const prevBtn = document.getElementById("mobilePrevBtn");
    const nextBtn = document.getElementById("mobileNextBtn");

    if (prevBtn) {
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        newPrev.addEventListener("click", (e) => {
            e.preventDefault();
            prevPhoto();
        });
    }

    if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        newNext.addEventListener("click", (e) => {
            e.preventDefault();
            nextPhoto();
        });
    }

    createMobileDots();
}

// ==================== LIGHTBOX (ФОТО НА ВЕСЬ ЭКРАН) ====================

function openLightbox(index) {
    if (!photos || photos.length === 0) return;
    
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    
    if (lightboxImg) {
        lightboxImg.src = photos[currentLightboxIndex];
    }
    
    if (counter && photos.length > 1) {
        counter.textContent = `${currentLightboxIndex + 1} / ${photos.length}`;
    } else if (counter) {
        counter.textContent = '';
    }
    
    if (lightbox) {
        lightbox.classList.add('active');
        lightboxActive = true;
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        lightboxActive = false;
        document.body.style.overflow = '';
    }
}

function prevLightbox() {
    if (photos.length === 0) return;
    currentLightboxIndex--;
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = photos.length - 1;
    }
    
    const lightboxImg = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    
    if (lightboxImg) {
        lightboxImg.src = photos[currentLightboxIndex];
    }
    
    if (counter && photos.length > 1) {
        counter.textContent = `${currentLightboxIndex + 1} / ${photos.length}`;
    }
}

function nextLightbox() {
    if (photos.length === 0) return;
    currentLightboxIndex++;
    if (currentLightboxIndex >= photos.length) {
        currentLightboxIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    
    if (lightboxImg) {
        lightboxImg.src = photos[currentLightboxIndex];
    }
    
    if (counter && photos.length > 1) {
        counter.textContent = `${currentLightboxIndex + 1} / ${photos.length}`;
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevLightbox();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextLightbox();
        });
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Обработка клавиш
    document.addEventListener('keydown', (e) => {
        if (!lightboxActive) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevLightbox();
        } else if (e.key === 'ArrowRight') {
            nextLightbox();
        }
    });
}

function initMainImageClick() {
    const productImg = document.getElementById("productImg");
    if (productImg) {
        // Удаляем старый обработчик, если есть, и добавляем новый
        const newImg = productImg.cloneNode(true);
        productImg.parentNode.replaceChild(newImg, productImg);
        
        newImg.addEventListener('click', (e) => {
            e.stopPropagation();
            if (photos.length > 0) {
                openLightbox(currentPhotoIndex);
            }
        });
    }
}

document.getElementById("backToCatalogBtn")?.addEventListener("click", () => {
    window.location.href = "index.html";
});

// Делаем функции глобальными для доступа из консоли (опционально)
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.prevLightbox = prevLightbox;
window.nextLightbox = nextLightbox;

document.addEventListener("DOMContentLoaded", async () => {
    if (typeof slengLoadProducts === "function") {
        await slengLoadProducts();
    }
    initProductPage();
});