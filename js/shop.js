document.addEventListener("DOMContentLoaded", () => {
  const store = window.PawixStore;
  const grid = document.querySelector("[data-product-grid]");
  const filterForm = document.querySelector(".filter-sidebar");
  if (!store || !grid || !filterForm) return;

  const pageSize = 8;
  const resultCount = document.querySelector("[data-result-count]");
  const pagination = document.querySelector("[data-pagination]");
  const emptyState = document.querySelector("[data-empty-state]");
  const sortSelect = document.querySelector("[data-sort]");
  const toast = document.querySelector("[data-toast]");
  const filterToggle = document.querySelector("[data-filter-toggle]");
  const searchInput = document.querySelector("[data-shop-search]");
  const newsletter = document.querySelector("[data-newsletter]");
  const newsletterMessage = document.querySelector("[data-newsletter-message]");
  let currentPage = 1;
  let toastTimer;
  let searchQuery = new URLSearchParams(window.location.search).get("search") || "";
  if (searchInput) searchInput.value = searchQuery;

  const formatPrice = (price) => new Intl.NumberFormat("fa-IR").format(price);
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  };
  const checkedValues = (name) =>
    [...filterForm.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);

  const getFilteredProducts = () => {
    const categories = checkedValues("category");
    const pets = checkedValues("pet");
    const brands = checkedValues("brand");
    const onlyAvailable = filterForm.querySelector('[name="available"]:checked');
    const discountedOnly = filterForm.querySelector('[name="discount"]:checked');
    const minInput = filterForm.querySelector("[data-min-price]");
    const maxInput = filterForm.querySelector("[data-max-price]");
    const minValue = Number(minInput.value);
    const maxValue = Number(maxInput.value);

    const searchMatches = searchQuery ? new Set(store.searchProducts(searchQuery).map((product) => product.id)) : null;
    const filtered = store.products.filter((product) => {
      const brandKey = ["Royal Canin", "Whiskas", "Pedigree", "Purina"].includes(product.brand)
        ? product.brand
        : "other";
      return (
        (!searchMatches || searchMatches.has(product.id)) &&
        (!categories.length || categories.includes(product.category)) &&
        (!pets.length || pets.includes(product.pet)) &&
        (!brands.length || brands.includes(brandKey)) &&
        (!onlyAvailable || product.available) &&
        (!discountedOnly || (product.originalPrice && product.originalPrice > product.price)) &&
        (minInput.value === "" || product.price >= minValue) &&
        (maxInput.value === "" || product.price <= maxValue)
      );
    });

    switch (sortSelect.value) {
      case "popular":
        filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case "newest":
        filtered.sort((a, b) => b.created - a.created);
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        filtered.sort((a, b) =>
          (b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0) -
          (a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0)
        );
        break;
      default:
        filtered.sort((a, b) => a.id - b.id);
    }
    return filtered;
  };

  const createProductCard = (product) => {
    const discount = product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;
    const article = document.createElement("article");
    article.className = "shop-product-card";
    article.innerHTML = `
      <div class="shop-product-image">
        <img src="${product.image}" alt="${product.alt}" loading="lazy" />
        ${discount ? `<span class="sale-badge">${formatPrice(discount)}٪ تخفیف</span>` : ""}
        <button type="button" class="wishlist-button" aria-label="افزودن ${product.name} به علاقه‌مندی‌ها" aria-pressed="false" data-wishlist>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path></svg>
        </button>
      </div>
      <div class="shop-product-info">
        <span class="shop-product-brand">${product.brand}</span>
        <h3><a href="product-detail.html?product=${product.id}">${product.name}</a></h3>
        <div class="product-rating" aria-label="امتیاز ${product.rating} از ۵">
          <span class="stars" aria-hidden="true">★★★★★</span>
          <span>${product.rating} (${formatPrice(product.reviews)} نظر)</span>
        </div>
        <div class="product-prices">
          <span class="current-price">${formatPrice(product.price)} تومان</span>
          ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)} تومان</span>` : ""}
        </div>
        <div class="shop-card-actions">
          <span class="stock-status ${product.available ? "" : "is-out"}">${product.available ? "موجود" : "ناموجود"}</span>
          <button type="button" class="add-cart-button" data-add-cart ${product.available ? "" : "disabled"}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="19" r="1.7"></circle><circle cx="18" cy="19" r="1.7"></circle><path d="M3 4h2l2.4 9.5a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L19 7H7"></path></svg>
            افزودن
          </button>
        </div>
      </div>`;
    article.querySelector("[data-add-cart]").addEventListener("click", () => {
      try {
        store.add(product.id);
        showToast(`${product.name} به سبد خرید آزمایشی اضافه شد.`);
      } catch (error) {
        showToast(error.message);
      }
    });
    article.querySelector("[data-wishlist]").addEventListener("click", (event) => {
      const button = event.currentTarget;
      const selected = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute("aria-label", `${selected ? "حذف" : "افزودن"} ${product.name} ${selected ? "از" : "به"} علاقه‌مندی‌ها`);
      showToast(selected ? "این حالت فقط برای پیش‌نمایش همین صفحه است." : "حالت علاقه‌مندی برداشته شد.");
    });
    return article;
  };

  const renderPagination = (totalPages) => {
    pagination.replaceChildren();
    if (totalPages <= 1) return;
    const makeButton = (label, page, disabled = false, current = false) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "page-button";
      button.textContent = label;
      button.disabled = disabled;
      if (current) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        currentPage = page;
        render();
        document.querySelector(".shop-results").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return button;
    };
    pagination.append(makeButton("قبلی", currentPage - 1, currentPage === 1));
    for (let page = 1; page <= totalPages; page += 1) {
      pagination.append(makeButton(formatPrice(page), page, false, page === currentPage));
    }
    pagination.append(makeButton("بعدی", currentPage + 1, currentPage === totalPages));
  };

  const render = () => {
    const products = getFilteredProducts();
    const totalPages = Math.ceil(products.length / pageSize);
    currentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
    resultCount.textContent = formatPrice(products.length);
    grid.replaceChildren();
    const start = (currentPage - 1) * pageSize;
    products.slice(start, start + pageSize).forEach((product) => grid.append(createProductCard(product)));
    emptyState.hidden = products.length > 0;
    if (!products.length && searchQuery) {
      const title = document.createElement("strong");
      title.textContent = "محصولی با این مشخصات پیدا نکردیم.";
      const suggestion = document.createElement("span");
      suggestion.textContent = "عبارت دیگری رو امتحان کن.";
      emptyState.replaceChildren(title, document.createElement("br"), suggestion);
    } else if (!products.length) {
      emptyState.textContent = "محصولی با این فیلترها پیدا نشد.";
    }
    grid.hidden = products.length === 0;
    renderPagination(totalPages);
  };

  filterForm.addEventListener("change", (event) => {
    if (event.target.matches("input[type='checkbox']")) currentPage = 1;
    render();
  });
  filterForm.querySelectorAll("[data-min-price], [data-max-price]").forEach((input) => {
    input.addEventListener("input", () => {
      currentPage = 1;
      render();
    });
    searchInput?.addEventListener("input", () => {
      searchQuery = searchInput.value.trim();
      const url = new URL(window.location.href);
      if (searchQuery) url.searchParams.set("search", searchQuery);
      else url.searchParams.delete("search");
      window.history.replaceState(null, "", url);
      currentPage = 1;
      render();
    });
  });
  sortSelect.addEventListener("change", () => {
    currentPage = 1;
    render();
  });
  document.querySelector("[data-clear-filters]").addEventListener("click", () => {
    filterForm.querySelectorAll("input[type='checkbox']").forEach((input) => { input.checked = false; });
    filterForm.querySelectorAll("[data-min-price], [data-max-price]").forEach((input) => { input.value = ""; });
    if (searchInput) searchInput.value = "";
    searchQuery = "";
    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    window.history.replaceState(null, "", url);
    sortSelect.value = "default";
    currentPage = 1;
    render();
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const isList = button.dataset.view === "list";
      grid.classList.toggle("is-list", isList);
      document.querySelectorAll("[data-view]").forEach((viewButton) => {
        const active = viewButton === button;
        viewButton.classList.toggle("is-active", active);
        viewButton.setAttribute("aria-pressed", String(active));
      });
    });
  });
  filterToggle.addEventListener("click", () => {
    const isOpen = filterForm.classList.toggle("is-open");
    filterToggle.setAttribute("aria-expanded", String(isOpen));
  });
  newsletter.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterMessage.textContent = "این فرم در نسخه نمایشی ایمیل را ذخیره نمی‌کند.";
    newsletter.reset();
  });
  render();
});
