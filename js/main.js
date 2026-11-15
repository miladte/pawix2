document.addEventListener("DOMContentLoaded", () => {
  const cursorMedia = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 769px) and (prefers-reduced-motion: no-preference)"
  );
  let removeCursorListeners = () => {};

  const updateCursorSupport = () => {
    removeCursorListeners();
    removeCursorListeners = () => {};
    document.body.classList.remove("pawix-custom-cursor");
    document.querySelector(".pawix-kibble-cursor")?.remove();

    if (!cursorMedia.matches) return;

    const cursor = document.createElement("span");
    cursor.className = "pawix-kibble-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
    document.body.classList.add("pawix-custom-cursor");

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrame = 0;
    let hasPosition = false;
    const interactiveSelector = "a, button:not(:disabled), [role='button'], input, select, textarea, label, summary";

    const getInteractiveTarget = (target) =>
      target instanceof Element ? target.closest(interactiveSelector) : null;

    const updateHoverState = (target) => {
      cursor.classList.toggle("is-hovering", Boolean(getInteractiveTarget(target)));
    };

    const animateCursor = () => {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) rotate(-18deg) scale(${cursor.classList.contains("is-hovering") ? 1.12 : 1})`;

      if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
        animationFrame = window.requestAnimationFrame(animateCursor);
      } else {
        animationFrame = 0;
      }
    };

    const onPointerMove = (event) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      hasPosition = true;
      cursor.classList.add("is-visible");
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animateCursor);

      updateHoverState(event.target);
    };

    const onPointerOver = (event) => updateHoverState(event.target);
    const onPointerOut = (event) => {
      if (getInteractiveTarget(event.target) !== getInteractiveTarget(event.relatedTarget)) {
        updateHoverState(event.relatedTarget);
      }
    };

    const onPointerDown = (event) => {
      if (event.pointerType === "mouse") cursor.classList.add("is-pressed");
    };

    const onPointerUp = () => cursor.classList.remove("is-pressed");
    const onPointerLeave = () => cursor.classList.remove("is-visible");
    const onPointerEnter = (event) => {
      if (event.pointerType === "mouse" && hasPosition) cursor.classList.add("is-visible");
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.documentElement.addEventListener("pointerenter", onPointerEnter);

    removeCursorListeners = () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  };

  updateCursorSupport();
  cursorMedia.addEventListener("change", updateCursorSupport);

  const store = window.PawixStore;
  const cartCount = document.querySelector("[data-cart-count]");
  const toast = document.querySelector("[data-toast]");
  let toastTimer;

  const formatCount = (count) => new Intl.NumberFormat("fa-IR").format(count);

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  };

  document.querySelectorAll("[data-product-id]").forEach((card) => {
    const product = store?.getProduct(card.dataset.productId);
    if (!product) return;
    const image = card.querySelector("[data-home-image]");
    image.src = product.image;
    image.alt = product.alt;
    card.querySelector("[data-home-brand]").textContent = product.brand;
    const productLink = card.querySelector("[data-home-link]");
    productLink.href = `pages/product-detail.html?product=${product.id}`;
    productLink.textContent = product.name;
    const rating = card.querySelector("[data-home-rating]");
    rating.setAttribute("aria-label", `امتیاز ${formatCount(product.rating)} از ۵`);
    card.querySelector("[data-home-score]").textContent = formatCount(product.rating);
    card.querySelector("[data-home-price]").textContent = `${formatCount(product.price)} تومان`;
  });

  const updateCartCount = () => {
    if (!store || !cartCount) return;
    try {
      cartCount.textContent = formatCount(store.getCount());
    } catch (error) {
      showToast(error.message);
    }
  };

  updateCartCount();
  store?.subscribe(updateCartCount);

  document.querySelectorAll("[data-add-home-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const productCard = button.closest("[data-product-id]");
      if (!store || !productCard) return;
      try {
        const product = store.getProduct(productCard.dataset.productId);
        store.add(product.id);
        showToast(`${product.name} به سبد آزمایشی اضافه شد.`);
      } catch (error) {
        showToast(error.message);
      }
    });
  });
});
