document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  const faqList = document.querySelector("[data-faq-list]");
  const messageField = document.querySelector("#contact-message");
  const messageCount = document.querySelector("[data-message-count]");

  const toLatinDigits = (value) =>
    value.replace(/[۰-۹٠-٩]/g, (digit) => {
      const code = digit.charCodeAt(0);
      return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
    });

  const formatCount = (count) => new Intl.NumberFormat("fa-IR").format(count);

  if (messageField && messageCount) {
    const updateMessageCount = () => {
      messageCount.textContent = `${formatCount(messageField.value.length)} از ۱۰۰۰ نویسه`;
    };

    messageField.addEventListener("input", updateMessageCount);
    updateMessageCount();
  }

  if (form) {
    const fields = [...form.querySelectorAll("input, textarea")];
    const submitButton = form.querySelector("[data-submit-button]");
    const status = form.querySelector("[data-form-status]");
    let isSubmitting = false;

    const getFieldError = (field) => {
      const value = field.value.trim();

      if (!value) return "تکمیل این فیلد الزامی است.";
      if (field.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return "لطفاً یک نشانی ایمیل معتبر وارد کن.";
      }

      if (field.name === "phone") {
        const normalized = toLatinDigits(value).replace(/[\s().-]/g, "");
        if (!/^\+?\d{7,15}$/.test(normalized)) {
          return "لطفاً شماره تماس معتبر با ۷ تا ۱۵ رقم وارد کن.";
        }
      }

      if (field.name === "message" && value.length > 1000) {
        return "متن پیام نمی‌تونه بیشتر از ۱۰۰۰ نویسه باشه.";
      }

      return "";
    };

    const showFieldError = (field, message) => {
      const error = document.getElementById(`${field.id}-error`);
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) error.textContent = message;
    };

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") {
          showFieldError(field, getFieldError(field));
        }
      });

      field.addEventListener("blur", () => {
        if (field.value.trim()) showFieldError(field, getFieldError(field));
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      let firstInvalidField = null;
      fields.forEach((field) => {
        const error = getFieldError(field);
        showFieldError(field, error);
        if (error && !firstInvalidField) firstInvalidField = field;
      });

      if (firstInvalidField) {
        status.textContent = "لطفاً خطاهای فرم رو بررسی و اصلاح کن.";
        status.className = "contact-form-status is-error";
        firstInvalidField.focus();
        return;
      }

      isSubmitting = true;
      submitButton.disabled = true;
      submitButton.querySelector("span").textContent = "در حال آماده‌سازی...";
      status.textContent = "در حال ثبت آزمایشی پیام...";
      status.className = "contact-form-status";

      window.setTimeout(() => {
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.querySelector("span").textContent = "ارسال پیام";
        status.textContent =
          "این یک ارسال نمایشی است؛ پیام شما به سرور ارسال نشده است. برای ارسال واقعی به اتصال بک‌اند نیاز داریم.";
        status.className = "contact-form-status is-success";
      }, 500);
    });
  }

  if (faqList) {
    faqList.addEventListener("click", (event) => {
      const button = event.target.closest(".contact-faq-question");
      if (!button || !faqList.contains(button)) return;

      const opening = button.getAttribute("aria-expanded") !== "true";
      faqList.querySelectorAll(".contact-faq-question").forEach((question) => {
        const answer = document.getElementById(question.getAttribute("aria-controls"));
        const isCurrent = question === button;

        question.setAttribute("aria-expanded", String(isCurrent && opening));
        if (!answer) return;

        if (isCurrent && opening) {
          answer.hidden = false;
          window.requestAnimationFrame(() => answer.classList.add("is-open"));
        } else {
          answer.classList.remove("is-open");
        }
      });
    });

    faqList.addEventListener("transitionend", (event) => {
      const answer = event.target;
      if (
        event.propertyName === "grid-template-rows" &&
        answer instanceof HTMLElement &&
        answer.classList.contains("contact-faq-answer") &&
        !answer.classList.contains("is-open")
      ) {
        answer.hidden = true;
      }
    });
  }
});
