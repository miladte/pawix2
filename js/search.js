document.addEventListener("DOMContentLoaded", () => {
  const store = window.PawixStore;
  const openButton = document.querySelector("[data-search-open]");
  if (!store || !openButton) return;

  const path = window.location.pathname;
  const pagePrefix = /\/pages\/[^/]+$/.test(path)
    ? ""
    : /\/user\/[^/]+$/.test(path)
      ? "../pages/"
      : "pages/";
  const shopPath = `${pagePrefix}shop.html`;
  const productPath = `${pagePrefix}product-detail.html`;
  const suggestions = [
    "غذای خشک سگ",
    "غذای خشک گربه",
    "اسباب‌بازی حیوانات",
    "شامپو حیوانات",
    "ظرف غذای حیوانات"
  ];
  const categories = [
    ["dog-food", "غذای سگ"],
    ["cat-food", "غذای گربه"],
    ["toys", "اسباب‌بازی"],
    ["hygiene", "بهداشت و مراقبت"],
    ["accessories", "لوازم جانبی"],
    ["treats", "تشویقی"],
    ["care", "لوازم نگهداری"]
  ];
  const overlay = document.createElement("div");
  overlay.className = "pawix-search-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="pawix-search-panel" role="dialog" aria-modal="true" aria-labelledby="pawix-search-title">
      <header class="pawix-search-header">
        <h2 id="pawix-search-title">جستجو در محصولات PAWIX</h2>
        <button class="pawix-search-close" type="button" aria-label="بستن جستجو" data-search-close>×</button>
      </header>
      <form class="pawix-search-form" role="search" data-search-form>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16 21 21"></path></svg>
        <input type="search" autocomplete="off" placeholder="نام محصول، برند یا دسته‌بندی موردنظرت رو جست‌وجو کن..." aria-label="جستجوی محصول" data-search-input />
        <button class="pawix-search-clear" type="button" aria-label="پاک کردن عبارت جستجو" data-search-clear hidden>×</button>
      </form>
      <div class="pawix-search-content" aria-live="polite" data-search-content></div>
    </section>`;
  document.body.append(overlay);

  const input = overlay.querySelector("[data-search-input]");
  const content = overlay.querySelector("[data-search-content]");
  const clearButton = overlay.querySelector("[data-search-clear]");
  let matches = [];
  let debounceTimer;
  let closeTimer;
  let isOpen = false;
  let returnFocus = null;

  const formatPrice = (price) => `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;

  const makeSuggestion = (label) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pawix-search-suggestion";
    button.textContent = label;
    button.addEventListener("click", () => {
      input.value = label;
      render();
      input.focus();
    });
    return button;
  };

  const makeResult = (product) => {
    const link = document.createElement("a");
    link.className = "pawix-search-result";
    link.href = `${productPath}?product=${encodeURIComponent(product.id)}`;
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.alt;
    image.loading = "lazy";
    const details = document.createElement("span");
    details.className = "pawix-search-result-info";
    const name = document.createElement("strong");
    name.textContent = product.name;
    const brand = document.createElement("span");
    brand.className = "pawix-search-result-meta";
    brand.textContent = product.brand;
    const price = document.createElement("span");
    price.className = "pawix-search-result-price";
    price.textContent = formatPrice(product.price);
    const availability = document.createElement("span");
    availability.className = `pawix-search-availability${product.available ? "" : " is-out"}`;
    availability.textContent = product.available ? "موجود" : "ناموجود";
    details.append(name, brand, price, availability);
    link.append(image, details);
    return link;
  };

  const makeShopLink = (label, query, className) => {
    const link = document.createElement("a");
    link.className = className;
    link.href = query
      ? `${shopPath}?search=${encodeURIComponent(query)}`
      : shopPath;
    link.textContent = label;
    return link;
  };

  const renderSuggestions = () => {
    const title = document.createElement("h3");
    title.className = "pawix-search-section-title";
    title.textContent = "جستجوهای محبوب";
    const popular = document.createElement("div");
    popular.className = "pawix-search-suggestions";
    suggestions
      .filter((term) => store.searchProducts(term).length > 0)
      .forEach((term) => popular.append(makeSuggestion(term)));

    const categoryTitle = document.createElement("h3");
    categoryTitle.className = "pawix-search-section-title";
    categoryTitle.textContent = "دسته‌بندی‌های محبوب";
    const categoryList = document.createElement("div");
    categoryList.className = "pawix-search-suggestions";
    categories
      .filter(([category]) => store.products.some((product) => product.category === category))
      .forEach(([, label]) => categoryList.append(makeSuggestion(label)));
    content.replaceChildren(title, popular, categoryTitle, categoryList);
  };

  const render = () => {
    clearButton.hidden = !input.value;
    const query = input.value.trim();
    content.replaceChildren();
    if (!store.normalizeSearchText(query)) {
      matches = [];
      renderSuggestions();
      return;
    }

    matches = store.searchProducts(query);
    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "pawix-search-empty";
      const title = document.createElement("strong");
      title.textContent = "محصولی با این مشخصات پیدا نکردیم.";
      const message = document.createElement("p");
      message.textContent = "عبارت دیگری رو امتحان کن.";
      empty.append(title, message, makeShopLink("بازگشت به فروشگاه", query, "pawix-search-shop-link"));
      content.append(empty);
      return;
    }

    const heading = document.createElement("h3");
    heading.className = "pawix-search-section-title";
    heading.textContent = `${new Intl.NumberFormat("fa-IR").format(matches.length)} محصول پیدا شد`;
    const resultList = document.createElement("div");
    resultList.className = "pawix-search-results";
    matches.slice(0, 6).forEach((product) => resultList.append(makeResult(product)));
    content.append(heading, resultList);
    content.append(makeShopLink("مشاهده همه نتایج", query, "pawix-search-all-link"));
  };

  const closeSearch = () => {
    if (!isOpen) return;
    isOpen = false;
    window.clearTimeout(debounceTimer);
    overlay.classList.remove("is-open");
    document.body.classList.remove("pawix-search-open");
    closeTimer = window.setTimeout(() => {
      overlay.hidden = true;
      returnFocus?.focus();
    }, 180);
  };

  const openSearch = () => {
    window.clearTimeout(closeTimer);
    returnFocus = document.activeElement;
    isOpen = true;
    overlay.hidden = false;
    document.body.classList.add("pawix-search-open");
    input.value = "";
    render();
    overlay.getBoundingClientRect();
    overlay.classList.add("is-open");
    input.focus({ preventScroll: true });
  };

  openButton.addEventListener("click", openSearch);
  overlay.querySelector("[data-search-close]").addEventListener("click", closeSearch);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeSearch();
  });
  overlay.querySelector("[data-search-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    if (matches.length) window.location.href = `${productPath}?product=${encodeURIComponent(matches[0].id)}`;
  });
  clearButton.addEventListener("click", () => {
    window.clearTimeout(debounceTimer);
    input.value = "";
    render();
    input.focus();
  });
  input.addEventListener("input", () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(render, 140);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) closeSearch();
    if (event.key === "Tab" && isOpen) {
      const focusable = [...overlay.querySelectorAll("button:not([hidden]), input, a[href]")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
});
