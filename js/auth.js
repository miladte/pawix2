document.addEventListener("DOMContentLoaded", () => {
  const toLatinDigits = (value) =>
    value.replace(/[۰-۹٠-٩]/g, (digit) => {
      const code = digit.charCodeAt(0);
      return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
    });

  const normalizePhone = (value) => toLatinDigits(value).replace(/[\s().-]/g, "");
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  const isPhone = (value) => /^\+?\d{7,15}$/.test(normalizePhone(value));

  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    const input = document.getElementById(button.dataset.passwordToggle);
    button.addEventListener("click", () => {
      const showing = input.type === "password";
      input.type = showing ? "text" : "password";
      button.textContent = showing ? "پنهان" : "نمایش";
      button.setAttribute("aria-pressed", String(showing));
      button.setAttribute("aria-label", showing ? "پنهان کردن رمز عبور" : "نمایش رمز عبور");
    });
  });

  document.querySelectorAll("[data-forgot-password]").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector("[data-auth-form] [role='status']").textContent =
        "بازیابی رمز عبور تا اتصال سرویس امن احراز هویت فعال نیست.";
    });
  });

  document.querySelectorAll("[data-auth-form]").forEach((form) => {
    const mode = form.dataset.authMode;
    const status = form.querySelector("[role='status']");
    const fields = [...form.querySelectorAll("input:not([type='checkbox'])")];
    const terms = form.querySelector("[name='terms']");

    const getError = (field) => {
      const value = field.value.trim();
      if (!value) return "تکمیل این فیلد الزامی است.";
      if (field.name === "email" && !isEmail(value)) return "لطفاً یک ایمیل معتبر وارد کن.";
      if (field.name === "phone" && !isPhone(value)) return "شماره موبایل باید ۷ تا ۱۵ رقم معتبر داشته باشد.";
      if (field.name === "identifier" && !isEmail(value) && !isPhone(value)) {
        return "ایمیل یا شماره موبایل معتبر وارد کن.";
      }
      if (field.name === "password" && mode === "register" && value.length < 8) {
        return "رمز عبور باید دست‌کم ۸ نویسه باشد.";
      }
      if (field.name === "confirmPassword" && value !== form.elements.password.value) {
        return "تکرار رمز عبور با رمز عبور یکسان نیست.";
      }
      return "";
    };

    const showError = (field, message) => {
      const error = document.getElementById(`${field.id}-error`);
      field.setAttribute("aria-invalid", String(Boolean(message)));
      if (error) error.textContent = message;
    };

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") showError(field, getError(field));
        if (field.name === "password" && mode === "register") {
          const confirmation = form.elements.confirmPassword;
          if (confirmation.value) showError(confirmation, getError(confirmation));
        }
      });
    });

    if (terms) {
      terms.addEventListener("change", () => {
        const error = document.getElementById("register-terms-error");
        error.textContent = terms.checked ? "" : "برای ادامه، پذیرش شرایط الزامی است.";
        terms.setAttribute("aria-invalid", String(!terms.checked));
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let firstInvalidField = null;
      fields.forEach((field) => {
        const message = getError(field);
        showError(field, message);
        if (message && !firstInvalidField) firstInvalidField = field;
      });
      if (terms && !terms.checked) {
        document.getElementById("register-terms-error").textContent = "برای ادامه، پذیرش شرایط الزامی است.";
        terms.setAttribute("aria-invalid", "true");
        if (!firstInvalidField) firstInvalidField = terms;
      }
      if (firstInvalidField) {
        status.classList.add("is-error");
        status.textContent = "اطلاعات فرم را بررسی و خطاها را اصلاح کن.";
        firstInvalidField.focus();
        return;
      }

      status.classList.remove("is-error");
      status.textContent = mode === "login"
        ? "ورود انجام نشد؛ این وب‌سایت سرویس احراز هویت ندارد و اطلاعات واردشده ارسال یا ذخیره نشده است."
        : "ثبت‌نام انجام نشد؛ این وب‌سایت سرویس احراز هویت ندارد و اطلاعات واردشده ارسال یا ذخیره نشده است.";
    });
  });
});
