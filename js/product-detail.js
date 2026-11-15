document.addEventListener("DOMContentLoaded", () => {
  const store = window.PawixStore;
  if (!store) throw new Error("Shared PAWIX product data is unavailable.");

  const formatPrice = (price) => new Intl.NumberFormat("fa-IR").format(price);
  const queryProductId = Number(new URLSearchParams(window.location.search).get("product")) || 2;
  const product = store.getProduct(queryProductId) || store.getProduct(2);
  const toast = document.querySelector("[data-toast]");
  const mainImage = document.querySelector("[data-main-image]");
  const thumbnails = document.querySelector("[data-product-thumbnails]");
  const variantOptions = document.querySelector("[data-variant-options]");
  const quantityOutput = document.querySelector("[data-quantity]");
  const originalPrice = document.querySelector("[data-original-price]");
  const discountBadge = document.querySelector("[data-discount]");
  const addButton = document.querySelector("[data-add-cart]");
  let quantity = 1;
  let toastTimer;
  let selectedVariant = product.variants[0];

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  };

  const updatePrice = (variant) => {
    selectedVariant = variant;
    document.querySelector("[data-current-price]").textContent = formatPrice(variant.price);
    if (variant.originalPrice && variant.originalPrice > variant.price) {
      const discount = Math.round((1 - variant.price / variant.originalPrice) * 100);
      originalPrice.textContent = `${formatPrice(variant.originalPrice)} تومان`;
      originalPrice.hidden = false;
      discountBadge.textContent = `${formatPrice(discount)}٪ تخفیف`;
      discountBadge.hidden = false;
      document.querySelector("[data-sale-badge]").textContent = `${formatPrice(discount)}٪ تخفیف`;
      document.querySelector("[data-sale-badge]").hidden = false;
    } else {
      originalPrice.hidden = true;
      discountBadge.hidden = true;
      document.querySelector("[data-sale-badge]").hidden = true;
    }
    document.querySelector("[data-spec-size]").textContent = variant.label;
  };

  const setWishlistState = (selected) => {
    const buttons = [
      document.querySelector("[data-wishlist]"),
      document.querySelector("[data-wishlist-secondary]")
    ];
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute(
        "aria-label",
        `${selected ? "حذف" : "افزودن"} ${product.name} ${selected ? "از" : "به"} علاقه‌مندی‌ها`
      );
    });
  };

  document.title = `${product.name} | PAWIX`;
  document.querySelector("[data-product-brand]").textContent = product.brand;
  document.querySelector("[data-product-name]").textContent = product.name;
  document.querySelector("[data-breadcrumb-product]").textContent = product.name;
  document.querySelector("[data-product-description]").textContent = product.description;
  document.querySelector("[data-product-rating]").textContent = formatPrice(product.rating);
  document.querySelector("[data-review-count]").textContent = formatPrice(product.reviews);
  document.querySelector(".product-review-line .product-rating").setAttribute(
    "aria-label",
    `امتیاز ${formatPrice(product.rating)} از ۵`
  );
  document.querySelector("[data-product-sku]").textContent = product.sku;
  document.querySelector("[data-spec-brand]").textContent = product.brand;
  document.querySelector("[data-spec-pet]").textContent = product.suitableFor;
  document.querySelector("[data-spec-category]").textContent = product.category;
  document.querySelector("[data-spec-sku]").textContent = product.sku;
  document.querySelector("[data-variant-label]").textContent = `${product.variantLabel}:`;
  const gallery = product.gallery || [{ image: product.image, alt: product.alt }];
  thumbnails.replaceChildren();
  gallery.forEach((image, index) => {
    const thumbnail = document.createElement("button");
    thumbnail.type = "button";
    thumbnail.className = `product-thumbnail${index === 0 ? " is-active" : ""}`;
    thumbnail.setAttribute("aria-label", `نمایش تصویر ${formatPrice(index + 1)}`);
    thumbnail.setAttribute("aria-pressed", String(index === 0));
    thumbnail.dataset.thumbnail = "";
    thumbnail.dataset.image = image.image;
    thumbnail.dataset.alt = image.alt;
    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = image.image;
    thumbnailImage.alt = "";
    thumbnailImage.loading = "lazy";
    thumbnail.append(thumbnailImage);
    thumbnails.append(thumbnail);
  });
  mainImage.src = gallery[0].image;
  mainImage.alt = gallery[0].alt;
  document.querySelector("[data-product-stock]").textContent = product.available ? "موجود در انبار" : "ناموجود";
  addButton.disabled = !product.available;

  document.querySelector("[data-long-description]").textContent = product.description;
  variantOptions.replaceChildren();
  product.variants.forEach((variant, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `variant-option${index === 0 ? " is-selected" : ""}`;
    button.setAttribute("aria-pressed", String(index === 0));
    button.dataset.variant = "";
    button.textContent = variant.label;
    button.addEventListener("click", () => {
      variantOptions.querySelectorAll("[data-variant]").forEach((option) => {
        option.classList.remove("is-selected");
        option.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");
      updatePrice(variant);
    });
    variantOptions.append(button);
  });
  updatePrice(selectedVariant);

  document.querySelectorAll("[data-thumbnail]").forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      mainImage.src = thumbnail.dataset.image;
      mainImage.alt = thumbnail.dataset.alt;
      document.querySelectorAll("[data-thumbnail]").forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      thumbnail.classList.add("is-active");
      thumbnail.setAttribute("aria-pressed", "true");
    });
  });

  document.querySelector("[data-quantity-increase]").addEventListener("click", () => {
    quantity += 1;
    quantityOutput.textContent = formatPrice(quantity);
  });
  document.querySelector("[data-quantity-decrease]").addEventListener("click", () => {
    if (quantity > 1) {
      quantity -= 1;
      quantityOutput.textContent = formatPrice(quantity);
    }
  });
  document.querySelector("[data-wishlist]").addEventListener("click", () => {
    const selected = document.querySelector("[data-wishlist]").getAttribute("aria-pressed") !== "true";
    setWishlistState(selected);
    showToast("علاقه‌مندی‌ها فقط برای پیش‌نمایش همین صفحه هستند.");
  });
  document.querySelector("[data-wishlist-secondary]").addEventListener("click", () => {
    const selected = document.querySelector("[data-wishlist-secondary]").getAttribute("aria-pressed") !== "true";
    setWishlistState(selected);
    showToast("علاقه‌مندی‌ها فقط برای پیش‌نمایش همین صفحه هستند.");
  });
  addButton.addEventListener("click", () => {
    try {
      store.add(product.id, quantity, selectedVariant.id);
      showToast(`${formatPrice(quantity)} عدد از «${product.name}» به سبد آزمایشی اضافه شد.`);
    } catch (error) {
      showToast(error.message);
    }
  });

  document.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-tab]").forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      document.querySelectorAll("[data-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      });
    });
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const tabs = [...document.querySelectorAll("[data-tab]")];
      const currentIndex = tabs.indexOf(tab);
      const direction = event.key === "ArrowLeft" ? 1 : -1;
      const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];
      nextTab.focus();
      nextTab.click();
    });
  });

  const relatedContainer = document.querySelector("[data-related-products]");
  store.products.filter((item) => item.id !== product.id && item.available).slice(0, 4).forEach((item) => {
    const discount = item.originalPrice
      ? Math.round((1 - item.price / item.originalPrice) * 100)
      : 0;
    const card = document.createElement("article");
    card.className = "shop-product-card";
    card.innerHTML = `
      <a class="shop-product-image related-product-link" href="product-detail.html?product=${item.id}" aria-label="مشاهده ${item.name}">
        <img src="${item.image}" alt="${item.alt}" loading="lazy" />
        ${discount ? `<span class="sale-badge">${formatPrice(discount)}٪ تخفیف</span>` : ""}
      </a>
      <div class="shop-product-info">
        <span class="shop-product-brand">${item.brand}</span>
        <h3><a class="related-product-name" href="product-detail.html?product=${item.id}">${item.name}</a></h3>
        <div class="product-rating" aria-label="امتیاز ${formatPrice(item.rating)} از ۵">
          <span class="stars" aria-hidden="true">★★★★★</span>
          <span>${formatPrice(item.rating)} (${formatPrice(item.reviews)} نظر)</span>
        </div>
        <div class="product-prices">
          <span class="current-price">${formatPrice(item.price)} تومان</span>
          ${item.originalPrice ? `<span class="original-price">${formatPrice(item.originalPrice)} تومان</span>` : ""}
        </div>
        <div class="shop-card-actions">
          <span class="stock-status">موجود</span>
          <button type="button" class="add-cart-button" data-related-add="${item.id}">
            افزودن به سبد
          </button>
        </div>
      </div>`;
    card.querySelector("[data-related-add]").addEventListener("click", () => {
      try {
        store.add(item.id);
        showToast(`${item.name} به سبد آزمایشی اضافه شد.`);
      } catch (error) {
        showToast(error.message);
      }
    });
    relatedContainer.append(card);
  });

  document.querySelector("[data-review-link]").addEventListener("click", () => {
    document.querySelector('[data-tab="reviews"]').click();
  });
});
