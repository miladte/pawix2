(() => {
  const products = [
    {
      id: 1, brand: "Whiskas", name: "غذای خشک گربه با طعم مرغ", category: "cat-food", pet: "cat",
      price: 485000, originalPrice: 560000, rating: 4.8, reviews: 124, available: true, created: 8,
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=85",
      alt: "غذای حیوانات خانگی در ظرف", sku: "WH-CH-01", suitableFor: "گربه‌های خانگی",
      description: "غذای خشک گربه با طعم مرغ و ترکیبی متعادل برای تأمین نیاز روزانه گربه‌های خانگی.",
      variantLabel: "وزن بسته", keywords: ["غذای خشک گربه", "cat food", "dry cat food", "مرغ", "whiskas chicken dry cat food"],
      variants: [
        { id: "1-1", label: "۱٫۵ کیلوگرم", price: 485000, originalPrice: 560000 },
        { id: "1-2", label: "۳ کیلوگرم", price: 895000, originalPrice: 990000 },
        { id: "1-3", label: "۷ کیلوگرم", price: 1850000, originalPrice: 2050000 }
      ]
    },
    {
      id: 2, brand: "Royal Canin", name: "غذای خشک سگ نژاد کوچک", category: "dog-food", pet: "dog",
      price: 890000, originalPrice: 990000, rating: 4.9, reviews: 98, available: true, created: 11,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=85",
      alt: "غذای خشک سگ نژاد کوچک", sku: "RC-SM-02", suitableFor: "سگ‌های نژاد کوچک",
      description: "غذایی کامل و متعادل برای سگ‌های نژاد کوچک؛ با دانه‌بندی مناسب و ترکیبی که به حفظ انرژی روزانه و سلامت عمومی حیوان خانگی شما کمک می‌کند.",
      variantLabel: "وزن بسته",
      gallery: [
        { image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=85", alt: "غذای خشک سگ نژاد کوچک" },
        { image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1000&q=85", alt: "غذای حیوانات خانگی در ظرف" },
        { image: "https://images.unsplash.com/photo-1582798358481-d199fb7347bb?auto=format&fit=crop&w=1000&q=85", alt: "غذای خشک برای حیوانات خانگی" },
        { image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=85", alt: "سگ خانگی در فضای باز" }
      ],
      keywords: ["غذای خشک سگ", "dog food", "dry dog food", "small dog food", "royal canin small breed dog food", "سگ", "غذای خشک"],
      variants: [
        { id: "2-2", label: "۲ کیلوگرم", price: 890000, originalPrice: 990000 },
        { id: "2-4", label: "۴ کیلوگرم", price: 1590000, originalPrice: 1790000 },
        { id: "2-8", label: "۸ کیلوگرم", price: 2980000, originalPrice: 3350000 }
      ]
    },
    {
      id: 3, brand: "Pedigree", name: "تشویقی نرم و خوشمزه سگ", category: "treats", pet: "dog",
      price: 235000, originalPrice: 275000, rating: 4.7, reviews: 76, available: true, created: 6,
      image: "https://images.unsplash.com/photo-1582798358481-d199fb7347bb?auto=format&fit=crop&w=700&q=85",
      alt: "تشویقی مناسب حیوانات خانگی", sku: "PD-SN-03", suitableFor: "سگ‌ها",
      description: "تشویقی خوش‌خوراک برای لحظه‌های آموزش و بازی؛ مناسب استفاده به‌عنوان میان‌وعده در کنار رژیم غذایی روزانه.",
      variantLabel: "وزن بسته", keywords: ["تشویقی سگ", "dog treat", "snack", "میان وعده", "pedigree soft dog treats"],
      variants: [
        { id: "3-100", label: "۱۰۰ گرم", price: 235000, originalPrice: 275000 },
        { id: "3-300", label: "۳۰۰ گرم", price: 490000, originalPrice: 550000 },
        { id: "3-1000", label: "۱ کیلوگرم", price: 1290000, originalPrice: 1450000 }
      ]
    },
    {
      id: 4, brand: "Purina", name: "غذای گربه با ترکیب متعادل", category: "cat-food", pet: "cat",
      price: 620000, originalPrice: null, rating: 4.6, reviews: 63, available: true, created: 12,
      image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=700&q=85",
      alt: "گربه در کنار غذای خود", sku: "PU-CF-04", suitableFor: "گربه‌های خانگی",
      description: "غذای روزانه گربه با ترکیبی متعادل از مواد مغذی و طعمی دلپذیر برای گربه‌های خانگی.",
      variantLabel: "وزن بسته", keywords: ["غذای گربه", "cat food", "غذای خشک گربه", "purina balanced cat food"],
      variants: [
        { id: "4-1", label: "۱ کیلوگرم", price: 620000, originalPrice: null },
        { id: "4-3", label: "۳ کیلوگرم", price: 1690000, originalPrice: null },
        { id: "4-7", label: "۷ کیلوگرم", price: 3590000, originalPrice: null }
      ]
    },
    {
      id: 5, brand: "Pawix", name: "توپ بازی مقاوم مخصوص سگ", category: "toys", pet: "dog",
      price: 185000, originalPrice: null, rating: 4.5, reviews: 41, available: true, created: 9,
      image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=700&q=85",
      alt: "اسباب‌بازی رنگی حیوان خانگی", sku: "PW-DB-05", suitableFor: "سگ‌ها",
      description: "توپ بازی مقاوم برای سرگرمی و فعالیت روزانه سگ‌ها.", variantLabel: "اندازه",
      keywords: ["اسباب‌بازی حیوانات", "اسباب بازی سگ", "dog toy", "pet toy", "توپ", "pawix durable dog ball"],
      variants: [{ id: "5-standard", label: "استاندارد", price: 185000, originalPrice: null }]
    },
    {
      id: 6, brand: "Pawix", name: "اسکرچر و محل استراحت گربه", category: "accessories", pet: "cat",
      price: 740000, originalPrice: 890000, rating: 4.8, reviews: 52, available: true, created: 10,
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=85",
      alt: "گربه خانگی", sku: "PW-CS-06", suitableFor: "گربه‌ها",
      description: "محلی برای بازی و استراحت گربه‌های خانگی با طراحی ساده و کاربردی.",
      variantLabel: "اندازه", keywords: ["اسکرچر گربه", "cat scratcher", "محل استراحت گربه", "pawix cat scratcher resting bed"],
      variants: [
        { id: "6-small", label: "کوچک", price: 740000, originalPrice: 890000 },
        { id: "6-medium", label: "متوسط", price: 1090000, originalPrice: 1290000 },
        { id: "6-large", label: "بزرگ", price: 1490000, originalPrice: 1750000 }
      ]
    },
    {
      id: 7, brand: "Pawix", name: "شامپو ملایم حیوانات خانگی", category: "hygiene", pet: "other",
      price: 310000, originalPrice: 350000, rating: 4.4, reviews: 29, available: true, created: 7,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=85",
      alt: "محصول مراقبت از حیوانات خانگی", sku: "PW-SH-07", suitableFor: "حیوانات خانگی",
      description: "شامپوی ملایم برای مراقبت و نظافت حیوانات خانگی.", variantLabel: "حجم",
      keywords: ["شامپو حیوانات", "pet shampoo", "shampoo", "بهداشت حیوانات", "pawix gentle pet shampoo"],
      variants: [{ id: "7-standard", label: "استاندارد", price: 310000, originalPrice: 350000 }]
    },
    {
      id: 8, brand: "Pawix", name: "ظرف غذای استیل ضدلغزش", category: "accessories", pet: "other",
      price: 260000, originalPrice: null, rating: 4.6, reviews: 35, available: true, created: 5,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=85",
      alt: "لوازم نگهداری حیوان خانگی", sku: "PW-BL-08", suitableFor: "حیوانات خانگی",
      description: "ظرف غذای استیل با پایه ضدلغزش برای استفاده روزانه.", variantLabel: "اندازه",
      keywords: ["ظرف غذای حیوانات", "pet bowl", "food bowl", "کاسه غذا", "pawix stainless steel non slip pet bowl"],
      variants: [{ id: "8-standard", label: "استاندارد", price: 260000, originalPrice: null }]
    },
    {
      id: 9, brand: "Royal Canin", name: "غذای گربه بالغ باکیفیت", category: "cat-food", pet: "cat",
      price: 780000, originalPrice: 850000, rating: 4.9, reviews: 88, available: true, created: 13,
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=85",
      alt: "غذای خشک گربه", sku: "RC-AC-09", suitableFor: "گربه‌های بالغ",
      description: "غذای روزانه گربه‌های بالغ.", variantLabel: "بسته",
      keywords: ["غذای خشک گربه", "cat food", "dry cat food", "royal canin adult cat food"],
      variants: [{ id: "9-standard", label: "استاندارد", price: 780000, originalPrice: 850000 }]
    },
    {
      id: 10, brand: "Pedigree", name: "غذای کامل سگ بالغ", category: "dog-food", pet: "dog",
      price: 535000, originalPrice: null, rating: 4.7, reviews: 71, available: false, created: 4,
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=85",
      alt: "غذای مناسب سگ", sku: "PD-AD-10", suitableFor: "سگ‌های بالغ",
      description: "غذای کامل برای سگ‌های بالغ.", variantLabel: "بسته",
      keywords: ["غذای خشک سگ", "dog food", "dry dog food", "pedigree complete adult dog food"],
      variants: [{ id: "10-standard", label: "استاندارد", price: 535000, originalPrice: null }]
    },
    {
      id: 11, brand: "Purina", name: "تشویقی کوچک برای گربه", category: "treats", pet: "cat",
      price: 145000, originalPrice: 180000, rating: 4.5, reviews: 47, available: true, created: 3,
      image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=700&q=85",
      alt: "گربه خانگی", sku: "PU-CT-11", suitableFor: "گربه‌ها",
      description: "تشویقی کوچک مناسب گربه‌ها.", variantLabel: "بسته",
      keywords: ["تشویقی گربه", "cat treat", "snack", "purina cat treats"],
      variants: [{ id: "11-standard", label: "استاندارد", price: 145000, originalPrice: 180000 }]
    },
    {
      id: 12, brand: "Pawix", name: "برس نرم مراقبت از مو", category: "care", pet: "other",
      price: 220000, originalPrice: 260000, rating: 4.3, reviews: 22, available: true, created: 2,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=85",
      alt: "مراقبت از موی حیوان خانگی", sku: "PW-BR-12", suitableFor: "حیوانات خانگی",
      description: "برس نرم برای مراقبت روزانه از موی حیوانات خانگی.", variantLabel: "اندازه",
      keywords: ["برس حیوانات", "pet brush", "grooming", "مراقبت از مو", "pawix soft pet grooming brush"],
      variants: [{ id: "12-standard", label: "استاندارد", price: 220000, originalPrice: 260000 }]
    }
  ];

  const storageKey = "pawix-cart-v1";
  const listeners = new Set();
  const getProduct = (id) => products.find((product) => product.id === Number(id)) || null;
  const getVariant = (product, variantId) =>
    product.variants.find((variant) => variant.id === variantId) || null;
  const normalizeSearchText = (value) => String(value)
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ـ/g, "")
    .replace(/[\u200c\u200f\u202a-\u202e]/g, " ")
    .toLocaleLowerCase("fa")
    .replace(/\s+/g, " ")
    .trim();
  const categoryLabels = {
    "dog-food": "غذای سگ dog food",
    "cat-food": "غذای گربه cat food",
    treats: "تشویقی treat snack",
    toys: "اسباب‌بازی اسباب بازی toy",
    care: "لوازم نگهداری care",
    hygiene: "بهداشت و مراقبت hygiene",
    accessories: "لوازم جانبی accessories"
  };
  const petLabels = { dog: "سگ dog", cat: "گربه cat", other: "حیوانات خانگی pet" };
  // Keep this catalog-search API as the frontend replacement point for a future product-search endpoint.
  const searchProducts = (query) => {
    const terms = normalizeSearchText(query).split(" ").filter(Boolean);
    if (!terms.length) return [];
    return products.filter((product) => {
      const searchableText = normalizeSearchText([
        product.name,
        product.brand,
        product.category,
        categoryLabels[product.category] || "",
        product.pet,
        petLabels[product.pet] || "",
        product.description,
        product.suitableFor,
        product.sku,
        ...(product.keywords || []),
        ...product.variants.map((variant) => variant.label)
      ].join(" "));
      return terms.every((term) => searchableText.includes(term));
    });
  };

  const readCart = () => {
    let raw;
    try {
      raw = window.localStorage.getItem(storageKey);
    } catch (error) {
      throw new Error("ذخیره‌سازی محلی در این مرورگر در دسترس نیست.", { cause: error });
    }
    if (!raw) return [];

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error("اطلاعات سبد خرید قابل خواندن نیست؛ داده‌های ذخیره‌شده را بررسی کنید.", { cause: error });
    }
    if (!Array.isArray(parsed)) throw new Error("ساختار ذخیره‌شده سبد خرید معتبر نیست.");

    return parsed.map((line) => {
      const product = getProduct(line.productId);
      if (
        !product ||
        typeof line.variantId !== "string" ||
        !Number.isInteger(line.quantity) ||
        line.quantity < 1
      ) {
        throw new Error("یکی از اقلام ذخیره‌شده سبد خرید معتبر نیست.");
      }
      if (!product.variants.some((variant) => variant.id === line.variantId)) {
        throw new Error("تنوع انتخاب‌شده برای یکی از اقلام سبد دیگر معتبر نیست.");
      }
      const variant = getVariant(product, line.variantId);
      if (!variant) throw new Error("تنوع انتخاب‌شده برای یکی از اقلام سبد دیگر معتبر نیست.");
      return {
        productId: product.id,
        name: product.name,
        image: product.image,
        unitPrice: variant.price,
        originalUnitPrice: variant.originalPrice || variant.price,
        quantity: line.quantity,
        variantId: variant.id,
        variantLabel: variant.label
      };
    });
  };

  const writeCart = (lines) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(lines));
    } catch (error) {
      throw new Error("سبد خرید ذخیره نشد؛ فضای ذخیره‌سازی مرورگر در دسترس نیست.", { cause: error });
    }
    listeners.forEach((listener) => listener(lines));
    window.dispatchEvent(new CustomEvent("pawix:cart-change", { detail: lines }));
  };

  const cart = {
    products,
    getProduct,
    searchProducts,
    normalizeSearchText,
    getItems: readCart,
    getCount() {
      return readCart().reduce((total, line) => total + line.quantity, 0);
    },
    add(productId, quantity = 1, variantId) {
      const product = getProduct(productId);
      if (!product || !product.available) throw new Error("این محصول برای افزودن به سبد موجود نیست.");
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error("تعداد انتخاب‌شده معتبر نیست.");
      const variant = getVariant(product, variantId || product.variants[0].id);
      if (!variant) throw new Error("تنوع انتخاب‌شده برای این محصول معتبر نیست.");
      const lines = readCart();
      const existing = lines.find((line) => line.productId === product.id && line.variantId === variant.id);
      if (existing) existing.quantity += quantity;
      else {
        lines.push({
          productId: product.id,
          name: product.name,
          image: product.image,
          unitPrice: variant.price,
          originalUnitPrice: variant.originalPrice || variant.price,
          quantity,
          variantId: variant.id,
          variantLabel: variant.label
        });
      }
      writeCart(lines);
      return lines;
    },
    setQuantity(productId, variantId, quantity) {
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error("تعداد محصول نمی‌تواند کمتر از یک باشد.");
      const lines = readCart();
      const line = lines.find((item) => item.productId === Number(productId) && item.variantId === variantId);
      if (!line) throw new Error("قلم موردنظر در سبد خرید پیدا نشد.");
      line.quantity = quantity;
      writeCart(lines);
      return lines;
    },
    remove(productId, variantId) {
      const lines = readCart().filter((line) =>
        line.productId !== Number(productId) || line.variantId !== variantId
      );
      writeCart(lines);
      return lines;
    },
    clear() {
      writeCart([]);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };

  window.PawixStore = cart;
})();
