document.addEventListener("DOMContentLoaded", () => {
  const store = window.PawixStore;
  if (!store) throw new Error("Shared PAWIX product data is unavailable.");

  const panels = [...document.querySelectorAll("[data-admin-panel]")];
  const navLinks = [...document.querySelectorAll("[data-admin-link]")];
  const formatPrice = (price) => `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
  const formatCount = (count) => new Intl.NumberFormat("fa-IR").format(count);
  const statusLabels = ["در انتظار پرداخت", "در حال پردازش", "ارسال شده", "تکمیل شده", "لغو شده"];
  const categoryLabels = {
    "dog-food": "غذای سگ",
    "cat-food": "غذای گربه",
    treats: "تشویقی",
    toys: "اسباب‌بازی",
    accessories: "لوازم جانبی",
    hygiene: "بهداشت و مراقبت",
    care: "لوازم نگهداری",
    other: "سایر"
  };
  const inventory = { 1: 18, 2: 4, 3: 22, 4: 7, 5: 3, 6: 9, 7: 12, 8: 2, 9: 15, 10: 0, 11: 26, 12: 6 };
  let products = store.products.map((product) => ({
    ...product,
    stock: Object.prototype.hasOwnProperty.call(inventory, product.id) ? inventory[product.id] : 10,
    active: product.available
  }));
  const orders = [
    { id: "PX-2042", customer: "مریم نمونه", date: "۱۴۰۵/۰۸/۱۲", productId: 2, quantity: 1, total: 890000, payment: "پرداخت آزمایشی", shipping: "در حال پردازش" },
    { id: "PX-2038", customer: "آرمان نمونه", date: "۱۴۰۵/۰۸/۱۰", productId: 3, quantity: 2, total: 470000, payment: "پرداخت آزمایشی", shipping: "ارسال شده" },
    { id: "PX-2029", customer: "سارا نمونه", date: "۱۴۰۵/۰۸/۰۵", productId: 1, quantity: 1, total: 485000, payment: "پرداخت آزمایشی", shipping: "در انتظار پرداخت" }
  ];
  const users = [
    { id: 1, name: "مریم نمونه", email: "maryam@example.test", phone: "۰۹۱۲۰۰۰۰۰۰۰", joined: "۱۴۰۵/۰۷/۰۲", orders: 2, active: true },
    { id: 2, name: "آرمان نمونه", email: "arman@example.test", phone: "۰۹۱۲۰۰۰۰۰۰۱", joined: "۱۴۰۵/۰۶/۱۸", orders: 1, active: true },
    { id: 3, name: "سارا نمونه", email: "sara@example.test", phone: "۰۹۱۲۰۰۰۰۰۰۲", joined: "۱۴۰۵/۰۵/۲۱", orders: 3, active: false }
  ];
  const monthlySales = [
    { label: "خرداد", value: 1450000 }, { label: "تیر", value: 2200000 },
    { label: "مرداد", value: 1750000 }, { label: "شهریور", value: 3100000 },
    { label: "مهر", value: 2600000 }, { label: "آبان", value: 3450000 }
  ];
  let editingProductId = null;

  const setActivePanel = (panelId) => {
    const activePanel = panels.find((panel) => panel.id === panelId) || panels[0];
    panels.forEach((panel) => { panel.hidden = panel !== activePanel; });
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${activePanel.id}`) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = link.getAttribute("href");
      if (!target || !target.startsWith("#")) return;
      event.preventDefault();
      setActivePanel(target.slice(1));
      window.history.replaceState(null, "", target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  window.addEventListener("popstate", () => setActivePanel(window.location.hash.slice(1)));
  setActivePanel(window.location.hash.slice(1) || "overview");

  const appendCell = (row, value, label) => {
    const cell = document.createElement("td");
    cell.dataset.label = label;
    if (value instanceof Node) cell.append(value);
    else cell.textContent = value;
    row.append(cell);
    return cell;
  };
  const makePill = (text, className = "") => {
    const pill = document.createElement("span");
    pill.className = `admin-status-pill ${className}`.trim();
    pill.textContent = text;
    return pill;
  };
  const createChart = (container, data, formatter = formatCount) => {
    const max = Math.max(...data.map((item) => item.value), 1);
    container.replaceChildren();
    data.forEach((item) => {
      const column = document.createElement("div");
      column.className = "chart-column";
      column.setAttribute("aria-label", `${item.label}: ${formatter(item.value)}؛ مقدار نمونه`);
      const value = document.createElement("strong");
      value.textContent = formatter(item.value);
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      bar.style.height = `${Math.max(8, (item.value / max) * 112)}px`;
      bar.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.textContent = item.label;
      column.append(value, bar, label);
      container.append(column);
    });
  };

  const renderSummary = () => {
    const sales = orders.reduce((sum, order) => sum + order.total, 0);
    document.querySelector("[data-demo-sales]").textContent = formatPrice(sales);
    document.querySelector("[data-demo-order-count]").textContent = formatCount(orders.length);
    document.querySelector("[data-demo-user-count]").textContent = formatCount(users.length);
    document.querySelector("[data-demo-product-count]").textContent = formatCount(products.length);
    document.querySelector("[data-demo-pending-count]").textContent =
      formatCount(orders.filter((order) => order.shipping === "در انتظار پرداخت").length);
    document.querySelector("[data-demo-low-stock]").textContent =
      formatCount(products.filter((product) => product.stock <= 5).length);

    const recent = document.querySelector("[data-overview-orders]");
    recent.replaceChildren();
    orders.slice(0, 3).forEach((order) => {
      const row = document.createElement("tr");
      appendCell(row, order.id, "کد");
      appendCell(row, order.customer, "مشتری");
      appendCell(row, formatPrice(order.total), "مبلغ");
      appendCell(row, makePill(order.shipping), "وضعیت");
      recent.append(row);
    });
    createChart(document.querySelector("[data-sales-chart]"), monthlySales, formatPrice);
  };

  const productForm = document.querySelector("[data-product-form]");
  const productStatus = document.querySelector("[data-product-status]");
  const cancelProduct = document.querySelector("[data-product-cancel]");
  const renderProducts = () => {
    const list = document.querySelector("[data-admin-products]");
    list.replaceChildren();
    products.forEach((product) => {
      const row = document.createElement("tr");
      const productCell = document.createElement("td");
      productCell.dataset.label = "محصول";
      const productInfo = document.createElement("div");
      productInfo.className = "admin-product-cell";
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = "";
      image.loading = "lazy";
      const name = document.createElement("span");
      name.textContent = product.name;
      productInfo.append(image, name);
      productCell.append(productInfo);
      row.append(productCell);
      appendCell(row, `${product.brand} / ${categoryLabels[product.category] || product.category}`, "برند / دسته");
      appendCell(row, formatPrice(product.price), "قیمت");
      const discount = product.originalPrice && product.originalPrice > product.price
        ? `${formatCount(Math.round((1 - product.price / product.originalPrice) * 100))}٪`
        : "ندارد";
      appendCell(row, discount, "تخفیف");
      appendCell(row, formatCount(product.stock), "موجودی نمونه");
      appendCell(row, makePill(product.active ? "فعال" : "غیرفعال", product.active ? "" : "is-inactive"), "وضعیت");
      const actions = document.createElement("td");
      actions.dataset.label = "عملیات";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.dataset.productAction = "edit";
      edit.dataset.productId = String(product.id);
      edit.textContent = "ویرایش";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.productAction = "delete";
      remove.dataset.productId = String(product.id);
      remove.textContent = "حذف";
      actions.append(edit, remove);
      row.append(actions);
      list.append(row);
    });
  };

  const resetProductForm = () => {
    editingProductId = null;
    productForm.reset();
    productForm.elements.productId.value = "";
    document.querySelector("[data-product-form-heading]").textContent = "افزودن محصول نمونه";
    cancelProduct.hidden = true;
  };
  document.querySelector("[data-admin-products]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-action]");
    if (!button) return;
    const id = Number(button.dataset.productId);
    const product = products.find((item) => item.id === id);
    if (!product) throw new Error("محصول نمونه پیدا نشد.");
    if (button.dataset.productAction === "delete") {
      products = products.filter((item) => item.id !== id);
      productStatus.textContent = "محصول فقط از فهرست نمونه همین صفحه حذف شد.";
      renderProducts();
      renderSummary();
      renderInventory();
      renderCategories();
      return;
    }
    editingProductId = id;
    productForm.elements.productId.value = String(id);
    productForm.elements.name.value = product.name;
    productForm.elements.brand.value = product.brand;
    productForm.elements.category.value = product.category;
    productForm.elements.price.value = String(product.price);
    productForm.elements.originalPrice.value = product.originalPrice || "";
    productForm.elements.stock.value = String(product.stock);
    productForm.elements.image.value = product.image;
    productForm.elements.description.value = product.description;
    productForm.elements.available.checked = product.active;
    document.querySelector("[data-product-form-heading]").textContent = "ویرایش محصول نمونه";
    cancelProduct.hidden = false;
    productForm.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!productForm.reportValidity()) return;
    const price = Number(productForm.elements.price.value);
    const originalPrice = productForm.elements.originalPrice.value
      ? Number(productForm.elements.originalPrice.value)
      : null;
    const stock = Number(productForm.elements.stock.value);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      productStatus.textContent = "قیمت و موجودی باید مقدار معتبر و غیرمنفی باشند.";
      return;
    }
    const values = {
      name: productForm.elements.name.value.trim(),
      brand: productForm.elements.brand.value.trim(),
      category: productForm.elements.category.value.trim(),
      price,
      originalPrice,
      stock,
      image: productForm.elements.image.value.trim(),
      description: productForm.elements.description.value.trim(),
      active: productForm.elements.available.checked
    };
    if (editingProductId !== null) {
      const product = products.find((item) => item.id === editingProductId);
      if (!product) throw new Error("محصول نمونه برای ویرایش پیدا نشد.");
      Object.assign(product, values);
      productStatus.textContent = "ویرایش محصول فقط در پیش‌نمایش انجام شد و ماندگار نیست.";
    } else {
      const id = products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
      products.push({
        ...values, id, alt: values.name, pet: "other", rating: 0, reviews: 0,
        created: id, sku: `DEMO-${id}`, suitableFor: "حیوانات خانگی",
        variantLabel: "استاندارد",
        variants: [{ id: `${id}-demo`, label: "استاندارد", price, originalPrice }]
      });
      productStatus.textContent = "محصول به فهرست نمونه همین صفحه افزوده شد؛ سایت یا سبد خرید تغییر نکرد.";
    }
    resetProductForm();
    renderProducts();
    renderSummary();
    renderInventory();
    renderCategories();
  });
  cancelProduct.addEventListener("click", resetProductForm);

  const renderCategories = () => {
    const counts = new Map();
    products.forEach((product) => counts.set(product.category, (counts.get(product.category) || 0) + 1));
    const container = document.querySelector("[data-category-list]");
    container.replaceChildren();
    [...counts.entries()].forEach(([category, count]) => {
      const card = document.createElement("article");
      card.className = "admin-category-card";
      const name = document.createElement("strong");
      name.textContent = categoryLabels[category] || category;
      const key = document.createElement("span");
      key.textContent = `شناسه: ${category}`;
      const total = document.createElement("span");
      total.textContent = `${formatCount(count)} محصول نمونه`;
      card.append(name, key, total);
      container.append(card);
    });
  };

  const renderOrders = () => {
    const list = document.querySelector("[data-admin-orders]");
    list.replaceChildren();
    orders.forEach((order) => {
      const product = products.find((item) => item.id === order.productId);
      const row = document.createElement("tr");
      appendCell(row, order.id, "کد سفارش");
      appendCell(row, order.customer, "مشتری");
      appendCell(row, order.date, "تاریخ");
      appendCell(row, product ? `${product.name} × ${formatCount(order.quantity)}` : "محصول نمونه حذف‌شده", "محصولات");
      appendCell(row, formatPrice(order.total), "مبلغ");
      appendCell(row, makePill(order.payment), "پرداخت");
      const shippingCell = document.createElement("td");
      shippingCell.dataset.label = "ارسال";
      const select = document.createElement("select");
      select.setAttribute("aria-label", `وضعیت ارسال نمونه سفارش ${order.id}`);
      select.dataset.orderStatus = order.id;
      statusLabels.forEach((label) => {
        const option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        option.selected = label === order.shipping;
        select.append(option);
      });
      shippingCell.append(select);
      row.append(shippingCell);
      const detailCell = document.createElement("td");
      detailCell.dataset.label = "جزئیات";
      const detailButton = document.createElement("button");
      detailButton.type = "button";
      detailButton.dataset.orderDetail = order.id;
      detailButton.textContent = "نمایش";
      detailCell.append(detailButton);
      row.append(detailCell);
      list.append(row);
    });
  };
  document.querySelector("[data-admin-orders]").addEventListener("change", (event) => {
    const select = event.target.closest("[data-order-status]");
    if (!select) return;
    const order = orders.find((item) => item.id === select.dataset.orderStatus);
    if (!order) throw new Error("سفارش نمونه پیدا نشد.");
    order.shipping = select.value;
    document.querySelector("[data-order-status]").textContent =
      `وضعیت نمونه ${order.id} در همین پیش‌نمایش به‌روزرسانی شد.`;
    renderSummary();
  });
  document.querySelector("[data-admin-orders]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-order-detail]");
    if (!button) return;
    const order = orders.find((item) => item.id === button.dataset.orderDetail);
    if (!order) throw new Error("سفارش نمونه پیدا نشد.");
    document.querySelector("[data-order-status]").textContent =
      `جزئیات آزمایشی ${order.id}: ${order.customer}، مبلغ ${formatPrice(order.total)}، وضعیت ${order.shipping}.`;
  });

  const renderUsers = () => {
    const list = document.querySelector("[data-admin-users]");
    list.replaceChildren();
    users.forEach((user) => {
      const row = document.createElement("tr");
      appendCell(row, user.name, "نام");
      appendCell(row, user.email, "ایمیل");
      appendCell(row, user.phone, "تلفن نمونه");
      appendCell(row, user.joined, "ثبت‌نام");
      appendCell(row, formatCount(user.orders), "تعداد سفارش نمونه");
      appendCell(row, makePill(user.active ? "فعال نمونه" : "غیرفعال نمونه", user.active ? "" : "is-inactive"), "وضعیت");
      const actions = document.createElement("td");
      actions.dataset.label = "عملیات";
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.userToggle = String(user.id);
      button.textContent = user.active ? "غیرفعال کردن" : "فعال کردن";
      actions.append(button);
      row.append(actions);
      list.append(row);
    });
  };
  document.querySelector("[data-admin-users]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-user-toggle]");
    if (!button) return;
    const user = users.find((item) => item.id === Number(button.dataset.userToggle));
    if (!user) throw new Error("کاربر نمونه پیدا نشد.");
    user.active = !user.active;
    document.querySelector("[data-user-status]").textContent =
      "وضعیت کاربر نمونه تغییر کرد؛ این اقدام هیچ حساب واقعی را تحت‌تأثیر قرار نمی‌دهد.";
    renderUsers();
  });

  const renderInventory = () => {
    const list = document.querySelector("[data-inventory-list]");
    list.replaceChildren();
    products.forEach((product) => {
      const row = document.createElement("tr");
      appendCell(row, product.name, "محصول");
      appendCell(row, product.sku || `DEMO-${product.id}`, "کد محصول");
      appendCell(row, formatCount(product.stock), "موجودی نمونه");
      appendCell(
        row,
        makePill(product.stock <= 5 ? "کم / ناموجود" : "موجودی نمونه", product.stock <= 5 ? "is-low" : ""),
        "وضعیت"
      );
      list.append(row);
    });
  };

  const renderReports = () => {
    const orderCounts = statusLabels.map((label) => ({
      label,
      value: orders.filter((order) => order.shipping === label).length
    }));
    createChart(document.querySelector("[data-report-sales]"), monthlySales, formatPrice);
    createChart(document.querySelector("[data-report-orders]"), orderCounts);
    const productReport = document.querySelector("[data-report-products]");
    productReport.replaceChildren();
    products.slice(0, 4).forEach((product) => {
      const row = document.createElement("div");
      row.className = "report-list-row";
      const name = document.createElement("span");
      name.textContent = product.name;
      const amount = document.createElement("strong");
      amount.textContent = `${formatCount(orders.filter((order) => order.productId === product.id).length)} سفارش نمونه`;
      row.append(name, amount);
      productReport.append(row);
    });
    const customerReport = document.querySelector("[data-report-customers]");
    customerReport.replaceChildren();
    users.forEach((user) => {
      const row = document.createElement("div");
      row.className = "report-list-row";
      const name = document.createElement("span");
      name.textContent = user.name;
      const amount = document.createElement("strong");
      amount.textContent = `${formatCount(user.orders)} سفارش نمونه`;
      row.append(name, amount);
      customerReport.append(row);
    });
  };

  document.querySelector("[data-settings-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    document.querySelector("[data-settings-status]").textContent =
      "تنظیمات ذخیره نشدند؛ این صفحه به سامانه مدیریت متصل نیست.";
  });

  renderProducts();
  renderCategories();
  renderOrders();
  renderUsers();
  renderInventory();
  renderReports();
  renderSummary();
});
