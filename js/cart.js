document.addEventListener("DOMContentLoaded", () => {
  const store = window.PawixStore;
  const lineContainer = document.querySelector("[data-cart-lines]");
  const content = document.querySelector("[data-cart-content]");
  const emptyState = document.querySelector("[data-cart-empty]");
  const errorMessage = document.querySelector("[data-cart-error]");
  const checkoutStatus = document.querySelector("[data-checkout-status]");
  if (!store || !lineContainer || !content || !emptyState) {
    throw new Error("Cart page markup or shared cart storage is missing.");
  }

  const previewShippingCost = 0;
  const formatPrice = (price) => `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;

  const makeElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const showError = (error) => {
    errorMessage.replaceChildren(makeElement("span", "", error.message));
    const resetButton = makeElement("button", "cart-error-reset", "پاک کردن داده‌های سبد");
    resetButton.type = "button";
    resetButton.addEventListener("click", () => {
      try {
        store.clear();
      } catch (resetError) {
        showError(resetError);
      }
    });
    errorMessage.append(resetButton);
    errorMessage.hidden = false;
  };

  const render = () => {
    try {
      errorMessage.hidden = true;
      const lines = store.getItems();
      lineContainer.replaceChildren();
      content.hidden = lines.length === 0;
      emptyState.hidden = lines.length > 0;
      let originalTotal = 0;
      let subtotal = 0;

      lines.forEach((line) => {
        const product = store.getProduct(line.productId);
        const originalUnitPrice = line.originalUnitPrice || line.unitPrice;
        const article = makeElement("article", "cart-line");
        const image = makeElement("img", "cart-line-image");
        image.src = product.image;
        image.alt = product.alt;
        image.loading = "lazy";
        const info = makeElement("div", "cart-line-info");
        info.append(makeElement("h3", "", line.name));
        info.append(makeElement("p", "cart-line-variant", `تنوع: ${line.variantLabel}`));
        const prices = makeElement("div", "cart-line-prices");
        prices.append(makeElement("strong", "", formatPrice(line.unitPrice)));
        if (originalUnitPrice > line.unitPrice) {
          const originalPrice = document.createElement("del");
          originalPrice.textContent = formatPrice(originalUnitPrice);
          prices.append(originalPrice);
        }
        info.append(prices);
        info.append(makeElement("p", "cart-line-subtotal", `جمع این ردیف: ${formatPrice(line.unitPrice * line.quantity)}`));

        const actions = makeElement("div", "cart-line-actions");
        const quantity = makeElement("div", "cart-quantity");
        quantity.setAttribute("aria-label", `تعداد ${line.name}`);
        const decrease = makeElement("button", "", "−");
        decrease.type = "button";
        decrease.setAttribute("aria-label", `کاهش تعداد ${line.name}`);
        decrease.dataset.cartAction = "decrease";
        const output = makeElement("output", "", new Intl.NumberFormat("fa-IR").format(line.quantity));
        output.setAttribute("aria-live", "polite");
        const increase = makeElement("button", "", "+");
        increase.type = "button";
        increase.setAttribute("aria-label", `افزایش تعداد ${line.name}`);
        increase.dataset.cartAction = "increase";
        quantity.append(decrease, output, increase);

        const remove = makeElement("button", "remove-line", "حذف محصول");
        remove.type = "button";
        remove.dataset.cartAction = "remove";
        actions.append(quantity, remove);
        [decrease, increase, remove].forEach((button) => {
          button.dataset.productId = String(line.productId);
          button.dataset.variantId = line.variantId;
        });
        article.append(image, info, actions);
        lineContainer.append(article);
        originalTotal += originalUnitPrice * line.quantity;
        subtotal += line.unitPrice * line.quantity;
      });

      const discount = originalTotal - subtotal;
      document.querySelector("[data-original-total]").textContent = formatPrice(originalTotal);
      document.querySelector("[data-discount-total]").textContent = formatPrice(discount);
      document.querySelector("[data-subtotal]").textContent = formatPrice(subtotal);
      document.querySelector("[data-shipping]").textContent = formatPrice(previewShippingCost);
      document.querySelector("[data-total]").textContent = formatPrice(subtotal + previewShippingCost);
    } catch (error) {
      content.hidden = true;
      emptyState.hidden = true;
      showError(error);
    }
  };

  lineContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;
    const productId = Number(button.dataset.productId);
    const variantId = button.dataset.variantId;
    try {
      if (button.dataset.cartAction === "increase") {
        const line = store.getItems().find((item) => item.productId === productId && item.variantId === variantId);
        if (!line) throw new Error("قلم موردنظر در سبد خرید پیدا نشد.");
        store.setQuantity(productId, variantId, line.quantity + 1);
      } else if (button.dataset.cartAction === "decrease") {
        const line = store.getItems().find((item) => item.productId === productId && item.variantId === variantId);
        if (!line) throw new Error("قلم موردنظر در سبد خرید پیدا نشد.");
        if (line.quantity > 1) store.setQuantity(productId, variantId, line.quantity - 1);
      } else if (button.dataset.cartAction === "remove") {
        store.remove(productId, variantId);
      }
    } catch (error) {
      showError(error);
    }
  });

  document.querySelector("[data-clear-cart]").addEventListener("click", () => {
    try {
      store.clear();
    } catch (error) {
      showError(error);
    }
  });
  document.querySelector("[data-checkout]").addEventListener("click", () => {
    checkoutStatus.textContent = "پرداخت آغاز نشد؛ این نسخه به سامانه سفارش یا درگاه امن متصل نیست.";
  });
  store.subscribe(render);
  render();
});
