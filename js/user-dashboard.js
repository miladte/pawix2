document.addEventListener("DOMContentLoaded", () => {
  const store = window.PawixStore;
  const panels = [...document.querySelectorAll("[data-dashboard-panel]")];
  const navLinks = [...document.querySelectorAll("[data-dashboard-link]")];
  const formatPrice = (price) => `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
  const orders = [
    { id: "PX-1042", date: "۱۴۰۵/۰۸/۱۲", product: "غذای خشک سگ نژاد کوچک", total: 890000, status: "ارسال شده" },
    { id: "PX-1038", date: "۱۴۰۵/۰۷/۲۸", product: "تشویقی نرم و خوشمزه سگ", total: 235000, status: "تکمیل شده" },
    { id: "PX-1029", date: "۱۴۰۵/۰۷/۱۴", product: "غذای خشک گربه با طعم مرغ", total: 485000, status: "در انتظار پرداخت" }
  ];
  let addresses = [
    { id: 1, title: "خانه", city: "تهران", address: "نشانی نمونه، خیابان آزمایشی", isDefault: true },
    { id: 2, title: "محل کار", city: "تهران", address: "نشانی نمونه، میدان فرضی", isDefault: false }
  ];
  let editingAddressId = null;

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
      const panelId = target.slice(1);
      setActivePanel(panelId);
      window.history.replaceState(null, "", target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  window.addEventListener("popstate", () => setActivePanel(window.location.hash.slice(1)));
  setActivePanel(window.location.hash.slice(1) || "overview");

  const makeCell = (value, label) => {
    const cell = document.createElement("td");
    cell.dataset.label = label;
    if (value instanceof Node) cell.append(value);
    else cell.textContent = value;
    return cell;
  };
  const renderOrders = () => {
    const orderList = document.querySelector("[data-order-list]");
    const recentList = document.querySelector("[data-recent-orders]");
    const createRow = (order, withAction = false) => {
      const row = document.createElement("tr");
      row.append(makeCell(order.id, "شماره سفارش"));
      row.append(makeCell(order.date, "تاریخ"));
      row.append(makeCell(order.product, "محصول"));
      row.append(makeCell(formatPrice(order.total), "مبلغ"));
      const status = document.createElement("span");
      status.className = "status-pill";
      status.textContent = order.status;
      row.append(makeCell(status, "وضعیت"));
      if (withAction) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dashboard-table-action";
        button.dataset.orderDetails = order.id;
        button.textContent = "مشاهده";
        row.append(makeCell(button, "جزئیات"));
      }
      return row;
    };
    orderList.replaceChildren(...orders.map((order) => createRow(order, true)));
    recentList.replaceChildren(...orders.slice(0, 2).map((order) => createRow(order)));
    document.querySelector("[data-total-orders]").textContent = new Intl.NumberFormat("fa-IR").format(orders.length);
    document.querySelector("[data-completed-orders]").textContent =
      new Intl.NumberFormat("fa-IR").format(orders.filter((order) => order.status === "تکمیل شده").length);
    document.querySelector("[data-pending-orders]").textContent =
      new Intl.NumberFormat("fa-IR").format(orders.filter((order) => order.status === "در انتظار پرداخت").length);
  };
  renderOrders();
  document.querySelector("[data-order-list]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-order-details]");
    if (!button) return;
    const order = orders.find((item) => item.id === button.dataset.orderDetails);
    if (!order) throw new Error("سفارش نمونه پیدا نشد.");
    document.querySelector("[data-order-status]").textContent =
      `جزئیات آزمایشی ${order.id}: ${order.product} — وضعیت «${order.status}»، مبلغ ${formatPrice(order.total)}.`;
  });

  document.querySelector("[data-profile-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const name = form.elements.firstName.value.trim();
    document.querySelector(".dashboard-profile-mini strong").textContent =
      `${name} ${form.elements.lastName.value.trim()}`;
    document.querySelector(".dashboard-profile-mini .profile-avatar").textContent = name.slice(0, 1);
    document.querySelector("#overview h1").textContent = `سلام، ${name}!`;
    document.querySelector("[data-profile-status]").textContent =
      "نمایش پروفایل در همین جلسه به‌روزرسانی شد؛ اطلاعات جایی ذخیره یا ارسال نشد.";
  });

  const addressList = document.querySelector("[data-address-list]");
  const addressForm = document.querySelector("[data-address-form]");
  const addressStatus = document.querySelector("[data-address-status]");
  const cancelAddress = document.querySelector("[data-cancel-address]");
  const renderAddresses = () => {
    addressList.replaceChildren();
    addresses.forEach((address) => {
      const card = document.createElement("article");
      card.className = "address-card";
      const header = document.createElement("div");
      header.className = "address-card-header";
      const title = document.createElement("strong");
      title.textContent = `${address.title}، ${address.city}`;
      header.append(title);
      if (address.isDefault) {
        const label = document.createElement("span");
        label.className = "default-address";
        label.textContent = "پیش‌فرض";
        header.append(label);
      }
      const addressText = document.createElement("p");
      addressText.textContent = address.address;
      const actions = document.createElement("div");
      actions.className = "address-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.dataset.addressAction = "edit";
      edit.dataset.addressId = String(address.id);
      edit.textContent = "ویرایش";
      const makeDefault = document.createElement("button");
      makeDefault.type = "button";
      makeDefault.dataset.addressAction = "default";
      makeDefault.dataset.addressId = String(address.id);
      makeDefault.textContent = "پیش‌فرض کردن";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.addressAction = "remove";
      remove.dataset.addressId = String(address.id);
      remove.textContent = "حذف";
      actions.append(edit, makeDefault, remove);
      card.append(header, addressText, actions);
      addressList.append(card);
    });
  };
  renderAddresses();

  addressList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-address-action]");
    if (!button) return;
    const id = Number(button.dataset.addressId);
    const address = addresses.find((item) => item.id === id);
    if (!address) throw new Error("آدرس نمونه پیدا نشد.");
    if (button.dataset.addressAction === "remove") {
      addresses = addresses.filter((item) => item.id !== id);
      if (!addresses.some((item) => item.isDefault) && addresses[0]) addresses[0].isDefault = true;
      addressStatus.textContent = "آدرس فقط از پیش‌نمایش همین صفحه حذف شد.";
      renderAddresses();
    } else if (button.dataset.addressAction === "default") {
      addresses.forEach((item) => { item.isDefault = item.id === id; });
      addressStatus.textContent = "آدرس پیش‌فرض فقط برای همین پیش‌نمایش تغییر کرد.";
      renderAddresses();
    } else {
      editingAddressId = id;
      addressForm.elements.title.value = address.title;
      addressForm.elements.city.value = address.city;
      addressForm.elements.address.value = address.address;
      addressForm.elements.default.checked = address.isDefault;
      document.querySelector("[data-address-form-title]").textContent = "ویرایش آدرس نمونه";
      cancelAddress.hidden = false;
      addressForm.scrollIntoView({ behavior: "smooth", block: "center" });
      addressForm.elements.title.focus();
    }
  });

  addressForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!addressForm.reportValidity()) return;
    const values = {
      title: addressForm.elements.title.value.trim(),
      city: addressForm.elements.city.value.trim(),
      address: addressForm.elements.address.value.trim(),
      isDefault: addressForm.elements.default.checked
    };
    if (values.isDefault) addresses.forEach((item) => { item.isDefault = false; });
    if (editingAddressId !== null) {
      const address = addresses.find((item) => item.id === editingAddressId);
      if (!address) throw new Error("آدرس نمونه برای ویرایش پیدا نشد.");
      Object.assign(address, values);
      addressStatus.textContent = "ویرایش در پیش‌نمایش انجام شد و ذخیره دائمی نشده است.";
    } else {
      addresses.push({ id: Date.now(), ...values });
      addressStatus.textContent = "آدرس به پیش‌نمایش همین صفحه افزوده شد؛ ذخیره دائمی نشده است.";
    }
    editingAddressId = null;
    addressForm.reset();
    document.querySelector("[data-address-form-title]").textContent = "افزودن آدرس نمونه";
    cancelAddress.hidden = true;
    renderAddresses();
  });

  cancelAddress.addEventListener("click", () => {
    editingAddressId = null;
    addressForm.reset();
    document.querySelector("[data-address-form-title]").textContent = "افزودن آدرس نمونه";
    cancelAddress.hidden = true;
  });

  const wishlist = document.querySelector("[data-user-wishlist]");
  if (!store) throw new Error("Shared PAWIX product data is unavailable.");
  store.products.slice(0, 3).forEach((product) => {
    const card = document.createElement("article");
    card.className = "wishlist-card";
    const link = document.createElement("a");
    link.href = `../pages/product-detail.html?product=${product.id}`;
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.alt;
    image.loading = "lazy";
    const info = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = product.name;
    const price = document.createElement("p");
    price.textContent = formatPrice(product.price);
    info.append(name, price);
    link.append(image, info);
    card.append(link);
    wishlist.append(card);
  });

  document.querySelector("[data-password-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.querySelector("[data-password-status]");
    const newPassword = form.elements.newPassword.value;
    if (!form.reportValidity()) return;
    if (newPassword !== form.elements.confirmPassword.value) {
      status.textContent = "تکرار رمز جدید با رمز جدید یکسان نیست.";
      return;
    }
    status.textContent = "رمز تغییر نکرد؛ سرویس احراز هویت متصل نیست و اطلاعات فرم ذخیره نشد.";
    form.reset();
  });
});
